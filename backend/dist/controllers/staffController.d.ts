import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
export declare class StaffController extends BaseCRUDController {
    constructor();
    getAvailable(_req: AuthenticatedRequest, res: Response): Promise<void>;
    getStats(_req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: StaffController;
export default _default;
//# sourceMappingURL=staffController.d.ts.map