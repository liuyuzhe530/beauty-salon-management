# 🚨 紧急修复指南

**日期**: 2025-10-22  
**问题**: 主页打不开，后端 package.json 格式错误  
**状态**: ✅ 已修复

---

## 🔧 已执行的修复

### 1. 修复后端 package.json

**问题**: package.json 有重复的 JSON 对象，导致解析错误

**修复**: 
- ✅ 删除了所有重复的 JSON 对象
- ✅ 恢复成单一有效的 JSON 文件
- ✅ 保留所有依赖和脚本配置

**文件**: `backend/package.json` (已修复)

---

## 🚀 启动步骤 (现在应该可以工作了)

### 方式 1: 使用两个终端 (推荐)

**终端 1 - 后端服务器**:
```bash
cd E:\xincs\xincs\backend
npm run dev
```

**预期输出**:
```
✓ Server running on port 5000
✓ Database connected to beauty_salon
```

**终端 2 - 前端应用**:
```bash
cd E:\xincs\xincs
npm run dev
```

**预期输出**:
```
✓ Vite v5.x.x ready in xxx ms
➜ Local: http://localhost:5173/
```

### 方式 2: 访问前端

打开浏览器访问: **http://localhost:5173**

---

## ✅ 验证清单

运行以下检查，确保系统正常：

### 后端检查
- [ ] 后端服务器在 localhost:5000 运行
- [ ] 没有错误日志
- [ ] 数据库已连接

### 前端检查  
- [ ] 前端在 localhost:5173 运行
- [ ] 页面加载成功
- [ ] 可以看到登录表单

### 连接检查
- [ ] 打开浏览器控制台 (F12)
- [ ] 输入以下代码测试:

```javascript
fetch('http://localhost:5000/api/auth/verify', {
  headers: { 'Authorization': 'Bearer test' }
})
.then(r => r.json())
.then(d => console.log('✅ 连接成功:', d))
.catch(e => console.error('❌ 连接失败:', e))
```

**预期**: 应该看到来自后端的响应 (即使是 401 错误也说明连接成功)

---

## 🐛 如果仍然有问题

### 问题 1: 后端启动失败

**症状**: npm run dev 出错

**解决**:
```bash
# 1. 清除 node_modules 和 package-lock.json
cd backend
rm -r node_modules
rm package-lock.json

# 2. 重新安装依赖
npm install

# 3. 再次尝试启动
npm run dev
```

### 问题 2: 前端在错误的端口

**症状**: 前端在 localhost:3000 或 localhost:3001

**解决**:
```bash
# 1. 杀死占用端口的进程
netstat -ano | findstr :5173  # 查找占用端口 5173 的进程
taskkill /PID <PID> /F        # 关闭进程

# 2. 或者配置使用特定端口
npm run dev -- --port 5173
```

### 问题 3: 数据库连接错误

**症状**: "Error: connect ECONNREFUSED 127.0.0.1:3306"

**解决**:
```bash
# 1. 检查 MySQL 是否运行
# 2. 检查 backend/.env 配置:
cat backend/.env | grep DB_

# 3. 确保配置正确:
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=<你的密码>
DB_NAME=beauty_salon
```

### 问题 4: CORS 错误

**症状**: 控制台显示 CORS 错误

**解决**:
```bash
# 检查 backend/.env
cat backend/.env | grep CORS

# 应该包含:
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

---

## 📊 系统状态检查

### 检查后端是否运行

```bash
# Windows PowerShell
curl http://localhost:5000/api

# 或者使用浏览器访问
http://localhost:5000/health
```

### 检查前端是否运行

```bash
# 浏览器访问
http://localhost:5173
```

---

## 🔍 诊断命令

### 查看后端日志

```bash
# 在后端终端中，应该看到:
[HH:MM:SS] Server running on port 5000
[HH:MM:SS] Database connected
[HH:MM:SS] POST /api/auth/login - 200 OK
```

### 查看前端编译

```bash
# 在前端终端中，应该看到:
✓ Vite v5.x.x ready
✓ Network: use --host to expose
```

### 检查浏览器控制台

打开 F12，进入 Console 标签：
- ✅ 没有红色错误
- ✅ 看得到 API 请求
- ✅ 看得到认证信息

---

## 💾 修复记录

| 时间 | 问题 | 修复 | 状态 |
|------|------|------|------|
| 2025-10-22 | backend/package.json 重复 | 删除重复内容 | ✅ |
| 2025-10-22 | 后端无法启动 | npm install 重新安装 | ✅ |

---

## 📞 快速命令参考

```bash
# 重新安装所有依赖
npm install && cd backend && npm install && cd ..

# 启动完整系统
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
npm run dev

# 清理并重新开始
rm -r node_modules backend/node_modules
rm package-lock.json backend/package-lock.json
npm install && cd backend && npm install && cd ..

# 测试 API 连接
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'
```

---

## ✨ 成功标志

当您看到以下现象时，系统已正常运行 ✅:

1. ✅ 后端终端显示 "Server running on port 5000"
2. ✅ 前端终端显示 "Vite vX.x.x ready"
3. ✅ 浏览器访问 http://localhost:5173 能加载页面
4. ✅ 可以在浏览器 Console 中成功调用 API
5. ✅ localStorage 能保存 Token 和用户信息

---

**现在系统应该已经修复！** 🚀

请按照上面的启动步骤重新启动系统，然后访问 http://localhost:5173

如果仍有问题，请查看"如果仍然有问题"部分的诊断步骤。
