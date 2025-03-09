"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = require("../lib/logger");
const loggerMiddleware = (req, res, next) => {
    const { method, url } = req;
    logger_1.logger.info(`${method} ${url} ${JSON.stringify(req.body)}`);
    next();
};
exports.loggerMiddleware = loggerMiddleware;
