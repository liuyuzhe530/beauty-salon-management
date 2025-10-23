import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseService } from '../services/baseService';
export declare abstract class BaseCRUDController {
    protected service: BaseService<any>;
    constructor(service: BaseService<any>);
    getAll(_req: AuthenticatedRequest, res: Response): Promise<void>;
    getById(req: AuthenticatedRequest, res: Response): Promise<void>;
    create(req: AuthenticatedRequest, res: Response): Promise<void>;
    update(req: AuthenticatedRequest, res: Response): Promise<void>;
    delete(req: AuthenticatedRequest, res: Response): Promise<void>;
}
export default BaseCRUDController;
//# sourceMappingURL=baseCRUDController.d.ts.map