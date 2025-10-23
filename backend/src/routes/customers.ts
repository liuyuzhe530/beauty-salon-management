import { Router, Request, Response } from 'express';
import customerController from '../controllers/customerController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

const asAuthReq = (req: Request) => req as AuthenticatedRequest;

router.get('/', authMiddleware, (req: Request, res: Response) => customerController.getAll(asAuthReq(req), res));
router.get('/stats', authMiddleware, (req: Request, res: Response) => customerController.getStats(asAuthReq(req), res));
router.get('/phone/:phone', authMiddleware, (req: Request, res: Response) => customerController.getByPhone(asAuthReq(req), res));
router.get('/:id', authMiddleware, (req: Request, res: Response) => customerController.getById(asAuthReq(req), res));
router.post('/', authMiddleware, requireRole('admin', 'staff'), (req: Request, res: Response) =>
  customerController.create(asAuthReq(req), res)
);
router.put('/:id', authMiddleware, requireRole('admin', 'staff'), (req: Request, res: Response) =>
  customerController.update(asAuthReq(req), res)
);
router.delete('/:id', authMiddleware, requireRole('admin'), (req: Request, res: Response) =>
  customerController.delete(asAuthReq(req), res)
);

export default router;




