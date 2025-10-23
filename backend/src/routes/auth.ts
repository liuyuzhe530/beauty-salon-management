import { Router, Request, Response } from 'express';
import authController from '../controllers/authController';
import { authMiddleware } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/auth';

const router = Router();

router.post('/register', (req: Request, res: Response) => 
  authController.register(req as AuthenticatedRequest, res)
);
router.post('/login', (req: Request, res: Response) => 
  authController.login(req as AuthenticatedRequest, res)
);
router.get('/verify', authMiddleware, (req: Request, res: Response) => 
  authController.verify(req as AuthenticatedRequest, res)
);

export default router;




