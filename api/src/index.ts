import "dotenv/config";
import express, { Express } from "express";
import { migrator } from "./database/config/databaseClient";
import { redisClient } from "./database/config/redisClient";

const app: Express = express();
const port = process.env.API_PORT;

const startupConfiguration = async () => {
  await migrator.up();
  await redisClient.connect();
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startupConfiguration();
});
