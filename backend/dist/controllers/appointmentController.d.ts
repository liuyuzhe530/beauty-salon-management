import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { BaseCRUDController } from './baseCRUDController';
export declare class AppointmentController extends BaseCRUDController {
    constructor();
    getByCustomer(req: AuthenticatedRequest, res: Response): Promise<void>;
    getUpcoming(_req: AuthenticatedRequest, res: Response): Promise<void>;
    getStats(_req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: AppointmentController;
export default _default;
//# sourceMappingURL=appointmentController.d.ts.map