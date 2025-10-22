# 美容院管理系统 - 后端API服务

## 项目简介

这是美容院管理系统的后端API服务，提供所有业务逻辑和数据管理功能。

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **加密**: bcryptjs
- **环境管理**: dotenv

## 快速开始

### 1. 环境配置

创建 `.env` 文件，复制以下内容并填入实际配置：

```env
# 服务器配置
NODE_ENV=development
PORT=5000
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=beauty_salon

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# 日志
LOG_LEVEL=debug

# CORS配置
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

确保MySQL正在运行，然后执行：

```bash
npm run db:init    # 创建数据库和表
npm run db:seed    # 填充示例数据（可选）
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

## 项目结构

```
backend/
├── src/
│   ├── config/              # 配置文件
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── connection.ts    # 数据库连接
│   │   ├── models/          # Sequelize模型
│   │   ├── init.ts          # 数据库初始化脚本
│   │   └── seed.ts          # 示例数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证路由
│   │   ├── users.ts         # 用户管理
│   │   ├── customers.ts     # 客户管理
│   │   ├── appointments.ts  # 预约管理
│   │   ├── staff.ts         # 美容师管理
│   │   └── products.ts      # 产品管理
│   ├── services/            # 业务逻辑
│   ├── controllers/         # 控制器
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}

Response: { token, user }
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response: { token, user }
```

#### 验证Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>

Response: { valid: true, user }
```

### 核心资源

所有资源API遵循RESTful规范：

- `GET /api/customers` - 获取客户列表
- `POST /api/customers` - 创建客户
- `GET /api/customers/:id` - 获取客户详情
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户

同样适用于其他资源：
- `/api/appointments` - 预约
- `/api/staff` - 美容师
- `/api/products` - 产品
- `/api/users` - 用户管理

## 命令列表

```bash
# 开发
npm run dev          # 启动开发服务器（hot-reload）
npm run build        # 编译TypeScript

# 生产
npm start            # 启动生产服务器
npm run build        # 编译

# 数据库
npm run db:init      # 初始化数据库
npm run db:seed      # 填充示例数据

# 代码质量
npm run lint         # 代码检查
npm test             # 运行测试

# 清理
rm -rf dist node_modules  # 完全清理
npm install          # 重新安装
```

## 数据库配置

### MySQL 本地设置

1. 安装 MySQL
2. 启动 MySQL 服务
3. 创建用户（可选）：
   ```sql
   CREATE USER 'beauty_admin'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON beauty_salon.* TO 'beauty_admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 常见问题

### Q: 如何连接到远程数据库？
A: 修改 `.env` 文件中的 `DB_HOST` 和其他数据库配置

### Q: 如何改变默认端口？
A: 修改 `.env` 文件中的 `PORT`

### Q: 如何启用生产模式？
A: 设置 `NODE_ENV=production`

## 下一步

1. ✅ 后端框架搭建
2. ⏳ 数据库Schema设计
3. ⏳ 认证系统实现
4. ⏳ 核心API开发
5. ⏳ 前端集成

## 许可证

MIT


## 项目简介

这是美容院管理系统的后端API服务，提供所有业务逻辑和数据管理功能。

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **加密**: bcryptjs
- **环境管理**: dotenv

## 快速开始

### 1. 环境配置

创建 `.env` 文件，复制以下内容并填入实际配置：

```env
# 服务器配置
NODE_ENV=development
PORT=5000
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=beauty_salon

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# 日志
LOG_LEVEL=debug

# CORS配置
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

确保MySQL正在运行，然后执行：

```bash
npm run db:init    # 创建数据库和表
npm run db:seed    # 填充示例数据（可选）
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

## 项目结构

```
backend/
├── src/
│   ├── config/              # 配置文件
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── connection.ts    # 数据库连接
│   │   ├── models/          # Sequelize模型
│   │   ├── init.ts          # 数据库初始化脚本
│   │   └── seed.ts          # 示例数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证路由
│   │   ├── users.ts         # 用户管理
│   │   ├── customers.ts     # 客户管理
│   │   ├── appointments.ts  # 预约管理
│   │   ├── staff.ts         # 美容师管理
│   │   └── products.ts      # 产品管理
│   ├── services/            # 业务逻辑
│   ├── controllers/         # 控制器
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}

Response: { token, user }
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response: { token, user }
```

#### 验证Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>

Response: { valid: true, user }
```

### 核心资源

所有资源API遵循RESTful规范：

- `GET /api/customers` - 获取客户列表
- `POST /api/customers` - 创建客户
- `GET /api/customers/:id` - 获取客户详情
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户

同样适用于其他资源：
- `/api/appointments` - 预约
- `/api/staff` - 美容师
- `/api/products` - 产品
- `/api/users` - 用户管理

## 命令列表

```bash
# 开发
npm run dev          # 启动开发服务器（hot-reload）
npm run build        # 编译TypeScript

