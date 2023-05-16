const express = require("express");
const http = require("http");
const https = require("https");
const path = require("path");
const app = express();

app.use(express.static(__dirname + "/../"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/../index.html");
});

app.get("/sudokuDB/:id", (req, res) => {

  // const client = await db.connect();
  // const query = await client.sql`SELECT * FROM Sudokus WHERE id = ${req.params.id};`;
  // const sudoku = query.rows[0];
  // return res.status(200).send(sudoku);

  var data = {
    "quiz": "004300209005009001070060043006002087190007400050083000600000105003508690042910300",
    "solution": "864371259325849761971265843436192587198657432257483916689734125713528694542916378"
  }

  res.send(data);
})

const httpServer = http.createServer(app);

httpServer.listen(80, function() {
  console.log("hello world");
})

module.exports = app;
  