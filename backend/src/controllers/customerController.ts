import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
import customerService from '../services/customerService';

export class CustomerController extends BaseCRUDController {
  constructor() {
    super(customerService);
  }

  async getByPhone(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { phone } = req.params;
      const data = await customerService.findByPhone(phone);
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
      const stats = await customerService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch stats',
      });
    }
  }
}

export default new CustomerController();




