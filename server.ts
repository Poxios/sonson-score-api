import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const app = express();
const port = 3000;
const dbPromise = open({
  filename: "scoreboard.db",
  driver: sqlite3.Database,
});

app.use(bodyParser.json());

app.post("/score", async (req: Request, res: Response) => {
  const { name, score, region } = req.body;

  if (typeof name !== "string" || typeof score !== "number" || typeof region !== "string") {
    return res.status(400).send("Invalid input");
  }

  const db = await dbPromise;
  await db.run("INSERT INTO scores (name, score, region) VALUES (?, ?, ?)", [name, score, region]);

  // Re-sort the table based on score after insertion
  const rows = await db.all("SELECT * FROM scores ORDER BY score DESC");
  await db.exec("DELETE FROM scores");
  for (const row of rows) {
    await db.run("INSERT INTO scores (name, score, region) VALUES (?, ?, ?)", [row.name, row.score, row.region]);
  }

  res.status(201).send("Score added successfully");
});

app.get("/scores", async (req: Request, res: Response) => {
  const db = await dbPromise;
  const rows = await db.all("SELECT * FROM scores ORDER BY score DESC LIMIT 10");
  res.json(rows);
});

app.delete("/scores", async (req: Request, res: Response) => {
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
            region TEXT
        )
    `);
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
})();
