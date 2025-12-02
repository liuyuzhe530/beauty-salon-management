# 🚀 数据库快速启动 (5 分钟)

**适合**: 首次搭建系统  
**预计时间**: 5 分钟  
**难度**: ⭐ 简单

---

## ⚡ 3 个关键步骤

### 第 1️⃣ 步: 创建 .env 文件

**创建文件**: `backend/.env`

复制以下内容：
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

**保存文件**

---

### 第 2️⃣ 步: 启动 MySQL

**Windows (PowerShell)**:
```powershell
Start-Service MySQL80
Get-Service MySQL80
```

看到 `Status : Running` 说明成功

**Mac/Linux**:
```bash
brew services start mysql
# 或
sudo systemctl start mysql
```

---

### 第 3️⃣ 步: 初始化数据库

**打开 PowerShell，在项目根目录执行**:
```powershell
cd E:\xincs\xincs\backend
npm run db:init
```

**预期输出**:
```
✓ Database initialized successfully
✓ Tables created
✓ Ready to start server
```

---

## ✅ 验证成功

运行以下命令测试连接：
```powershell
cd backend
node test-connection.js
```

应该看到：
```
✓ Database connected successfully
✓ Connection test passed
```

---

## 🎯 完整命令清单

| 操作 | 命令 |
|------|------|
| 初始化数据库 | `npm run db:init` |
| 填充示例数据 | `npm run db:seed` |
| 测试连接 | `node test-connection.js` |
| 启动后端 | `npm start` |
| 启动前端 | `npm run dev` (在项目根目录) |

---

## ⚠️ 如果遇到错误

### 错误 1: `ECONNREFUSED`
**原因**: MySQL 未启动
```powershell
Start-Service MySQL80
```

### 错误 2: `Access denied`
**原因**: 数据库密码错误
检查 .env 中的 DB_PASSWORD

### 错误 3: `Table already exists`
**原因**: 数据库已存在
删除旧数据库：
```bash
mysql -h localhost -u root
DROP DATABASE beauty_salon;
EXIT;
```

---

## 🎊 完成后

所有功能都将可用：
- ✅ 用户登录
- ✅ 客户管理
- ✅ 上传功能
- ✅ 数据保存

---

**现在就创建 .env 文件并启动数据库吧！** 🎉







