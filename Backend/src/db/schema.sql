CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  monthly_budget NUMERIC(12,2),
  daily_budget NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  entry_type VARCHAR(50) NOT NULL,
  source_type VARCHAR(50) NOT NULL DEFAULT 'manual',

  amount NUMERIC(12,2) NOT NULL CHECK (amount >= 0),
  currency VARCHAR(10) NOT NULL DEFAULT 'INR',

  title VARCHAR(150),
  category VARCHAR(100),
  paid_to VARCHAR(150),
  payment_for VARCHAR(200),
  payment_method VARCHAR(50),
  payment_date TIMESTAMP NOT NULL,

  notes TEXT,
  payment_proof_url TEXT,

  source_text TEXT,
  ai_confidence NUMERIC(5,2),
  ai_raw_json JSONB,
  metadata JSONB,

  is_user_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);