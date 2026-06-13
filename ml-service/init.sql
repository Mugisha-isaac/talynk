-- 1. CORE USER ACCOUNT SCHEMA
CREATE TABLE IF NOT EXISTS platform_users (
    user_id SERIAL PRIMARY KEY,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. DYNAMIC MEDIA EVALUATIONS SCHEMA (Referencing Users)
CREATE TABLE IF NOT EXISTS platform_media_evaluations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,             
    media_type VARCHAR(10) NOT NULL,         -- 'audio', 'image', or 'video'
    visibility_score NUMERIC(5, 2) NOT NULL, 
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_sector ON platform_media_evaluations(sector);