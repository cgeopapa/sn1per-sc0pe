const express = require('express');
const ws = require('ws');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs');

const scansFolder = '/usr/share/sniper/loot/workspace/';

const app = express();
const server = http.createServer(app);

const scanStatusPath = "../scans.json"
let scanObjects = {};
let scanStatus = {};
const scansFile = fs.readFileSync(scanStatusPath)
scanStatus = JSON.parse(scansFile);

let wsCons = [];

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.set('json spaces', 200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const wss = new ws.Server({ server });
wss.on('connection', sock => {
  wsCons.push(sock);
  const scansFile = fs.readFileSync(scanStatusPath)
  scanStatus = JSON.parse(scansFile);
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  sock.on('message', function(msg) {
    if(msg.toString().startsWith("pls ")) {
      const scan = msg.toString().substring(4);
      const path = `${scansFolder}${scan}`;
      const e = shell.exec(`tail -n1000 -f ${path}/scan.out`, {async: true});
      e.stdout.on('data', function(data) {
        sock.send(data);
      })
    }
  })
})

function executeShell(req, res) {
  const scan = req.query.scan;
  const path = `${scansFolder}${scan}`;
  const e = shell.exec(`sudo sh ${path}/scan.sh > ${path}/scan.out`, {async: true});
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

function getScans(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const scans = fs.readdirSync(scansFolder);

  const scansFile = fs.readFileSync(scanStatusPath)
  scanStatus = JSON.parse(scansFile);
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))
  
  res.json(scans);
}

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

function createScan(req, res) {
  const scan = req.query.scan;
  const path = `${scansFolder}/${scan}`
  fs.mkdirSync(path)
  const ip = req.query.ip;
  const type = req.query.type
  fs.writeFileSync(`${path}/scan.sh`, `sudo sniper -t ${ip} -m ${type} -w ${scan}`)
  scanStatus[scan] = false;
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}

function killScan(req, res) {
  const scan = req.query.scan;
  scanObjects[scan].kill();

  scanStatus[scan] = false;
  fs.writeFile(scanStatusPath, JSON.stringify(scanStatus), err => {
    if(err) console.log(err);
  });
  wsCons.forEach((s) => s.send(JSON.stringify(scanStatus)))

  res.sendStatus(200);
}

app.get('/exec', executeShell);
app.get("/scan", createScan);
app.get("/killscan", killScan);
app.delete("/scan", deleteScan);
app.get("/scans", getScans);

const PORT = 3001;

server.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
