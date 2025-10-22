import { Request, Response } from 'express';
import { BaseService } from '../services/baseService';

/**
 * 基础CRUD控制器类
 * 提供通用的HTTP处理方法
 */
export abstract class BaseCRUDController<T> {
  protected service: BaseService<any>;
  protected resourceName: string;

  constructor(service: BaseService<any>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  /**
   * 获取全部数据
   * GET /api/{resource}
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      // 构建查询选项
      const where: any = {};
      if (search) {
        where[this.resourceName] = {
          [Symbol.for('op')]: 'like',
          [Symbol.for('val')]: `%${search}%`
        };
      }

      const result = await this.service.paginate(page, limit, { where });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取单条数据
   * GET /api/{resource}/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        res.status(404).json({
          success: false,
          message: '数据不存在',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 创建数据
   * POST /api/{resource}
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: '创建成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '创建失败',
        code: error.code || 'CREATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 更新数据
   * PUT /api/{resource}/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);

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
        code: error.code || 'UPDATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 删除数据
   * DELETE /api/{resource}/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.status(200).json({
        success: true,
        message: '删除成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '删除失败',
        code: error.code || 'DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 批量删除
   * POST /api/{resource}/batch/delete
   */
  async bulkDelete(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'IDs必须是非空数组',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const count = await this.service.bulkDelete(ids);

      res.status(200).json({
        success: true,
        message: `删除 ${count} 条记录`,
        data: { deletedCount: count },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '批量删除失败',
        code: error.code || 'BULK_DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default BaseCRUDController;

import { BaseService } from '../services/baseService';

/**
 * 基础CRUD控制器类
 * 提供通用的HTTP处理方法
 */
export abstract class BaseCRUDController<T> {
  protected service: BaseService<any>;
  protected resourceName: string;

  constructor(service: BaseService<any>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  /**
   * 获取全部数据
   * GET /api/{resource}
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      // 构建查询选项
      const where: any = {};
      if (search) {
        where[this.resourceName] = {
          [Symbol.for('op')]: 'like',
          [Symbol.for('val')]: `%${search}%`
        };
      }

      const result = await this.service.paginate(page, limit, { where });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取单条数据
   * GET /api/{resource}/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        res.status(404).json({
          success: false,
          message: '数据不存在',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 创建数据
   * POST /api/{resource}
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: '创建成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '创建失败',
        code: error.code || 'CREATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 更新数据
   * PUT /api/{resource}/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);

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
        code: error.code || 'UPDATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 删除数据
   * DELETE /api/{resource}/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.status(200).json({
        success: true,
        message: '删除成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '删除失败',
        code: error.code || 'DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 批量删除
   * POST /api/{resource}/batch/delete
   */
  async bulkDelete(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'IDs必须是非空数组',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const count = await this.service.bulkDelete(ids);

      res.status(200).json({
        success: true,
        message: `删除 ${count} 条记录`,
        data: { deletedCount: count },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '批量删除失败',
        code: error.code || 'BULK_DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default BaseCRUDController;

import { BaseService } from '../services/baseService';

/**
 * 基础CRUD控制器类
 * 提供通用的HTTP处理方法
 */
export abstract class BaseCRUDController<T> {
  protected service: BaseService<any>;
  protected resourceName: string;

  constructor(service: BaseService<any>, resourceName: string) {
    this.service = service;
    this.resourceName = resourceName;
  }

  /**
   * 获取全部数据
   * GET /api/{resource}
   */
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      // 构建查询选项
      const where: any = {};
      if (search) {
        where[this.resourceName] = {
          [Symbol.for('op')]: 'like',
          [Symbol.for('val')]: `%${search}%`
        };
      }

      const result = await this.service.paginate(page, limit, { where });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 获取单条数据
   * GET /api/{resource}/:id
   */
  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.findById(id);

      if (!data) {
        res.status(404).json({
          success: false,
          message: '数据不存在',
          code: 'NOT_FOUND'
        });
        return;
      }

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取数据失败',
        code: error.code || 'GET_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 创建数据
   * POST /api/{resource}
   */
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.service.create(req.body);

      res.status(201).json({
        success: true,
        message: '创建成功',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '创建失败',
        code: error.code || 'CREATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 更新数据
   * PUT /api/{resource}/:id
   */
  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.update(id, req.body);

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
        code: error.code || 'UPDATE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 删除数据
   * DELETE /api/{resource}/:id
   */
  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.service.delete(id);

      res.status(200).json({
        success: true,
        message: '删除成功',
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '删除失败',
        code: error.code || 'DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * 批量删除
   * POST /api/{resource}/batch/delete
   */
  async bulkDelete(req: Request, res: Response): Promise<void> {
    try {
      const { ids } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          message: 'IDs必须是非空数组',
          code: 'INVALID_INPUT'
        });
        return;
      }

      const count = await this.service.bulkDelete(ids);

      res.status(200).json({
        success: true,
        message: `删除 ${count} 条记录`,
        data: { deletedCount: count },
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '批量删除失败',
        code: error.code || 'BULK_DELETE_ERROR',
        timestamp: new Date().toISOString()
      });
    }
  }
}

export default BaseCRUDController;







