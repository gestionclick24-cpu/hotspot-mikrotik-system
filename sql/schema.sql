-- schema.sql
CREATE TABLE IF NOT EXISTS users (
  id integer primary key autoincrement,
  email text UNIQUE,
  password text,
  provider text,
  provider_id text,
  verified boolean default 0,
  created_at datetime default (datetime('now')),
  updated_at datetime default (datetime('now'))
);

CREATE TABLE IF NOT EXISTS plans (
  id integer primary key autoincrement,
  name text,
  price_cents integer default 0,
  duration_days integer default 1,
  max_sessions integer default 1,
  mikrotik_profile text default 'default',
  created_at datetime default (datetime('now')),
  updated_at datetime default (datetime('now'))
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id integer primary key autoincrement,
  user_id integer,
  plan_id integer,
  username text,
  password text,
  started_at datetime,
  expires_at datetime,
  active boolean default 1,
  created_at datetime default (datetime('now'))
);
