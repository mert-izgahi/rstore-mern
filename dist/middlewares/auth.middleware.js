"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizedFor = exports.withAuth = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const configs_1 = __importDefault(require("../configs"));
const api_error_1 = require("../lib/api-error");
const logger_1 = require("../lib/logger");
const authMiddleware = (req, res, next) => {
    try {
        const { token } = req === null || req === void 0 ? void 0 : req.cookies;
        if (!token) {
            next();
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, configs_1.default.JWT_SECRET);
        if (!decoded) {
            next();
            return;
        }
        const currentUserId = decoded.id;
        const currentUserRole = decoded.role;
        if (!currentUserId) {
            next();
            logger_1.logger.error("Invalid token");
            return;
        }
        if (!currentUserRole) {
            next();
            logger_1.logger.error("Invalid token");
            return;
        }
        res.locals.currentUserId = currentUserId;
        res.locals.currentUserRole = currentUserRole;
        next();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : error;
        logger_1.logger.error(errorMessage);
    }
};
exports.authMiddleware = authMiddleware;
const withAuth = (req, res, next) => {
    const { currentUserId } = res.locals;
    if (!currentUserId) {
        logger_1.logger.error("Invalid token");
        next(api_error_1.ApiError.invalidCredentials());
        return;
    }
    next();
};
exports.withAuth = withAuth;
const authorizedFor = (...roles) => {
    return (req, res, next) => {
        const { currentUserRole } = res.locals;
        if (!currentUserRole) {
            next(api_error_1.ApiError.invalidCredentials());
            return;
        }
        if (!roles.includes(currentUserRole)) {
            next(api_error_1.ApiError.invalidCredentials());
            return;
        }
        next();
    };
};
exports.authorizedFor = authorizedFor;
