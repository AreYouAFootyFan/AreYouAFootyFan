import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/error.utils";
import { Message, Http, Db } from "../utils/enums";

export const errorHandler = (
  error: AppError,
  _request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (response.headersSent) {
    return next(error);
  }

  const status = error.status || Http.HttpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || Message.Error.ApiError.SOMETHING_WENT_WRONG;

  if (error.code === Db.PgErrorCode.UNIQUE_VIOLATION) {
    response.status(Http.HttpStatus.CONFLICT).json({
      error: Message.Error.ApiError.DUPLICATE_RECORD,
    });
    return;
  }
  response.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

export const notFoundHandler = (request: Request, response: Response): void => {
  const errorMessage = Message.Error.ApiError.ENDPOINT_NOT_FOUND
    .replace("{method}", request.method)
    .replace("{path}", request.path);
    
  response.status(Http.HttpStatus.NOT_FOUND).json({
    error: errorMessage,
  });
};
