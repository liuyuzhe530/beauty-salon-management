import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class AuthController {
    register(req: AuthenticatedRequest, res: Response): Promise<void>;
    login(req: AuthenticatedRequest, res: Response): Promise<void>;
    verify(req: AuthenticatedRequest, res: Response): Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=authController.d.ts.map