import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/error.utils';

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  const message = err.message || 'Something went wrong';

  if (err.code === '23505') { 
    res.status(409).json({
      error: 'A record with this information already exists'
    });
    return;
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: `Cannot ${req.method} ${req.path}`
  });
};