-- Cloudflare D1 Schema for Nitya Smaran Sync
CREATE TABLE IF NOT EXISTS smaran_sync (
  user_id TEXT PRIMARY KEY,
  state_json TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);
