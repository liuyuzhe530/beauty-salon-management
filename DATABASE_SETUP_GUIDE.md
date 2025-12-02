# 📊 数据库完整搭建指南

**创建日期**: 2025-11-04  
**系统**: MySQL + Sequelize  
**状态**: 📝 准备搭建  

---

## 🎯 概述

您的系统使用：
- **数据库**: MySQL
- **ORM**: Sequelize
- **驱动**: mysql2

---

## ⚡ 快速搭建 (5 分钟)

### 步骤 1: 创建 .env 环境文件

**创建文件**: `backend/.env`

```env
# 服务器配置
NODE_ENV=development
PORT=3001
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_salon

# JWT 配置
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# 日志
LOG_LEVEL=debug

# CORS 配置
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 步骤 2: 确保 MySQL 运行

**Windows 用户**:
```powershell
# 检查 MySQL 服务状态
Get-Service MySQL80

# 如果未运行，启动它
Start-Service MySQL80

# 验证已启动
Get-Service MySQL80 | Select-Object Status
```

**Mac/Linux 用户**:
```bash
# 启动 MySQL
brew services start mysql

# 或
sudo systemctl start mysql
```

### 步骤 3: 创建数据库

**打开 MySQL 命令行**:
```bash
mysql -h localhost -u root
```

**执行以下命令**:
```sql
-- 创建数据库
CREATE DATABASE IF NOT EXISTS beauty_salon 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 验证
SHOW DATABASES;

-- 使用数据库
USE beauty_salon;

-- 显示表
SHOW TABLES;

-- 退出
EXIT;
```

### 步骤 4: 初始化表结构

**在项目根目录运行**:
```bash
cd backend
npm run db:init
```

**预期输出**:
```
✓ Database initialized successfully
✓ Tables created
✓ Ready to start server
```

---

## 📋 完整数据库配置

### 配置详情

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 数据库名 | beauty_salon | 美容院管理系统 |
| 主机 | localhost | 本地服务器 |
| 端口 | 3306 | MySQL 默认端口 |
| 用户 | root | MySQL root 用户 |
| 密码 | (空) | 默认无密码 |
| 字符集 | utf8mb4 | 完整 UTF-8 支持 |
| 排序规则 | utf8mb4_unicode_ci | 中文排序 |

### 修改配置

如果需要修改数据库配置，编辑 `backend/.env`:

```env
# 连接到远程数据库
DB_HOST=192.168.1.100
DB_PORT=3306
DB_USER=admin
DB_PASSWORD=your_password
DB_NAME=beauty_salon_prod
```

---

## 🗂️ 数据表结构

系统会自动创建以下表：

| 表名 | 说明 | 主要字段 |
|------|------|---------|
| users | 用户 | id, username, email, password, role |
| customers | 客户 | id, name, phone, email, avatar |
| staff | 员工 | id, name, phone, role, department |
| services | 服务 | id, name, description, price, duration |
| appointments | 预约 | id, customerId, staffId, serviceId, date, status |
| products | 产品 | id, name, category, price, stock, image |
| orders | 订单 | id, customerId, totalAmount, status, createdAt |
| uploads | 上传文件 | id, userId, filename, url, filesize |

---

## 🔧 常见命令

### 初始化数据库
```bash
npm run db:init
```
创建数据库和所有表

### 填充示例数据
```bash
npm run db:seed
```
插入测试数据供开发使用

### 测试连接
```bash
node backend/test-connection.js
```
检查数据库连接是否正常

### 重置数据库
```bash
# 删除所有表
npx sequelize-cli db:migrate:undo:all

# 重新创建表
npm run db:init
```

---

## 🧪 验证数据库

### 方法 1: 使用 MySQL 命令行

```bash
# 连接数据库
mysql -h localhost -u root beauty_salon

# 查看所有表
SHOW TABLES;

# 查看表结构
DESC users;

# 查看数据
SELECT * FROM users;

