#  第1阶段快速启动指南

**日期**: 2025-10-22  
**目标**: 验证后端对接和测试登录流程  
**预计时间**: 15 分钟

---

##  系统要求检查清单

在开始之前，请确保您有：

- [ ] Node.js 14+ 已安装
- [ ] npm 或 yarn 已安装
- [ ] MySQL 服务运行中
- [ ] 后端 `.env` 文件已配置
- [ ] 前端可以访问后端 API

---

##  启动步骤

### 步骤 1: 启动后端服务器 (5分钟)

```bash
# 打开新的终端窗口（终端 1）
cd E:\xincs\xincs\backend

# 检查依赖
npm install

# 启动开发服务器
npm run dev
```

**预期输出**:
```
 Server running on port 5000
 Database connected
```

**常见问题**:
| 问题 | 原因 | 解决方案 |
|------|------|--------|
| `EADDRINUSE: address already in use :::5000` | 端口被占用 | 关闭其他应用或更改端口 |
| `Error: connect ECONNREFUSED 127.0.0.1:3306` | MySQL 未运行 | 启动 MySQL 服务 |
| `Error: Access denied for user 'root'` | 数据库凭证错误 | 检查 `.env` 配置 |

---

### 步骤 2: 启动前端服务器 (3分钟)

```bash
# 打开新的终端窗口（终端 2）
cd E:\xincs\xincs

# 确保依赖已安装
npm install

# 启动前端开发服务器
npm run dev
```

**预期输出**:
```
 Vite v5.x.x ready in XXX ms

  Local:   http://localhost:5173/
  press h to show help
```

**打开浏览器**: http://localhost:5173

---

### 步骤 3: 验证 API 连接 (3分钟)

**方法 A: 使用浏览器开发者工具**

