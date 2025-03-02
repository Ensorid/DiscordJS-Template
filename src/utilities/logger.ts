import * as fs from "fs";
import * as path from "path";
import { logInConsole } from "../../config.json";

export enum level {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    DEBUG = "DEBUG",
}

/**
 * Custom logger function for logging messages to the console and a log file with timestamps and log levels
 * @param message The message to log
 * @param level The log level
*/
export function log(message: string, level: level): void {
	const logDir = path.join("logs");
	const date = new Date();
	const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
	const logFilePath = path.join(logDir, `${formattedDate}.log`);

	// Create the log directory if it doesn't exist
	if (!fs.existsSync(logDir)) {
		fs.mkdirSync(logDir);
	}

	const timeStamp = date.toTimeString().split(" ")[0];
	const logMessage = `${timeStamp} [${level}] ${message}`;

	// Check if the log message should be displayed in the console
	if (logInConsole) {
		console.log(logMessage);
	}

	fs.appendFileSync(logFilePath, logMessage + "\n", { encoding: "utf8" });
}
