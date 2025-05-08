import { HttpStatus, ErrorMessage } from './enums';

export interface AppError extends Error {
    status?: number;
    code?: string;
}
  
export function createError(message: string, status: number = HttpStatus.INTERNAL_SERVER_ERROR): AppError {
    const error: AppError = new Error(message);
    error.status = status;
    return error;
}   

export const ErrorUtils = {
    badRequest: (message: string = ErrorMessage.BAD_REQUEST) => createError(message, HttpStatus.BAD_REQUEST),
    unauthorized: (message: string = ErrorMessage.UNAUTHORIZED) => createError(message, HttpStatus.UNAUTHORIZED),
    forbidden: (message: string = ErrorMessage.FORBIDDEN) => createError(message, HttpStatus.FORBIDDEN),
    notFound: (message: string = ErrorMessage.NOT_FOUND) => createError(message, HttpStatus.NOT_FOUND),
    conflict: (message: string = ErrorMessage.CONFLICT) => createError(message, HttpStatus.CONFLICT),
    internal: (message: string = ErrorMessage.INTERNAL_SERVER_ERROR) => createError(message, HttpStatus.INTERNAL_SERVER_ERROR)
};