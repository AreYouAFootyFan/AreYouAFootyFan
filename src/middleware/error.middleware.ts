import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils';

export const errorHandler = (
  error: AppError,
  request: Request,
  response: Response,
  next: NextFunction
): void => {
  if (response.headersSent) {
    return next(error);
  }

  const status = error.status || 500;
  const message = error.message || 'Something went wrong';

  if (error.code === '23505') { 
    response.status(409).json({
      error: 'A record with this information already exists'
    });
    return;
  }

  response.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

export const notFoundHandler = (request: Request, response: Response): void => {
  response.status(404).json({
    error: `Cannot ${request.method} ${request.path}`
  });
};