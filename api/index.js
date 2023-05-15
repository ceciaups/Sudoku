const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
var db = fs.createReadStream(__dirname + "/../csv/sudoku.csv");
const app = express();

app.use(express.static(__dirname + "/../"));

app.get("/api", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/api/sudokuDB/:id", (req, res) => {
  const dbData = [];
  const number = Number(req.params.id) + 1;

  db.pipe(parse({ delimiter: ",", from_line: number , to_line: number }))

  .on("data", function (row) {
    dbData.push(row);
  })
  .on("error", function (error) {
    console.log(error.message);
  })
  .on("end", function () {
    console.log("Read csv data done!");
    var data = {
      "quiz": dbData[0][0],
      "solution": dbData[0][1]
    }
    res.send(data);
  })
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;