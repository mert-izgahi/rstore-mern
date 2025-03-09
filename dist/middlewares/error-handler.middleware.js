"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandlerMiddleware = void 0;
const api_error_1 = require("../lib/api-error");
const logger_1 = require("../lib/logger");
const errorHandlerMiddleware = (error, req, res, next) => {
    const errorMessage = error instanceof Error ? error.message : error;
    logger_1.logger.error(errorMessage);
    if (error instanceof api_error_1.ApiError) {
        res.status(error.status).json({
            status: error.status,
            message: error.message,
            title: error.title,
        });
        return;
    }
    res.status(500).json({
        status: 500,
        message: "Something went wrong!",
        title: "ERROR",
    });
    next();
};
exports.errorHandlerMiddleware = errorHandlerMiddleware;
