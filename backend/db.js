import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

// Keep the default database beside the backend, regardless of the working directory.
const databasePath = process.env.DATABASE_PATH
  || fileURLToPath(new URL('./data/expenses.db', import.meta.url));

mkdirSync(dirname(databasePath), { recursive: true });

const db = new Database(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  );
`);

export default db;
