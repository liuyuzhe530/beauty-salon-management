import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: process.env.JWT_EXPIRE || '7d'
};

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}

/**
 * 生成JWT Token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn
  });
};

/**
 * 验证JWT Token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 解析Token（不验证过期时间）
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: process.env.JWT_EXPIRE || '7d'
};

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}

/**
 * 生成JWT Token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn
  });
};

/**
 * 验证JWT Token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 解析Token（不验证过期时间）
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
  expiresIn: process.env.JWT_EXPIRE || '7d'
};

export interface JWTPayload {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
}

/**
 * 生成JWT Token
 */
export const generateToken = (payload: JWTPayload): string => {
  return jwt.sign(payload, JWT_CONFIG.secret, {
    expiresIn: JWT_CONFIG.expiresIn
  });
};

/**
 * 验证JWT Token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * 解析Token（不验证过期时间）
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};







