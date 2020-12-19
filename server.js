const express = require('express');
const app = express();
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/get_scenic_info', (req, res) => {
  try {
    const users = require('./scenic_info.json');
    const start = req.query.start;
    const end = req.query.end;
    res.send(users.XML_Head.Infos.Info.slice(start, end));
  }
  catch (ex) {
    console.log('Error' + ex.code)
  }
});

app.get('/init_scenic_info', async (req, res) => {
  let users = {};
  try {
    users = require('./scenic_info.json');

    const start = req.query.start;
    const end = req.query.end;
    res.send(users.XML_Head.Infos.Info.slice(start, end));
    fetchData();
  }
  catch (ex) {
    console.log('Error' + ex.code)

    await fetchData();
    users = require('./scenic_info.json');

    const start = req.query.start;
    const end = req.query.end;
    res.send(users.XML_Head.Infos.Info.slice(start, end));
  }
});

// TODO make fetchData fetch everyday by crond
function fetchData() {
  return new Promise((resolve) => {
    let url = 'https://gis.taiwan.net.tw/XMLReleaseALL_public/scenic_spot_C_f.json';
    console.log('Start:', Date.now().toLocaleString());
    let settings = { method: "Get" };
    fetch(url, settings)
      .then(res => res.text())
      .then((json) => {
        fs.writeFile('scenic_info.json', json, 'utf8', (err) => {
          if (err) throw err;
          console.log('End:', Date.now().toLocaleString());
          console.log('Saved to file!');
          resolve('Done');
        });
      })
      .catch((err) => {
        console.log('Error: ' + err);
      });
  })
};

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('Listening on Port ' + PORT)
});