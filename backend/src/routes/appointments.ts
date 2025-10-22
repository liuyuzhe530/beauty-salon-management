import { Router } from 'express';
import appointmentController from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 预约管理API
 */

// 基础CRUD操作
router.get('/', appointmentController.getAll.bind(appointmentController));
router.post('/', appointmentController.create.bind(appointmentController));
router.get('/:id', appointmentController.getById.bind(appointmentController));
router.put('/:id', appointmentController.update.bind(appointmentController));
router.delete('/:id', appointmentController.delete.bind(appointmentController));

// 批量删除
router.post('/batch/delete', appointmentController.bulkDelete.bind(appointmentController));

// 特定功能
router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
router.get('/pending', appointmentController.getPendingAppointments.bind(appointmentController));
router.get('/customer/:customerId', appointmentController.getCustomerAppointments.bind(appointmentController));
router.get('/staff/:staffId', appointmentController.getStaffAppointments.bind(appointmentController));
router.put('/:id/confirm', appointmentController.confirmAppointment.bind(appointmentController));
router.put('/:id/complete', appointmentController.completeAppointment.bind(appointmentController));
router.put('/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));
router.get('/statistics', appointmentController.getStatistics.bind(appointmentController));

export default router;

import appointmentController from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 预约管理API
 */

// 基础CRUD操作
router.get('/', appointmentController.getAll.bind(appointmentController));
router.post('/', appointmentController.create.bind(appointmentController));
router.get('/:id', appointmentController.getById.bind(appointmentController));
router.put('/:id', appointmentController.update.bind(appointmentController));
router.delete('/:id', appointmentController.delete.bind(appointmentController));

// 批量删除
router.post('/batch/delete', appointmentController.bulkDelete.bind(appointmentController));

// 特定功能
router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
router.get('/pending', appointmentController.getPendingAppointments.bind(appointmentController));
router.get('/customer/:customerId', appointmentController.getCustomerAppointments.bind(appointmentController));
router.get('/staff/:staffId', appointmentController.getStaffAppointments.bind(appointmentController));
router.put('/:id/confirm', appointmentController.confirmAppointment.bind(appointmentController));
router.put('/:id/complete', appointmentController.completeAppointment.bind(appointmentController));
router.put('/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));
router.get('/statistics', appointmentController.getStatistics.bind(appointmentController));

export default router;

import appointmentController from '../controllers/appointmentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 预约管理API
 */

// 基础CRUD操作
router.get('/', appointmentController.getAll.bind(appointmentController));
router.post('/', appointmentController.create.bind(appointmentController));
router.get('/:id', appointmentController.getById.bind(appointmentController));
router.put('/:id', appointmentController.update.bind(appointmentController));
router.delete('/:id', appointmentController.delete.bind(appointmentController));

// 批量删除
router.post('/batch/delete', appointmentController.bulkDelete.bind(appointmentController));

// 特定功能
router.get('/today', appointmentController.getTodayAppointments.bind(appointmentController));
router.get('/pending', appointmentController.getPendingAppointments.bind(appointmentController));
router.get('/customer/:customerId', appointmentController.getCustomerAppointments.bind(appointmentController));
router.get('/staff/:staffId', appointmentController.getStaffAppointments.bind(appointmentController));
router.put('/:id/confirm', appointmentController.confirmAppointment.bind(appointmentController));
router.put('/:id/complete', appointmentController.completeAppointment.bind(appointmentController));
router.put('/:id/cancel', appointmentController.cancelAppointment.bind(appointmentController));
router.get('/statistics', appointmentController.getStatistics.bind(appointmentController));

export default router;







