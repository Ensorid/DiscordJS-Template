import fs from "fs";
import path from "path";

type LogLevel = "info" | "warn" | "error";

function logMessage(message: string, level: LogLevel) {
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().slice(0, 10);
  const logFileName = `${formattedDate}.log`;
  const logFilePath = path.join(__dirname, "../../logs", logFileName);

  const logMessage = `[${currentDate.toISOString()}] [${level.toUpperCase()}] ${message}\n`;

  fs.appendFileSync(logFilePath, logMessage);

  console[level](message);
}

export const logger = {
  info: (message: string) => logMessage(message, "info"),
  warn: (message: string) => logMessage(message, "warn"),
  error: (message: string) => logMessage(message, "error"),
};
