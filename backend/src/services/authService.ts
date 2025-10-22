import User from '../database/models/User';
import { generateToken, verifyToken, JWTPayload } from '../config/jwt';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    // 检查密码是否匹配
    if (data.password !== data.confirmPassword) {
      throw {
        status: 400,
        message: '密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw {
        status: 409,
        message: '用户名已存在',
        code: 'USERNAME_EXISTS'
      };
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw {
        status: 409,
        message: '邮箱已注册',
        code: 'EMAIL_EXISTS'
      };
    }

    // 创建新用户
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'customer',
      isActive: true
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 用户登录
   */
  async login(data: LoginRequest) {
    // 查找用户
    const user = await User.findOne({
      where: { username: data.username }
    });

    if (!user) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      throw {
        status: 403,
        message: '账户已禁用',
        code: 'ACCOUNT_DISABLED'
      };
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 更新最后登录时间
    await user.update({
      lastLogin: new Date()
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 验证Token
   */
  async verifyToken(token: string) {
    const decoded = verifyToken(token);

    if (!decoded) {
      throw {
        status: 401,
        message: '令牌无效或已过期',
        code: 'INVALID_TOKEN'
      };
    }

    // 查找用户确认仍然存在
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw {
        status: 401,
        message: '用户不存在或已被禁用',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      throw {
        status: 400,
        message: '新密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    // 验证旧密码
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '原密码错误',
        code: 'INVALID_PASSWORD'
      };
    }

    // 更新密码
    await user.update({
      password: newPassword
    });

    return {
      success: true,
      message: '密码修改成功'
    };
  }
}

export const authService = new AuthService();

import { generateToken, verifyToken, JWTPayload } from '../config/jwt';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    // 检查密码是否匹配
    if (data.password !== data.confirmPassword) {
      throw {
        status: 400,
        message: '密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw {
        status: 409,
        message: '用户名已存在',
        code: 'USERNAME_EXISTS'
      };
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw {
        status: 409,
        message: '邮箱已注册',
        code: 'EMAIL_EXISTS'
      };
    }

    // 创建新用户
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'customer',
      isActive: true
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 用户登录
   */
  async login(data: LoginRequest) {
    // 查找用户
    const user = await User.findOne({
      where: { username: data.username }
    });

    if (!user) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      throw {
        status: 403,
        message: '账户已禁用',
        code: 'ACCOUNT_DISABLED'
      };
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 更新最后登录时间
    await user.update({
      lastLogin: new Date()
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 验证Token
   */
  async verifyToken(token: string) {
    const decoded = verifyToken(token);

    if (!decoded) {
      throw {
        status: 401,
        message: '令牌无效或已过期',
        code: 'INVALID_TOKEN'
      };
    }

    // 查找用户确认仍然存在
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw {
        status: 401,
        message: '用户不存在或已被禁用',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      throw {
        status: 400,
        message: '新密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    // 验证旧密码
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '原密码错误',
        code: 'INVALID_PASSWORD'
      };
    }

    // 更新密码
    await user.update({
      password: newPassword
    });

    return {
      success: true,
      message: '密码修改成功'
    };
  }
}

export const authService = new AuthService();

import { generateToken, verifyToken, JWTPayload } from '../config/jwt';
import { RegisterRequest, LoginRequest } from '../types/auth';

export class AuthService {
  /**
   * 用户注册
   */
  async register(data: RegisterRequest) {
    // 检查密码是否匹配
    if (data.password !== data.confirmPassword) {
      throw {
        status: 400,
        message: '密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    // 检查用户名是否已存在
    const existingUsername = await User.findOne({
      where: { username: data.username }
    });

    if (existingUsername) {
      throw {
        status: 409,
        message: '用户名已存在',
        code: 'USERNAME_EXISTS'
      };
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findOne({
      where: { email: data.email }
    });

    if (existingEmail) {
      throw {
        status: 409,
        message: '邮箱已注册',
        code: 'EMAIL_EXISTS'
      };
    }

    // 创建新用户
    const user = await User.create({
      username: data.username,
      email: data.email,
      password: data.password,
      role: data.role || 'customer',
      isActive: true
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 用户登录
   */
  async login(data: LoginRequest) {
    // 查找用户
    const user = await User.findOne({
      where: { username: data.username }
    });

    if (!user) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 检查用户是否被禁用
    if (!user.isActive) {
      throw {
        status: 403,
        message: '账户已禁用',
        code: 'ACCOUNT_DISABLED'
      };
    }

    // 验证密码
    const isPasswordValid = await user.comparePassword(data.password);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '用户名或密码错误',
        code: 'INVALID_CREDENTIALS'
      };
    }

    // 更新最后登录时间
    await user.update({
      lastLogin: new Date()
    });

    // 生成Token
    const token = generateToken({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }
    };
  }

  /**
   * 验证Token
   */
  async verifyToken(token: string) {
    const decoded = verifyToken(token);

    if (!decoded) {
      throw {
        status: 401,
        message: '令牌无效或已过期',
        code: 'INVALID_TOKEN'
      };
    }

    // 查找用户确认仍然存在
    const user = await User.findByPk(decoded.id);

    if (!user || !user.isActive) {
      throw {
        status: 401,
        message: '用户不存在或已被禁用',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      valid: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(userId: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    };
  }

  /**
   * 修改密码
   */
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ) {
    if (newPassword !== confirmPassword) {
      throw {
        status: 400,
        message: '新密码不匹配',
        code: 'PASSWORD_MISMATCH'
      };
    }

    const user = await User.findByPk(userId);

    if (!user) {
      throw {
        status: 404,
        message: '用户不存在',
        code: 'USER_NOT_FOUND'
      };
    }

    // 验证旧密码
    const isPasswordValid = await user.comparePassword(oldPassword);

    if (!isPasswordValid) {
      throw {
        status: 401,
        message: '原密码错误',
        code: 'INVALID_PASSWORD'
      };
    }

    // 更新密码
    await user.update({
      password: newPassword
    });

    return {
      success: true,
      message: '密码修改成功'
    };
  }
}

export const authService = new AuthService();







