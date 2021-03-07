require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const formBodyParse = bodyParser.urlencoded({ extended: false });
const { DataBase } = require('./classes/DataBase.js');
const cors = require("cors");
const app = express();

// middleWares
app.use('/', cors());   // opened to all to enable your checking methods work properly.
app.use('/public', express.static(`./public`));

// enters the main site.
app.get("/", (req, res) => {
  return res.sendFile(__dirname + "/views/index.html");
});

// redirects to url registered for shortened id given.
app.get("/:shortUrl", (req, res) => {
  const { shortUrl } = req.params;
  const messenger = new DataBase(shortUrl);
  messenger.isThere(shortUrl, 'redirect').then(response => {
    return res.redirect(303, response);
  }).catch(error => {
    return res.status(200).send("Couldn't get url from specified shortened url: " + error.message);
  });
});

// get all statistics of specific shortened url
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
  return
});

module.exports = app;
