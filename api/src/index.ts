import "dotenv/config";
import express, { Express } from "express";
import { migrator } from "./database/config/databaseClient";
import { redisClient } from "./database/config/redisClient";
import assetsRouter from "./routes/AssetRouter";
import locationsRouter from "./routes/LocationRouter";
import settingsRouter from "./routes/SettingsRouter";
import authRouter from "./routes/AuthRouter";

const app: Express = express();
const port = process.env.API_PORT;

app.use(express.json());

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
