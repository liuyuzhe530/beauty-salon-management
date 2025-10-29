#  系统诊断与故障排除指南

**生成时间**: 2025年10月23日  
**问题**: 数据库连接失败 (ConnectionRefusedError)  
**状态**: 待修复

---

##  **当前问题**

### 错误信息
```
Failed to start server: ConnectionRefusedError [SequelizeConnectionRefusedError]
Code: ECONNREFUSED
Location: MySQL connection to localhost:3306
```

### 原因分析

| 可能原因 | 概率 | 解决方案 |
|---------|------|---------|
| MySQL服务未启动 |  高 | 启动MySQL服务 |
| MySQL端口被占用 |  中 | 检查3306端口 |
| 凭证不正确 |  中 | 验证用户名密码 |
| 防火墙阻止 |  低 | 配置防火墙 |

---

##  **快速诊断检查清单**

### 检查1: MySQL服务状态

**Windows**:
```bash
# 检查MySQL服务是否运行
Get-Service | Select-String mysql

# 如果显示 "Stopped"，启动它
Start-Service MySQL80  # 或对应的MySQL版本

# 验证服务状态
Get-Service MySQL80 | Select-Object Status
```

**Linux/Mac**:
```bash
# 检查MySQL进程
ps aux | grep mysql

# 启动MySQL
sudo systemctl start mysql

# 验证状态
sudo systemctl status mysql
```

### 检查2: 检查MySQL端口

```bash
# Windows - 检查3306端口
netstat -ano | find ":3306"

# Linux/Mac - 检查3306端口
lsof -i :3306
```

### 检查3: 测试MySQL连接

```bash
# 使用mysql客户端测试
mysql -h localhost -u root -p

# 如果连接成功，会进入mysql>提示符
# 输入: SHOW DATABASES;
# 输入: exit 退出
```

### 检查4: 验证.env配置

```bash
# 查看backend/.env文件
cat backend/.env

# 关键配置:
# DB_HOST=localhost (或127.0.0.1)
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=(留空如果没设置密码)
# DB_NAME=beauty_salon
```

---

##  **逐步修复指南**

### 步骤1: 启动MySQL服务

#### Windows 用户

```powershell
# 打开PowerShell (以管理员身份)

# 查看已安装的MySQL服务
Get-Service | Select-String MySQL

# 启动MySQL服务 (替换为实际服务名)
Start-Service MySQL80

# 验证启动成功
Get-Service MySQL80 | Select-Object Status
# 应显示: Status: Running
```

#### Mac 用户 (使用Homebrew)

```bash
# 启动MySQL
brew services start mysql

# 验证状态
brew services list | grep mysql
```

#### Linux 用户 (Ubuntu/Debian)

```bash
# 启动MySQL
sudo systemctl start mysql

# 启用自动启动
sudo systemctl enable mysql

# 验证状态
sudo systemctl status mysql
```

### 步骤2: 创建数据库和用户

```bash
# 连接到MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 验证数据库创建成功
SHOW DATABASES;
# 应该看到 beauty_salon

# 退出
exit
```

### 步骤3: 验证后端配置

```bash
# 查看backend/.env
cd backend
cat .env

# 确保配置正确:
#  DB_HOST=localhost
#  DB_PORT=3306
#  DB_USER=root
#  DB_PASSWORD=(正确的密码)
#  DB_NAME=beauty_salon
```

### 步骤4: 重新启动后端

```bash
# 清理node_modules缓存
cd backend
rm -r node_modules package-lock.json  # 或 rmdir /s node_modules (Windows)

# 重新安装依赖
npm install

# 重新编译
npm run build

# 启动服务器
npm run start

# 预期输出:
# Database connected
# Database synchronized
# Server running on port 3001
```

---

##  **连接测试脚本**

### 创建测试文件 (backend/test-connection.js)

```javascript
// test-connection.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'beauty_salon',
  logging: console.log
});

const testConnection = async () => {
  try {
    console.log(' 测试数据库连接...');
    console.log('配置:');
    console.log('  Host:', process.env.DB_HOST || 'localhost');
    console.log('  Port:', process.env.DB_PORT || '3306');
    console.log('  User:', process.env.DB_USER || 'root');
    console.log('  Database:', process.env.DB_NAME || 'beauty_salon');
    console.log('');
    
    await sequelize.authenticate();
    console.log(' 数据库连接成功！');
    
    // 列出数据库信息
    const [results] = await sequelize.query('SELECT DATABASE() as db');
    console.log(' 当前数据库:', results[0].db);
    
    process.exit(0);
  } catch (error) {
    console.error(' 连接失败:', error.message);
    console.error('');
    console.error('故障排除建议:');
    console.error('1.  检查MySQL服务是否启动');
    console.error('2.  验证.env文件中的数据库配置');
    console.error('3.  检查MySQL用户名和密码');
    console.error('4.  确保数据库已创建');
    process.exit(1);
  }
};

testConnection();
```

### 运行测试

```bash
cd backend
node test-connection.js

# 成功输出示例:
#  测试数据库连接...
# 配置:
#   Host: localhost
#   Port: 3306
#   User: root
#   Database: beauty_salon
# 
#  数据库连接成功！
#  当前数据库: beauty_salon
```

