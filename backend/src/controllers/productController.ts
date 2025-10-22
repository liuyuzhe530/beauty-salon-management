import { Request, Response } from 'express';
import { BaseCRUDController } from './baseCRUDController';
import ProductService from '../services/productService';

export class ProductController extends BaseCRUDController<any> {
  private productService: ProductService;

  constructor() {
    const service = new ProductService();
    super(service, 'name');
    this.productService = service;
  }

  /**
   * 按分类获取产品
   * GET /api/products/category/:category
   */
  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const data = await this.productService.getByCategory(category);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索产品
   * GET /api/products/search?keyword=xxx
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        res.status(400).json({
          success: false,
          message: '搜索关键词不能为空',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.searchProducts(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索产品失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取库存不足的产品
   * GET /api/products/low-stock?threshold=10
   */
  async getLowStockProducts(req: Request, res: Response): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const data = await this.productService.getLowStockProducts(threshold);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取库存不足产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 减少库存
   * PUT /api/products/:id/decrease-stock
   */
  async decreaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.decreaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已减少',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '减少库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 增加库存
   * PUT /api/products/:id/increase-stock
   */
  async increaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.increaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已增加',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '增加库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取最畅销产品
   * GET /api/products/top-selling?limit=10
   */
  async getTopSellingProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.productService.getTopSellingProducts(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取产品统计
   * GET /api/products/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.productService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取统计失败',
        code: 'STATS_ERROR'
      });
    }
  }

  /**
   * 获取所有分类
   * GET /api/products/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.productService.getCategories();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取分类失败',
        code: 'GET_ERROR'
      });
    }
  }
}

export default new ProductController();

import { BaseCRUDController } from './baseCRUDController';
import ProductService from '../services/productService';

export class ProductController extends BaseCRUDController<any> {
  private productService: ProductService;

  constructor() {
    const service = new ProductService();
    super(service, 'name');
    this.productService = service;
  }

  /**
   * 按分类获取产品
   * GET /api/products/category/:category
   */
  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const data = await this.productService.getByCategory(category);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索产品
   * GET /api/products/search?keyword=xxx
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        res.status(400).json({
          success: false,
          message: '搜索关键词不能为空',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.searchProducts(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索产品失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取库存不足的产品
   * GET /api/products/low-stock?threshold=10
   */
  async getLowStockProducts(req: Request, res: Response): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const data = await this.productService.getLowStockProducts(threshold);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取库存不足产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 减少库存
   * PUT /api/products/:id/decrease-stock
   */
  async decreaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.decreaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已减少',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '减少库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 增加库存
   * PUT /api/products/:id/increase-stock
   */
  async increaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.increaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已增加',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '增加库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取最畅销产品
   * GET /api/products/top-selling?limit=10
   */
  async getTopSellingProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.productService.getTopSellingProducts(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取产品统计
   * GET /api/products/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.productService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取统计失败',
        code: 'STATS_ERROR'
      });
    }
  }

  /**
   * 获取所有分类
   * GET /api/products/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.productService.getCategories();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取分类失败',
        code: 'GET_ERROR'
      });
    }
  }
}

export default new ProductController();

import { BaseCRUDController } from './baseCRUDController';
import ProductService from '../services/productService';

export class ProductController extends BaseCRUDController<any> {
  private productService: ProductService;

  constructor() {
    const service = new ProductService();
    super(service, 'name');
    this.productService = service;
  }

  /**
   * 按分类获取产品
   * GET /api/products/category/:category
   */
  async getByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const data = await this.productService.getByCategory(category);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索产品
   * GET /api/products/search?keyword=xxx
   */
  async searchProducts(req: Request, res: Response): Promise<void> {
    try {
      const { keyword } = req.query;

      if (!keyword) {
        res.status(400).json({
          success: false,
          message: '搜索关键词不能为空',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.searchProducts(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索产品失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取库存不足的产品
   * GET /api/products/low-stock?threshold=10
   */
  async getLowStockProducts(req: Request, res: Response): Promise<void> {
    try {
      const threshold = parseInt(req.query.threshold as string) || 10;
      const data = await this.productService.getLowStockProducts(threshold);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取库存不足产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 减少库存
   * PUT /api/products/:id/decrease-stock
   */
  async decreaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.decreaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已减少',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '减少库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 增加库存
   * PUT /api/products/:id/increase-stock
   */
  async increaseStock(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (!quantity || quantity <= 0) {
        res.status(400).json({
          success: false,
          message: '数量必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.productService.increaseStock(id, quantity);

      res.status(200).json({
        success: true,
        message: '库存已增加',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '增加库存失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取最畅销产品
   * GET /api/products/top-selling?limit=10
   */
  async getTopSellingProducts(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.productService.getTopSellingProducts(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取产品失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取产品统计
   * GET /api/products/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.productService.getStatistics();

      res.status(200).json({
        success: true,
        data: stats,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取统计失败',
        code: 'STATS_ERROR'
      });
    }
  }

  /**
   * 获取所有分类
   * GET /api/products/categories
   */
  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.productService.getCategories();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取分类失败',
        code: 'GET_ERROR'
      });
    }
  }
}

export default new ProductController();







