const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const fs = require("fs");
const { parse } = require("csv-parse");
const app = express();
const CHUNK_SIZE = 1000000;
const dbData = [];

const sudokus = require("./sudokus");
// var dbUrl = "https://media.githubusercontent.com/media/ceciaups/Sudoku/master/csv/sudoku.csv";

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/sudokus", async (req, res) => {
  let result = sudokus.importDB(req, res);
});

app.get("/sudokuDB/:id", async (req, res) => {
  sudokus.getSudoku(req, res);
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;