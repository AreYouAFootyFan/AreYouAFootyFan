export interface AppError extends Error {
    status?: number;
    code?: string;
}
  
export function createError(message: string, status: number = 500): AppError {
    const error: AppError = new Error(message);
    error.status = status;
    return error;
}   

export const ErrorUtils = {
    badRequest: (message: string = 'Bad request') => createError(message, 400),
    unauthorized: (message: string = 'Unauthorized') => createError(message, 401),
    forbidden: (message: string = 'Forbidden') => createError(message, 403),
    notFound: (message: string = 'Not found') => createError(message, 404),
    conflict: (message: string = 'Conflict') => createError(message, 409),
    internal: (message: string = 'Internal server error') => createError(message, 500)
};