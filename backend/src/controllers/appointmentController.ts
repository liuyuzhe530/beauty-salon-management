import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
import appointmentService from '../services/appointmentService';

export class AppointmentController extends BaseCRUDController {
  constructor() {
    super(appointmentService);
  }

  async getByCustomer(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const data = await appointmentService.findByCustomer(customerId);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch',
      });
    }
  }

  async getUpcoming(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const days = _req.query.days ? parseInt(_req.query.days as string) : 7;
      const data = await appointmentService.findUpcoming(days);
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
      const stats = await appointmentService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch stats',
      });
    }
  }
}

export default new AppointmentController();




