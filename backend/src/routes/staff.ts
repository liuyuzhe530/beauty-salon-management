import { Router, Request, Response } from 'express';
import staffController from '../controllers/staffController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

const asAuthReq = (req: Request) => req as AuthenticatedRequest;

router.get('/', authMiddleware, (req: Request, res: Response) => staffController.getAll(asAuthReq(req), res));
router.get('/stats', authMiddleware, (req: Request, res: Response) => staffController.getStats(asAuthReq(req), res));
router.get('/available', authMiddleware, (req: Request, res: Response) => staffController.getAvailable(asAuthReq(req), res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => staffController.getById(asAuthReq(req), res));
router.post('/', authMiddleware, requireRole('admin'), (req: Request, res: Response) => staffController.create(asAuthReq(req), res));
router.put('/:id', authMiddleware, requireRole('admin', 'staff'), (req: Request, res: Response) =>
  staffController.update(asAuthReq(req), res)
);
router.delete('/:id', authMiddleware, requireRole('admin'), (req: Request, res: Response) =>
  staffController.delete(asAuthReq(req), res)
);

export default router;




