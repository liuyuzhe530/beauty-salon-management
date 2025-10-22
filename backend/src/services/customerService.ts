import { BaseService } from './baseService';
import Customer from '../database/models/Customer';

export class CustomerService extends BaseService<any> {
  constructor() {
    super(Customer);
  }

  /**
   * 按电话号码查找客户
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找客户
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃客户列表
   */
  async getActiveCustomers() {
    return this.findAll({
      where: { status: 'active' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 获取风险客户列表
   */
  async getRiskCustomers() {
    return this.findAll({
      where: { status: 'atrisk' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 更新客户访问时间
   */
  async updateLastVisit(id: string) {
    return this.update(id, { lastVisit: new Date() });
  }

  /**
   * 更新客户消费金额
   */
  async updateTotalSpending(id: string, amount: number) {
    const customer = await this.findById(id);
    if (!customer) throw { status: 404, message: '客户不存在' };

    const currentTotal = parseFloat(customer.totalSpending || '0');
    return this.update(id, {
      totalSpending: currentTotal + amount,
      appointmentCount: (customer.appointmentCount || 0) + 1
    });
  }

  /**
   * 搜索客户
   */
  async searchCustomers(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取客户统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const atrisk = await this.count({ where: { status: 'atrisk' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      atrisk,
      inactive,
      activePercentage: total > 0 ? (active / total * 100).toFixed(2) : 0
    };
  }
}

export default CustomerService;

import Customer from '../database/models/Customer';

export class CustomerService extends BaseService<any> {
  constructor() {
    super(Customer);
  }

  /**
   * 按电话号码查找客户
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找客户
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃客户列表
   */
  async getActiveCustomers() {
    return this.findAll({
      where: { status: 'active' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 获取风险客户列表
   */
  async getRiskCustomers() {
    return this.findAll({
      where: { status: 'atrisk' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 更新客户访问时间
   */
  async updateLastVisit(id: string) {
    return this.update(id, { lastVisit: new Date() });
  }

  /**
   * 更新客户消费金额
   */
  async updateTotalSpending(id: string, amount: number) {
    const customer = await this.findById(id);
    if (!customer) throw { status: 404, message: '客户不存在' };

    const currentTotal = parseFloat(customer.totalSpending || '0');
    return this.update(id, {
      totalSpending: currentTotal + amount,
      appointmentCount: (customer.appointmentCount || 0) + 1
    });
  }

  /**
   * 搜索客户
   */
  async searchCustomers(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取客户统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const atrisk = await this.count({ where: { status: 'atrisk' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      atrisk,
      inactive,
      activePercentage: total > 0 ? (active / total * 100).toFixed(2) : 0
    };
  }
}

export default CustomerService;

import Customer from '../database/models/Customer';

export class CustomerService extends BaseService<any> {
  constructor() {
    super(Customer);
  }

  /**
   * 按电话号码查找客户
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找客户
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃客户列表
   */
  async getActiveCustomers() {
    return this.findAll({
      where: { status: 'active' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 获取风险客户列表
   */
  async getRiskCustomers() {
    return this.findAll({
      where: { status: 'atrisk' },
      order: [['lastVisit', 'DESC']]
    });
  }

  /**
   * 更新客户访问时间
   */
  async updateLastVisit(id: string) {
    return this.update(id, { lastVisit: new Date() });
  }

  /**
   * 更新客户消费金额
   */
  async updateTotalSpending(id: string, amount: number) {
    const customer = await this.findById(id);
    if (!customer) throw { status: 404, message: '客户不存在' };

    const currentTotal = parseFloat(customer.totalSpending || '0');
    return this.update(id, {
      totalSpending: currentTotal + amount,
      appointmentCount: (customer.appointmentCount || 0) + 1
    });
  }

  /**
   * 搜索客户
   */
  async searchCustomers(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取客户统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const atrisk = await this.count({ where: { status: 'atrisk' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      atrisk,
      inactive,
      activePercentage: total > 0 ? (active / total * 100).toFixed(2) : 0
    };
  }
}

export default CustomerService;







