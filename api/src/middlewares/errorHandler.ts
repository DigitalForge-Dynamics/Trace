import { Request, Response, NextFunction } from "express";
import { HandleError } from "../controllers/ErrorController";
import Logger from "../utils/Logger";

type GenericError = {
  statusCode: number;
  message: string;
};

export const errorHandler = (
  err: Error,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
) => {
  const { statusCode, message } = sanitiseError(err);

  res
  .status(statusCode)
  .json({
    error: {
      message,
    },
  })
  .end();
};

const sanitiseError = (error: Error): GenericError => {
  if (error instanceof HandleError) return error;
  Logger.error(error.message);
  return {
    statusCode: 500,
    message: "Internal Server Error",
  };
};
