import { SQL } from "bun";

const db: SQL = new SQL(":memory:");

export { db };
