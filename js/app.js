const bodyParser = require("body-parser");
const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();
var db =  fs.createReadStream(__dirname + "/../csv/sudoku.csv");
const dbData = [];

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/sudokuDB/:id", (req, res) => {
  res.send(dbData[req.params.id]);
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

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