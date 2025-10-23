import bcryptjs from 'bcryptjs';
import User from '../database/models/User';
import { generateToken } from '../config/jwt';
import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';

export class AuthService {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      // Check if user exists
      const existingUser = await User.findOne({
        where: { email: data.email },
      });

      if (existingUser) {
        return {
          success: false,
          message: 'Email already registered',
          code: 'EMAIL_EXISTS',
          timestamp: new Date().toISOString(),
        };
      }

      // Hash password
      const hashedPassword = await bcryptjs.hash(data.password, 10);

      // Create user
      const user = await User.create({
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || 'customer',
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'Registration successful',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed',
        code: 'REGISTRATION_ERROR',
        timestamp: new Date().toISOString(),
      };
    }
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      // Find user
      const user = await User.findOne({
        where: { username: data.username },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid username or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
        };
      }

      // Verify password
      const isPasswordValid = await bcryptjs.compare(data.password, user.password);

      if (!isPasswordValid) {
        return {
          success: false,
          message: 'Invalid username or password',
          code: 'INVALID_CREDENTIALS',
          timestamp: new Date().toISOString(),
        };
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      });

      return {
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
          },
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed',
        code: 'LOGIN_ERROR',
        timestamp: new Date().toISOString(),
      };
    }
  }
}

export default new AuthService();




