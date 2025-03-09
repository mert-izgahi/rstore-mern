"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const notFoundMiddleware = (req, res, next) => {
    res.status(404).json({
        status: 404,
        message: "Route not found",
        title: "NotFound",
    });
    next();
};
exports.notFoundMiddleware = notFoundMiddleware;
