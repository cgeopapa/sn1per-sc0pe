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
const scansFolder = '/usr/share/sniper/loot/workspace/';

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
      const path = `${scansFolder}${scan}`;
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
  const path = `${scansFolder}${scan}`;
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
// ─── GET SCANS ──────────────────────────────────────────────────────────────────
//
function getScans(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let scans = fs.readdirSync(scansFolder, { withFileTypes: true });
  scans = scans.filter(s => s.isDirectory()).map(s => s.name)

  const scansFile = fs.readFileSync(scanStatusPath);
  scanStatus = JSON.parse(scansFile);
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
  
  res.json(scans);
}

//
// ─── DELETE SCNAS ───────────────────────────────────────────────────────────────
//
function deleteScan(req, res) {
  const scan = req.query.scan;
  fs.rmSync(scansFolder+"/"+scan, {recursive: true, force: true});

  delete scanStatus[scan];
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}

//
// ─── CREATE SCAN ────────────────────────────────────────────────────────────────
//
function createScan(req, res) {
  const scan = req.query.scan;
  const path = `${scansFolder}/${scan}`
  fs.mkdirSync(path)
  const ip = req.query.ip;
  const type = req.query.type;
  
  const fp = req.query.fp == "true" ? " -fp" : "";
  const b = req.query.b == "true" ? " -b" : "";
  const o = req.query.o == "true" ? " -o" : "";
  const r = req.query.r == "true" ? " -re" : "";

  fs.writeFileSync(`${path}/scan.sh`, `sudo sniper -t ${ip} -m ${type} ${fp}${b}${o}${r} -w ${scan}`)
  scanStatus[scan] = false;
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}

//
// ─── GET CONFIGS ────────────────────────────────────────────────────────────────
//
function getConfs(req, res) {
  res.setHeader('Content-Type', 'application/json');
  let configs = fs.readdirSync(configDir);
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

//
// ─── CREATE CONFIG ──────────────────────────────────────────────────────────────
//
function createConfig(req, res) {

}

app.get('/exec', executeShell);
app.get("/scan", createScan);
app.delete("/scan", deleteScan);
app.get("/scans", getScans);
app.get("/configs", getConfs);
app.get("/config", getConfig);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
