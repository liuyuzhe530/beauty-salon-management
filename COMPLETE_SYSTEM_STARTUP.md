#  美容院管理系统 - 完整启动指南

##  系统状态检查

### 当前已完成
 **前端应用** - 已启动在 `http://localhost:3000`（或其他可用端口）
 **登录页面** - 已显示
 **导入修复** - 已修复相对路径导入
 **环境变量** - 已修复 Vite 兼容性

###  需要检查的事项
1. **后端服务器** - 必须运行在 `http://localhost:3001`
2. **MySQL 数据库** - 必须启动并准备就绪
3. **点击功能** - 需要后端 API 响应

---

##  完整启动步骤

### 第1步：启动 MySQL 数据库

#### Windows
```powershell
# 方式1：作为服务启动（推荐）
Start-Service MySQL80

# 验证服务是否运行
Get-Service MySQL80 | Select-Object Status
```

#### Mac
```bash
brew services start mysql
```

#### Linux
```bash
sudo systemctl start mysql
```

### 第2步：检查数据库是否创建

```powershell
# 连接到 MySQL
mysql -u root -p

# 在 MySQL 提示符中执行：
SHOW DATABASES;
CREATE DATABASE beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_salon;
SHOW TABLES;
```

### 第3步：启动后端服务器

```powershell
# 新开一个终端窗口
cd E:\xincs\xincs\backend

# 编译 TypeScript
npm run build

# 或者直接运行（如果已编译）
npm run start

# 预期输出：
# Database connected
# Database synchronized
# Server running on port 3001
```

### 第4步：验证后端连接

```powershell
# 测试数据库连接
cd E:\xincs\xincs\backend
node test-connection.js

# 预期输出应该显示：
#  数据库连接成功！
```

### 第5步：刷新前端应用

```
浏览器中按 Ctrl+Shift+R (硬刷新)
```

---

##  功能测试清单

### 登录功能测试

1. **测试注册**
   - 用户名: `testuser`
   - 邮箱: `test@example.com`
   - 密码: `Test@123`
   - 选择角色: 客户
   - 点击"注册"按钮
   
   **预期结果**: 注册成功，自动登录

2. **测试登录**
   - 用户名: `testuser`
   - 密码: `Test@123`
   - 点击"登录"按钮
   
   **预期结果**: 登录成功，进入仪表板

3. **快速访问按钮测试**
   - 点击"以管理员身份进入"
   - 点击"以美容师身份进入"
   - 点击"以客户身份进入"
   
   **预期结果**: 直接进入对应角色的仪表板

---

##  问题诊断

### 问题1: "点不了任何功能"

**排查步骤：**

1. **检查浏览器控制台**
   ```
   按 F12 打开开发者工具 → Console 标签
   查看是否有红色错误信息
   ```

2. **检查后端是否运行**
   ```powershell
   # 查看 3001 端口是否被占用
   netstat -ano | findstr :3001
   
   # 如果显示 LISTENING，说明后端正在运行
   ```

3. **检查 MySQL 是否运行**
   ```powershell
   # 查看 3306 端口是否被占用
   netstat -ano | findstr :3306
   ```

4. **查看具体错误信息**
   - 打开浏览器 F12 → Console
   - 尝试点击登录/注册按钮
   - 记录错误信息
   - 告诉我具体错误

### 问题2: "ConnectionRefusedError"

这表示后端未运行或无法连接到 MySQL。

**解决方案：**
```powershell
# 1. 启动 MySQL
Start-Service MySQL80

# 2. 验证连接
cd E:\xincs\xincs\backend
node test-connection.js

# 3. 如果数据库不存在，创建它
mysql -u root -p < backend/init-db.sql
```

### 问题3: "Failed to resolve import"

这是前端导入路径问题。

**解决方案：**
```powershell
# 清理和重启前端
cd E:\xincs\xincs
rmdir /s /q node_modules\.vite
npm run dev
# 按 Ctrl+Shift+R 硬刷新浏览器
```

---

##  系统架构

```
┌─────────────────────────────────────────┐
│         前端 (React + Vite)             │
│  http://localhost:3000 (或其他端口)     │
└──────────────┬──────────────────────────┘
               │ HTTP API 请求
               ↓
┌─────────────────────────────────────────┐
│    后端 (Express + TypeScript)          │
│     http://localhost:3001               │
└──────────────┬──────────────────────────┘
               │ SQL 查询
               ↓
┌─────────────────────────────────────────┐
│   数据库 (MySQL)                        │
│  localhost:3306 beauty_salon            │
└─────────────────────────────────────────┘
```

---

##  关键 API 端点

### 认证
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/verify` - 验证 token

### 核心资源
- `/api/customers` - 客户管理
- `/api/appointments` - 预约管理
- `/api/staff` - 员工管理
- `/api/products` - 产品管理

---

##  快速命令参考

```powershell
# 启动整个系统
cd E:\xincs\xincs\backend; npm run start &
cd E:\xincs\xincs; npm run dev

# 仅重启前端
cd E:\xincs\xincs
taskkill /f /im node.exe 2>$null
npm run dev

# 查看日志
cd E:\xincs\xincs\backend
npm run build

# 测试后端连接
cd E:\xincs\xincs\backend
node test-connection.js
```

---

##  完整验收清单

- [ ] MySQL 服务已启动
- [ ] 数据库已创建（`beauty_salon`）
- [ ] 后端服务已启动（端口 3001）
- [ ] 前端应用已启动（可访问）
- [ ] 登录页面可见
- [ ] 可以在控制台看到登录响应
- [ ] 可以成功注册新用户
- [ ] 可以成功登录
- [ ] 可以进入仪表板
- [ ] 所有导航功能可用

---

## � 需要帮助？

如果系统无法工作，请：

1. **提供具体错误信息**
   - 浏览器控制台的红色错误
   - 后端的错误日志
   - MySQL 连接错误

2. **提供系统状态**
   - 哪些端口在运行
   - 哪些服务已启动
   - 哪个步骤失败

3. **运行诊断脚本**
   ```powershell
   cd E:\xincs\xincs\backend
   node test-connection.js
   ```

---

**最后更新**: 2024年10月
