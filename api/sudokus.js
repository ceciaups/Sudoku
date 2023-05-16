const { db } =  require('@vercel/postgres');
const fs = require("fs");
const { parse } = require("csv-parse");

const dbData = [];
const dotenv = require("dotenv");
dotenv.config();

async function readDB() {
  var stream =  fs.createReadStream(__dirname + "/../csv/sudoku.csv");

  return new Promise((resolve, reject) => {
    stream.pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", (row) => {
      dbData.push(row);
    })
    .on("error", (error) => {
      console.log(error.message);
    })
    .on("end", () => {
      console.log("Read csv data done!");
      resolve();
    })
  })
}

async function importDB(req, res) {
  const client = await db.connect();

  if (!dbData.length) {
    await readDB();
  }
 
  try {
    await client.sql`DROP TABLE Sudokus`;
    await client.sql`CREATE TABLE Sudokus ( id integer PRIMARY KEY, quiz varchar(255), solution varchar(255) );`;
    // await client.sql`COPY Sudokus(quiz, solution)
    // FROM '/Users/buifamily.ceci/VSCode_workspace/JS_5111/JS-Pet-Project/csv/sudoku.csv'
    // DELIMITER ','
    // CSV HEADER;`
    dbData.forEach(async function(data, index) {
      // if (index <= 200000) {
        console.log(index);
        await client.sql`INSERT INTO Sudokus(id, quiz, solution)
        VALUES (${index}, ${data[0]}, ${data[1]});`;
      // }
    });

  } catch (error) {
    return res.status(500).json({ error });
  }
}

async function getSudoku(req, res) {
  const client = await db.connect();
  const query = await client.sql`SELECT * FROM Sudokus WHERE id = ${req.params.id};`;
  const sudoku = query.rows[0];
  return res.status(200).send(sudoku);
}

module.exports = {
  importDB,
  getSudoku
};