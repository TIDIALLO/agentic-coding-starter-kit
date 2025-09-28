import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.POSTGRES_URL as string;

if (!connectionString) {
  throw new Error("POSTGRES_URL environment variable is not set");
}

// Serverless-friendly Postgres client.
// Many hosted DBs (e.g., Neon) require TLS; enforce ssl: 'require'.
// Keep pool very small to avoid exhausting connections on serverless.
const client = postgres(connectionString, {
  ssl: "require",
  max: 1,
  idle_timeout: 20,
  connect_timeout: 30,
  prepare: false,
});
export const db = drizzle(client, { schema });
