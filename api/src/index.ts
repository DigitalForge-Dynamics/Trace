import "dotenv/config";
import express, { Express } from "express";
import { migrator } from "./database/config/databaseClient";
import { redisClient } from "./database/config/redisClient";
import assetsRouter from './routes/assetsRouter';

const app: Express = express();
const port = process.env.API_PORT;

app.use(express.json());


// Asset Route
app.use('/assets', assetsRouter);

const startupConfiguration = async () => {
  await migrator.up();
  await redisClient.connect();
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startupConfiguration();
});
