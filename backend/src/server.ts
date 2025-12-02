import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import sequelize from './config/database';
import authRoutes from './routes/auth';
import customerRoutes from './routes/customers';
import staffRoutes from './routes/staff';
import appointmentRoutes from './routes/appointments';
import productRoutes from './routes/products';
import uploadRoutes from './routes/upload';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 提供上传文件的静态访问
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Server is running' });
});

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Start server
const startServer = async () => {
  try {
    try {
      await sequelize.authenticate();
      console.log('✅ Database connected successfully');
      
      await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
      console.log('✅ Database synchronized');
    } catch (dbError: any) {
      console.warn('⚠️ Database connection failed:', dbError.message);
      console.warn('⚠️ Running server without database connection...');
    }

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`Upload endpoint: http://localhost:${PORT}/api/upload/image`);
      console.log(`Static files: http://localhost:${PORT}/uploads/`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;




