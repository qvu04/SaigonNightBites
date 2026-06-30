-- SaigonNightBites Database Schema
-- Run this in Supabase SQL Editor to initialize all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ============================================================
-- SEARCH HISTORY TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS search_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  mood VARCHAR(50) NOT NULL,
  budget VARCHAR(20) NOT NULL,
  radius INTEGER NOT NULL CHECK (radius BETWEEN 1000 AND 5000),
  ai_keywords JSONB DEFAULT '[]',
  ai_reason TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at DESC);

-- ============================================================
-- FAVORITE PLACES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS favorite_places (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  place_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  rating DECIMAL(2, 1) CHECK (rating BETWEEN 0 AND 5),
  vicinity TEXT,
  location JSONB,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_places_user_id ON favorite_places(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
-- Note: Since the backend uses service_role key, RLS is enforced
-- at the application layer. These policies add a defense-in-depth layer.

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorite_places ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS by default in Supabase — these policies
-- protect against direct client access with anon/user tokens.
CREATE POLICY "No public access to users" ON users
  FOR ALL USING (false);

CREATE POLICY "No public access to search_history" ON search_history
  FOR ALL USING (false);

CREATE POLICY "No public access to favorite_places" ON favorite_places
  FOR ALL USING (false);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
