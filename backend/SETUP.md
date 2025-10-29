# 后端项目快速启动指南

##  前置要求

在启动后端项目之前，请确保已安装以下软件：

- **Node.js** >= 16.0.0 (推荐 18 LTS)
  - 下载: https://nodejs.org/
  - 验证: `node --version`

- **MySQL** >= 5.7
  - 下载: https://dev.mysql.com/downloads/mysql/
  - 或使用 Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0`

##  快速启动（5分钟）

### 第1步：创建项目目录

```bash
# 进入美容院管理系统项目目录
cd /path/to/xincs/xincs

# 后端文件已创建在 backend/ 文件夹中
cd backend
```

### 第2步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下信息：
# - DB_HOST: localhost (MySQL服务器地址)
# - DB_PORT: 3306 (MySQL端口)
# - DB_USER: root (MySQL用户名)
# - DB_PASSWORD: password (MySQL密码)
# - JWT_SECRET: 生成一个随机字符串用于JWT加密
```

**生成强密钥命令：**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

### 第3步：安装依赖

```bash
npm install
```

预期耗时：2-3 分钟

### 第4步：验证MySQL连接

确保MySQL服务正在运行：

```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
# 在"服务"中检查 MySQL 服务状态
# 或运行: mysql.exe -u root -p

# Docker
docker ps | grep mysql
```

### 第5步：启动服务器

```bash
npm run dev
```

**成功启动的标志：**
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    美容院管理系统 API 服务已启动                          ║
║                                                            ║
║   服务器地址: http://localhost:5000                        ║
║   环境: development                                        ║
║   数据库: beauty_salon                                     ║
║                                                            ║
║   API 文档: http://localhost:5000/api                      ║
║   健康检查: http://localhost:5000/health                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

##  验证服务器

### 在浏览器中测试：

1. **健康检查**：
   ```
   GET http://localhost:5000/health
   ```

2. **API信息**：
   ```
   GET http://localhost:5000/api
   ```

### 使用curl测试：

```bash
# 健康检查
curl http://localhost:5000/health

# 获取API信息
curl http://localhost:5000/api
```

##  项目结构说明

```
backend/
├── src/
│   ├── config/              # 配置模块
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── models/          # 数据模型（User等）
│   │   ├── connection.ts    # 连接管理
│   │   ├── init.ts          # 初始化脚本
│   │   └── seed.ts          # 测试数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件 
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证API 
│   │   ├── users.ts         # 用户API 
│   │   ├── customers.ts     # 客户API 
│   │   ├── appointments.ts  # 预约API 
│   │   ├── staff.ts         # 美容师API 
│   │   └── products.ts      # 产品API 
│   ├── services/            # 业务逻辑层 
│   ├── controllers/         # 控制器层 
│   ├── types/              # 类型定义 
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件 
├── .env.example            # 环境变量示例 
├── package.json            # 项目配置 
├── tsconfig.json           # TypeScript配置 
└── README.md               # 项目文档 

 = 已完成
 = 待开发
```

## ️ 常用命令

```bash
# 开发模式（自动重启）
npm run dev

# 编译TypeScript
npm run build

# 生产模式运行
npm start

# 初始化数据库
npm run db:init

# 填充示例数据
npm run db:seed

# 代码检查
npm run lint

# 运行测试
npm test
```

## ️ 常见问题

### Q1: 启动时出现"数据库连接失败"
**解决方案：**
- 检查MySQL是否正在运行
- 验证 `.env` 中的数据库配置是否正确
- 确保用户有权限创建数据库

```bash
# 测试MySQL连接
mysql -h localhost -u root -p
```

### Q2: Port 5000 已被占用
**解决方案：**
- 修改 `.env` 中的 PORT 为其他端口（如 5001）
- 或杀死占用该端口的进程

```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Q3: npm install 速度很慢
**解决方案：**
```bash
# 使用淘宝npm镜像
npm config set registry https://registry.npmmirror.com

# 恢复默认镜像
npm config set registry https://registry.npmjs.org/
```

### Q4: TypeScript编译错误
**解决方案：**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 或编译检查
npm run build
```

##  下一步

1.  后端框架搭建完成
2.  **下一步：实现认证API** (POST /api/auth/login, /api/auth/register)
3.  **然后：实现数据库模型和CRUD API**
4.  **最后：前端集成**

##  需要帮助？

遇到问题可以：
1. 查看 `/backend/README.md` 详细文档
2. 检查 `src/server.ts` 中的错误日志
3. 查看 `.env` 配置是否正确

---

**祝您开发愉快！** 



##  前置要求

在启动后端项目之前，请确保已安装以下软件：

- **Node.js** >= 16.0.0 (推荐 18 LTS)
  - 下载: https://nodejs.org/
  - 验证: `node --version`

