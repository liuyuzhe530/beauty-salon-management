import { Router } from 'express';
import staffController from '../controllers/staffController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 美容师管理API
 */

// 基础CRUD操作
router.get('/', staffController.getAll.bind(staffController));
router.post('/', staffController.create.bind(staffController));
router.get('/:id', staffController.getById.bind(staffController));
router.put('/:id', staffController.update.bind(staffController));
router.delete('/:id', staffController.delete.bind(staffController));

// 批量删除
router.post('/batch/delete', staffController.bulkDelete.bind(staffController));

// 特定功能
router.get('/active', staffController.getActiveStaff.bind(staffController));
router.get('/top-rated', staffController.getTopRatedStaff.bind(staffController));
router.get('/search/:keyword', staffController.searchStaff.bind(staffController));
router.put('/:id/rating', staffController.updateRating.bind(staffController));
router.get('/statistics', staffController.getStatistics.bind(staffController));

export default router;

import staffController from '../controllers/staffController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 美容师管理API
 */

// 基础CRUD操作
router.get('/', staffController.getAll.bind(staffController));
router.post('/', staffController.create.bind(staffController));
router.get('/:id', staffController.getById.bind(staffController));
router.put('/:id', staffController.update.bind(staffController));
router.delete('/:id', staffController.delete.bind(staffController));

// 批量删除
router.post('/batch/delete', staffController.bulkDelete.bind(staffController));

// 特定功能
router.get('/active', staffController.getActiveStaff.bind(staffController));
router.get('/top-rated', staffController.getTopRatedStaff.bind(staffController));
router.get('/search/:keyword', staffController.searchStaff.bind(staffController));
router.put('/:id/rating', staffController.updateRating.bind(staffController));
router.get('/statistics', staffController.getStatistics.bind(staffController));

export default router;

import staffController from '../controllers/staffController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 美容师管理API
 */

// 基础CRUD操作
router.get('/', staffController.getAll.bind(staffController));
router.post('/', staffController.create.bind(staffController));
router.get('/:id', staffController.getById.bind(staffController));
router.put('/:id', staffController.update.bind(staffController));
router.delete('/:id', staffController.delete.bind(staffController));

// 批量删除
router.post('/batch/delete', staffController.bulkDelete.bind(staffController));

// 特定功能
router.get('/active', staffController.getActiveStaff.bind(staffController));
router.get('/top-rated', staffController.getTopRatedStaff.bind(staffController));
router.get('/search/:keyword', staffController.searchStaff.bind(staffController));
router.put('/:id/rating', staffController.updateRating.bind(staffController));
router.get('/statistics', staffController.getStatistics.bind(staffController));

export default router;







