import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { getDatabaseHost, getDatabaseName, getDatabasePassword, getDatabasePort, getDatabaseUsername } from "../../utils/Environment";

dotenv.configDotenv();

const getDatabaseConnectionUrl = (): string => {
  const instance = getDatabaseName();
  const username = getDatabaseUsername();
  const password = getDatabasePassword();
  const host = getDatabaseHost();
  const port = getDatabasePort();

  if (!instance || !username || !password || !host || !port) {
    throw new Error("Unable to retrieve Database Connection Credentials");
  }

  return `postgres://${username}:${password}@${host}:${port}/${instance}`;
}

const connectionUrl = getDatabaseConnectionUrl();

export const databaseConnection = new DataSource({
  type: "postgres",
  url: connectionUrl,
  synchronize: false,
  logging: true,
  schema: "public",
});
