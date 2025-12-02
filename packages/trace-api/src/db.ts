import { SQL } from "bun";
import { Database } from "trace-db";
import { env } from "./env.ts";

const db: Database = new Database(new SQL(env.DATABASE_URL ?? "sqlite://:memory:"));

export { db };
