import { BaseService } from './baseService';
import Product from '../database/models/Product';

export class ProductService extends BaseService<any> {
  constructor() {
    super(Product);
  }

  /**
   * 按名称查找产品
   */
  async findByName(name: string) {
    return this.findOne({ where: { name } });
  }

  /**
   * 获取某个分类的产品
   */
  async getByCategory(category: string) {
    return this.findAll({
      where: { category },
      order: [['name', 'ASC']]
    });
  }

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取库存不足的产品
   */
  async getLowStockProducts(threshold: number = 10) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        stock: {
          [Op.lte]: threshold
        }
      },
      order: [['stock', 'ASC']]
    });
  }

  /**
   * 更新库存（减少）
   */
  async decreaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    if (product.stock < quantity) {
      throw { status: 400, message: '库存不足' };
    }

    return this.update(id, {
      stock: product.stock - quantity,
      sold: (product.sold || 0) + quantity
    });
  }

  /**
   * 更新库存（增加）
   */
  async increaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    return this.update(id, {
      stock: product.stock + quantity
    });
  }

  /**
   * 获取利润最高的产品
   */
  async getTopProfitProducts(limit: number = 10) {
    const products = await this.findAll({ limit: 100 });
    return products
      .map((p: any) => ({
        ...p,
        profit: p.price - p.cost,
        profitMargin: ((p.price - p.cost) / p.price * 100).toFixed(2)
      }))
      .sort((a: any, b: any) => b.profit - a.profit)
      .slice(0, limit);
  }

  /**
   * 获取最畅销的产品
   */
  async getTopSellingProducts(limit: number = 10) {
    return this.findAll({
      order: [['sold', 'DESC']],
      limit
    });
  }

  /**
   * 获取产品统计
   */
  async getStatistics() {
    const total = await this.count();
    const allProducts = await this.findAll();

    let totalValue = 0;
    let totalCost = 0;
    let totalSold = 0;

    allProducts.forEach((p: any) => {
      totalValue += parseFloat(p.price) * p.stock;
      totalCost += parseFloat(p.cost) * p.stock;
      totalSold += p.sold || 0;
    });

    return {
      total,
      totalInventoryValue: totalValue.toFixed(2),
      totalInventoryCost: totalCost.toFixed(2),
      totalProfit: (totalValue - totalCost).toFixed(2),
      totalSold
    };
  }

  /**
   * 获取所有分类
   */
  async getCategories() {
    const products = await this.findAll();
    const categories = new Set(products.map((p: any) => p.category));
    return Array.from(categories);
  }
}

export default ProductService;

import Product from '../database/models/Product';

export class ProductService extends BaseService<any> {
  constructor() {
    super(Product);
  }

  /**
   * 按名称查找产品
   */
  async findByName(name: string) {
    return this.findOne({ where: { name } });
  }

  /**
   * 获取某个分类的产品
   */
  async getByCategory(category: string) {
    return this.findAll({
      where: { category },
      order: [['name', 'ASC']]
    });
  }

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取库存不足的产品
   */
  async getLowStockProducts(threshold: number = 10) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        stock: {
          [Op.lte]: threshold
        }
      },
      order: [['stock', 'ASC']]
    });
  }

  /**
   * 更新库存（减少）
   */
  async decreaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    if (product.stock < quantity) {
      throw { status: 400, message: '库存不足' };
    }

    return this.update(id, {
      stock: product.stock - quantity,
      sold: (product.sold || 0) + quantity
    });
  }

  /**
   * 更新库存（增加）
   */
  async increaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    return this.update(id, {
      stock: product.stock + quantity
    });
  }

  /**
   * 获取利润最高的产品
   */
  async getTopProfitProducts(limit: number = 10) {
    const products = await this.findAll({ limit: 100 });
    return products
      .map((p: any) => ({
        ...p,
        profit: p.price - p.cost,
        profitMargin: ((p.price - p.cost) / p.price * 100).toFixed(2)
      }))
      .sort((a: any, b: any) => b.profit - a.profit)
      .slice(0, limit);
  }

  /**
   * 获取最畅销的产品
   */
  async getTopSellingProducts(limit: number = 10) {
    return this.findAll({
      order: [['sold', 'DESC']],
      limit
    });
  }

  /**
   * 获取产品统计
   */
  async getStatistics() {
    const total = await this.count();
    const allProducts = await this.findAll();

    let totalValue = 0;
    let totalCost = 0;
    let totalSold = 0;

    allProducts.forEach((p: any) => {
      totalValue += parseFloat(p.price) * p.stock;
      totalCost += parseFloat(p.cost) * p.stock;
      totalSold += p.sold || 0;
    });

    return {
      total,
      totalInventoryValue: totalValue.toFixed(2),
      totalInventoryCost: totalCost.toFixed(2),
      totalProfit: (totalValue - totalCost).toFixed(2),
      totalSold
    };
  }

  /**
   * 获取所有分类
   */
  async getCategories() {
    const products = await this.findAll();
    const categories = new Set(products.map((p: any) => p.category));
    return Array.from(categories);
  }
}

