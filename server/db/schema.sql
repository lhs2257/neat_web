-- NEAT 웹 MVP 데이터베이스 스키마
-- ADR-013: Node.js + Express + PostgreSQL on Render

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  nickname VARCHAR(16) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  whisky TEXT NOT NULL,
  category TEXT,
  nose TEXT,
  palate TEXT,
  finish TEXT,
  rating NUMERIC(3,1),
  img TEXT,
  x FLOAT DEFAULT 100,
  y FLOAT DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS likes (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  note_id INTEGER REFERENCES notes(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, note_id)
);
