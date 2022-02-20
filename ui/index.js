const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const shell = require('shelljs');
const fs = require('fs');

const scansFolder = '/usr/share/sniper/loot/workspace/';

const app = express();

app.use(cors({
  origin: 'http://localhost:4200'
}));
app.set('json spaces', 200);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

function executeShell(req, res) {
  const scan = req.query.scan;
  const path = `${scansFolder}${scan}`;
  shell.exec(`sudo sh ${path}/scan.sh > ${path}/scan.out & websocketd --address="${scan}" --port=3333 tail -f -n 1000000 ${path}/scan.out`,
    {async: false}
  );
  res.sendStatus(200);
}
app.get('/exec', executeShell);

function getScans(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const scans = fs.readdirSync(scansFolder);
  res.json(scans);
}
app.get("/scans", getScans)

function deleteScan(req, res) {
  const scan = req.query.scan;
  fs.rmSync(scansFolder+"/"+scan, {recursive: true, force: true});
  res.sendStatus(200);
}
app.delete("/scan", deleteScan)

function createScan(req, res) {
  const scan = req.query.scan;
  const path = `${scansFolder}/${scan}`
  fs.mkdirSync(path)
  // ip type 
  const ip = req.query.ip;
  const type = req.query.type
  fs.writeFileSync(`${path}/scan.sh`, `sudo sniper -t ${ip} -m ${type} -w ${scan}`)

  res.sendStatus(200);
}
app.get("/scan", createScan)

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
