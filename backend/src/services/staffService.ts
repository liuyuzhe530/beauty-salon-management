import { BaseService } from './baseService';
import Staff from '../database/models/Staff';

export class StaffService extends BaseService<any> {
  constructor() {
    super(Staff);
  }

  /**
   * 按电话号码查找美容师
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找美容师
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃美容师
   */
  async getActiveStaff() {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']]
    });
  }

  /**
   * 获取最高评分美容师
   */
  async getTopRatedStaff(limit: number = 10) {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']],
      limit
    });
  }

  /**
   * 更新美容师评分
   */
  async updateRating(id: string, newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw { status: 400, message: '评分必须在0-5之间' };
    }
    return this.update(id, { rating: newRating });
  }

  /**
   * 更新美容师收入
   */
  async updateRevenue(id: string, amount: number) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    const currentRevenue = parseFloat(staff.totalRevenue || '0');
    return this.update(id, {
      totalRevenue: currentRevenue + amount
    });
  }

  /**
   * 增加客户数
   */
  async incrementClientCount(id: string) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    return this.update(id, {
      clientCount: (staff.clientCount || 0) + 1
    });
  }

  /**
   * 搜索美容师
   */
  async searchStaff(keyword: string) {
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
   * 获取美容师统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const onleave = await this.count({ where: { status: 'onleave' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      onleave,
      inactive
    };
  }
}

export default StaffService;

import Staff from '../database/models/Staff';

export class StaffService extends BaseService<any> {
  constructor() {
    super(Staff);
  }

  /**
   * 按电话号码查找美容师
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找美容师
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃美容师
   */
  async getActiveStaff() {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']]
    });
  }

  /**
   * 获取最高评分美容师
   */
  async getTopRatedStaff(limit: number = 10) {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']],
      limit
    });
  }

  /**
   * 更新美容师评分
   */
  async updateRating(id: string, newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw { status: 400, message: '评分必须在0-5之间' };
    }
    return this.update(id, { rating: newRating });
  }

  /**
   * 更新美容师收入
   */
  async updateRevenue(id: string, amount: number) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    const currentRevenue = parseFloat(staff.totalRevenue || '0');
    return this.update(id, {
      totalRevenue: currentRevenue + amount
    });
  }

  /**
   * 增加客户数
   */
  async incrementClientCount(id: string) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    return this.update(id, {
      clientCount: (staff.clientCount || 0) + 1
    });
  }

  /**
   * 搜索美容师
   */
  async searchStaff(keyword: string) {
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
   * 获取美容师统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const onleave = await this.count({ where: { status: 'onleave' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      onleave,
      inactive
    };
  }
}

export default StaffService;

import Staff from '../database/models/Staff';

export class StaffService extends BaseService<any> {
  constructor() {
    super(Staff);
  }

  /**
   * 按电话号码查找美容师
   */
  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  /**
   * 按邮箱查找美容师
   */
  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  /**
   * 获取活跃美容师
   */
  async getActiveStaff() {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']]
    });
  }

  /**
   * 获取最高评分美容师
   */
  async getTopRatedStaff(limit: number = 10) {
    return this.findAll({
      where: { status: 'active' },
      order: [['rating', 'DESC']],
      limit
    });
  }

  /**
   * 更新美容师评分
   */
  async updateRating(id: string, newRating: number) {
    if (newRating < 0 || newRating > 5) {
      throw { status: 400, message: '评分必须在0-5之间' };
    }
    return this.update(id, { rating: newRating });
  }

  /**
   * 更新美容师收入
   */
  async updateRevenue(id: string, amount: number) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    const currentRevenue = parseFloat(staff.totalRevenue || '0');
    return this.update(id, {
      totalRevenue: currentRevenue + amount
    });
  }

  /**
   * 增加客户数
   */
  async incrementClientCount(id: string) {
    const staff = await this.findById(id);
    if (!staff) throw { status: 404, message: '美容师不存在' };

    return this.update(id, {
      clientCount: (staff.clientCount || 0) + 1
    });
  }

  /**
   * 搜索美容师
   */
  async searchStaff(keyword: string) {
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
   * 获取美容师统计
   */
  async getStatistics() {
    const total = await this.count();
    const active = await this.count({ where: { status: 'active' } });
    const onleave = await this.count({ where: { status: 'onleave' } });
    const inactive = await this.count({ where: { status: 'inactive' } });

    return {
      total,
      active,
      onleave,
      inactive
    };
  }
}

export default StaffService;







