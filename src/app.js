import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';

import {setUpConnection} from "./database";
import collections from './routes/collections';

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/bundle.js', function (req, res) {
  res.sendFile('bundle.js', {root: 'client/build/'})
});

app.get('/manifest.json', function (req, res) {
  res.sendFile('manifest.json', {root: 'client/public/'});
});

app.get('/style', function (req, res) {
  res.sendFile('style.css', {root: 'client/build/'});
});

app.use('/api/collections', collections);


app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/../public/index.html'), function (err) {
    if (err) {
      res.status(500).send(err)
    }
  })
});

async function start() {
  setUpConnection();
  app.listen(5000, () => console.log("started at " + 5000));
}

start();

module.exports = app;
