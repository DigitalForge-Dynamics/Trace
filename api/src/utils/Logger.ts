import winston from "winston";
import { environment } from "..";

const Logger = winston.createLogger({
  level: environment === "development" ? "debug" : "warn",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.colorize({ all: true })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exitOnError: false,
});

export default Logger;
