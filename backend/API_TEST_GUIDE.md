# 认证API测试指南

##  快速开始

启动服务器后，可以使用以下方式测试认证API：

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

---

##  认证API端点

### 1. 用户注册
**端点**: `POST /api/auth/register`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "admin"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "email": "string (必填)",
  "password": "string (必填)",
  "confirmPassword": "string (必填)",
  "role": "admin | staff | customer (可选，默认 customer)"
}
```

#### 成功响应 (201)
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "用户名已存在",
  "code": "USERNAME_EXISTS",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 2. 用户登录
**端点**: `POST /api/auth/login`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 3. 验证Token
**端点**: `GET /api/auth/verify`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "令牌有效",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 4. 获取当前用户信息
**端点**: `GET /api/auth/me`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 5. 修改密码
**端点**: `POST /api/auth/change-password`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

#### 请求体
```json
{
  "oldPassword": "string (必填)",
  "newPassword": "string (必填)",
  "confirmPassword": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "密码修改成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 6. 登出
**端点**: `POST /api/auth/logout`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登出成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

##  完整测试流程

### 步骤1: 注册新用户
```bash
TOKEN_AND_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123",
    "role": "customer"
  }')

echo $TOKEN_AND_RESPONSE | jq '.'
```

### 步骤2: 从响应中提取Token
```bash
TOKEN=$(echo $TOKEN_AND_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
```

### 步骤3: 用Token验证
```bash
curl -s -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤4: 获取用户信息
```bash
curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤5: 修改密码
```bash
curl -s -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "oldPassword": "Test@123",
    "newPassword": "NewTest@123",
    "confirmPassword": "NewTest@123"
  }' | jq '.'
```

### 步骤6: 用新密码登录
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "NewTest@123"
  }' | jq '.'
```

---

##  Postman导入

### 创建Postman Collection

1. 在Postman中创建新的Collection
2. 添加以下请求：

**Environment Variables (在Postman中设置)**
```
url: http://localhost:5000
token: (从登录响应中复制)
```

**请求1: 注册**
- Method: POST
- URL: {{url}}/api/auth/register
- Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123",
  "confirmPassword": "Admin@123",
  "role": "admin"
}
```

**请求2: 登录**
- Method: POST
- URL: {{url}}/api/auth/login
- Body (raw JSON):
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
- 在Tests标签页添加（自动保存Token）:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

**请求3: 验证Token**
- Method: GET
- URL: {{url}}/api/auth/verify
- Headers: Authorization = Bearer {{token}}

**请求4: 获取用户信息**
- Method: GET
- URL: {{url}}/api/auth/me
- Headers: Authorization = Bearer {{token}}

---

##  错误处理

### 常见错误代码

| 状态码 | 错误代码 | 描述 |
|-------|---------|------|
| 400 | MISSING_FIELDS | 缺少必填字段 |
| 400 | PASSWORD_MISMATCH | 密码不匹配 |
| 401 | INVALID_CREDENTIALS | 用户名或密码错误 |
| 401 | INVALID_TOKEN | Token无效或已过期 |
| 403 | ACCOUNT_DISABLED | 账户已禁用 |
| 409 | USERNAME_EXISTS | 用户名已存在 |
| 409 | EMAIL_EXISTS | 邮箱已注册 |

---

##  前端集成示例

### JavaScript/TypeScript
```typescript
// 注册
async function register(username: string, email: string, password: string, role: string = 'customer') {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirmPassword: password, role })
  });
  return response.json();
}

// 登录
async function login(username: string, password: string) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
}

// 验证Token
async function verifyToken() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

##  测试清单

- [ ] 成功注册新用户
- [ ] 用错误的密码登录失败
- [ ] 成功登录后获得Token
- [ ] 用有效Token验证成功
- [ ] 用无效Token验证失败
- [ ] 获取当前用户信息
- [ ] 成功修改密码
- [ ] 用新密码登录

---

##  故障排查

### 问题：CORS错误
**解决方案**：
检查 `.env` 中的 `CORS_ORIGIN` 是否包含前端地址

### 问题：数据库连接失败
**解决方案**：
确保MySQL正在运行，`.env` 配置正确

### 问题：Token验证失败
**解决方案**：
- 检查Token是否过期（JWT_EXPIRE在.env中）
- 确保Token格式正确（Bearer <token>）

---

**祝您测试愉快！** 


##  快速开始

启动服务器后，可以使用以下方式测试认证API：

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

---

##  认证API端点

### 1. 用户注册
**端点**: `POST /api/auth/register`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "admin"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "email": "string (必填)",
  "password": "string (必填)",
  "confirmPassword": "string (必填)",
  "role": "admin | staff | customer (可选，默认 customer)"
}
```

