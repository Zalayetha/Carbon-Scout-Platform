import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

const connectionString = process.env.DATABASE_URL || "postgres://anvia:anvia@localhost:5433/anvia";

// PostgreSQL client instance using postgres.js
export const client = postgres(connectionString, {
  max: 10,
});

// Drizzle ORM client instance with schema attached
export const db = drizzle(client, { schema });
