import { Request, Response, NextFunction } from "express";

type GenericError = {
  statusCode: number;
  message: string;
};

export const errorHandler = (
  err: GenericError,
  _req: Request<{}>,
  res: Response,
  _next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    error: {
      message: message,
    },
  });
};
