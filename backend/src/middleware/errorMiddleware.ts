import { ErrorRequestHandler } from 'express';

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

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  void next;
  err.status = err.status || 500;

  // Handle Prisma unique constraint error
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(', ') : err.meta.target) : 'field';
    err.message = `The database unique constraint failed on the fields: (${fields}). This record already exists.`;
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
