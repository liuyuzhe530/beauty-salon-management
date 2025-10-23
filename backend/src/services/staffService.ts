import Staff from '../database/models/Staff';
import { BaseService } from './baseService';

export class StaffService extends BaseService<any> {
  constructor() {
    super(Staff);
  }

  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  async findAvailable() {
    return this.findAll({ where: { isAvailable: true } });
  }

  async getStats() {
    const total = await this.model.count();
    const available = await this.model.count({ where: { isAvailable: true } });
    return { totalStaff: total, availableStaff: available };
  }
}

export default new StaffService();




