import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
export declare class CustomerController extends BaseCRUDController {
    constructor();
    getByPhone(req: AuthenticatedRequest, res: Response): Promise<void>;
    getStats(_req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: CustomerController;
export default _default;
//# sourceMappingURL=customerController.d.ts.map