import { Router, Request, Response } from 'express';
import productController from '../controllers/productController';
import { authMiddleware, requireRole } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

const asAuthReq = (req: Request) => req as AuthenticatedRequest;

router.get('/', authMiddleware, (req: Request, res: Response) => productController.getAll(asAuthReq(req), res));
router.get('/stats', authMiddleware, (req: Request, res: Response) => productController.getStats(asAuthReq(req), res));
router.get('/search', authMiddleware, (req: Request, res: Response) => productController.search(asAuthReq(req), res));
router.get('/category/:category', authMiddleware, (req: Request, res: Response) =>
  productController.getByCategory(asAuthReq(req), res)
);
router.get('/:id', authMiddleware, (req: Request, res: Response) => productController.getById(asAuthReq(req), res));
router.post('/', authMiddleware, requireRole('admin'), (req: Request, res: Response) => productController.create(asAuthReq(req), res));
router.put('/:id', authMiddleware, requireRole('admin'), (req: Request, res: Response) =>
  productController.update(asAuthReq(req), res)
);
router.delete('/:id', authMiddleware, requireRole('admin'), (req: Request, res: Response) =>
  productController.delete(asAuthReq(req), res)
);

export default router;




