import { Http, Message } from "./enums";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function createError(
  message: string,
  status: number = Http.Status.INTERNAL_SERVER_ERROR
): AppError {
  const error: AppError = new Error(message);
  error.status = status;
  return error;
}

export const ErrorUtils = {
  badRequest: (message: string = Message.Error.Base.BAD_REQUEST) =>
    createError(message, Http.Status.BAD_REQUEST),
  unauthorized: (message: string = Message.Error.Base.UNAUTHORIZED) =>
    createError(message, Http.Status.UNAUTHORIZED),
  forbidden: (message: string = Message.Error.Base.FORBIDDEN) =>
    createError(message, Http.Status.FORBIDDEN),
  notFound: (message: string = Message.Error.Base.NOT_FOUND) =>
    createError(message, Http.Status.NOT_FOUND),
  conflict: (message: string = Message.Error.Base.CONFLICT) =>
    createError(message, Http.Status.CONFLICT),
  internal: (message: string = Message.Error.Base.INTERNAL_SERVER_ERROR) =>
    createError(message, Http.Status.INTERNAL_SERVER_ERROR),
};
