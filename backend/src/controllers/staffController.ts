import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
import staffService from '../services/staffService';

export class StaffController extends BaseCRUDController {
  constructor() {
    super(staffService);
  }

  async getAvailable(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await staffService.findAvailable();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch',
      });
    }
  }

  async getStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await staffService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch stats',
      });
    }
  }
}

export default new StaffController();




