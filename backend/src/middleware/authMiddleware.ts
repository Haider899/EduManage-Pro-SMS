import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../utils/config';
import { AppError } from './errorMiddleware';
import { asyncHandler } from '../utils/asyncHandler';
import User, { IUser, UserRole } from '../models/User';
import { IS_MOCK_MODE } from '../index';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('You are not logged in! Please log in to get access.', 401);
  }

  // 2) Verification token
  const decoded = jwt.verify(token, config.jwtSecret) as { id: string };

  // 3) Check if user still exists
  let currentUser;
  if (IS_MOCK_MODE && decoded.id.startsWith('mock-id-')) {
    const username = decoded.id.replace('mock-id-', '');
    const mockData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/mockDB.json'), 'utf8'));
    currentUser = mockData.users.find((u: any) => u.username === username);
    if (currentUser) {
      currentUser._id = decoded.id;
    }
  } else {
    currentUser = await User.findById(decoded.id);
  }

  if (!currentUser) {
    throw new AppError('The user belonging to this token no longer exists.', 401);
  }

  // Grant access
  req.user = currentUser;
  next();
});

export const restrictTo = (...roles: UserRole[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }
    next();
  };
};
