import { Model, FindOptions, CreateOptions, UpdateOptions } from 'sequelize';

/**
 * 基础CRUD服务类
 * 提供通用的数据库操作方法
 */
export abstract class BaseService<T extends Model> {
  protected model: typeof Model;

  constructor(model: typeof Model) {
    this.model = model;
  }

  /**
   * 获取全部数据
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options) as Promise<T[]>;
  }

  /**
   * 获取单条数据
   */
  async findById(id: string, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options) as Promise<T | null>;
  }

  /**
   * 查询数据
   */
  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options) as Promise<T | null>;
  }

  /**
   * 分页查询
   */
  async paginate(page: number = 1, limit: number = 10, options?: FindOptions) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      ...options,
      offset,
      limit
    }) as any;

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * 创建数据
   */
  async create(data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options) as Promise<T>;
  }

  /**
   * 批量创建
   */
  async bulkCreate(data: any[], options?: CreateOptions): Promise<T[]> {
    return this.model.bulkCreate(data, options) as Promise<T[]>;
  }

  /**
   * 更新数据
   */
  async update(id: string, data: any): Promise<T | null> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.update(data) as Promise<T>;
  }

  /**
   * 删除数据
   */
  async delete(id: string): Promise<number> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.destroy();
  }

  /**
   * 批量删除
   */
  async bulkDelete(ids: string[]): Promise<number> {
    return this.model.destroy({
      where: {
        id: ids
      }
    }) as Promise<number>;
  }

  /**
   * 计数
   */
  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }

  /**
   * 检查是否存在
   */
  async exists(options: FindOptions): Promise<boolean> {
    const count = await this.model.count(options);
    return count > 0;
  }
}

export default BaseService;


/**
 * 基础CRUD服务类
 * 提供通用的数据库操作方法
 */
export abstract class BaseService<T extends Model> {
  protected model: typeof Model;

  constructor(model: typeof Model) {
    this.model = model;
  }

  /**
   * 获取全部数据
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options) as Promise<T[]>;
  }

  /**
   * 获取单条数据
   */
  async findById(id: string, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options) as Promise<T | null>;
  }

  /**
   * 查询数据
   */
  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options) as Promise<T | null>;
  }

  /**
   * 分页查询
   */
  async paginate(page: number = 1, limit: number = 10, options?: FindOptions) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      ...options,
      offset,
      limit
    }) as any;

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * 创建数据
   */
  async create(data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options) as Promise<T>;
  }

  /**
   * 批量创建
   */
  async bulkCreate(data: any[], options?: CreateOptions): Promise<T[]> {
    return this.model.bulkCreate(data, options) as Promise<T[]>;
  }

  /**
   * 更新数据
   */
  async update(id: string, data: any): Promise<T | null> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.update(data) as Promise<T>;
  }

  /**
   * 删除数据
   */
  async delete(id: string): Promise<number> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.destroy();
  }

  /**
   * 批量删除
   */
  async bulkDelete(ids: string[]): Promise<number> {
    return this.model.destroy({
      where: {
        id: ids
      }
    }) as Promise<number>;
  }

  /**
   * 计数
   */
  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }

  /**
   * 检查是否存在
   */
  async exists(options: FindOptions): Promise<boolean> {
    const count = await this.model.count(options);
    return count > 0;
  }
}

export default BaseService;


/**
 * 基础CRUD服务类
 * 提供通用的数据库操作方法
 */
export abstract class BaseService<T extends Model> {
  protected model: typeof Model;

  constructor(model: typeof Model) {
    this.model = model;
  }

  /**
   * 获取全部数据
   */
  async findAll(options?: FindOptions): Promise<T[]> {
    return this.model.findAll(options) as Promise<T[]>;
  }

  /**
   * 获取单条数据
   */
  async findById(id: string, options?: FindOptions): Promise<T | null> {
    return this.model.findByPk(id, options) as Promise<T | null>;
  }

  /**
   * 查询数据
   */
  async findOne(options: FindOptions): Promise<T | null> {
    return this.model.findOne(options) as Promise<T | null>;
  }

  /**
   * 分页查询
   */
  async paginate(page: number = 1, limit: number = 10, options?: FindOptions) {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.model.findAndCountAll({
      ...options,
      offset,
      limit
    }) as any;

    return {
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit)
      }
    };
  }

  /**
   * 创建数据
   */
  async create(data: any, options?: CreateOptions): Promise<T> {
    return this.model.create(data, options) as Promise<T>;
  }

  /**
   * 批量创建
   */
  async bulkCreate(data: any[], options?: CreateOptions): Promise<T[]> {
    return this.model.bulkCreate(data, options) as Promise<T[]>;
  }

  /**
   * 更新数据
   */
  async update(id: string, data: any): Promise<T | null> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.update(data) as Promise<T>;
  }

  /**
   * 删除数据
   */
  async delete(id: string): Promise<number> {
    const instance = await this.findById(id);
    if (!instance) {
      throw {
        status: 404,
        message: '数据不存在',
        code: 'NOT_FOUND'
      };
    }
    return instance.destroy();
  }

  /**
   * 批量删除
   */
  async bulkDelete(ids: string[]): Promise<number> {
    return this.model.destroy({
      where: {
        id: ids
      }
    }) as Promise<number>;
  }

  /**
   * 计数
   */
  async count(options?: FindOptions): Promise<number> {
    return this.model.count(options);
  }

  /**
   * 检查是否存在
   */
  async exists(options: FindOptions): Promise<boolean> {
    const count = await this.model.count(options);
    return count > 0;
  }
}

export default BaseService;







