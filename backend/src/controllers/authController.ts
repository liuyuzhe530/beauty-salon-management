import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, confirmPassword, role } = req.body;

      // 基础验证
      if (!username || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const data: RegisterRequest = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role: role || 'customer'
      };

      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '注册失败',
        code: error.code || 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // 基础验证
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
          code: 'MISSING_CREDENTIALS'
        });
        return;
      }

      const data: LoginRequest = {
        username: username.trim(),
        password
      };

      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        message: '登录成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '登录失败',
        code: error.code || 'LOGIN_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 验证Token
   * GET /api/auth/verify
   */
  async verify(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          valid: false,
          message: '缺少认证令牌',
          code: 'NO_TOKEN'
        });
        return;
      }

      const token = authHeader.substring(7);
      const result = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        valid: result.valid,
        user: result.user,
        message: '令牌有效',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 401).json({
        success: false,
        valid: false,
        message: error.message || '令牌验证失败',
        code: error.code || 'TOKEN_VERIFICATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取用户信息失败',
        code: error.code || 'GET_USER_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 修改密码
   * POST /api/auth/change-password
   */
  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const result = await authService.changePassword(
        req.user.id,
        oldPassword,
        newPassword,
        confirmPassword
      );

      res.status(200).json({
        success: true,
        message: '密码修改成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '密码修改失败',
        code: error.code || 'CHANGE_PASSWORD_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 登出
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 前端应该删除本地存储的Token
      res.status(200).json({
        success: true,
        message: '登出成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '登出失败',
        code: 'LOGOUT_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const authController = new AuthController();

import { AuthenticatedRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, confirmPassword, role } = req.body;

      // 基础验证
      if (!username || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const data: RegisterRequest = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role: role || 'customer'
      };

      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '注册失败',
        code: error.code || 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // 基础验证
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
          code: 'MISSING_CREDENTIALS'
        });
        return;
      }

      const data: LoginRequest = {
        username: username.trim(),
        password
      };

      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        message: '登录成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '登录失败',
        code: error.code || 'LOGIN_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 验证Token
   * GET /api/auth/verify
   */
  async verify(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          valid: false,
          message: '缺少认证令牌',
          code: 'NO_TOKEN'
        });
        return;
      }

      const token = authHeader.substring(7);
      const result = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        valid: result.valid,
        user: result.user,
        message: '令牌有效',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 401).json({
        success: false,
        valid: false,
        message: error.message || '令牌验证失败',
        code: error.code || 'TOKEN_VERIFICATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取用户信息失败',
        code: error.code || 'GET_USER_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 修改密码
   * POST /api/auth/change-password
   */
  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const result = await authService.changePassword(
        req.user.id,
        oldPassword,
        newPassword,
        confirmPassword
      );

      res.status(200).json({
        success: true,
        message: '密码修改成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '密码修改失败',
        code: error.code || 'CHANGE_PASSWORD_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 登出
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 前端应该删除本地存储的Token
      res.status(200).json({
        success: true,
        message: '登出成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '登出失败',
        code: 'LOGOUT_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const authController = new AuthController();

import { AuthenticatedRequest } from '../middleware/auth';
import { authService } from '../services/authService';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthController {
  /**
   * 用户注册
   * POST /api/auth/register
   */
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, email, password, confirmPassword, role } = req.body;

      // 基础验证
      if (!username || !email || !password || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const data: RegisterRequest = {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password,
        confirmPassword,
        role: role || 'customer'
      };

      const result = await authService.register(data);

      res.status(201).json({
        success: true,
        message: '注册成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '注册失败',
        code: error.code || 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 用户登录
   * POST /api/auth/login
   */
  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;

      // 基础验证
      if (!username || !password) {
        res.status(400).json({
          success: false,
          message: '用户名和密码不能为空',
          code: 'MISSING_CREDENTIALS'
        });
        return;
      }

      const data: LoginRequest = {
        username: username.trim(),
        password
      };

      const result = await authService.login(data);

      res.status(200).json({
        success: true,
        message: '登录成功',
        data: result,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '登录失败',
        code: error.code || 'LOGIN_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 验证Token
   * GET /api/auth/verify
   */
  async verify(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          success: false,
          valid: false,
          message: '缺少认证令牌',
          code: 'NO_TOKEN'
        });
        return;
      }

      const token = authHeader.substring(7);
      const result = await authService.verifyToken(token);

      res.status(200).json({
        success: true,
        valid: result.valid,
        user: result.user,
        message: '令牌有效',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 401).json({
        success: false,
        valid: false,
        message: error.message || '令牌验证失败',
        code: error.code || 'TOKEN_VERIFICATION_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取当前用户信息
   * GET /api/auth/me
   */
  async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const user = await authService.getCurrentUser(req.user.id);

      res.status(200).json({
        success: true,
        data: user,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取用户信息失败',
        code: error.code || 'GET_USER_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 修改密码
   * POST /api/auth/change-password
   */
  async changePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: '需要认证',
          code: 'UNAUTHORIZED'
        });
        return;
      }

      const { oldPassword, newPassword, confirmPassword } = req.body;

      if (!oldPassword || !newPassword || !confirmPassword) {
        res.status(400).json({
          success: false,
          message: '缺少必填字段',
          code: 'MISSING_FIELDS'
        });
        return;
      }

      const result = await authService.changePassword(
        req.user.id,
        oldPassword,
        newPassword,
        confirmPassword
      );

      res.status(200).json({
        success: true,
        message: '密码修改成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '密码修改失败',
        code: error.code || 'CHANGE_PASSWORD_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 登出
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      // 前端应该删除本地存储的Token
      res.status(200).json({
        success: true,
        message: '登出成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || '登出失败',
        code: 'LOGOUT_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const authController = new AuthController();







