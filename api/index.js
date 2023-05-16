const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const app = express();

const { sql } =  require('@vercel/postgres');
const dotenv = require("dotenv");
dotenv.config();

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/sudokuDB/:id", async (req, res) => {
  const { rows } = await sql`SELECT * FROM Sudokus WHERE id = ${req.params.id};`;
  const sudoku = rows[0];
  return res.status(200).send(sudoku);
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;
  