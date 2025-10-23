import Customer from '../database/models/Customer';
import { BaseService } from './baseService';

export class CustomerService extends BaseService<any> {
  constructor() {
    super(Customer);
  }

  async findByPhone(phone: string) {
    return this.findOne({ where: { phone } });
  }

  async findByEmail(email: string) {
    return this.findOne({ where: { email } });
  }

  async getStats() {
    const count = await this.model.count();
    return { totalCustomers: count };
  }
}

export default new CustomerService();




