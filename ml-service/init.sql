CREATE TABLE IF NOT EXISTS platform_media_evaluations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(100) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    media_type VARCHAR(10) NOT NULL,
    visibility_score NUMERIC(5, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_media_sector ON platform_media_evaluations(sector);