- **MySQL** >= 5.7
  - 下载: https://dev.mysql.com/downloads/mysql/
  - 或使用 Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0`

##  快速启动（5分钟）

### 第1步：创建项目目录

```bash
# 进入美容院管理系统项目目录
cd /path/to/xincs/xincs

# 后端文件已创建在 backend/ 文件夹中
cd backend
```

### 第2步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下信息：
# - DB_HOST: localhost (MySQL服务器地址)
# - DB_PORT: 3306 (MySQL端口)
# - DB_USER: root (MySQL用户名)
# - DB_PASSWORD: password (MySQL密码)
# - JWT_SECRET: 生成一个随机字符串用于JWT加密
```

**生成强密钥命令：**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

### 第3步：安装依赖

```bash
npm install
```

预期耗时：2-3 分钟

### 第4步：验证MySQL连接

确保MySQL服务正在运行：

```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
# 在"服务"中检查 MySQL 服务状态
# 或运行: mysql.exe -u root -p

# Docker
docker ps | grep mysql
```

### 第5步：启动服务器

```bash
npm run dev
```

**成功启动的标志：**
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    美容院管理系统 API 服务已启动                          ║
║                                                            ║
║   服务器地址: http://localhost:5000                        ║
║   环境: development                                        ║
║   数据库: beauty_salon                                     ║
║                                                            ║
║   API 文档: http://localhost:5000/api                      ║
║   健康检查: http://localhost:5000/health                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

##  验证服务器

### 在浏览器中测试：

1. **健康检查**：
   ```
   GET http://localhost:5000/health
   ```

2. **API信息**：
   ```
   GET http://localhost:5000/api
   ```

### 使用curl测试：

```bash
# 健康检查
curl http://localhost:5000/health

# 获取API信息
curl http://localhost:5000/api
```

##  项目结构说明

```
backend/
├── src/
│   ├── config/              # 配置模块
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── models/          # 数据模型（User等）
│   │   ├── connection.ts    # 连接管理
│   │   ├── init.ts          # 初始化脚本
│   │   └── seed.ts          # 测试数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件 
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证API 
│   │   ├── users.ts         # 用户API 
│   │   ├── customers.ts     # 客户API 
│   │   ├── appointments.ts  # 预约API 
│   │   ├── staff.ts         # 美容师API 
│   │   └── products.ts      # 产品API 
│   ├── services/            # 业务逻辑层 
│   ├── controllers/         # 控制器层 
│   ├── types/              # 类型定义 
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件 
├── .env.example            # 环境变量示例 
├── package.json            # 项目配置 
├── tsconfig.json           # TypeScript配置 
└── README.md               # 项目文档 

 = 已完成
 = 待开发
```

## ️ 常用命令

```bash
# 开发模式（自动重启）
npm run dev

# 编译TypeScript
npm run build

# 生产模式运行
npm start

# 初始化数据库
npm run db:init

# 填充示例数据
npm run db:seed

# 代码检查
npm run lint

# 运行测试
npm test
```

## ️ 常见问题

### Q1: 启动时出现"数据库连接失败"
**解决方案：**
- 检查MySQL是否正在运行
- 验证 `.env` 中的数据库配置是否正确
- 确保用户有权限创建数据库

```bash
# 测试MySQL连接
mysql -h localhost -u root -p
```

### Q2: Port 5000 已被占用
**解决方案：**
- 修改 `.env` 中的 PORT 为其他端口（如 5001）
- 或杀死占用该端口的进程

```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Q3: npm install 速度很慢
**解决方案：**
```bash
# 使用淘宝npm镜像
npm config set registry https://registry.npmmirror.com

# 恢复默认镜像
npm config set registry https://registry.npmjs.org/
```

### Q4: TypeScript编译错误
**解决方案：**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 或编译检查
npm run build
```

##  下一步

1.  后端框架搭建完成
2.  **下一步：实现认证API** (POST /api/auth/login, /api/auth/register)
3.  **然后：实现数据库模型和CRUD API**
4.  **最后：前端集成**

##  需要帮助？

遇到问题可以：
1. 查看 `/backend/README.md` 详细文档
2. 检查 `src/server.ts` 中的错误日志
3. 查看 `.env` 配置是否正确

---

**祝您开发愉快！** 



##  前置要求

在启动后端项目之前，请确保已安装以下软件：

- **Node.js** >= 16.0.0 (推荐 18 LTS)
  - 下载: https://nodejs.org/
  - 验证: `node --version`

- **MySQL** >= 5.7
  - 下载: https://dev.mysql.com/downloads/mysql/
  - 或使用 Docker: `docker run --name mysql -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0`

##  快速启动（5分钟）

### 第1步：创建项目目录

