const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();
const CHUNK_SIZE = 10000000;
const dbData = [];
// var dbUrl = "https://media.githubusercontent.com/media/ceciaups/Sudoku/master/csv/sudoku.csv";

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

async function readDB() {
  const stream =  fs.createReadStream(__dirname + "/../csv/sudoku.csv", { highWaterMark: CHUNK_SIZE });

  for await(const db of stream) {
    let str = (db.toString()).split("\n");
    console.log(str.length);
    str.forEach(function(line, index) {
      if (index == 0 && dbData.length) {
        let last = dbData.pop();
        dbData.push(last.concat(line));
      }
      else {
        dbData.push(line);
      }
    });
  }
}

readDB();

app.get("/sudokuDB/:id", async (req, res) => {

  // var dbData = [];

  // const nthline = require("nthline"),
  //   filePath = __dirname + "/../csv/sudoku.csv",
  //   rowIndex = Number(req.params.id);

  // dbData = (await nthline(rowIndex, filePath)).split(",");
  
  let split = dbData[req.params.id].split(",");

  let data = {
    "quiz": split[0],
    "solution": split[1]
  }

  res.send(data);

  // https.get(dbUrl, (res_db) => {
  //   res_db.pipe(parse({ delimiter: ",", from_line: number, to_line: number }))
  //   .on("data", (row) => {
  //     dbData.push(row);
  //   })
  //   .on("error", (error) => {
  //     console.log(error.message);
  //   })
  //   .on("end", () => {
  //     console.log("Read csv data done!");

  //     var data = {
  //       "quiz": dbData[0][0],
  //       "solution": dbData[0][1]
  //     }
  //     res.send(data);
  //   })
  // });
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;