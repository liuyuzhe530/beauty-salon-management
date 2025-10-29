const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'beauty_salon',
  logging: false
});

const testConnection = async () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║     数据库连接测试工具                             ║');
  console.log('╚════════════════════════════════════════════════════╝\n');
  
  console.log(' 当前配置:');
  console.log('  Host:     ', process.env.DB_HOST || 'localhost');
  console.log('  Port:     ', process.env.DB_PORT || '3306');
  console.log('  User:     ', process.env.DB_USER || 'root');
  console.log('  Database: ', process.env.DB_NAME || 'beauty_salon');
  console.log('  Password: ', process.env.DB_PASSWORD ? '••••••••' : '(empty)');
  console.log('');
  
  try {
    console.log(' 正在连接数据库...');
    await sequelize.authenticate();
    console.log(' 数据库连接成功！\n');
    
    // 获取数据库信息
    const [dbResult] = await sequelize.query('SELECT DATABASE() as db');
    const currentDb = dbResult[0].db;
    console.log(' 数据库信息:');
    console.log('  当前数据库:', currentDb);
    
    // 列出所有数据库
    const [dbs] = await sequelize.query('SHOW DATABASES');
    console.log('  已有数据库:', dbs.map(d => d.Database).join(', '));
    
    // 列出表
    const [tables] = await sequelize.query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = '${currentDb}'
    `);
    console.log('  当前表数:', tables.length);
    if (tables.length > 0) {
      console.log('    ', tables.map(t => t.TABLE_NAME).join(', '));
    }
    
    console.log('\n 所有测试通过！');
    console.log('\n 下一步:');
    console.log('  1. npm run build    (编译TypeScript)');
    console.log('  2. npm run start    (启动服务器)');
    console.log('');
    process.exit(0);
    
  } catch (error) {
    console.error(' 连接失败!\n');
    console.error('错误信息:', error.message);
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error(' 问题诊断: 连接被拒绝\n');
      console.error('可能原因:');
      console.error('  1.  MySQL服务未启动');
      console.error('  2.  错误的host/port');
      console.error('  3.  防火墙阻止\n');
      console.error('解决方案:');
      console.error('  Windows:  Start-Service MySQL80');
      console.error('  Mac:      brew services start mysql');
      console.error('  Linux:    sudo systemctl start mysql');
      
    } else if (error.code === 'ER_ACCESS_DENIED_FOR_USER') {
      console.error(' 问题诊断: 用户名或密码错误\n');
      console.error('解决方案:');
      console.error('  1. 检查 backend/.env 中的配置');
      console.error('  2. 确保 DB_USER 和 DB_PASSWORD 正确');
      console.error('  3. 重新运行本测试');
      
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.error(' 问题诊断: 数据库不存在\n');
      console.error('解决方案:');
      console.error('  1. mysql -u root -p');
      console.error('  2. CREATE DATABASE beauty_salon CHARACTER SET utf8mb4;');
      console.error('  3. 重新运行本测试');
    }
    
    console.error('');
    process.exit(1);
  }
};

testConnection();
