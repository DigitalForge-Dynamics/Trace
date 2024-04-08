import { Request, Response, NextFunction } from "express";
import { HandleError } from "../controllers/ErrorController";

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
  })
  .end();
};

const sanitiseError = (error: Error): GenericError => {
  if (error instanceof HandleError) return error;
  return {
    statusCode: 500,
    message: "Internal Server Error",
  };
};
