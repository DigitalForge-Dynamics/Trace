import "dotenv/config";
import "reflect-metadata";
import express, { Express } from "express";
import { getRedisClient } from "./database/config/redisClient";
import cors from "cors";
import helmet from "helmet";
import assetsRouter from "./routes/AssetRouter";
import locationsRouter from "./routes/LocationRouter";
import settingsRouter from "./routes/SettingsRouter";
import authRouter from "./routes/AuthRouter";
import systemRouter from "./routes/SystemRouter";
import dashboardRouter from "./routes/DashboardRouter";
import { rateLimiterMiddleware } from "./middlewares/requestRateLimiter";
import { errorHandler } from "./middlewares/errorHandler";
import { httpRequestLogger } from "./middlewares/httpRequestLogger";
import { getApiPort } from "./utils/Environment";
import SystemService from "./services/SystemService";
import AuthService from "./services/AuthenticationService";
import UserService from "./services/UserService";

const app: Express = express();
const port = getApiPort();

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(httpRequestLogger);
app.use(rateLimiterMiddleware);
app.disable("x-powered-by");

// Routes
app.use("/dashboard", dashboardRouter);
app.use("/system", systemRouter);
app.use("/settings", settingsRouter);
app.use("/assets", assetsRouter);
app.use("/locations", locationsRouter);
app.use("/auth", authRouter);
app.use(errorHandler);

const startupConfiguration = async () => {
  const redisClient = getRedisClient();
  await Promise.all([
    redisClient.connect(),
  ]);
  const systemService = new SystemService();
  const settings = await systemService.loadSettings();
  if (!settings.setup) {
    console.log("Generating quick start user:...");
    const authService = new AuthService();
    const userService = new UserService();
    // Strict ordering
    const [user, credential] = await systemService.generateQuickStartUser(authService);
    await userService.createUser(user);
    await systemService.setSettings({ ...settings, setup: true });
    // Intentional display of credentials, for quick start, to allow only Administrator to sign in.
    // Purposefully not using Logger, to avoid being stored in plain-text files.
    console.log(`Username: ${user.username}, Credential: ${credential}, MFA: ${user.mfaSecret}`);
  }
};

const server = app.listen(port, () => {
  console.log(`Server is starting on port: ${port}`);
  void startupConfiguration().then(() => {
    console.log(`Server has started on port: ${port}`);
  });
});

process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => {
    console.log("Server has shutdown");
  });
});

export default app;
