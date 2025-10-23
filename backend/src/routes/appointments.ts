import { Router, Request, Response } from 'express';
import appointmentController from '../controllers/appointmentController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

const asAuthReq = (req: Request) => req as AuthenticatedRequest;

router.get('/', authMiddleware, (req: Request, res: Response) => appointmentController.getAll(asAuthReq(req), res));
router.get('/stats', authMiddleware, (req: Request, res: Response) => appointmentController.getStats(asAuthReq(req), res));
router.get('/upcoming', authMiddleware, (req: Request, res: Response) => appointmentController.getUpcoming(asAuthReq(req), res));
router.get('/customer/:customerId', authMiddleware, (req: Request, res: Response) =>
  appointmentController.getByCustomer(asAuthReq(req), res)
);
router.get('/:id', authMiddleware, (req: Request, res: Response) => appointmentController.getById(asAuthReq(req), res));
router.post('/', authMiddleware, (req: Request, res: Response) => appointmentController.create(asAuthReq(req), res));
router.put('/:id', authMiddleware, requireRole('admin', 'staff'), (req: Request, res: Response) =>
  appointmentController.update(asAuthReq(req), res)
);
router.delete('/:id', authMiddleware, requireRole('admin'), (req: Request, res: Response) =>
  appointmentController.delete(asAuthReq(req), res)
);

export default router;




