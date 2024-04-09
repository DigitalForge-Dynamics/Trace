import { Request, Response, NextFunction } from "express";
import { HandleError } from "../controllers/ErrorController";
import Logger from "../utils/Logger";

type GenericError = {
  statusCode: number;
  message: string;
};

export const errorHandler = (
  err: Error,
  _req: Request<{}>,
  res: Response,
  _next: NextFunction
) => {
  const { statusCode, message } = sanitiseError(err);

  res
  .status(statusCode)
  .json({
    error: {
      message,
    },
  });
};

const sanitiseError = (error: Error): GenericError => {
  if (error instanceof HandleError) return error;
  Logger.error(error);
  return {
    statusCode: 500,
    message: "Internal Server Error",
  };
};
