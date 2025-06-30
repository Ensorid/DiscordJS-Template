import { DatabaseProvider } from '../provider';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

export class SQLiteProvider implements DatabaseProvider {
  private db: Database.Database;

  constructor(fileName = 'database.sqlite') {
    const dbPath = path.resolve(__dirname, '../data', fileName);

    if (!fs.existsSync(dbPath)) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    
    this.db = new Database(dbPath);

    this.db.prepare(`
      CREATE TABLE IF NOT EXISTS data (
        key TEXT PRIMARY KEY,
        value TEXT
      )
    `).run();
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    const row = this.db.prepare('SELECT value FROM data WHERE key = ?').get(key) as { value: string } | undefined;
    return row ? JSON.parse(row.value) as T : null;
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    this.db.prepare(`
      INSERT INTO data (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `).run(key, json);
  }

  async delete(key: string): Promise<void> {
    this.db.prepare('DELETE FROM data WHERE key = ?').run(key);
  }
}
