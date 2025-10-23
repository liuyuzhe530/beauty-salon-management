import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
import productService from '../services/productService';

export class ProductController extends BaseCRUDController {
  constructor() {
    super(productService);
  }

  async getByCategory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const data = await productService.findByCategory(category);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch',
      });
    }
  }

  async search(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { name } = req.query;
      if (!name) {
        res.status(400).json({ success: false, message: 'Name parameter required' });
        return;
      }
      const data = await productService.searchByName(name as string);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to search',
      });
    }
  }

  async getStats(_req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const stats = await productService.getStats();
      res.json({ success: true, data: stats });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch stats',
      });
    }
  }
}

export default new ProductController();




