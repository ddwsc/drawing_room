import fs from "fs";
import path from "path";
import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";
import config from "@/configs/env";

const logPath = path.resolve(config.log.dir);
// Create the log directory if it does not exist
if (!fs.existsSync(logPath)) {
	fs.mkdirSync(logPath);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
	dirname: logPath,
	filename: "%DATE%.log",
	datePattern: "YYYY-MM-DD",
	maxFiles: config.log.maxFiles,
	format: format.combine(format.json()),
});

const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({
			format: "YYYY-MM-DD HH:mm:ss",
		}),
		format.splat(),
		format.prettyPrint(),
		format.simple(),
		format.json(),
		format.printf((options) =>
			[
				`[${options.timestamp}]`,
				options.label
					? `${options.label} [${options.level.toUpperCase()}]`
					: `[${options.level.toUpperCase()}]`,
				`${options.message}`,
			].join(" ")
		)
	),
	transports: [new transports.Console(), dailyRotateFileTransport],
});

export default logger;
