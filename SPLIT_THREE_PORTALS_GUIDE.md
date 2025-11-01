# 🚀 美容院管理系统 - 三端拆分完整指南

## 📋 项目结构概览

```
beauty-salon-management/
├── backend/                          # 后端服务（不变）
│   ├── src/
│   ├── .env
│   └── package.json
│
├── admin-portal/                    # 👑 管理员端应用
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── staff-portal/                    # 👩‍💼 美容师端应用
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
├── customer-app/                    # 👤 客户端应用
│   ├── src/
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── 根目录配置文件
    ├── package.json (根工作空间)
    ├── README.md
    └── SPLIT_THREE_PORTALS_GUIDE.md (本文件)
```

---

## 🎯 三个应用的核心差异

### 管理员端 (Admin Portal)
**端口**: 5173  
**URL**: `http://localhost:5173`  
**功能**:
- ✅ 仪表盘 (Dashboard)
- ✅ 客户管理 (Customer Management)
- ✅ 美容师管理 (Staff)
- ✅ 商城装修 (MallPage)
- ✅ 培训教育 (Training Education)
- ✅ AI助手
- ✅ 健康助手 (Smart Photo Series)

### 美容师端 (Staff Portal)
**端口**: 5174  
**URL**: `http://localhost:5174`  
**功能**:
- ✅ 我的日程 (Dashboard)
- ✅ 我的客户 (Customer Management)
- ✅ 培训学习 (Training Education)
- ✅ 健康助手 (Smart Photo Series)

### 客户端 (Customer App)
**端口**: 5175  
**URL**: `http://localhost:5175`  
**功能**:
- ✅ 上门服务预约 (On-Site Service Booking)
- ✅ 我的预约 (Customer Management)
- ✅ 美容商城 (Beauty Product Mall)
- ✅ 健康助手 (Smart Photo Series)

---

## 🔧 共享的 API 和服务

所有三个应用共享以下文件（内容完全相同）:

### 文件结构
```
src/
├── api/              # API 服务
│   ├── client.ts
│   ├── index.ts
│   └── services/
│       ├── authService.ts
│       ├── customerService.ts
│       ├── staffService.ts
│       ├── appointmentService.ts
│       └── productService.ts
│
├── context/          # React Context
│   └── AuthContext.tsx
│
├── services/         # 业务逻辑服务
│   ├── aiService.ts
│   ├── tongueCoatingAnalysisService.ts
│   ├── healthAssistantAIService.ts
│   └── ...其他服务
│
├── types/            # TypeScript 类型定义
│   └── index.ts
│
├── styles/           # CSS 样式
│   └── globals.css
│
├── hooks/            # 自定义 Hooks
│   ├── useAPI.ts
│   ├── useFetchData.ts
│   └── ...其他hooks
│
└── data/             # 静态数据
    ├── customerData.ts
    ├── staffData.ts
    └── ...其他数据
```

### 共享文件清单
- `src/api/*` - 所有 API 服务
- `src/context/AuthContext.tsx` - 认证 Context
- `src/services/*` - 所有业务逻辑服务
- `src/types/index.ts` - 类型定义
- `src/styles/globals.css` - 全局样式
- `src/hooks/*` - 自定义 Hooks
- `src/data/*` - 静态数据
- `src/main.tsx` - 入口文件
- `src/vite-env.d.ts` - Vite 环境声明

### 三端各自的文件
- `src/App.tsx` - **不同**，根据角色显示不同菜单
- `src/components/` - **大部分相同**，但每个端口只加载需要的组件

---

## 📦 后端 API（保持不变）

后端接口无需任何改动，支持三个前端调用：

```typescript
// 后端 API 端点
POST   /api/auth/login              # 通用登录，根据 role 区分
GET    /api/customers               # 获取客户列表
GET    /api/staff                   # 获取美容师列表
POST   /api/appointments            # 创建预约
GET    /api/products                # 获取商品
POST   /api/upload/image            # 上传图片
// 其他接口...
```

**关键点**：
- 后端根据认证 token 中的 `role` 返回对应权限的数据
- 所有前端在 `src/api/services/authService.ts` 中使用相同的认证逻辑

---

## 🚀 快速启动指南

### 前置条件
1. Node.js >= 16
2. MySQL 数据库运行中
3. 后端服务运行在 `http://localhost:3001`

### 方式1：逐个启动（推荐开发）

**终端1 - 启动后端**:
```powershell
cd E:\xincs\xincs\backend
npm install
npm start
# 输出: Server running on port 3001
```

**终端2 - 启动管理员端**:
```powershell
cd E:\xincs\xincs\admin-portal
npm install
npm run dev
# 输出: VITE v5.0.8  ready in XXX ms
#      ➜  Local:   http://localhost:5173/
```

**终端3 - 启动美容师端**:
```powershell
cd E:\xincs\xincs\staff-portal
npm install
npm run dev
# 输出: ➜  Local:   http://localhost:5174/
```

**终端4 - 启动客户端**:
```powershell
cd E:\xincs\xincs\customer-app
npm install
npm run dev
# 输出: ➜  Local:   http://localhost:5175/
```

### 方式2：使用启动脚本（全部启动）

创建 `launch-all-portals.ps1` 文件：

