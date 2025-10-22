import { Router } from 'express';
import productController from '../controllers/productController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// 应用认证中间件
router.use(authMiddleware);

/**
 * 产品管理API
 */

// 基础CRUD操作
router.get('/', productController.getAll.bind(productController));
router.post('/', productController.create.bind(productController));
router.get('/:id', productController.getById.bind(productController));
router.put('/:id', productController.update.bind(productController));
router.delete('/:id', productController.delete.bind(productController));

// 批量删除
router.post('/batch/delete', productController.bulkDelete.bind(productController));

// 特定功能
router.get('/category/:category', productController.getByCategory.bind(productController));
router.get('/search/:keyword', productController.searchProducts.bind(productController));
router.get('/low-stock', productController.getLowStockProducts.bind(productController));
router.get('/top-selling', productController.getTopSellingProducts.bind(productController));
router.put('/:id/decrease-stock', productController.decreaseStock.bind(productController));
router.put('/:id/increase-stock', productController.increaseStock.bind(productController));
router.get('/statistics', productController.getStatistics.bind(productController));
router.get('/categories', productController.getCategories.bind(productController));

export default router;







