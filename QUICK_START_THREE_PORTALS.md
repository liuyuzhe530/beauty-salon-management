# 🚀 三端应用快速启动指南

## ✅ 已完成的拆分

您的项目已经成功拆分为三个独立的应用：

```
E:\xincs\xincs\
├── backend/                  # 后端服务
├── admin-portal/            # 👑 管理员端 (端口 5173)
├── staff-portal/            # 👩‍💼 美容师端 (端口 5174)  
└── customer-app/            # 👤 客户端 (端口 5175)
```

---

## 📱 三个应用的功能

| 应用 | 端口 | 主要功能 |
|------|------|---------|
| **管理员端** | 5173 | 仪表盘、客户管理、美容师管理、商城装修、AI助手 |
| **美容师端** | 5174 | 我的日程、我的客户、培训学习、健康助手 |
| **客户端** | 5175 | 上门服务、我的预约、美容商城、健康助手 |

---

## 🎯 启动步骤

### 步骤1️⃣ 安装依赖（仅第一次需要）

在每个应用目录中运行 npm install：

```powershell
# 终端1 - 管理员端
cd E:\xincs\xincs\admin-portal
npm install

# 终端2 - 美容师端
cd E:\xincs\xincs\staff-portal
npm install

# 终端3 - 客户端
cd E:\xincs\xincs\customer-app
npm install
```

### 步骤2️⃣ 启动后端

```powershell
# 终端1 (后端)
cd E:\xincs\xincs\backend
npm start

# 输出应该显示:
# Server running on port 3001
# Database connected
# Database synchronized
```

### 步骤3️⃣ 启动三个前端

**打开3个新的PowerShell终端**

**终端2 - 启动管理员端**:
```powershell
cd E:\xincs\xincs\admin-portal
npm run dev

# 输出: 
# VITE v5.0.8 ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

**终端3 - 启动美容师端**:
```powershell
cd E:\xincs\xincs\staff-portal
npm run dev

# 输出:
# VITE v5.0.8 ready in XXX ms
# ➜  Local:   http://localhost:5174/
```

**终端4 - 启动客户端**:
```powershell
cd E:\xincs\xincs\customer-app
npm run dev

# 输出:
# VITE v5.0.8 ready in XXX ms
# ➜  Local:   http://localhost:5175/
```

---

## 🌐 访问应用

启动完成后，在浏览器中打开：

| 应用 | 地址 |
|------|------|
| 管理员端 | http://localhost:5173 |
| 美容师端 | http://localhost:5174 |
| 客户端 | http://localhost:5175 |

---

## 🔐 测试登录

| 应用 | 用户名 | 密码 |
|------|--------|------|
| 管理员端 | admin | password123 |
| 美容师端 | beautician | password123 |
| 客户端 | customer | password123 |

登录后，每个应用会显示相应角色的功能菜单。

---

## 📊 API 端点

所有三个应用都调用同一个后端 API：

```
http://localhost:3001/api/*
```

不需要任何修改，后端会根据登录用户的角色返回对应的数据。

---

## 🛠️ 常见问题

### Q1: 如何关闭所有应用？

在各个终端中按 `Ctrl+C` 停止服务。

### Q2: 端口被占用怎么办？

```powershell
# 查看占用的进程
netstat -ano | findstr :5173

# 找到 PID 后杀死进程
taskkill /PID <PID> /F

# 例如:
taskkill /PID 12345 /F
```

### Q3: 如何修改 API 地址？

编辑各应用的 `vite.config.ts` 文件中的代理地址：

```typescript
// admin-portal/vite.config.ts
proxy: {
  '/api': {
    target: 'http://your-api-address:3001',  // 改这里
    changeOrigin: true
  }
}
```

### Q4: 如何只运行一个应用？

可以单独运行任何一个应用，只需确保后端服务在运行：

```powershell
cd admin-portal
npm run dev
```

---

## 📁 文件结构说明

每个应用的结构相同：

```
admin-portal/
├── src/
│   ├── components/         # React 组件（三端共享）
│   ├── context/           # React Context（三端共享）
│   ├── api/               # API 服务（三端共享）
│   ├── services/          # 业务逻辑（三端共享）
│   ├── types/             # TypeScript 类型（三端共享）
│   ├── styles/            # CSS 样式（三端共享）
│   ├── hooks/             # 自定义 Hooks（三端共享）
│   ├── data/              # 静态数据（三端共享）
│   ├── App.tsx            # 主应用文件（★ 各端不同）
│   ├── main.tsx           # 入口文件（三端共享）
│   └── vite-env.d.ts      # Vite 类型声明（三端共享）
├── index.html             # HTML 模板（★ 各端不同标题）
├── vite.config.ts         # Vite 配置（★ 各端端口不同）
├── tailwind.config.js     # Tailwind 配置（三端相同）
├── tsconfig.json          # TypeScript 配置（三端相同）
└── package.json           # 包配置（三端不同 name）
```

**★ 标注的文件** 是各应用特定的，其他都是三端共享的代码。

---

## ✨ 优势

✅ **代码共享**: 所有业务逻辑、API、类型定义都是共享的  
✅ **独立部署**: 三个应用可以部署到不同的服务器  
✅ **易于维护**: API 修改后，三端自动同步更新  
✅ **性能优化**: 每个应用只加载需要的功能  
✅ **独立开发**: 团队可以分工开发不同的端  

---

## 📞 需要帮助？

查看详细文档：
- `SPLIT_THREE_PORTALS_GUIDE.md` - 完整的拆分说明
- 各应用的 `README.md`（如果存在）


