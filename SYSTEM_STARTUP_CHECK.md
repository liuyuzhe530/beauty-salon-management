#  系统启动检查表

**日期**: 2025-10-22  
**状态**:  系统修复完成，准备启动

---

##  已修复的问题

| 问题 | 文件 | 原因 | 修复 | 状态 |
|------|------|------|------|------|
| JSON 格式错误 | `backend/package.json` | 内容重复3份 | 删除重复 |  |
| TypeScript 编译错误 | `backend/tsconfig.json` | 配置重复3份 | 删除重复 |  |
| 前端加载失败 | 待验证 | 后端启动失败 | 修复后端 |  |

---

##  现在启动系统

### 步骤 1: 打开后端终端

```bash
cd E:\xincs\xincs\backend
npm run dev
```

**等待看到**:
```
 Server running on port 5000
 Database connected to beauty_salon
 listening on port 5000
```

### 步骤 2: 打开前端终端

在新的终端窗口中：

```bash
cd E:\xincs\xincs
npm run dev -- --port 5173
```

**等待看到**:
```
 Vite v5.x.x ready in xxx ms
 Local: http://localhost:5173/
```

### 步骤 3: 打开浏览器

访问: **http://localhost:5173**

---

##  系统验证检查清单

### A. 后端验证

在后端运行的终端中，检查：

```bash
# 应该看到这些日志:
 [HH:MM:SS] Server running on port 5000
 [HH:MM:SS] Database connected
 [HH:MM:SS] Express server initialized
```

**检查点**:
- [ ] 后端服务器已启动
- [ ] 没有 TypeScript 编译错误
- [ ] 数据库已连接
- [ ] 没有关键错误日志

### B. 前端验证

在前端运行的终端中，检查：

```bash
# 应该看到:
 Vite vX.x.x ready in xxx ms
 Local: http://localhost:5173/
```

**检查点**:
- [ ] 前端服务器已启动
- [ ] 没有编译错误
- [ ] 可以访问本地 URL

### C. 浏览器验证

1. 打开 **http://localhost:5173**
2. 应该看到登录页面（淡绿色主题）
3. 打开 F12 开发者工具

**检查点**:
- [ ] 页面加载成功
- [ ] 看到登录表单
- [ ] Console 没有红色错误

### D. API 连接验证

在浏览器 Console 中粘贴并运行：

```javascript
// 测试 API 连接
fetch('http://localhost:5000/api/auth/verify', {
  headers: { 'Authorization': 'Bearer test' }
})
.then(r => r.json())
.then(d => console.log(' 后端响应:', d))
.catch(e => console.error(' 错误:', e))
```

**预期结果**:
-  看到来自后端的 JSON 响应
-  即使是 401 错误也说明连接成功

### E. 登录测试

在登录页面：

```
用户名: admin
密码: Admin@123
```

**预期结果**:
-  成功进入仪表板
-  localStorage 保存了 Token
-  页面显示用户名

---

##  预期的完整启动输出

### 后端日志 (应该看到)

```
[nodemon] 3.1.10
[nodemon] to restart at any time, enter `rs`
[nodemon] watching path(s): *.*
[nodemon] watching extensions: ts,json
[nodemon] starting `ts-node src/server.ts`

 Server running on port 5000
 Database connected to beauty_salon
 Express middlewares initialized
 Routes registered: /api/auth, /api/customers, etc.
```

### 前端日志 (应该看到)

```
  VITE v5.4.21  ready in 160 ms

    Local:   http://localhost:5173/
    Network: use --host to expose
```

### 浏览器 Console (应该看到)

```
 API Client initialized
 Auth Context loaded
 App mounted successfully
```

---

##  如果启动失败

### 问题 1: 后端仍然无法编译

**症状**: 仍然看到 TypeScript 错误

**解决**:
```bash
cd backend
rm -r node_modules
npm cache clean --force
npm install
npm run dev
```

### 问题 2: 前端无法连接后端

**症状**: Console 显示连接被拒绝

**检查**:
1. 后端是否真的在运行？
2. 检查端口 5000 是否被占用
3. 检查防火墙设置

```bash
# 查看占用的端口
netstat -ano | findstr :5000
```

### 问题 3: 数据库连接错误

**症状**: 后端崩溃，显示 MySQL 连接错误

**解决**:
```bash
# 1. 检查 MySQL 是否运行
# 2. 检查 .env 配置
cat backend/.env | grep DB_

# 应该显示:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<your_password>
DB_NAME=beauty_salon
```

---

##  成功标志

当您看到以下现象，系统已完全启动 :

1.  后端终端显示 "Server running on port 5000"
2.  前端终端显示 "Vite vX.x.x ready"
3.  浏览器访问 http://localhost:5173 能加载页面
4.  浏览器 Console 没有红色错误
5.  API 连接测试成功响应
6.  能使用 admin/Admin@123 登录

---

##  故障排查流程图

```
系统启动失败?
    |
    ├─→ 后端无法启动?
    │   └─→ 检查 TypeScript 编译错误
    │   └─→ 检查 package.json 是否有效
    │   └─→ 重新安装依赖: npm install
    │
    ├─→ 前端无法启动?
    │   └─→ 检查端口是否被占用
    │   └─→ 使用 --port 5173 指定端口
    │   └─→ 杀死旧进程: taskkill /PID <pid> /F
    │
    ├─→ 无法访问页面?
    │   └─→ 检查 URL: http://localhost:5173
    │   └─→ 检查浏览器 Console 错误
    │   └─→ 清除浏览器缓存
    │
    ├─→ API 连接失败?
    │   └─→ 确认后端在 5000 运行
    │   └─→ 检查 CORS 配置
    │   └─→ 查看后端日志找错误
    │
    └─→ 登录失败?
        └─→ 检查 MySQL 连接
        └─→ 验证测试用户是否存在
        └─→ 查看后端日志找错误
```

---

##  快速命令速查

```bash
# 完整清理和重启
cd backend && rm -rf node_modules && npm install && npm run dev &
sleep 5
cd .. && npm run dev -- --port 5173

# 只重启后端
cd backend && npm run dev

# 只重启前端
npm run dev -- --port 5173

# 查看后端日志
tail -f /path/to/backend.log

# 杀死占用端口 5000 的进程
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# 杀死占用端口 5173 的进程
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# 测试 API
curl http://localhost:5000/api/auth/verify
```

---

##  系统状态

```
修复完成!

┌─────────────────────────┐
│  系统启动状态            │
├─────────────────────────┤
│                         │
│ 后端配置 ...  已修复  │
│ 前端配置 ...  已修复  │
│ 数据库配置 ..  已配置 │
│ 认证系统 ...  已集成  │
│                         │
│  总体状态  可启动!  │
│                         │
└─────────────────────────┘
```

---

**现在您可以按照"现在启动系统"部分的步骤启动系统！** 

预期：5分钟内系统完全启动并可以登录。
