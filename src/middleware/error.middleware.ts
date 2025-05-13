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

  const status = error.status || Http.Status.INTERNAL_SERVER_ERROR;
  const message = error.message || Message.Error.Api.SOMETHING_WENT_WRONG;

  response.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { 
      stack: error.stack, 
      dbError: error.code ? mapToDbError(error.code) : "",
    }),
  });
};

export const notFoundHandler = (request: Request, response: Response): void => {
  const errorMessage = Message.Error.Api.ENDPOINT_NOT_FOUND.replace(
    "{method}",
    request.method
  ).replace("{path}", request.path);

  response.status(Http.Status.NOT_FOUND).json({
    error: errorMessage,
  });
};

const dbErrorMessages: Record<Db.PgErrorCode, string> = {
  [Db.PgErrorCode.UNIQUE_VIOLATION]: "A record with this value already exists.",
  [Db.PgErrorCode.FOREIGN_KEY_VIOLATION]: "Referenced record does not exist.",
  [Db.PgErrorCode.NOT_NULL_VIOLATION]: "A required field is missing.",
  [Db.PgErrorCode.CHECK_VIOLATION]: "A data validation rule was violated.",
  [Db.PgErrorCode.INVALID_TEXT_REPRESENTATION]: "Invalid input format.",
  [Db.PgErrorCode.UNDEFINED_TABLE]: "Referenced table does not exist.",
  [Db.PgErrorCode.UNDEFINED_COLUMN]: "Referenced column does not exist.",
};

const mapToDbError = (code: string): string => {
  return dbErrorMessages[code as Db.PgErrorCode] || "Unknown db error occured.";
};