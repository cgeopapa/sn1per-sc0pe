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

function executeShell(request, response, next) {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  
  const ip = request.query.ip;
  const std = shell.exec("sudo ping google.com > test.out & websocketd --port=8080 tail -f -n 1000000 test.out &",
    {async: false}
  );
  response.writeHead(200, headers);

  // std.stdout.on("data", function(data) {
  //   console.log(data);
  //   return response.write(`data: ${JSON.stringify(data)}\n\n`);
  // })

  // std.stdout.on("end", function() {
  //   response.connection.destroy();
  // })
}
app.get('/exec', executeShell);

function getScans(req, res) {
  res.setHeader('Content-Type', 'application/json');
  const scans = fs.readdirSync(scansFolder);
  res.json(scans);
}
app.get("/scans", getScans)

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
