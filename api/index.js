const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const { parse } = require("csv-parse");
const app = express();
var dbUrl = "https://media.githubusercontent.com/media/ceciaups/Sudoku/master/csv/sudoku.csv";

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/sudokuDB/:id", (req, res) => {
  const dbData = [];
  const number = Number(req.params.id) + 1;

  https.get(dbUrl, (res_db) => {
    res_db.pipe(parse({ delimiter: ",", from_line: number, to_line: number }))
    .on("data", (row) => {
      dbData.push(row);
    })
    .on("error", (error) => {
      console.log(error.message);
    })
    .on("end", () => {
      console.log("Read csv data done!");

      var data = {
        "quiz": dbData[0][0],
        "solution": dbData[0][1]
      }
      res.send(data);
    })
  });
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;