#### 成功响应 (201)
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "用户名已存在",
  "code": "USERNAME_EXISTS",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 2. 用户登录
**端点**: `POST /api/auth/login`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 3. 验证Token
**端点**: `GET /api/auth/verify`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "令牌有效",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 4. 获取当前用户信息
**端点**: `GET /api/auth/me`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 5. 修改密码
**端点**: `POST /api/auth/change-password`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

#### 请求体
```json
{
  "oldPassword": "string (必填)",
  "newPassword": "string (必填)",
  "confirmPassword": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "密码修改成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 6. 登出
**端点**: `POST /api/auth/logout`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登出成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

##  完整测试流程

### 步骤1: 注册新用户
```bash
TOKEN_AND_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123",
    "role": "customer"
  }')

echo $TOKEN_AND_RESPONSE | jq '.'
```

### 步骤2: 从响应中提取Token
```bash
TOKEN=$(echo $TOKEN_AND_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
```

### 步骤3: 用Token验证
```bash
curl -s -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤4: 获取用户信息
```bash
curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤5: 修改密码
```bash
curl -s -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "oldPassword": "Test@123",
    "newPassword": "NewTest@123",
    "confirmPassword": "NewTest@123"
  }' | jq '.'
```

### 步骤6: 用新密码登录
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "NewTest@123"
  }' | jq '.'
```

---

##  Postman导入

### 创建Postman Collection

1. 在Postman中创建新的Collection
2. 添加以下请求：

**Environment Variables (在Postman中设置)**
```
url: http://localhost:5000
token: (从登录响应中复制)
```

**请求1: 注册**
- Method: POST
- URL: {{url}}/api/auth/register
- Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123",
  "confirmPassword": "Admin@123",
  "role": "admin"
}
```

**请求2: 登录**
- Method: POST
- URL: {{url}}/api/auth/login
- Body (raw JSON):
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
- 在Tests标签页添加（自动保存Token）:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

**请求3: 验证Token**
- Method: GET
- URL: {{url}}/api/auth/verify
- Headers: Authorization = Bearer {{token}}

**请求4: 获取用户信息**
- Method: GET
- URL: {{url}}/api/auth/me
- Headers: Authorization = Bearer {{token}}

---

##  错误处理

### 常见错误代码

| 状态码 | 错误代码 | 描述 |
|-------|---------|------|
| 400 | MISSING_FIELDS | 缺少必填字段 |
| 400 | PASSWORD_MISMATCH | 密码不匹配 |
| 401 | INVALID_CREDENTIALS | 用户名或密码错误 |
| 401 | INVALID_TOKEN | Token无效或已过期 |
| 403 | ACCOUNT_DISABLED | 账户已禁用 |
| 409 | USERNAME_EXISTS | 用户名已存在 |
| 409 | EMAIL_EXISTS | 邮箱已注册 |

---

##  前端集成示例

### JavaScript/TypeScript
```typescript
// 注册
async function register(username: string, email: string, password: string, role: string = 'customer') {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirmPassword: password, role })
  });
  return response.json();
}

// 登录
async function login(username: string, password: string) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
}

// 验证Token
async function verifyToken() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

##  测试清单

- [ ] 成功注册新用户
- [ ] 用错误的密码登录失败
- [ ] 成功登录后获得Token
- [ ] 用有效Token验证成功
- [ ] 用无效Token验证失败
- [ ] 获取当前用户信息
- [ ] 成功修改密码
- [ ] 用新密码登录

---

##  故障排查

### 问题：CORS错误
**解决方案**：
检查 `.env` 中的 `CORS_ORIGIN` 是否包含前端地址

### 问题：数据库连接失败
**解决方案**：
确保MySQL正在运行，`.env` 配置正确

### 问题：Token验证失败
**解决方案**：
- 检查Token是否过期（JWT_EXPIRE在.env中）
- 确保Token格式正确（Bearer <token>）

---

**祝您测试愉快！** 


##  快速开始

启动服务器后，可以使用以下方式测试认证API：

```bash
npm run dev
```

服务器将在 `http://localhost:5000` 启动

---

##  认证API端点

### 1. 用户注册
**端点**: `POST /api/auth/register`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "password123",
    "confirmPassword": "password123",
    "role": "admin"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "email": "string (必填)",
  "password": "string (必填)",
  "confirmPassword": "string (必填)",
  "role": "admin | staff | customer (可选，默认 customer)"
}
```

#### 成功响应 (201)
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

#### 错误响应
```json
{
  "success": false,
  "message": "用户名已存在",
  "code": "USERNAME_EXISTS",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 2. 用户登录
**端点**: `POST /api/auth/login`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "password123"
  }'
