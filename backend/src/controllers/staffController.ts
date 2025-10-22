import { Request, Response } from 'express';
import { BaseCRUDController } from './baseCRUDController';
import StaffService from '../services/staffService';

export class StaffController extends BaseCRUDController<any> {
  private staffService: StaffService;

  constructor() {
    const service = new StaffService();
    super(service, 'name');
    this.staffService = service;
  }

  /**
   * 获取活跃美容师
   * GET /api/staff/active
   */
  async getActiveStaff(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.staffService.getActiveStaff();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取最高评分美容师
   * GET /api/staff/top-rated?limit=10
   */
  async getTopRatedStaff(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.staffService.getTopRatedStaff(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索美容师
   * GET /api/staff/search?keyword=xxx
   */
  async searchStaff(req: Request, res: Response): Promise<void> {
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

      const data = await this.staffService.searchStaff(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索美容师失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 更新美容师评分
   * PUT /api/staff/:id/rating
   */
  async updateRating(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (rating === undefined || rating < 0 || rating > 5) {
        res.status(400).json({
          success: false,
          message: '评分必须在0-5之间',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.staffService.updateRating(id, rating);

      res.status(200).json({
        success: true,
        message: '评分已更新',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新评分失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取美容师统计
   * GET /api/staff/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.staffService.getStatistics();

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
}

export default new StaffController();

import { BaseCRUDController } from './baseCRUDController';
import StaffService from '../services/staffService';

export class StaffController extends BaseCRUDController<any> {
  private staffService: StaffService;

  constructor() {
    const service = new StaffService();
    super(service, 'name');
    this.staffService = service;
  }

  /**
   * 获取活跃美容师
   * GET /api/staff/active
   */
  async getActiveStaff(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.staffService.getActiveStaff();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取最高评分美容师
   * GET /api/staff/top-rated?limit=10
   */
  async getTopRatedStaff(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.staffService.getTopRatedStaff(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索美容师
   * GET /api/staff/search?keyword=xxx
   */
  async searchStaff(req: Request, res: Response): Promise<void> {
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

      const data = await this.staffService.searchStaff(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索美容师失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 更新美容师评分
   * PUT /api/staff/:id/rating
   */
  async updateRating(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (rating === undefined || rating < 0 || rating > 5) {
        res.status(400).json({
          success: false,
          message: '评分必须在0-5之间',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.staffService.updateRating(id, rating);

      res.status(200).json({
        success: true,
        message: '评分已更新',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新评分失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取美容师统计
   * GET /api/staff/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.staffService.getStatistics();

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
}

export default new StaffController();

import { BaseCRUDController } from './baseCRUDController';
import StaffService from '../services/staffService';

export class StaffController extends BaseCRUDController<any> {
  private staffService: StaffService;

  constructor() {
    const service = new StaffService();
    super(service, 'name');
    this.staffService = service;
  }

  /**
   * 获取活跃美容师
   * GET /api/staff/active
   */
  async getActiveStaff(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.staffService.getActiveStaff();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取活跃美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取最高评分美容师
   * GET /api/staff/top-rated?limit=10
   */
  async getTopRatedStaff(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const data = await this.staffService.getTopRatedStaff(limit);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 搜索美容师
   * GET /api/staff/search?keyword=xxx
   */
  async searchStaff(req: Request, res: Response): Promise<void> {
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

      const data = await this.staffService.searchStaff(keyword as string);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '搜索美容师失败',
        code: 'SEARCH_ERROR'
      });
    }
  }

  /**
   * 更新美容师评分
   * PUT /api/staff/:id/rating
   */
  async updateRating(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (rating === undefined || rating < 0 || rating > 5) {
        res.status(400).json({
          success: false,
          message: '评分必须在0-5之间',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const data = await this.staffService.updateRating(id, rating);

      res.status(200).json({
        success: true,
        message: '评分已更新',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '更新评分失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取美容师统计
   * GET /api/staff/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.staffService.getStatistics();

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
}

export default new StaffController();







