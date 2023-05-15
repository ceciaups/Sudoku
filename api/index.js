const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const { parse } = require("csv-parse");
const app = express();
var dbUrl = "https://media.githubusercontent.com/media/ceciaups/Sudoku/master/csv/sudoku.csv";
const dbData = [];

https.get(dbUrl, (res) => {
  res.pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", (row) => {
    dbData.push(row);
  })
  .on("error", (error) => {
    console.log(error.message);
  })
  .on("end", () => {
    console.log("Read csv data done!");
    console.log(dbData.length);
  })
});

app.use(express.static(__dirname + "/../"));

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/api/sudokuDB/:id", (req, res) => {
  console.log(dbData.length);

  var data = {
    "quiz": dbData[req.params.id][0],
    "solution": dbData[req.params.id][1]
  }
  res.send(data);
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;