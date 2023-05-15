const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();
var db =  fs.createReadStream(__dirname + "/../csv/sudoku.csv");
const dbData = [];

db.pipe(parse({ delimiter: ",", from_line: 2 }))

.on("data", function (row) {
  dbData.push(row);
})
.on("error", function (error) {
  console.log(error.message);
})
.on("end", function () {
  console.log("Read csv data done!");
})

app.use(express.static(__dirname + "/../"));

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/api/sudokuDB/:id", (req, res) => {
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