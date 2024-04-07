import "dotenv/config";
import express, { Express } from "express";
import { startup as databaseStartup } from "./database/config/databaseClient";
import { getRedisClient } from "./database/config/redisClient";
import cors from "cors";
import helmet from "helmet";
import assetsRouter from "./routes/AssetRouter";
import locationsRouter from "./routes/LocationRouter";
import settingsRouter from "./routes/SettingsRouter";
import authRouter from "./routes/AuthRouter";
import { rateLimiterMiddleware } from "./middlewares/requestRateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { httpRequestLogger } from "./middlewares/httpRequestLogger";

const app: Express = express();
const port = process.env.API_PORT;

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(httpRequestLogger);
app.use(rateLimiterMiddleware);
app.disable("x-powered-by");

// Routes
app.use("/settings", settingsRouter);
app.use("/assets", assetsRouter);
app.use("/locations", locationsRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

const startupConfiguration = async () => {
  const redisClient = getRedisClient();
  await Promise.all([
    databaseStartup(),
    redisClient.connect(),
  ]);
};

app.listen(port, async () => {
  console.log(`Server is starting on port: ${port}`);
  await startupConfiguration();
  console.log(`Server has started on port: ${port}`);
});

export default app;