# 生产
npm start            # 启动生产服务器
npm run build        # 编译

# 数据库
npm run db:init      # 初始化数据库
npm run db:seed      # 填充示例数据

# 代码质量
npm run lint         # 代码检查
npm test             # 运行测试

# 清理
rm -rf dist node_modules  # 完全清理
npm install          # 重新安装
```

## 数据库配置

### MySQL 本地设置

1. 安装 MySQL
2. 启动 MySQL 服务
3. 创建用户（可选）：
   ```sql
   CREATE USER 'beauty_admin'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON beauty_salon.* TO 'beauty_admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 常见问题

### Q: 如何连接到远程数据库？
A: 修改 `.env` 文件中的 `DB_HOST` 和其他数据库配置

### Q: 如何改变默认端口？
A: 修改 `.env` 文件中的 `PORT`

### Q: 如何启用生产模式？
A: 设置 `NODE_ENV=production`

## 下一步

1. ✅ 后端框架搭建
2. ⏳ 数据库Schema设计
3. ⏳ 认证系统实现
4. ⏳ 核心API开发
5. ⏳ 前端集成

## 许可证

MIT


## 项目简介

这是美容院管理系统的后端API服务，提供所有业务逻辑和数据管理功能。

## 技术栈

- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: MySQL
- **ORM**: Sequelize
- **认证**: JWT (JSON Web Token)
- **加密**: bcryptjs
- **环境管理**: dotenv

## 快速开始

### 1. 环境配置

创建 `.env` 文件，复制以下内容并填入实际配置：

```env
# 服务器配置
NODE_ENV=development
PORT=5000
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=beauty_salon

# JWT配置
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d

# 日志
LOG_LEVEL=debug

# CORS配置
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 2. 安装依赖

```bash
npm install
```

### 3. 初始化数据库

确保MySQL正在运行，然后执行：

```bash
npm run db:init    # 创建数据库和表
npm run db:seed    # 填充示例数据（可选）
```

### 4. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

## 项目结构

```
backend/
├── src/
│   ├── config/              # 配置文件
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── connection.ts    # 数据库连接
│   │   ├── models/          # Sequelize模型
│   │   ├── init.ts          # 数据库初始化脚本
│   │   └── seed.ts          # 示例数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证路由
│   │   ├── users.ts         # 用户管理
│   │   ├── customers.ts     # 客户管理
│   │   ├── appointments.ts  # 预约管理
│   │   ├── staff.ts         # 美容师管理
│   │   └── products.ts      # 产品管理
│   ├── services/            # 业务逻辑
│   ├── controllers/         # 控制器
│   ├── types/              # TypeScript类型定义
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件
├── .env.example            # 环境变量示例
├── package.json
├── tsconfig.json
└── README.md
```

## API 文档

### 认证相关

#### 用户注册
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@example.com",
  "password": "password123",
  "role": "admin"
}

Response: { token, user }
```

#### 用户登录
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}

Response: { token, user }
```

#### 验证Token
```
GET /api/auth/verify
Headers: Authorization: Bearer <token>

Response: { valid: true, user }
```

### 核心资源

所有资源API遵循RESTful规范：

- `GET /api/customers` - 获取客户列表
- `POST /api/customers` - 创建客户
- `GET /api/customers/:id` - 获取客户详情
- `PUT /api/customers/:id` - 更新客户
- `DELETE /api/customers/:id` - 删除客户

同样适用于其他资源：
- `/api/appointments` - 预约
- `/api/staff` - 美容师
- `/api/products` - 产品
- `/api/users` - 用户管理

## 命令列表

```bash
# 开发
npm run dev          # 启动开发服务器（hot-reload）
npm run build        # 编译TypeScript

# 生产
npm start            # 启动生产服务器
npm run build        # 编译

# 数据库
npm run db:init      # 初始化数据库
npm run db:seed      # 填充示例数据

# 代码质量
npm run lint         # 代码检查
npm test             # 运行测试

# 清理
rm -rf dist node_modules  # 完全清理
npm install          # 重新安装
```

## 数据库配置

### MySQL 本地设置

1. 安装 MySQL
2. 启动 MySQL 服务
3. 创建用户（可选）：
   ```sql
   CREATE USER 'beauty_admin'@'localhost' IDENTIFIED BY 'password123';
   GRANT ALL PRIVILEGES ON beauty_salon.* TO 'beauty_admin'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 常见问题

### Q: 如何连接到远程数据库？
A: 修改 `.env` 文件中的 `DB_HOST` 和其他数据库配置

### Q: 如何改变默认端口？
A: 修改 `.env` 文件中的 `PORT`

### Q: 如何启用生产模式？
A: 设置 `NODE_ENV=production`

## 下一步

1. ✅ 后端框架搭建
2. ⏳ 数据库Schema设计
3. ⏳ 认证系统实现
4. ⏳ 核心API开发
5. ⏳ 前端集成

## 许可证

MIT







