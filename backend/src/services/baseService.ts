import { Model, FindOptions, UpdateOptions, DestroyOptions, ModelStatic } from 'sequelize';

export abstract class BaseService<T extends Model> {
  protected model: ModelStatic<any>;

  constructor(model: ModelStatic<any>) {
    this.model = model;
  }

  async findAll(options?: FindOptions): Promise<T[]> {
    return (await this.model.findAll(options)) as T[];
  }

  async findById(id: string): Promise<T | null> {
    return (await this.model.findByPk(id)) as T | null;
  }

  async findOne(options: FindOptions): Promise<T | null> {
    return (await this.model.findOne(options)) as T | null;
  }

  async create(data: Record<string, any>): Promise<T> {
    return (await this.model.create(data)) as T;
  }

  async update(id: string, data: Record<string, any>): Promise<[number, T[]]> {
    const [affectedCount, affectedRows] = await (this.model.update(data, {
      where: { id },
      returning: true,
    } as UpdateOptions) as any);
    
    return [affectedCount, (affectedRows || []) as T[]];
  }

  async delete(id: string): Promise<number> {
    return await this.model.destroy({
      where: { id },
    } as DestroyOptions);
  }
}

export default BaseService;




