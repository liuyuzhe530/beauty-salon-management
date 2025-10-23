import { Response } from 'express';
import { AuthenticatedRequest, RegisterRequest, LoginRequest } from '../types/auth';
import authService from '../services/authService';

export class AuthController {
  async register(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await authService.register(req.body as RegisterRequest);
    res.status(result.success ? 201 : 400).json(result);
  }

  async login(req: AuthenticatedRequest, res: Response): Promise<void> {
    const result = await authService.login(req.body as LoginRequest);
    res.status(result.success ? 200 : 401).json(result);
  }

  async verify(req: AuthenticatedRequest, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        success: false,
        valid: false,
        message: 'No user authenticated',
      });
      return;
    }

    res.json({
      success: true,
      valid: true,
      user: req.user,
      message: 'Token is valid',
    });
  }
}

export default new AuthController();




