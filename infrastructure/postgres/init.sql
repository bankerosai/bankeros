-- BankerOS PostgreSQL Initialization
-- Enables required extensions for the banking platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- For fuzzy text search on customer names
CREATE EXTENSION IF NOT EXISTS "btree_gin";    -- Composite index support

-- Set default timezone to UTC (critical for financial timestamps)
SET timezone = 'UTC';
ALTER DATABASE bankeros_core SET timezone TO 'UTC';

-- Row-level security will be configured per-table by Prisma migrations
-- This file runs once on first container start
