"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError extends Error {
    constructor(status, message, title) {
        super(message);
        this.title = title;
        this.status = status;
    }
    static notFound(message = "Route not found") {
        return new ApiError(404, message, "NotFound");
    }
    static duplicatedEmail(message = "Email already exist") {
        return new ApiError(409, message, "DuplicateEmail");
    }
    static invalidCredentials(message = "Invalid credentials") {
        return new ApiError(401, message, "InvalidCredentials");
    }
    static badRequest(message = "Bad request") {
        return new ApiError(400, message, "BadRequest");
    }
}
exports.ApiError = ApiError;
