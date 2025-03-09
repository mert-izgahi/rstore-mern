"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const pino_1 = __importDefault(require("pino"));
const dayjs_1 = __importDefault(require("dayjs"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const logDirectory = path_1.default.join(path_1.default.resolve(__dirname, "../../"), "logs");
if (!fs_1.default.existsSync(logDirectory)) {
    fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
// Log file path
const logFilePath = path_1.default.join(logDirectory, `app.log-${(0, dayjs_1.default)().format("YYYY-MM-DD")}.log`);
const loggerInstance = (0, pino_1.default)({
    transport: {
        targets: [
            {
                target: "pino/file",
                options: { destination: logFilePath, mkdir: true },
            },
            {
                target: "pino-pretty", // Pretty print logs in console
                options: {
                    colorize: true,
                    translateTime: true,
                    ignore: "pid,hostname",
                },
            },
        ],
        options: {
            colorize: true,
            translateTime: true,
            ignore: "pid,hostname",
        },
    },
    base: {
        pid: false,
    },
    // level: process.env.NODE_ENV === "production" ? "info" : "debug",
    timestamp: () => `,"time":"${(0, dayjs_1.default)().format("YYYY-MM-DD HH:mm:ss")}"`,
});
exports.logger = loggerInstance;
