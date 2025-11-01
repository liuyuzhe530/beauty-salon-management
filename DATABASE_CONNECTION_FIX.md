# 🔧 数据库连接问题 - 诊断和修复

**问题**: 后端启动失败  
**错误**: `ConnectionRefusedError [SequelizeConnectionRefusedError]`  
**原因**: MySQL 连接被拒绝  
**优先级**: 🔴 高 (阻止上传功能工作)

---

## 🔍 问题分析

### 错误信息
```
Failed to start server: ConnectionRefusedError [SequelizeConnectionRefusedError]
Code: ECONNREFUSED
Fatal: true
```

### 可能原因

1. ❌ **MySQL 服务未启动**
2. ❌ **MySQL 连接参数错误** (host/port/user/password)
3. ❌ **数据库不存在**
4. ❌ **防火墙阻止连接**
5. ❌ **环境变量未设置**

---

## ✅ 快速修复步骤

### 步骤 1️⃣: 启动 MySQL 服务

```powershell
# 启动 MySQL 服务
Start-Service MySQL80

# 验证服务是否运行
Get-Service MySQL80
```

预期输出:
```
Status   Name
------   ----
Running  MySQL80
```

---

### 步骤 2️⃣: 检查环境变量

**检查文件**: `backend/.env` (如果存在)

```bash
# 应该包含:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_salon
```

如果文件不存在，创建一个:

```bash
# 在 backend 目录下创建 .env 文件
echo "DB_HOST=localhost" > .env
echo "DB_PORT=3306" >> .env
echo "DB_USER=root" >> .env
echo "DB_PASSWORD=" >> .env
echo "DB_NAME=beauty_salon" >> .env
```

---

### 步骤 3️⃣: 验证 MySQL 连接

```bash
# 测试连接
mysql -h localhost -u root

# 应该显示:
# mysql>
```

如果失败，检查:
- ✅ MySQL 服务是否运行
- ✅ 默认端口 3306 是否正确
- ✅ 用户名 `root` 是否存在

---

### 步骤 4️⃣: 创建数据库

```bash
# 连接 MySQL
mysql -h localhost -u root

# 创建数据库
mysql> CREATE DATABASE beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
mysql> EXIT;
```

---

### 步骤 5️⃣: 重新启动后端

```bash
cd backend
npm start
```

预期输出:
```
Database connected
Database synchronized
Server running on port 3001
Upload endpoint: http://localhost:3001/api/upload/image
```

---

## 🆘 如果还是不工作

### 问题 1: "access denied for user 'root'@'localhost'"

**原因**: MySQL root 用户密码不正确

**解决**:
```bash
# 使用正确的密码
mysql -h localhost -u root -p

# 或在 .env 中设置密码
DB_PASSWORD=your_password
```

### 问题 2: "Can't connect to MySQL server on 'localhost'"

**原因**: MySQL 服务未运行或端口不正确

**解决**:
```bash
# 确保 MySQL 运行
Start-Service MySQL80

# 检查端口
netstat -ano | findstr 3306

# 如果端口不同，更新 .env
DB_PORT=3307  # 根据实际端口
```

### 问题 3: "Unknown database 'beauty_salon'"

**原因**: 数据库不存在

**解决**:
```bash
# 创建数据库
mysql -h localhost -u root
mysql> CREATE DATABASE beauty_salon CHARACTER SET utf8mb4;
mysql> EXIT;

# 重新启动后端
npm start
```

---

## 📝 完整的 MySQL 安装和配置

如果 MySQL 完全不可用，按照以下步骤：

### 安装 MySQL

1. **下载**: https://dev.mysql.com/downloads/mysql/
2. **选择**: MySQL Community Server
3. **安装**: 使用默认设置
4. **重要**: 记住 root 密码

### 配置 MySQL

```bash
# 启动 MySQL 服务
Start-Service MySQL80

# 创建用户 (可选)
mysql -u root -p
mysql> CREATE USER 'beauty_salon'@'localhost' IDENTIFIED BY 'password';
mysql> GRANT ALL PRIVILEGES ON beauty_salon.* TO 'beauty_salon'@'localhost';
mysql> FLUSH PRIVILEGES;
mysql> EXIT;
```

---

## 🔗 后端数据库配置文件

**位置**: `backend/src/config/database.ts`

```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'beauty_salon',
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
});

export default sequelize;
```

---

## ✅ 验证连接成功

### 检查 1: 服务启动日志

```
✅ Database connected
✅ Database synchronized
✅ Server running on port 3001
```

### 检查 2: API 健康检查

```bash
curl http://localhost:3001/api/health
```

预期响应:
```json
{"success": true, "message": "Server is running"}
```

### 检查 3: 上传端点就绪

```bash
curl -X POST http://localhost:3001/api/upload/image
```

预期响应:
```json
{"success": false, "message": "没有上传文件"}
```

(这是正常的，因为没有上传文件)

---

## 🎯 完整的启动流程

```bash
# 1. 启动 MySQL 服务
Start-Service MySQL80
Start-Sleep -Seconds 2

# 2. 创建数据库 (如果还没创建)
mysql -h localhost -u root -e "CREATE DATABASE IF NOT EXISTS beauty_salon;"

# 3. 启动后端
cd backend
npm start

# 4. 在新 Terminal 启动前端
npm run dev

# 5. 在浏览器打开
http://localhost:5173/

# 6. 按 Ctrl+Shift+R 清除缓存
# 7. 测试上传功能
```

---

## 📊 MySQL 默认配置

| 参数 | 值 |
|------|-----|
| Host | localhost |
| Port | 3306 |
| User | root |
| Password | (空) |
| Database | beauty_salon |

---

## 🎉 成功标志

如果看到以下日志，说明连接成功:

```
Database connected ✓
Database synchronized ✓
Server running on port 3001 ✓
Upload endpoint: http://localhost:3001/api/upload/image ✓
Static files: http://localhost:3001/uploads/ ✓
```

然后上传功能就能正常工作了！

---

**现在就按照步骤 1-5 操作吧！** 🚀
