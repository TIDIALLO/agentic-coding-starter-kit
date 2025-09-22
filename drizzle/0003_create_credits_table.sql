CREATE TABLE IF NOT EXISTS "credits" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "user_id" text NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "amount" integer NOT NULL,
  "reason" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);

-- Optional: seed initial grants matching the user's default
-- INSERT INTO "credits" (user_id, amount, reason) SELECT id, 30, 'initial grant' FROM "user";

