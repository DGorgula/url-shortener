require("dotenv").config();
const express = require("express");
const bodyParser = require('body-parser');
const formBodyParse = bodyParser.urlencoded({ extended: true });

const cors = require("cors");
const app = express();

app.use(cors());

app.use("/public", express.static(`./public`));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post('/api/shorturl/new', formBodyParse, (req, res) => {
  const bla = req.body;
  res.send(bla);
})

module.exports = app;