```

#### 请求体
```json
{
  "username": "string (必填)",
  "password": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "username": "admin",
      "email": "admin@example.com",
      "role": "admin",
      "isActive": true
    }
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 3. 验证Token
**端点**: `GET /api/auth/verify`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "valid": true,
  "user": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  },
  "message": "令牌有效",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 4. 获取当前用户信息
**端点**: `GET /api/auth/me`

#### 请求
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin",
    "isActive": true
  },
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 5. 修改密码
**端点**: `POST /api/auth/change-password`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "oldPassword": "password123",
    "newPassword": "newpassword123",
    "confirmPassword": "newpassword123"
  }'
```

#### 请求体
```json
{
  "oldPassword": "string (必填)",
  "newPassword": "string (必填)",
  "confirmPassword": "string (必填)"
}
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "密码修改成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

### 6. 登出
**端点**: `POST /api/auth/logout`

#### 请求
```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 成功响应 (200)
```json
{
  "success": true,
  "message": "登出成功",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

##  完整测试流程

### 步骤1: 注册新用户
```bash
TOKEN_AND_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "Test@123",
    "confirmPassword": "Test@123",
    "role": "customer"
  }')

echo $TOKEN_AND_RESPONSE | jq '.'
```

### 步骤2: 从响应中提取Token
```bash
TOKEN=$(echo $TOKEN_AND_RESPONSE | jq -r '.data.token')
echo "Token: $TOKEN"
```

### 步骤3: 用Token验证
```bash
curl -s -X GET http://localhost:5000/api/auth/verify \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤4: 获取用户信息
```bash
curl -s -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### 步骤5: 修改密码
```bash
curl -s -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "oldPassword": "Test@123",
    "newPassword": "NewTest@123",
    "confirmPassword": "NewTest@123"
  }' | jq '.'
```

### 步骤6: 用新密码登录
```bash
curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "NewTest@123"
  }' | jq '.'
```

---

##  Postman导入

### 创建Postman Collection

1. 在Postman中创建新的Collection
2. 添加以下请求：

**Environment Variables (在Postman中设置)**
```
url: http://localhost:5000
token: (从登录响应中复制)
```

**请求1: 注册**
- Method: POST
- URL: {{url}}/api/auth/register
- Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Admin@123",
  "confirmPassword": "Admin@123",
  "role": "admin"
}
```

**请求2: 登录**
- Method: POST
- URL: {{url}}/api/auth/login
- Body (raw JSON):
```json
{
  "username": "admin",
  "password": "Admin@123"
}
```
- 在Tests标签页添加（自动保存Token）:
```javascript
var jsonData = pm.response.json();
pm.environment.set("token", jsonData.data.token);
```

**请求3: 验证Token**
- Method: GET
- URL: {{url}}/api/auth/verify
- Headers: Authorization = Bearer {{token}}

**请求4: 获取用户信息**
- Method: GET
- URL: {{url}}/api/auth/me
- Headers: Authorization = Bearer {{token}}

---

##  错误处理

### 常见错误代码

| 状态码 | 错误代码 | 描述 |
|-------|---------|------|
| 400 | MISSING_FIELDS | 缺少必填字段 |
| 400 | PASSWORD_MISMATCH | 密码不匹配 |
| 401 | INVALID_CREDENTIALS | 用户名或密码错误 |
| 401 | INVALID_TOKEN | Token无效或已过期 |
| 403 | ACCOUNT_DISABLED | 账户已禁用 |
| 409 | USERNAME_EXISTS | 用户名已存在 |
| 409 | EMAIL_EXISTS | 邮箱已注册 |

---

##  前端集成示例

### JavaScript/TypeScript
```typescript
// 注册
async function register(username: string, email: string, password: string, role: string = 'customer') {
  const response = await fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password, confirmPassword: password, role })
  });
  return response.json();
}

// 登录
async function login(username: string, password: string) {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
  }
  return data;
}

// 验证Token
async function verifyToken() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

##  测试清单

- [ ] 成功注册新用户
- [ ] 用错误的密码登录失败
- [ ] 成功登录后获得Token
- [ ] 用有效Token验证成功
- [ ] 用无效Token验证失败
- [ ] 获取当前用户信息
- [ ] 成功修改密码
- [ ] 用新密码登录

---

##  故障排查

### 问题：CORS错误
**解决方案**：
检查 `.env` 中的 `CORS_ORIGIN` 是否包含前端地址

### 问题：数据库连接失败
**解决方案**：
确保MySQL正在运行，`.env` 配置正确

### 问题：Token验证失败
**解决方案**：
- 检查Token是否过期（JWT_EXPIRE在.env中）
- 确保Token格式正确（Bearer <token>）

---

**祝您测试愉快！** 







