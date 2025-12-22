import { Database } from "@DigitalForge-Dynamics/trace-db";
import { SQL } from "bun";
import { env } from "./env.ts";

const db: Database = new Database(new SQL(env.DATABASE_URL ?? "sqlite://:memory:"));

export { db };
