import { BaseService } from './baseService';
import Appointment from '../database/models/Appointment';

export class AppointmentService extends BaseService<any> {
  constructor() {
    super(Appointment);
  }

  /**
   * 获取某个客户的预约
   */
  async getCustomerAppointments(customerId: string) {
    return this.findAll({
      where: { customerId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取某个美容师的预约
   */
  async getStaffAppointments(staffId: string) {
    return this.findAll({
      where: { staffId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取今天的预约
   */
  async getTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findAll({
      where: {
        date: {
          [Symbol.for('gte')]: today,
          [Symbol.for('lt')]: tomorrow
        }
      },
      order: [['time', 'ASC']]
    });
  }

  /**
   * 获取待确认预约
   */
  async getPendingAppointments() {
    return this.findAll({
      where: { status: 'pending' },
      order: [['date', 'ASC']]
    });
  }

  /**
   * 确认预约
   */
  async confirmAppointment(id: string) {
    return this.update(id, { status: 'confirmed' });
  }

  /**
   * 完成预约
   */
  async completeAppointment(id: string) {
    return this.update(id, { status: 'completed' });
  }

  /**
   * 取消预约
   */
  async cancelAppointment(id: string) {
    return this.update(id, { status: 'cancelled' });
  }

  /**
   * 获取预约统计
   */
  async getStatistics() {
    const total = await this.count();
    const pending = await this.count({ where: { status: 'pending' } });
    const confirmed = await this.count({ where: { status: 'confirmed' } });
    const completed = await this.count({ where: { status: 'completed' } });
    const cancelled = await this.count({ where: { status: 'cancelled' } });

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled
    };
  }
}

export default AppointmentService;

import Appointment from '../database/models/Appointment';

export class AppointmentService extends BaseService<any> {
  constructor() {
    super(Appointment);
  }

  /**
   * 获取某个客户的预约
   */
  async getCustomerAppointments(customerId: string) {
    return this.findAll({
      where: { customerId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取某个美容师的预约
   */
  async getStaffAppointments(staffId: string) {
    return this.findAll({
      where: { staffId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取今天的预约
   */
  async getTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findAll({
      where: {
        date: {
          [Symbol.for('gte')]: today,
          [Symbol.for('lt')]: tomorrow
        }
      },
      order: [['time', 'ASC']]
    });
  }

  /**
   * 获取待确认预约
   */
  async getPendingAppointments() {
    return this.findAll({
      where: { status: 'pending' },
      order: [['date', 'ASC']]
    });
  }

  /**
   * 确认预约
   */
  async confirmAppointment(id: string) {
    return this.update(id, { status: 'confirmed' });
  }

  /**
   * 完成预约
   */
  async completeAppointment(id: string) {
    return this.update(id, { status: 'completed' });
  }

  /**
   * 取消预约
   */
  async cancelAppointment(id: string) {
    return this.update(id, { status: 'cancelled' });
  }

  /**
   * 获取预约统计
   */
  async getStatistics() {
    const total = await this.count();
    const pending = await this.count({ where: { status: 'pending' } });
    const confirmed = await this.count({ where: { status: 'confirmed' } });
    const completed = await this.count({ where: { status: 'completed' } });
    const cancelled = await this.count({ where: { status: 'cancelled' } });

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled
    };
  }
}

export default AppointmentService;

import Appointment from '../database/models/Appointment';

export class AppointmentService extends BaseService<any> {
  constructor() {
    super(Appointment);
  }

  /**
   * 获取某个客户的预约
   */
  async getCustomerAppointments(customerId: string) {
    return this.findAll({
      where: { customerId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取某个美容师的预约
   */
  async getStaffAppointments(staffId: string) {
    return this.findAll({
      where: { staffId },
      order: [['date', 'DESC']]
    });
  }

  /**
   * 获取今天的预约
   */
  async getTodayAppointments() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.findAll({
      where: {
        date: {
          [Symbol.for('gte')]: today,
          [Symbol.for('lt')]: tomorrow
        }
      },
      order: [['time', 'ASC']]
    });
  }

  /**
   * 获取待确认预约
   */
  async getPendingAppointments() {
    return this.findAll({
      where: { status: 'pending' },
      order: [['date', 'ASC']]
    });
  }

  /**
   * 确认预约
   */
  async confirmAppointment(id: string) {
    return this.update(id, { status: 'confirmed' });
  }

  /**
   * 完成预约
   */
  async completeAppointment(id: string) {
    return this.update(id, { status: 'completed' });
  }

  /**
   * 取消预约
   */
  async cancelAppointment(id: string) {
    return this.update(id, { status: 'cancelled' });
  }

  /**
   * 获取预约统计
   */
  async getStatistics() {
    const total = await this.count();
    const pending = await this.count({ where: { status: 'pending' } });
    const confirmed = await this.count({ where: { status: 'confirmed' } });
    const completed = await this.count({ where: { status: 'completed' } });
    const cancelled = await this.count({ where: { status: 'cancelled' } });

    return {
      total,
      pending,
      confirmed,
      completed,
      cancelled
    };
  }
}

export default AppointmentService;