---

##  **端到端功能测试计划**

### 第一轮: 基础连接测试 (完成后进行)

```
 后端启动成功
 数据库连接正常
 健康检查端点通过
```

### 第二轮: 认证测试

```bash
# 测试1: 用户注册
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test123!",
    "confirmPassword": "Test123!",
    "role": "customer"
  }'

# 预期响应: success: true, 返回token

# 测试2: 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "Test123!"
  }'

# 预期响应: success: true, token, user信息
```

### 第三轮: CRUD操作测试

```bash
# 获取token (从登录响应)
TOKEN="your_token_here"

# 测试1: 获取客户列表
curl -X GET http://localhost:3001/api/customers \
  -H "Authorization: Bearer $TOKEN"

# 测试2: 创建客户
curl -X POST http://localhost:3001/api/customers \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com"
  }'

# 测试3: 更新客户
curl -X PUT http://localhost:3001/api/customers/{id} \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "李四"
  }'

# 测试4: 删除客户
curl -X DELETE http://localhost:3001/api/customers/{id} \
  -H "Authorization: Bearer $TOKEN"
```

---

##  **端到端测试检查清单**

### 认证系统 
- [ ] POST /api/auth/register - 新用户注册
- [ ] POST /api/auth/login - 用户登录
- [ ] GET /api/auth/verify - Token验证
- [ ] 错误处理 - 无效凭证

### 客户管理 
- [ ] GET /api/customers - 获取列表
- [ ] POST /api/customers - 创建客户
- [ ] GET /api/customers/:id - 获取详情
- [ ] PUT /api/customers/:id - 更新客户
- [ ] DELETE /api/customers/:id - 删除客户

### 预约管理 
- [ ] GET /api/appointments - 获取列表
- [ ] POST /api/appointments - 创建预约
- [ ] PUT /api/appointments/:id - 更新预约
- [ ] DELETE /api/appointments/:id - 取消预约

### 美容师管理 
- [ ] GET /api/staff - 获取列表
- [ ] POST /api/staff - 添加美容师
- [ ] PUT /api/staff/:id - 更新信息
- [ ] DELETE /api/staff/:id - 移除美容师

### 产品管理 
- [ ] GET /api/products - 获取列表
- [ ] POST /api/products - 创建产品
- [ ] PUT /api/products/:id - 更新产品
- [ ] DELETE /api/products/:id - 删除产品

### 前端集成 
- [ ] 登录页面正常显示
- [ ] API调用成功
- [ ] Token正确保存
- [ ] 数据加载正常

---

##  **性能评估指标**

### 后端性能

```bash
# 响应时间测试
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:3001/api/health

# 应该在 100ms 以内

# 压力测试 (安装 ab)
ab -n 1000 -c 10 http://localhost:3001/api/health
# 目标: 吞吐量 > 100 req/s
```

### 前端性能

```bash
# 打开浏览器DevTools → Performance
# 运行以下操作并记录:
# 1. 页面加载时间
# 2. 登录响应时间 (< 1s)
# 3. 列表加载时间 (< 2s)
# 4. CRUD操作响应时间 (< 1s)
```

---

##  **安全审计检查清单**

### 认证安全 
- [ ] 密码加密 (bcryptjs)
- [ ] JWT Token验证
- [ ] Token过期机制
- [ ] 敏感信息不暴露

### API安全 
- [ ] CORS配置正确
- [ ] SQL注入防护 (Sequelize ORM)
- [ ] 请求验证 (Joi)
- [ ] 错误消息不暴露系统信息

### 数据安全 
- [ ] 数据库加密连接 (可选)
- [ ] 日志不包含敏感信息
- [ ] 权限检查 (RBAC)
- [ ] 审计日志 (可选)

---

##  **部署准备检查清单**

### 代码准备
- [ ] 所有测试通过
- [ ] 没有console.log调试代码
- [ ] 没有硬编码的敏感信息
- [ ] .env文件已配置生产环境

### 环境准备
- [ ] 生产数据库已创建
- [ ] MySQL服务配置好
- [ ] 域名和SSL证书准备
- [ ] 环境变量已配置

### 文档准备
- [ ] API文档完整
- [ ] 部署指南已写
- [ ] 故障排除文档已准备
- [ ] 维护手册已写

### 监控准备
- [ ] 日志收集配置
- [ ] 性能监控工具
- [ ] 错误追踪系统
- [ ] 告警规则设置

---

##  **下一步行动**

### 立即执行
1.  启动MySQL服务
2.  创建beauty_salon数据库
3.  运行test-connection.js验证
4.  npm run start启动后端

### 随后执行
5.  执行端到端测试
6.  进行性能评估
7.  完成安全审计
8.  准备部署

---

##  **获取帮助**

如果遇到问题:

1. **查看错误信息** - 通常包含关键线索
2. **检查日志** - 查看详细的错误堆栈
3. **参考本指南** - 逐步排查问题
4. **查看文档** - BACKEND_STARTUP_TEST.md

---

**最后更新**: 2025年10月23日  
**状态**: 准备诊断  
**下一步**: 启动MySQL并重新测试
