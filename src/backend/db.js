import sqlite3 from "sqlite3";
import { open } from "sqlite";

const initializeDB = async () => {
  const db = await open({
    filename: "./marketplace.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      password TEXT
    );
  `);

  return db;
};

export default initializeDB;
