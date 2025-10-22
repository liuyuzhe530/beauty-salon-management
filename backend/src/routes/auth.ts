import express, { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';

const router: Router = express.Router();

/**
 * 公开路由（无需认证）
 */

// 用户注册
router.post('/register', authController.register.bind(authController));

// 用户登录
router.post('/login', authController.login.bind(authController));

// 验证Token
router.get('/verify', authController.verify.bind(authController));

// 登出
router.post('/logout', authController.logout.bind(authController));

/**
 * 受保护路由（需要认证）
 */

// 获取当前用户信息
router.get('/me', authMiddleware, authController.getCurrentUser.bind(authController));

// 修改密码
router.post('/change-password', authMiddleware, authController.changePassword.bind(authController));

export default router;

