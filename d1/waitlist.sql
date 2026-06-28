-- Esquema de la waitlist de beta cerrada (Cloudflare D1).
-- Crear la base:  wrangler d1 create minibox-waitlist
-- Aplicar:        wrangler d1 execute minibox-waitlist --remote --file=d1/waitlist.sql
CREATE TABLE IF NOT EXISTS waitlist (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  email      TEXT NOT NULL UNIQUE,
  source     TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist (created_at);
