import { Request, Response } from 'express';
import { BaseCRUDController } from './baseCRUDController';
import CustomerService from '../services/customerService';

export class CustomerController extends BaseCRUDController<any> {
  private customerService: CustomerService;

  constructor() {
    const service = new CustomerService();
    super(service, 'name');
    this.customerService = service;
  }

  /**
   * 获取活跃客户
   * GET /api/customers/status/active
   */
  async getActiveCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'active' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃客户失败',
        code: 'GET_ACTIVE_ERROR'
      });
    }
  }

  /**
   * 获取风险客户
   * GET /api/customers/status/atrisk
   */
  async getRiskCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'atrisk' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取风险客户失败',
        code: 'GET_RISK_ERROR'
      });
    }
  }

  /**
   * 搜索客户
   * GET /api/customers/search?keyword=xxx
   */
  async searchCustomers(req: Request, res: Response): Promise<void> {
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

      const data = await this.customerService.searchCustomers(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索客户失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取客户统计
   * GET /api/customers/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.customerService.getStatistics();

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
   * 更新客户消费
   * PUT /api/customers/:id/spending
   */
  async updateSpending(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: '消费金额必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.customerService.updateTotalSpending(id, amount);

      res.status(200).json({
        success: true,
        message: '更新成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新失败',
        code: 'UPDATE_ERROR'
      });
    }
  }
}

export default new CustomerController();

import { BaseCRUDController } from './baseCRUDController';
import CustomerService from '../services/customerService';

export class CustomerController extends BaseCRUDController<any> {
  private customerService: CustomerService;

  constructor() {
    const service = new CustomerService();
    super(service, 'name');
    this.customerService = service;
  }

  /**
   * 获取活跃客户
   * GET /api/customers/status/active
   */
  async getActiveCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'active' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃客户失败',
        code: 'GET_ACTIVE_ERROR'
      });
    }
  }

  /**
   * 获取风险客户
   * GET /api/customers/status/atrisk
   */
  async getRiskCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'atrisk' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取风险客户失败',
        code: 'GET_RISK_ERROR'
      });
    }
  }

  /**
   * 搜索客户
   * GET /api/customers/search?keyword=xxx
   */
  async searchCustomers(req: Request, res: Response): Promise<void> {
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

      const data = await this.customerService.searchCustomers(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索客户失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取客户统计
   * GET /api/customers/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.customerService.getStatistics();

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
   * 更新客户消费
   * PUT /api/customers/:id/spending
   */
  async updateSpending(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: '消费金额必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.customerService.updateTotalSpending(id, amount);

      res.status(200).json({
        success: true,
        message: '更新成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新失败',
        code: 'UPDATE_ERROR'
      });
    }
  }
}

export default new CustomerController();

import { BaseCRUDController } from './baseCRUDController';
import CustomerService from '../services/customerService';

export class CustomerController extends BaseCRUDController<any> {
  private customerService: CustomerService;

  constructor() {
    const service = new CustomerService();
    super(service, 'name');
    this.customerService = service;
  }

  /**
   * 获取活跃客户
   * GET /api/customers/status/active
   */
  async getActiveCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'active' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃客户失败',
        code: 'GET_ACTIVE_ERROR'
      });
    }
  }

  /**
   * 获取风险客户
   * GET /api/customers/status/atrisk
   */
  async getRiskCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.customerService.paginate(page, limit, {
        where: { status: 'atrisk' },
        order: [['lastVisit', 'DESC']]
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取风险客户失败',
        code: 'GET_RISK_ERROR'
      });
    }
  }

  /**
   * 搜索客户
   * GET /api/customers/search?keyword=xxx
   */
  async searchCustomers(req: Request, res: Response): Promise<void> {
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

      const data = await this.customerService.searchCustomers(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索客户失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 获取客户统计
   * GET /api/customers/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.customerService.getStatistics();

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
   * 更新客户消费
   * PUT /api/customers/:id/spending
   */
  async updateSpending(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { amount } = req.body;

      if (!amount || amount <= 0) {
        res.status(400).json({
          success: false,
          message: '消费金额必须大于0',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.customerService.updateTotalSpending(id, amount);

      res.status(200).json({
        success: true,
        message: '更新成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新失败',
        code: 'UPDATE_ERROR'
      });
    }
  }
}

export default new CustomerController();







