import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseService } from '../services/baseService';

export abstract class BaseCRUDController {
  protected service: BaseService<any>;

  constructor(service: BaseService<any>) {
    this.service = service;
  }

  async getAll(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await this.service.findAll();
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch data',
      });
    }
  }

  async getById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }

      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch data',
      });
    }
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({ success: true, data });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to create',
      });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const [rows, data] = await this.service.update(id, req.body);

      if (rows === 0) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }

      res.json({ success: true, data: data[0] });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to update',
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rows = await this.service.delete(id);

      if (rows === 0) {
        res.status(404).json({ success: false, message: 'Not found' });
        return;
      }

      res.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to delete',
      });
    }
  }
}

export default BaseCRUDController;




