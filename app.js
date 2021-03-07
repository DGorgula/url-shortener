require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const formBodyParse = bodyParser.urlencoded({ extended: false });
const { DataBase } = require('./classes/DataBase.js');
const cors = require("cors");
const app = express();

app.use('/', cors());

app.use('/public', express.static(`./public`));

// get response for localhost:3000/
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/views/index.html");
});

app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const messenger = new DataBase(shortUrl);
  messenger.isThere(shortUrl, 'redirect').then(response => {
    return res.redirect(303, response);
  }).catch(error => {
    return res.status(200).send("Couldn't get url from specified shortened url: " + error.message);
  });
});


app.get('/api/statistic/:shorturl-id', (req, res) => {
  const data = req.params.shorturl;
  const messenger = new DataBase(data);
  messenger.isThere(data).then(result => {
    console.log("post result: ", result);
    return res.status(200).send(result);
  }
  ).catch(error => {
    return res.send(error);
  });
});

// post response for localhost:3000/api/shoryurl/new
app.post('/api/shorturl/new', formBodyParse, (req, res) => {
  const data = req.body;
  const messenger = new DataBase(data);
  messenger.send(data).then(result => {
    res.status(200).send(result);
  }).catch((error) => {
    return res.status(200).send(error.message);
  });

  // return res.sendFile(__dirname + "/views/index.html");
  return
});






module.exports = app;