```powershell
# 启动后端
Start-Process powershell -ArgumentList "cd E:\xincs\xincs\backend; npm start"
Start-Sleep -Seconds 3

# 启动三个前端
Start-Process powershell -ArgumentList "cd E:\xincs\xincs\admin-portal; npm run dev"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "cd E:\xincs\xincs\staff-portal; npm run dev"
Start-Sleep -Seconds 2

Start-Process powershell -ArgumentList "cd E:\xincs\xincs\customer-app; npm run dev"

Write-Host "`n✅ 所有服务已启动!" -ForegroundColor Green
Write-Host "📱 管理员端:  http://localhost:5173" -ForegroundColor Cyan
Write-Host "👩‍💼 美容师端:  http://localhost:5174" -ForegroundColor Cyan
Write-Host "👤 客户端:   http://localhost:5175" -ForegroundColor Cyan
Write-Host "🔧 后端API:  http://localhost:3001" -ForegroundColor Cyan
```

执行：
```powershell
.\launch-all-portals.ps1
```

---

## 🔐 登录凭证示例

| 角色 | 用户名 | 密码 | 访问端口 |
|------|--------|------|---------|
| 管理员 | admin | password123 | 5173 |
| 美容师 | beautician | password123 | 5174 |
| 客户 | customer | password123 | 5175 |

---

## 📝 App.tsx 配置说明

每个应用的 `src/App.tsx` 根据 `userRole` 显示对应菜单：

### admin-portal/src/App.tsx
```typescript
// 仅显示管理员菜单项
const menuItems = {
  admin: [
    { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
    { id: 'customermanagement', label: '客户管理', icon: Users },
    { id: 'staff', label: '美容师', icon: Users },
    { id: 'shop', label: '商城装修', icon: ShoppingBag },
    // ... 更多管理员功能
  ]
}
```

### staff-portal/src/App.tsx
```typescript
// 仅显示美容师菜单项
const menuItems = {
  staff: [
    { id: 'dashboard', label: '我的日程', icon: Users },
    { id: 'customermanagement', label: '我的客户', icon: Users },
    { id: 'training', label: '培训学习', icon: BookOpen },
    // ... 更多美容师功能
  ]
}
```

### customer-app/src/App.tsx
```typescript
// 仅显示客户菜单项
const menuItems = {
  customer: [
    { id: 'onsite-booking', label: '上门服务', icon: Home },
    { id: 'customermanagement', label: '我的预约', icon: Users },
    { id: 'shop', label: '美容商城', icon: ShoppingBag },
    // ... 更多客户功能
  ]
}
```

---

## 🌍 生产环境部署

### 部署到不同的服务器

1. **管理员端** → `admin.beauty-salon.com`
2. **美容师端** → `staff.beauty-salon.com`
3. **客户端** → `app.beauty-salon.com` 或 `customer.beauty-salon.com`
4. **后端API** → `api.beauty-salon.com`

### 修改 API 代理地址

在各应用的 `vite.config.ts` 中修改代理地址：

```typescript
// admin-portal/vite.config.ts
proxy: {
  '/api': {
    target: 'https://api.beauty-salon.com',  // 改为生产地址
    changeOrigin: true
  }
}
```

---

## 🧪 测试三端登录

1. **管理员端** (`http://localhost:5173`)
   - 用户名: admin
   - 密码: password123
   - ✅ 应看到完整的管理功能

2. **美容师端** (`http://localhost:5174`)
   - 用户名: beautician
   - 密码: password123
   - ✅ 应看到美容师专用功能

3. **客户端** (`http://localhost:5175`)
   - 用户名: customer
   - 密码: password123
   - ✅ 应看到客户专用功能

---

## 📚 文件复制清单

### 需要为每个应用复制的文件
- `src/api/` - 完整复制
- `src/context/` - 完整复制
- `src/services/` - 完整复制
- `src/types/` - 完整复制
- `src/styles/` - 完整复制
- `src/hooks/` - 完整复制
- `src/data/` - 完整复制
- `src/main.tsx` - 完整复制
- `src/vite-env.d.ts` - 完整复制

### 各应用特有的文件
- `src/App.tsx` - **根据角色修改**
- `src/components/Navigation.tsx` - **根据角色修改**
- `src/components/BottomNavigation.tsx` - **根据角色修改**
- `src/components/Dashboard.tsx` - **根据角色定制**

---

## ✅ 拆分完成检查清单

- [ ] 创建三个应用目录
- [ ] 复制配置文件 (vite.config.ts, tsconfig.json 等)
- [ ] 复制共享源代码文件
- [ ] 修改各应用的 App.tsx
- [ ] 修改各应用的 Navigation.tsx
- [ ] 修改各应用的 index.html 标题
- [ ] 修改各应用的 package.json 名称
- [ ] 安装三个应用的依赖
- [ ] 启动后端服务
- [ ] 分别启动三个前端应用
- [ ] 测试每个应用的登录和功能

---

## 🐛 常见问题排查

### Q1: 端口被占用
```powershell
# 查看占用的进程
netstat -ano | findstr :5173
# 杀死进程（记住 PID）
taskkill /PID 12345 /F
```

### Q2: API 调用失败
- 检查后端是否运行: `curl http://localhost:3001/api/health`
- 检查 vite.config.ts 中的代理配置
- 检查浏览器控制台的错误信息

### Q3: 登录失败
- 检查数据库连接
- 检查后端 `.env` 配置
- 查看后端日志输出

---

## 📞 支持

如有问题，请查看：
- 各应用的浏览器控制台（F12）
- 后端的终端输出
- 本指南的常见问题部分


