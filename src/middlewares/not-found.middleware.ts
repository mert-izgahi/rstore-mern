import { NextFunction, Request, Response } from "express";
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    status: 404,
    message: "Route not found",
    title: "NotFound",
  });
  next();
};
