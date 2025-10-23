import Product from '../database/models/Product';
import { BaseService } from './baseService';

export class ProductService extends BaseService<any> {
  constructor() {
    super(Product);
  }

  async findByCategory(category: string) {
    return this.findAll({
      where: { category, isActive: true },
    });
  }

  async findActive() {
    return this.findAll({ where: { isActive: true } });
  }

  async searchByName(name: string) {
    const { Op } = await import('sequelize');
    return this.findAll({
      where: {
        name: { [Op.like]: `%${name}%` },
        isActive: true,
      },
    });
  }

  async getStats() {
    const total = await this.model.count();
    const active = await this.model.count({ where: { isActive: true } });
    return { totalProducts: total, activeProducts: active };
  }
}

export default new ProductService();