export default ProductService;

import Product from '../database/models/Product';

export class ProductService extends BaseService<any> {
  constructor() {
    super(Product);
  }

  /**
   * 按名称查找产品
   */
  async findByName(name: string) {
    return this.findOne({ where: { name } });
  }

  /**
   * 获取某个分类的产品
   */
  async getByCategory(category: string) {
    return this.findAll({
      where: { category },
      order: [['name', 'ASC']]
    });
  }

  /**
   * 搜索产品
   */
  async searchProducts(keyword: string) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { category: { [Op.like]: `%${keyword}%` } },
          { description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
  }

  /**
   * 获取库存不足的产品
   */
  async getLowStockProducts(threshold: number = 10) {
    const { Op } = require('sequelize');
    return this.findAll({
      where: {
        stock: {
          [Op.lte]: threshold
        }
      },
      order: [['stock', 'ASC']]
    });
  }

  /**
   * 更新库存（减少）
   */
  async decreaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    if (product.stock < quantity) {
      throw { status: 400, message: '库存不足' };
    }

    return this.update(id, {
      stock: product.stock - quantity,
      sold: (product.sold || 0) + quantity
    });
  }

  /**
   * 更新库存（增加）
   */
  async increaseStock(id: string, quantity: number) {
    const product = await this.findById(id);
    if (!product) throw { status: 404, message: '产品不存在' };

    return this.update(id, {
      stock: product.stock + quantity
    });
  }

  /**
   * 获取利润最高的产品
   */
  async getTopProfitProducts(limit: number = 10) {
    const products = await this.findAll({ limit: 100 });
    return products
      .map((p: any) => ({
        ...p,
        profit: p.price - p.cost,
        profitMargin: ((p.price - p.cost) / p.price * 100).toFixed(2)
      }))
      .sort((a: any, b: any) => b.profit - a.profit)
      .slice(0, limit);
  }

  /**
   * 获取最畅销的产品
   */
  async getTopSellingProducts(limit: number = 10) {
    return this.findAll({
      order: [['sold', 'DESC']],
      limit
    });
  }

  /**
   * 获取产品统计
   */
  async getStatistics() {
    const total = await this.count();
    const allProducts = await this.findAll();

    let totalValue = 0;
    let totalCost = 0;
    let totalSold = 0;

    allProducts.forEach((p: any) => {
      totalValue += parseFloat(p.price) * p.stock;
      totalCost += parseFloat(p.cost) * p.stock;
      totalSold += p.sold || 0;
    });

    return {
      total,
      totalInventoryValue: totalValue.toFixed(2),
      totalInventoryCost: totalCost.toFixed(2),
      totalProfit: (totalValue - totalCost).toFixed(2),
      totalSold
    };
  }

  /**
   * 获取所有分类
   */
  async getCategories() {
    const products = await this.findAll();
    const categories = new Set(products.map((p: any) => p.category));
    return Array.from(categories);
  }
}

export default ProductService;







