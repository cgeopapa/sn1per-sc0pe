// #region setup
const express = require('express');
const ws = require('ws');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs');
const Convert = require('ansi-to-html');

const configDir = '/usr/share/sniper/conf/'
const workspacesFolder = '/usr/share/sniper/loot/workspace/';

const app = express();
const server = http.createServer(app);
const convert = new Convert();

const scanStatusPath = "../scans.json"
let scanObjects = {};
let scanStatus = {};
const scansFile = fs.readFileSync(scanStatusPath)
scanStatus = JSON.parse(scansFile);
// #endregion

let wsCons = [];

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.set('json spaces', 200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//
// ─── WEBSOCKET STUFF ────────────────────────────────────────────────────────────
//
const wss = new ws.Server({ server });
wss.on('connection', sock => {
  sock.on('message', function(msg) {
    const s = msg.toString();
    console.log(s);
    if(s.startsWith("pls ")) {
      const scan = msg.toString().substring(4);
      const path = `${workspacesFolder}${scan}`;
      const e = shell.exec(`tail -n1000 -f ${path}/scan.out`, {async: true, silent: true});
      e.stdout.on('data', function(data) {
        sock.send(convert.toHtml(data));
      })
    }
    else if(s === "scans") {
      wsCons.push(sock);
      const scansFile = fs.readFileSync(scanStatusPath)
      scanStatus = JSON.parse(scansFile);
      wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
    }
  })
})

//
// ─── SHELL EXECUTION ────────────────────────────────────────────────────────────
//
function executeShell(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}`;
  const e = shell.exec(`yes Y | sudo bash ${path}/scan.sh > ${path}/scan.out`, {async: true});
  console.log("Request to execute ", scan)

  scanStatus[scan] = true;
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
  scanObjects[scan] = e;

  e.stdout.on('end', function() {
    scanStatus[scan] = false;
    fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
      if(err) console.log(err);
    });
    wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
  })
  res.sendStatus(200);
}

//
// ─── SCANS ──────────────────────────────────────────────────────────────────
//
function getScans(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let scans = fs.readdirSync(workspacesFolder, { withFileTypes: true });
  scans = scans.filter(s => s.isDirectory()).map(s => s.name)

  const scansFile = fs.readFileSync(scanStatusPath);
  scanStatus = JSON.parse(scansFile);
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
  
  res.json(scans);
}
function getScan(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}/scan.sh`;
  try {
    let out = fs.readFileSync(path).toString().trim();
    out = out.split(" ")
    let returnObj = {
      name: null,
      ip: null,
      type: null,
      sch: null,
      config: null,
      fp: false,
      b: false,
      o: false,
      r: false,
    };
    let i = 2;
    while(i < out.length) {
      switch (out[i++]) {
        case "-t":
          returnObj.ip = out[i++]
          break;
        case "-m":
          returnObj.type = out[i++];
          break;
        case "-s":
          returnObj.sch = out[i++];
          break;
        case "-c":
          returnObj.config = out[i++];
          break;
        case "-fp":
          returnObj.fp = true;
          i++;
          break;
        case "-b":
          returnObj.b = true;
          i++;
          break;
        case "-o":
          returnObj.o = true;
          i++;
          break;
        case "-re":
          returnObj.re = true;
          i++;
          break;
        case "-w":
          returnObj.name = out[i++];
          break;
      }
    }
    res.json(returnObj);
  } catch(e) {
    console.log(e)
    if(e.code === 'ENOENT') {
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  }

}
function updateScan(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}/scan.sh`;
  const scanObj = req.body

  fs.writeFileSync(path, scanObjToScript(scanObj, scan));
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}
function deleteScan(req, res) {
  const scan = req.query.scan;
  fs.rmSync(workspacesFolder+"/"+scan, {recursive: true, force: true});

  delete scanStatus[scan];
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}
function createScan(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}`
  fs.mkdirSync(path, {recursive: true})

  fs.writeFileSync(`${path}/scan.sh`, scanObjToScript(req.body, scan))
  scanStatus[scan] = false;
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}

//
// ─── CONFIGS ────────────────────────────────────────────────────────────────
//
function getConfs(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let configs = fs.readdirSync(configDir, {withFileTypes: true});
  configs = configs.filter(c => c.isFile);
  configs = configs.map(c => c.name);
  res.json(configs);
}
function getConfig(req, res) {
  const config = req.query.config;
  let data = fs.readFileSync(configDir+config, 'utf-8');
  data = data.split("\n");
  data = data.filter((d) => d !== "" && !d.startsWith("#"));
  let ret = {};
  for(let d of data) {
    const line = d.split("=");
    line[1] = line[1].replaceAll('"', "");
    line[1] = line[1].replaceAll("'", "");
    ret[line[0]] = line[1];
  }
  res.setHeader('Content-Type', 'application/json');
  res.json(ret);
}
function createConfig(req, res) {
  const config = req.query.config;
  fs.copyFileSync(configDir+'default', configDir+config);
  res.sendStatus(200);
}
function deleteConfig(req, res) {
  const config = req.query.config;
  if (config !== "default") {
    fs.unlinkSync(configDir+config);
    res.sendStatus(200);
  }
  else {
    res.sendStatus(301);
  }
}
function updateConfig(req, res) {
  const configName = req.query.config;
  const config = req.body;
  const f = fs.createWriteStream(configDir+configName)
  let configWrite = "";
  for(let c in config) {
    let value;
    if(config[c] === true || config[c] === false) {
      value = config[c] ? "1" : "0";
    }
    else {
      value = config[c];
    }
    f.write(`${c}="${value}"\n`);
  }

  res.sendStatus(200);
}

//
// ─── TASKS HISTORY ──────────────────────────────────────────────────────────
//
function tasksHistory(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}/scans/tasks.txt`;
  try{
    const history = fs.readFileSync(path).toString().trim();
    r = history.split("\n");
    r = r.map(l => l.split(" "));
    res.json(r);
  } catch(e) {
    console.log(e)
    if(e.code === 'ENOENT') {
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  }
}

//
// ─── OUTPUT ─────────────────────────────────────────────────────────────────
//
function getOutput(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}/output.json`;
  try {
    const out = fs.readFileSync(path).toString().trim();
    res.json(JSON.parse(out));
  } catch(e) {
    console.log(e)
    if(e.code === 'ENOENT') {
      res.sendStatus(200);
    }
    else {
      res.sendStatus(400);
    }
  }
}
function openFileExplorer(req, res) {
  const scan = req.query.scan;
  const path = `${workspacesFolder}${scan}`;
}

//
// ─── UTILS ──────────────────────────────────────────────────────────────────────
//
function scanObjToScript(obj, scan) {
  const ip = obj.ip;
  const type = obj.type;
  
  const sch = obj.sch ? ` -s ${obj.sch}` : "";
  const config = obj.config ? ` -c ${configDir}${obj.config}` : "";
  const fp = obj.fp ? " -fp" : "";
  const b = obj.b ? " -b" : "";
  const o = obj.o ? " -o" : "";
  const r = obj.r ? " -re" : "";

  return `sudo sniper${sch}${config} -t ${ip} -m ${type}${fp}${b}${o}${r} -w ${scan}`;
}

app.get('/exec', executeShell);
app.post("/scan", createScan);
app.get("/scan", getScan);
app.put("/scan", updateScan);
app.delete("/scan", deleteScan);
app.get("/scans", getScans);
app.get("/configs", getConfs);
app.get("/config", getConfig);
app.post("/config", createConfig);
app.delete("/config", deleteConfig);
app.put("/config", updateConfig);
app.get("/history", tasksHistory);
app.get("/output", getOutput);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
