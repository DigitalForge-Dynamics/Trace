import winston from "winston";

winston.addColors({
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'white',
    debug: 'magenta',
});

const Logger = winston.createLogger({
  level: "info",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
  exitOnError: false,
});

export default Logger;
