import { Http, Message } from "./enums";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function createError(
  message: string,
  status: number = Http.HttpStatus.INTERNAL_SERVER_ERROR
): AppError {
  const error: AppError = new Error(message);
  error.status = status;
  return error;
}

export const ErrorUtils = {
  badRequest: (message: string = Message.Error.BaseError.BAD_REQUEST) =>
    createError(message, Http.HttpStatus.BAD_REQUEST),
  unauthorized: (message: string = Message.Error.BaseError.UNAUTHORIZED) =>
    createError(message, Http.HttpStatus.UNAUTHORIZED),
  forbidden: (message: string = Message.Error.BaseError.FORBIDDEN) =>
    createError(message, Http.HttpStatus.FORBIDDEN),
  notFound: (message: string = Message.Error.BaseError.NOT_FOUND) =>
    createError(message, Http.HttpStatus.NOT_FOUND),
  conflict: (message: string = Message.Error.BaseError.CONFLICT) =>
    createError(message, Http.HttpStatus.CONFLICT),
  internal: (message: string = Message.Error.BaseError.INTERNAL_SERVER_ERROR) =>
    createError(message, Http.HttpStatus.INTERNAL_SERVER_ERROR),
};
