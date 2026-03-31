import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'nihongo.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS vocabulary (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      reading TEXT,
      meaning TEXT NOT NULL,
      source TEXT,
      review_count INTEGER DEFAULT 0,
      next_review INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch())
    );
  `);
}

export interface VocabularyItem {
  id: number;
  word: string;
  reading: string | null;
  meaning: string;
  source: string | null;
  review_count: number;
  next_review: number;
  created_at: number;
}

export function getAllVocabulary(): VocabularyItem[] {
  const db = getDb();
  return db.prepare('SELECT * FROM vocabulary ORDER BY created_at DESC').all() as VocabularyItem[];
}

export function addVocabulary(
  word: string,
  reading: string | null,
  meaning: string,
  source: string | null
): VocabularyItem {
  const db = getDb();
  const stmt = db.prepare(
    'INSERT INTO vocabulary (word, reading, meaning, source) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(word, reading, meaning, source);
  return db.prepare('SELECT * FROM vocabulary WHERE id = ?').get(result.lastInsertRowid) as VocabularyItem;
}

export function deleteVocabulary(id: number): boolean {
  const db = getDb();
  const result = db.prepare('DELETE FROM vocabulary WHERE id = ?').run(id);
  return result.changes > 0;
}

export function updateReview(id: number, remembered: boolean): VocabularyItem | null {
  const db = getDb();
  const item = db.prepare('SELECT * FROM vocabulary WHERE id = ?').get(id) as VocabularyItem | undefined;
  if (!item) return null;

  const now = Math.floor(Date.now() / 1000);
  const newCount = item.review_count + 1;
  // SRS: if remembered, next review doubles (1 day, 2 days, 4 days, etc.)
  // if not remembered, review again after 5 minutes
  const interval = remembered ? Math.pow(2, item.review_count) * 86400 : 300;
  const nextReview = now + interval;

  db.prepare(
    'UPDATE vocabulary SET review_count = ?, next_review = ? WHERE id = ?'
  ).run(newCount, nextReview, id);

  return db.prepare('SELECT * FROM vocabulary WHERE id = ?').get(id) as VocabularyItem;
}
