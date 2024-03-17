import "dotenv/config";
import express, { Express } from "express";
import { migrator } from "./database/config/databaseClient";
import { redisClient } from "./database/config/redisClient";
import cors from 'cors';
import helment from "helmet";
import assetsRouter from "./routes/AssetRouter";
import locationsRouter from "./routes/LocationRouter";
import settingsRouter from "./routes/SettingsRouter";
import authRouter from "./routes/AuthRouter";
import { rateLimterMiddleware } from "./middlewares/requestRateLimiter";

const app: Express = express();
const port = process.env.API_PORT;

app.use(cors())
app.use(express.json());
app.use(helment());
app.use(rateLimterMiddleware);
app.disable('x-powered-by');

// Routes
app.use("/settings", settingsRouter);
app.use("/assets", assetsRouter);
app.use("/locations", locationsRouter);
app.use("/auth", authRouter);

const startupConfiguration = async () => {
  await migrator.up();
  await redisClient.connect();
};

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
  startupConfiguration();
});

export default app;
