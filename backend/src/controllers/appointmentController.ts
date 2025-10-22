import { Request, Response } from 'express';
import { BaseCRUDController } from './baseCRUDController';
import AppointmentService from '../services/appointmentService';

export class AppointmentController extends BaseCRUDController<any> {
  private appointmentService: AppointmentService;

  constructor() {
    const service = new AppointmentService();
    super(service, 'service');
    this.appointmentService = service;
  }

  /**
   * 获取客户的预约
   * GET /api/appointments/customer/:customerId
   */
  async getCustomerAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const data = await this.appointmentService.getCustomerAppointments(customerId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取客户预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取美容师的预约
   * GET /api/appointments/staff/:staffId
   */
  async getStaffAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { staffId } = req.params;
      const data = await this.appointmentService.getStaffAppointments(staffId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取今天的预约
   * GET /api/appointments/today
   */
  async getTodayAppointments(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.appointmentService.getTodayAppointments();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取今天预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取待确认预约
   * GET /api/appointments/pending
   */
  async getPendingAppointments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.appointmentService.paginate(page, limit, {
        where: { status: 'pending' },
        order: [['date', 'ASC']]
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
        message: error.message || '获取待确认预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 确认预约
   * PUT /api/appointments/:id/confirm
   */
  async confirmAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.confirmAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已确认',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '确认预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 完成预约
   * PUT /api/appointments/:id/complete
   */
  async completeAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.completeAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已完成',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '完成预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 取消预约
   * PUT /api/appointments/:id/cancel
   */
  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.cancelAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已取消',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '取消预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取预约统计
   * GET /api/appointments/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.appointmentService.getStatistics();

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

export default new AppointmentController();

import { BaseCRUDController } from './baseCRUDController';
import AppointmentService from '../services/appointmentService';

export class AppointmentController extends BaseCRUDController<any> {
  private appointmentService: AppointmentService;

  constructor() {
    const service = new AppointmentService();
    super(service, 'service');
    this.appointmentService = service;
  }

  /**
   * 获取客户的预约
   * GET /api/appointments/customer/:customerId
   */
  async getCustomerAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const data = await this.appointmentService.getCustomerAppointments(customerId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取客户预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取美容师的预约
   * GET /api/appointments/staff/:staffId
   */
  async getStaffAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { staffId } = req.params;
      const data = await this.appointmentService.getStaffAppointments(staffId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取今天的预约
   * GET /api/appointments/today
   */
  async getTodayAppointments(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.appointmentService.getTodayAppointments();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取今天预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取待确认预约
   * GET /api/appointments/pending
   */
  async getPendingAppointments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.appointmentService.paginate(page, limit, {
        where: { status: 'pending' },
        order: [['date', 'ASC']]
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
        message: error.message || '获取待确认预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 确认预约
   * PUT /api/appointments/:id/confirm
   */
  async confirmAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.confirmAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已确认',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '确认预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 完成预约
   * PUT /api/appointments/:id/complete
   */
  async completeAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.completeAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已完成',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '完成预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 取消预约
   * PUT /api/appointments/:id/cancel
   */
  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.cancelAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已取消',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '取消预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取预约统计
   * GET /api/appointments/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.appointmentService.getStatistics();

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

export default new AppointmentController();

import { BaseCRUDController } from './baseCRUDController';
import AppointmentService from '../services/appointmentService';

export class AppointmentController extends BaseCRUDController<any> {
  private appointmentService: AppointmentService;

  constructor() {
    const service = new AppointmentService();
    super(service, 'service');
    this.appointmentService = service;
  }

  /**
   * 获取客户的预约
   * GET /api/appointments/customer/:customerId
   */
  async getCustomerAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { customerId } = req.params;
      const data = await this.appointmentService.getCustomerAppointments(customerId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取客户预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取美容师的预约
   * GET /api/appointments/staff/:staffId
   */
  async getStaffAppointments(req: Request, res: Response): Promise<void> {
    try {
      const { staffId } = req.params;
      const data = await this.appointmentService.getStaffAppointments(staffId);

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取美容师预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取今天的预约
   * GET /api/appointments/today
   */
  async getTodayAppointments(req: Request, res: Response): Promise<void> {
    try {
      const data = await this.appointmentService.getTodayAppointments();

      res.status(200).json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '获取今天预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 获取待确认预约
   * GET /api/appointments/pending
   */
  async getPendingAppointments(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await this.appointmentService.paginate(page, limit, {
        where: { status: 'pending' },
        order: [['date', 'ASC']]
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
        message: error.message || '获取待确认预约失败',
        code: 'GET_ERROR'
      });
    }
  }

  /**
   * 确认预约
   * PUT /api/appointments/:id/confirm
   */
  async confirmAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.confirmAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已确认',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '确认预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 完成预约
   * PUT /api/appointments/:id/complete
   */
  async completeAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.completeAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已完成',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '完成预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 取消预约
   * PUT /api/appointments/:id/cancel
   */
  async cancelAppointment(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.appointmentService.cancelAppointment(id);

      res.status(200).json({
        success: true,
        message: '预约已取消',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      res.status(error.status || 500).json({
        success: false,
        message: error.message || '取消预约失败',
        code: 'UPDATE_ERROR'
      });
    }
  }

  /**
   * 获取预约统计
   * GET /api/appointments/statistics
   */
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const stats = await this.appointmentService.getStatistics();

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

export default new AppointmentController();







