import { Model, FindOptions, ModelStatic } from 'sequelize';
export declare abstract class BaseService<T extends Model> {
    protected model: ModelStatic<any>;
    constructor(model: ModelStatic<any>);
    findAll(options?: FindOptions): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    findOne(options: FindOptions): Promise<T | null>;
    create(data: Record<string, any>): Promise<T>;
    update(id: string, data: Record<string, any>): Promise<[number, T[]]>;
    delete(id: string): Promise<number>;
}
export default BaseService;
//# sourceMappingURL=baseService.d.ts.map