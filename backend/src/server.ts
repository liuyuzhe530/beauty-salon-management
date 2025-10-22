import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import appointmentRoutes from './routes/appointments';
import staffRoutes from './routes/staff';
import productRoutes from './routes/products';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// ==================== 中间件配置 ====================

// 安全中间件
app.use(helmet());

// CORS配置
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  optionsSuccessStatus: 200
}));

// 日志中间件
app.use(morgan('combined'));

// 请求体解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ==================== 健康检查 ====================

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '服务器正常运行',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ==================== API路由 ====================

app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '美容院管理系统 API v1.0',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      customers: '/api/customers',
      appointments: '/api/appointments',
      staff: '/api/staff',
      products: '/api/products'
    }
  });
});

// 认证API
app.use('/api/auth', authRoutes);

// 业务API
app.use('/api/customers', customerRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/products', productRoutes);

// ==================== 错误处理 ====================

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: '请求的资源不存在',
    code: 'NOT_FOUND'
  });
});

// ==================== 数据库连接与服务器启动 ====================

const startServer = async () => {
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 同步数据库模型（开发环境）
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ 数据库模型同步成功');
    }

    // 启动服务器
    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 美容院管理系统 API 服务已启动                          ║
║                                                            ║
║   服务器地址: http://localhost:${PORT}                      ║
║   环境: ${process.env.NODE_ENV || 'development'}                             ║
║   数据库: ${process.env.DB_NAME || 'beauty_salon'}                          ║
║                                                            ║
║   API 文档: http://localhost:${PORT}/api                    ║
║   健康检查: http://localhost:${PORT}/health                ║
║                                                            ║
║   ✅ 所有路由已启用:                                         ║
║   - 认证 API: /api/auth                                    ║
║   - 客户 API: /api/customers                               ║
║   - 预约 API: /api/appointments                            ║
║   - 美容师 API: /api/staff                                 ║
║   - 产品 API: /api/products                                ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error('❌ 服务器启动失败:', error);
    process.exit(1);
  }
};

// 处理未捕获的异常
process.on('unhandledRejection', (reason) => {
  console.error('未处理的Promise拒绝:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  process.exit(1);
});

startServer();

export default app;
