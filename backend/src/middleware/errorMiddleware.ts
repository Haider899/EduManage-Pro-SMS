import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.status = err.status || 500;

  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    err.message = `The ${field} '${value}' is already registered in the system. Please use a different ${field}.`;
    err.status = 400;
  }

  if (process.env.NODE_ENV === 'development') {
    res.status(err.status).json({
      success: false,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    // Production: Don't leak stack trace
    res.status(err.status).json({
      success: false,
      message: err.isOperational ? err.message : 'Something went wrong!',
    });
  }
};