```bash
# 进入美容院管理系统项目目录
cd /path/to/xincs/xincs

# 后端文件已创建在 backend/ 文件夹中
cd backend
```

### 第2步：配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下信息：
# - DB_HOST: localhost (MySQL服务器地址)
# - DB_PORT: 3306 (MySQL端口)
# - DB_USER: root (MySQL用户名)
# - DB_PASSWORD: password (MySQL密码)
# - JWT_SECRET: 生成一个随机字符串用于JWT加密
```

**生成强密钥命令：**
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object {Get-Random -Maximum 256}))
```

### 第3步：安装依赖

```bash
npm install
```

预期耗时：2-3 分钟

### 第4步：验证MySQL连接

确保MySQL服务正在运行：

```bash
# Linux/Mac
sudo systemctl status mysql

# Windows
# 在"服务"中检查 MySQL 服务状态
# 或运行: mysql.exe -u root -p

# Docker
docker ps | grep mysql
```

### 第5步：启动服务器

```bash
npm run dev
```

**成功启动的标志：**
```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    美容院管理系统 API 服务已启动                          ║
║                                                            ║
║   服务器地址: http://localhost:5000                        ║
║   环境: development                                        ║
║   数据库: beauty_salon                                     ║
║                                                            ║
║   API 文档: http://localhost:5000/api                      ║
║   健康检查: http://localhost:5000/health                   ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

##  验证服务器

### 在浏览器中测试：

1. **健康检查**：
   ```
   GET http://localhost:5000/health
   ```

2. **API信息**：
   ```
   GET http://localhost:5000/api
   ```

### 使用curl测试：

```bash
# 健康检查
curl http://localhost:5000/health

# 获取API信息
curl http://localhost:5000/api
```

##  项目结构说明

```
backend/
├── src/
│   ├── config/              # 配置模块
│   │   ├── database.ts      # 数据库配置
│   │   ├── jwt.ts           # JWT配置
│   │   └── env.ts           # 环境变量
│   ├── database/
│   │   ├── models/          # 数据模型（User等）
│   │   ├── connection.ts    # 连接管理
│   │   ├── init.ts          # 初始化脚本
│   │   └── seed.ts          # 测试数据
│   ├── middleware/
│   │   ├── auth.ts          # 认证中间件 
│   │   ├── errorHandler.ts  # 错误处理
│   │   └── validation.ts    # 数据验证
│   ├── routes/
│   │   ├── auth.ts          # 认证API 
│   │   ├── users.ts         # 用户API 
│   │   ├── customers.ts     # 客户API 
│   │   ├── appointments.ts  # 预约API 
│   │   ├── staff.ts         # 美容师API 
│   │   └── products.ts      # 产品API 
│   ├── services/            # 业务逻辑层 
│   ├── controllers/         # 控制器层 
│   ├── types/              # 类型定义 
│   ├── utils/              # 工具函数
│   └── server.ts           # 服务器主文件 
├── .env.example            # 环境变量示例 
├── package.json            # 项目配置 
├── tsconfig.json           # TypeScript配置 
└── README.md               # 项目文档 

 = 已完成
 = 待开发
```

## ️ 常用命令

```bash
# 开发模式（自动重启）
npm run dev

# 编译TypeScript
npm run build

# 生产模式运行
npm start

# 初始化数据库
npm run db:init

# 填充示例数据
npm run db:seed

# 代码检查
npm run lint

# 运行测试
npm test
```

## ️ 常见问题

### Q1: 启动时出现"数据库连接失败"
**解决方案：**
- 检查MySQL是否正在运行
- 验证 `.env` 中的数据库配置是否正确
- 确保用户有权限创建数据库

```bash
# 测试MySQL连接
mysql -h localhost -u root -p
```

### Q2: Port 5000 已被占用
**解决方案：**
- 修改 `.env` 中的 PORT 为其他端口（如 5001）
- 或杀死占用该端口的进程

```bash
# Linux/Mac
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Q3: npm install 速度很慢
**解决方案：**
```bash
# 使用淘宝npm镜像
npm config set registry https://registry.npmmirror.com

# 恢复默认镜像
npm config set registry https://registry.npmjs.org/
```

### Q4: TypeScript编译错误
**解决方案：**
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 或编译检查
npm run build
```

##  下一步

1.  后端框架搭建完成
2.  **下一步：实现认证API** (POST /api/auth/login, /api/auth/register)
3.  **然后：实现数据库模型和CRUD API**
4.  **最后：前端集成**

##  需要帮助？

遇到问题可以：
1. 查看 `/backend/README.md` 详细文档
2. 检查 `src/server.ts` 中的错误日志
3. 查看 `.env` 配置是否正确

---

**祝您开发愉快！** 








