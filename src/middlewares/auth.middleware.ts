import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import configs from "../configs";
import { ApiError } from "../lib/api-error";
import { logger } from "../lib/logger";

interface RequestWithCookies extends Request {
  cookies: {
    token: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req?.cookies as RequestWithCookies["cookies"];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, configs.JWT_SECRET!) as {
      id: string;
      role: string;
    };

    if (!decoded) {
      next();
      return;
    }

    const currentUserId = decoded.id;
    const currentUserRole = decoded.role;
    if (!currentUserId) {
      next();
      logger.error("Invalid token");
      return;
    }

    if (!currentUserRole) {
      next();
      logger.error("Invalid token");
      return;
    }

    res.locals.currentUserId = currentUserId;
    res.locals.currentUserRole = currentUserRole;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : error;
    logger.error(errorMessage);
  }
};

export const withAuth = (req: Request, res: Response, next: NextFunction) => {
  const { currentUserId } = res.locals;
  if (!currentUserId) {
    logger.error("Invalid token");
    return next(ApiError.invalidCredentials());
  }
  return next();
};

export const authorizedFor = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { currentUserRole } = res.locals;
    if (!currentUserRole) {
      return next(ApiError.invalidCredentials());
    }

    if (!roles.includes(currentUserRole)) {
      return next(ApiError.invalidCredentials());
    }

    return next();
  };
};