1. 打开前端 (http://localhost:5173)
2. 按 `F12` 打开开发者工具
3. 进入 `Console` 标签
4. 输入以下命令测试 API:

```javascript
// 测试后端连接
fetch('http://localhost:5000/api/auth/verify', {
  headers: {
    'Authorization': 'Bearer test-token'
  }
})
.then(r => r.json())
.then(d => console.log(' 后端响应:', d))
.catch(e => console.error(' 错误:', e));
```

**预期结果**:
-  如果连接正常，会收到后端的 JSON 响应
-  如果显示 `ERR_CONNECTION_REFUSED`，后端未启动

**方法 B: 使用 curl (Windows PowerShell)**

```powershell
# 测试后端是否运行
curl -I http://localhost:5000/health

# 测试登录端点
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "username": "admin",
    "password": "Admin@123"
  }' | ConvertFrom-Json | Write-Host
```

**预期响应**:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "1",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

##  测试登录流程 (4分钟)

### 测试凭证

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | Admin@123 | admin |
| staff | Staff@123 | staff |
| manager | Manager@123 | manager |

### 测试步骤

1. **访问前端**: http://localhost:5173
2. **查看登录页面**: 应该看到登录表单
3. **输入凭证**:
   - 用户名: `admin`
   - 密码: `Admin@123`
4. **点击登录**
5. **验证结果**:
   -  成功: 进入仪表板，显示用户名
   -  失败: 显示错误信息

### 浏览器开发者工具验证

打开 `Application` 标签，检查 `localStorage`:

```javascript
// 应该能看到:
{
  "authToken": "eyJhbGc...",
  "currentUser": "{\"id\":\"1\",\"username\":\"admin\",\"email\":\"admin@example.com\",\"role\":\"admin\"}"
}
```

---

##  完整的检查清单

### 后端检查
- [ ] 服务器在 `http://localhost:5000` 运行
- [ ] 可以访问 `http://localhost:5000/health`
- [ ] 数据库已连接
- [ ] 没有错误日志

### 前端检查
- [ ] 应用在 `http://localhost:5173` 运行
- [ ] 没有编译错误
- [ ] 可以看到登录页面
- [ ] 浏览器控制台无错误

### API 连接检查
- [ ] 登录请求成功 (200 OK)
- [ ] 返回的 Token 有效
- [ ] 用户信息正确显示
- [ ] Token 已保存到 localStorage

### 功能检查
- [ ] 能登录系统
- [ ] Token 正确存储
- [ ] 页面刷新后仍保持登录
- [ ] 能点击登出
- [ ] 登出后返回登录页

---

##  故障排查

### 问题 1: 后端连接被拒绝 (ERR_CONNECTION_REFUSED)

**症状**: 浏览器显示 "无法访问此网站"

**解决步骤**:

1. 检查后端是否运行:
```bash
# 检查端口 5000 是否被监听
netstat -ano | findstr :5000
```

2. 重新启动后端:
```bash
cd backend
npm run dev
```

3. 检查防火墙设置

4. 尝试访问 `http://localhost:5000/api`

---

### 问题 2: 登录失败 (401 Unauthorized)

**症状**: 输入正确的凭证但仍然失败

**解决步骤**:

1. 检查后端日志中的错误信息

2. 验证 `.env` 配置:
```bash
# 检查数据库是否正确
cat backend/.env | grep DB_
```

3. 重置数据库:
```bash
cd backend
npm run db:init
npm run db:seed
```

4. 再次尝试登录

---

### 问题 3: Token 错误 (Invalid Token)

**症状**: 页面显示 "Token 无效" 或自动退出登录

**解决步骤**:

1. 清除浏览器数据:
   - 打开浏览器设置 → 隐私 → 清除浏览数据
   - 选择 "Cookies 和其他网站数据"
   - 点击清除

2. 刷新页面

3. 重新登录

---

### 问题 4: CORS 错误

**症状**: 控制台显示 CORS 错误

**解决步骤**:

1. 检查后端 `.env` 中的 CORS 配置:
```env
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

2. 重启后端服务器

3. 清除浏览器缓存

---

##  实时日志监控

### 后端日志

```bash
# 在后端终端查看实时日志
# 应该能看到类似的信息:

[18:30:45] Server running on port 5000
[18:30:45] Database connected to beauty_salon
[18:31:02] POST /api/auth/login - 200 OK
[18:31:02] User admin authenticated
```

### 前端日志

```bash
# 在浏览器开发者工具中查看
# Console 应该显示:

 API Client initialized
 Auth Context loaded
 Login successful
 Token saved: eyJhbGc...
```

---

##  成功标志

当您看到以下任何一个，说明第1阶段启动成功 :

1.  能登录系统
2.  Token 正确保存到 localStorage
3.  页面显示用户名
4.  刷新页面后保持登录
5.  能成功登出
6.  后端和前端之间能正常通信

---

##  需要帮助？

### 常见错误代码

| 代码 | 含义 | 解决方案 |
|------|------|--------|
| 400 | 请求错误 | 检查请求数据格式 |
| 401 | 未授权 | 检查用户名/密码 |
| 403 | 禁止访问 | 检查权限 |
| 404 | 未找到 | 检查 API 端点 |
| 500 | 服务器错误 | 检查后端日志 |
| ECONNREFUSED | 连接被拒绝 | 启动后端服务器 |
| CORS Error | 跨域问题 | 检查 CORS 配置 |

---

##  下一步

一旦登录流程工作正常，您可以：

1. **测试数据获取**: 
   - 进入客户管理页面
   - 检查是否能加载客户列表

2. **测试 CRUD 操作**:
   - 添加新客户
   - 编辑现有客户
   - 删除客户

3. **测试其他模块**:
   - 预约管理
   - 员工管理
   - 产品管理

---

##  性能检查

### API 响应时间目标

| 操作 | 目标 | 状态 |
|------|------|------|
| 登录 | < 500ms | ️ |
| 获取列表 | < 500ms | ️ |
| 创建数据 | < 1000ms | ️ |
| 更新数据 | < 500ms | ️ |
| 删除数据 | < 500ms | ️ |

### 检查方法

打开浏览器开发者工具 → Network 标签：

1. 执行操作
2. 查看请求的响应时间
3. 与目标对比

---

##  数据备份

在进行任何数据库操作前，建议备份：

```bash
# 备份数据库
mysqldump -u root -p beauty_salon > backup.sql

# 恢复数据库
mysql -u root -p beauty_salon < backup.sql
```

---

**现在您已准备好开始第1阶段的测试！** 

需要任何帮助，请参考上面的故障排查部分。

祝测试顺利！
