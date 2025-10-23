import { Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { AuthenticatedRequest, JWTPayload } from '../types/auth';

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'No token provided',
        code: 'NO_TOKEN',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const decoded = verifyToken(token) as JWTPayload;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
      timestamp: new Date().toISOString(),
    });
  }
};

export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        timestamp: new Date().toISOString(),
      });
      return;
    }
    next();
  };
};




