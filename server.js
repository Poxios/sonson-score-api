const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const app = express();
const port = 3030;
const dbPromise = open({
  filename: "scoreboard.db",
  driver: sqlite3.Database,
});

app.use(bodyParser.json());

app.post("/score", async (req, res) => {
  const { name, score, data } = req.body;

  if (typeof name !== "string" || typeof score !== "number" || typeof data !== "string") {
    return res.status(400).send("Invalid input");
  }

  const db = await dbPromise;
  await db.run("INSERT INTO scores (name, score, data) VALUES (?, ?, ?)", [name, score, data]);

  // Re-sort the table based on score after insertion
  const rows = await db.all("SELECT * FROM scores ORDER BY score DESC");
  await db.exec("DELETE FROM scores");
  for (const row of rows) {
    await db.run("INSERT INTO scores (name, score, data) VALUES (?, ?, ?)", [row.name, row.score, row.data]);
  }

  res.status(201).send("Score added successfully");
});

app.get("/scores", async (req, res) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM scores ORDER BY score DESC LIMIT 100");
  res.json(rows);
});

app.delete("/scores", async (req, res) => {
  const { password } = req.body;

  if (password !== "dangerouspassword123!") {
    return res.status(403).send("Forbidden");
  }

  const db = await dbPromise;
  await db.exec("DELETE FROM scores");
  res.send("All scores deleted successfully");
});

(async () => {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        score INTEGER,
        data TEXT
    )
  `);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
})();
