import { Router } from 'express';
import customerController from '../controllers/customerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 客户管理API
 */

// 基础CRUD操作
router.get('/', customerController.getAll.bind(customerController));
router.post('/', customerController.create.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));
router.put('/:id', customerController.update.bind(customerController));
router.delete('/:id', customerController.delete.bind(customerController));

// 批量删除
router.post('/batch/delete', customerController.bulkDelete.bind(customerController));

// 特定功能
router.get('/status/active', customerController.getActiveCustomers.bind(customerController));
router.get('/status/atrisk', customerController.getRiskCustomers.bind(customerController));
router.get('/search/:keyword', customerController.searchCustomers.bind(customerController));
router.get('/statistics', customerController.getStatistics.bind(customerController));
router.put('/:id/spending', customerController.updateSpending.bind(customerController));

export default router;

import customerController from '../controllers/customerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 客户管理API
 */

// 基础CRUD操作
router.get('/', customerController.getAll.bind(customerController));
router.post('/', customerController.create.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));
router.put('/:id', customerController.update.bind(customerController));
router.delete('/:id', customerController.delete.bind(customerController));

// 批量删除
router.post('/batch/delete', customerController.bulkDelete.bind(customerController));

// 特定功能
router.get('/status/active', customerController.getActiveCustomers.bind(customerController));
router.get('/status/atrisk', customerController.getRiskCustomers.bind(customerController));
router.get('/search/:keyword', customerController.searchCustomers.bind(customerController));
router.get('/statistics', customerController.getStatistics.bind(customerController));
router.put('/:id/spending', customerController.updateSpending.bind(customerController));

export default router;

import customerController from '../controllers/customerController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 客户管理API
 */

// 基础CRUD操作
router.get('/', customerController.getAll.bind(customerController));
router.post('/', customerController.create.bind(customerController));
router.get('/:id', customerController.getById.bind(customerController));
router.put('/:id', customerController.update.bind(customerController));
router.delete('/:id', customerController.delete.bind(customerController));

// 批量删除
router.post('/batch/delete', customerController.bulkDelete.bind(customerController));

// 特定功能
router.get('/status/active', customerController.getActiveCustomers.bind(customerController));
router.get('/status/atrisk', customerController.getRiskCustomers.bind(customerController));
router.get('/search/:keyword', customerController.searchCustomers.bind(customerController));
router.get('/statistics', customerController.getStatistics.bind(customerController));
router.put('/:id/spending', customerController.updateSpending.bind(customerController));

export default router;







