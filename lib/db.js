const fs = require("fs");
const path = require("path");
const { DatabaseSync } = require("node:sqlite");

let db;

function getDb() {
  if (db) return db;

  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), "data", "chalk.db");
  fs.mkdirSync(path.dirname(dbPath), { recursive: true });

  const connection = new DatabaseSync(dbPath);
  try {
    connection.exec("PRAGMA busy_timeout = 5000");
    connection.exec("PRAGMA journal_mode = WAL");
    connection.exec("PRAGMA foreign_keys = ON");

    connection.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        display_name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'officer')),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id),
        body TEXT NOT NULL,
        pinned INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id),
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );

      CREATE TABLE IF NOT EXISTS officer_desk (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        note TEXT NOT NULL
      );
    `);
  } catch (error) {
    connection.close();
    throw error;
  }

  db = connection;
  return db;
}

module.exports = getDb;
