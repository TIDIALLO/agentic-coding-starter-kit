-- Add credits column to user table with default 30
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS "credits" integer DEFAULT 30 NOT NULL;

-- Backfill existing rows that may be null (defensive for old snapshots)
UPDATE "user" SET "credits" = 30 WHERE "credits" IS NULL;

