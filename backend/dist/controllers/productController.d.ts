import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
export declare class ProductController extends BaseCRUDController {
    constructor();
    getByCategory(req: AuthenticatedRequest, res: Response): Promise<void>;
    search(req: AuthenticatedRequest, res: Response): Promise<void>;
    getStats(_req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: ProductController;
export default _default;
//# sourceMappingURL=productController.d.ts.map