# 退出
EXIT;
```

### 方法 2: 使用 MySQL 客户端 (GUI)

推荐工具：
- MySQL Workbench
- Navicat
- DBeaver

步骤：
1. 打开 MySQL 客户端
2. 新建连接
3. 输入: localhost:3306, root, (空密码)
4. 连接到 beauty_salon 数据库
5. 查看表结构和数据

### 方法 3: 启动后端后验证

```powershell
# 启动后端
cd backend
npm start

# 后端启动时会自动创建表
# 查看日志：
# ✓ Database connected
# ✓ Database synchronized
```

---

## ⚠️ 常见问题

### Q1: MySQL 服务未启动

**症状**: `ECONNREFUSED 127.0.0.1:3306`

**解决**:
```powershell
# Windows
Start-Service MySQL80

# Mac
brew services start mysql

# Linux
sudo systemctl start mysql
```

### Q2: 拒绝访问 (无密码)

**症状**: `Access denied for user 'root'@'localhost'`

**解决**: 检查 `.env` 文件中的密码配置

### Q3: 数据库已存在

**症状**: `Error: ER_DB_CREATE_EXISTS`

**解决**:
```sql
DROP DATABASE beauty_salon;
CREATE DATABASE beauty_salon 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
```

### Q4: 表创建失败

**症状**: 执行 `npm run db:init` 后出错

**解决**:
1. 检查 MySQL 是否运行
2. 检查数据库连接配置
3. 查看 backend 目录中的日志文件
4. 运行 `node backend/test-connection.js` 测试连接

### Q5: 端口已被占用

**症状**: `EADDRINUSE :::3306`

**解决**:
```powershell
# 找到占用 3306 端口的进程
netstat -ano | findstr :3306

# 杀死进程
taskkill /PID <PID> /F

# 或改用其他端口
# 修改 .env: DB_PORT=3307
```

---

## 🚀 完整启动流程

### 第一步: 配置

```bash
# 创建 .env 文件
# 内容见上面的 "快速搭建" 部分
```

### 第二步: 启动 MySQL

```powershell
Start-Service MySQL80
```

### 第三步: 初始化数据库

```bash
cd backend
npm run db:init
```

### 第四步: 启动后端

```bash
npm start
```

**预期输出**:
```
Database connected
Database synchronized
Server running on port 3001
```

### 第五步: 启动前端

```powershell
cd ..
npm install
npm run dev
```

**预期输出**:
```
VITE v5.x.x ready in xxx ms
Local: http://localhost:5173
```

---

## 📊 示例数据

系统会自动创建以下示例数据 (通过 `npm run db:seed`):

### 示例用户
```
用户名: admin
密码: admin123
角色: admin

用户名: staff1
密码: staff123
角色: staff

用户名: customer1
密码: customer123
角色: customer
```

### 示例服务
```
护肤套餐 - ¥99
美发护理 - ¥59
按摩放松 - ¥79
整体护理 - ¥199
```

### 示例产品
```
护肤品 1 - ¥199
面膜套装 - ¥299
精油产品 - ¥149
```

---

## 🎯 验证清单

完成以下步骤确认数据库正常：

- [ ] .env 文件已创建
- [ ] MySQL 服务正在运行
- [ ] 可以连接到 MySQL
- [ ] beauty_salon 数据库已创建
- [ ] 所有表已创建
- [ ] 后端可以启动
- [ ] 前端可以访问
- [ ] 上传功能可以使用

---

## 🔗 数据库连接信息

启动后使用以下信息连接：

```
主机: localhost
端口: 3306
用户: root
密码: (空)
数据库: beauty_salon
```

---

## 📝 备份和恢复

### 备份数据库

```bash
mysqldump -h localhost -u root beauty_salon > backup.sql
```

### 恢复数据库

```bash
mysql -h localhost -u root beauty_salon < backup.sql
```

---

## ✅ 下一步

1. ✅ 创建 .env 文件
2. ✅ 启动 MySQL
3. ✅ 运行 `npm run db:init`
4. ✅ 启动后端和前端
5. ✅ 测试上传功能

---

**数据库搭建完成后，所有功能都将正常工作！** 🎉

需要帮助？查看相关文档或重新执行步骤。







