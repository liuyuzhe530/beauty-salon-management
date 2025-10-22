# 🚀 CRUD API 完整测试指南

美容院管理系统的CRUD API完整文档和测试示例。

---

## 📋 目录

1. [客户管理 API](#客户管理-api)
2. [预约管理 API](#预约管理-api)
3. [美容师管理 API](#美容师管理-api)
4. [产品管理 API](#产品管理-api)
5. [通用特性](#通用特性)
6. [错误处理](#错误处理)

---

## 🔑 认证说明

所有CRUD API都需要有效的JWT Token。获取Token的方式：

```bash
# 1. 注册用户
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }'

# 2. 从响应中获取 token
# 3. 在后续请求中使用 Authorization: Bearer <token>
```

---

## 客户管理 API

### 1. 创建客户
**POST** `/api/customers`

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active",
    "photo": "https://example.com/photo.jpg",
    "notes": "VIP客户"
  }'
```

**成功响应 (201):**
```json
{
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": 0,
    "appointmentCount": 0,
    "status": "active",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 2. 获取所有客户（分页）
**GET** `/api/customers?page=1&limit=10&search=张`

```bash
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "totalSpending": "500.00",
      "appointmentCount": 5,
      "status": "active"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 3. 获取单个客户
**GET** `/api/customers/:id`

```bash
curl -X GET http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": "500.00",
    "appointmentCount": 5,
    "preferredStaff": null,
    "status": "active",
    "lastVisit": "2024-01-01T12:00:00.000Z",
    "notes": "VIP客户"
  }
}
```

---

### 4. 更新客户
**PUT** `/api/customers/:id`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "status": "inactive",
    "notes": "已转移到其他门店"
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "status": "inactive"
  }
}
```

---

### 5. 删除客户
**DELETE** `/api/customers/:id`

```bash
curl -X DELETE http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 6. 批量删除客户
**POST** `/api/customers/batch/delete`

```bash
curl -X POST http://localhost:5000/api/customers/batch/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ids": [
      "550e8400-e29b-41d4-a716-446655440000",
      "660e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除 2 条记录",
  "data": {
    "deletedCount": 2
  }
}
```

---

### 7. 获取活跃客户
**GET** `/api/customers/status/active?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 获取风险客户
**GET** `/api/customers/status/atrisk?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/atrisk" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 搜索客户
**GET** `/api/customers/search?keyword=张三`

```bash
curl -X GET "http://localhost:5000/api/customers/search?keyword=张三" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 更新客户消费
**PUT** `/api/customers/:id/spending`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000/spending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 299.99
  }'
```

---

### 11. 获取客户统计
**GET** `/api/customers/statistics`

```bash
curl -X GET http://localhost:5000/api/customers/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "active": 75,
    "atrisk": 15,
    "inactive": 10,
    "activePercentage": "75.00"
  }
}
```

---

## 预约管理 API

### 1. 创建预约
**POST** `/api/appointments`

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "staffId": "550e8400-e29b-41d4-a716-446655440001",
    "customerName": "张三",
    "staffName": "李四",
    "service": "美甲服务",
    "date": "2024-01-15T00:00:00.000Z",
    "time": "14:00",
    "duration": 60,
    "price": 199.99,
    "status": "pending"
  }'
```

---

### 2. 获取所有预约
**GET** `/api/appointments?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取单个预约
**GET** `/api/appointments/:id`

```bash
curl -X GET http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 更新预约
**PUT** `/api/appointments/:id`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "time": "15:00",
    "notes": "客户要求延后一小时"
  }'
```

---

### 5. 删除预约
**DELETE** `/api/appointments/:id`

```bash
curl -X DELETE http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 确认预约
**PUT** `/api/appointments/:id/confirm`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/confirm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 完成预约
**PUT** `/api/appointments/:id/complete`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 取消预约
**PUT** `/api/appointments/:id/cancel`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取客户的预约
**GET** `/api/appointments/customer/:customerId`

```bash
curl -X GET http://localhost:5000/api/appointments/customer/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 获取美容师的预约
**GET** `/api/appointments/staff/:staffId`

```bash
curl -X GET http://localhost:5000/api/appointments/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. 获取今天的预约
**GET** `/api/appointments/today`

```bash
curl -X GET http://localhost:5000/api/appointments/today \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 12. 获取待确认预约
**GET** `/api/appointments/pending?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments/pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 13. 获取预约统计
**GET** `/api/appointments/statistics`

```bash
curl -X GET http://localhost:5000/api/appointments/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "pending": 10,
    "confirmed": 30,
    "completed": 55,
    "cancelled": 5
  }
}
```

---

## 美容师管理 API

### 1. 创建美容师
**POST** `/api/staff`

```bash
curl -X POST http://localhost:5000/api/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "李四",
    "phone": "13800138001",
    "email": "lisi@example.com",
    "specialty": ["美甲", "纹眉", "美睫"],
    "experience": 5,
    "status": "active",
    "certifications": "国家级美容师证"
  }'
```

---

### 2. 获取所有美容师
**GET** `/api/staff?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取活跃美容师
**GET** `/api/staff/active`

```bash
curl -X GET http://localhost:5000/api/staff/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 获取最高评分美容师
**GET** `/api/staff/top-rated?limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff/top-rated?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 搜索美容师
**GET** `/api/staff/search?keyword=李四`

```bash
curl -X GET "http://localhost:5000/api/staff/search?keyword=李四" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 更新美容师评分
**PUT** `/api/staff/:id/rating`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001/rating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 4.8
  }'
```

---

### 7. 更新美容师信息
**PUT** `/api/staff/:id`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "onleave",
    "specialty": ["美甲", "纹眉"]
  }'
```

---

### 8. 获取美容师统计
**GET** `/api/staff/statistics`

```bash
curl -X GET http://localhost:5000/api/staff/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 30,
    "active": 25,
    "onleave": 3,
    "inactive": 2
  }
}
```

---

## 产品管理 API

### 1. 创建产品
**POST** `/api/products`

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "进口护肤品",
    "category": "护肤",
    "description": "美容院专用进口护肤品",
    "price": 299.99,
    "cost": 150.00,
    "stock": 50,
    "image": "https://example.com/product.jpg"
  }'
```

---

### 2. 获取所有产品
**GET** `/api/products?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 按分类获取产品
**GET** `/api/products/category/:category`

```bash
curl -X GET http://localhost:5000/api/products/category/护肤 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 搜索产品
**GET** `/api/products/search?keyword=护肤品`

```bash
curl -X GET "http://localhost:5000/api/products/search?keyword=护肤品" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 获取库存不足产品
**GET** `/api/products/low-stock?threshold=10`

```bash
curl -X GET "http://localhost:5000/api/products/low-stock?threshold=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 减少库存
**PUT** `/api/products/:id/decrease-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/decrease-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 5
  }'
```

---

### 7. 增加库存
**PUT** `/api/products/:id/increase-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/increase-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 20
  }'
```

---

### 8. 获取最畅销产品
**GET** `/api/products/top-selling?limit=10`

```bash
curl -X GET "http://localhost:5000/api/products/top-selling?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取产品统计
**GET** `/api/products/statistics`

```bash
curl -X GET http://localhost:5000/api/products/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "totalInventoryValue": "50000.00",
    "totalInventoryCost": "25000.00",
    "totalProfit": "25000.00",
    "totalSold": 1250
  }
}
```

---

### 10. 获取所有分类
**GET** `/api/products/categories`

```bash
curl -X GET http://localhost:5000/api/products/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": ["护肤", "美甲", "化妆", "护理"]
}
```

---

## 通用特性

### 分页

所有列表端点都支持分页：

```bash
GET /api/customers?page=2&limit=20
```

参数：
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)

### 搜索

许多端点支持搜索功能：

```bash
GET /api/customers?search=张三

GET /api/products/search?keyword=护肤品
```

### 排序

数据通常按以下规则排序：
- 客户：按最后访问时间降序
- 预约：按日期升序
- 美容师：按评分降序
- 产品：按名称升序

---

## 错误处理

### 常见错误码

| 状态码 | 错误代码 | 说明 |
|--------|---------|------|
| 400 | INVALID_INPUT | 输入数据无效 |
| 401 | UNAUTHORIZED | 未认证 |
| 403 | FORBIDDEN | 禁止访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | DUPLICATE | 数据重复（如电话号码已存在） |
| 500 | SERVER_ERROR | 服务器错误 |

### 错误响应示例

```json
{
  "success": false,
  "message": "电话号码已存在",
  "code": "DUPLICATE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🧪 完整测试流程

```bash
#!/bin/bash

TOKEN=""

# 1. 注册并获取Token
response=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }')

TOKEN=$(echo $response | jq -r '.data.token')
echo "✅ Token: $TOKEN"

# 2. 创建客户
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active"
  }'

echo "✅ 客户创建成功"

# 3. 获取客户列表
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

echo "✅ 客户列表获取成功"
```

---

## 📚 相关文档

- [认证 API](./API_TESTING_GUIDE.md)
- [后端 README](./README.md)
- [环境配置](../.env.example)


美容院管理系统的CRUD API完整文档和测试示例。

---

## 📋 目录

1. [客户管理 API](#客户管理-api)
2. [预约管理 API](#预约管理-api)
3. [美容师管理 API](#美容师管理-api)
4. [产品管理 API](#产品管理-api)
5. [通用特性](#通用特性)
6. [错误处理](#错误处理)

---

## 🔑 认证说明

所有CRUD API都需要有效的JWT Token。获取Token的方式：

```bash
# 1. 注册用户
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }'

# 2. 从响应中获取 token
# 3. 在后续请求中使用 Authorization: Bearer <token>
```

---

## 客户管理 API

### 1. 创建客户
**POST** `/api/customers`

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active",
    "photo": "https://example.com/photo.jpg",
    "notes": "VIP客户"
  }'
```

**成功响应 (201):**
```json
{
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": 0,
    "appointmentCount": 0,
    "status": "active",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 2. 获取所有客户（分页）
**GET** `/api/customers?page=1&limit=10&search=张`

```bash
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "totalSpending": "500.00",
      "appointmentCount": 5,
      "status": "active"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 3. 获取单个客户
**GET** `/api/customers/:id`

```bash
curl -X GET http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": "500.00",
    "appointmentCount": 5,
    "preferredStaff": null,
    "status": "active",
    "lastVisit": "2024-01-01T12:00:00.000Z",
    "notes": "VIP客户"
  }
}
```

---

### 4. 更新客户
**PUT** `/api/customers/:id`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "status": "inactive",
    "notes": "已转移到其他门店"
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "status": "inactive"
  }
}
```

---

### 5. 删除客户
**DELETE** `/api/customers/:id`

```bash
curl -X DELETE http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 6. 批量删除客户
**POST** `/api/customers/batch/delete`

```bash
curl -X POST http://localhost:5000/api/customers/batch/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ids": [
      "550e8400-e29b-41d4-a716-446655440000",
      "660e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除 2 条记录",
  "data": {
    "deletedCount": 2
  }
}
```

---

### 7. 获取活跃客户
**GET** `/api/customers/status/active?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 获取风险客户
**GET** `/api/customers/status/atrisk?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/atrisk" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 搜索客户
**GET** `/api/customers/search?keyword=张三`

```bash
curl -X GET "http://localhost:5000/api/customers/search?keyword=张三" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 更新客户消费
**PUT** `/api/customers/:id/spending`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000/spending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 299.99
  }'
```

---

### 11. 获取客户统计
**GET** `/api/customers/statistics`

```bash
curl -X GET http://localhost:5000/api/customers/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "active": 75,
    "atrisk": 15,
    "inactive": 10,
    "activePercentage": "75.00"
  }
}
```

---

## 预约管理 API

### 1. 创建预约
**POST** `/api/appointments`

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "staffId": "550e8400-e29b-41d4-a716-446655440001",
    "customerName": "张三",
    "staffName": "李四",
    "service": "美甲服务",
    "date": "2024-01-15T00:00:00.000Z",
    "time": "14:00",
    "duration": 60,
    "price": 199.99,
    "status": "pending"
  }'
```

---

### 2. 获取所有预约
**GET** `/api/appointments?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取单个预约
**GET** `/api/appointments/:id`

```bash
curl -X GET http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 更新预约
**PUT** `/api/appointments/:id`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "time": "15:00",
    "notes": "客户要求延后一小时"
  }'
```

---

### 5. 删除预约
**DELETE** `/api/appointments/:id`

```bash
curl -X DELETE http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 确认预约
**PUT** `/api/appointments/:id/confirm`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/confirm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 完成预约
**PUT** `/api/appointments/:id/complete`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 取消预约
**PUT** `/api/appointments/:id/cancel`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取客户的预约
**GET** `/api/appointments/customer/:customerId`

```bash
curl -X GET http://localhost:5000/api/appointments/customer/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 获取美容师的预约
**GET** `/api/appointments/staff/:staffId`

```bash
curl -X GET http://localhost:5000/api/appointments/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. 获取今天的预约
**GET** `/api/appointments/today`

```bash
curl -X GET http://localhost:5000/api/appointments/today \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 12. 获取待确认预约
**GET** `/api/appointments/pending?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments/pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 13. 获取预约统计
**GET** `/api/appointments/statistics`

```bash
curl -X GET http://localhost:5000/api/appointments/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "pending": 10,
    "confirmed": 30,
    "completed": 55,
    "cancelled": 5
  }
}
```

---

## 美容师管理 API

### 1. 创建美容师
**POST** `/api/staff`

```bash
curl -X POST http://localhost:5000/api/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "李四",
    "phone": "13800138001",
    "email": "lisi@example.com",
    "specialty": ["美甲", "纹眉", "美睫"],
    "experience": 5,
    "status": "active",
    "certifications": "国家级美容师证"
  }'
```

---

### 2. 获取所有美容师
**GET** `/api/staff?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取活跃美容师
**GET** `/api/staff/active`

```bash
curl -X GET http://localhost:5000/api/staff/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 获取最高评分美容师
**GET** `/api/staff/top-rated?limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff/top-rated?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 搜索美容师
**GET** `/api/staff/search?keyword=李四`

```bash
curl -X GET "http://localhost:5000/api/staff/search?keyword=李四" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 更新美容师评分
**PUT** `/api/staff/:id/rating`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001/rating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 4.8
  }'
```

---

### 7. 更新美容师信息
**PUT** `/api/staff/:id`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "onleave",
    "specialty": ["美甲", "纹眉"]
  }'
```

---

### 8. 获取美容师统计
**GET** `/api/staff/statistics`

```bash
curl -X GET http://localhost:5000/api/staff/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 30,
    "active": 25,
    "onleave": 3,
    "inactive": 2
  }
}
```

---

## 产品管理 API

### 1. 创建产品
**POST** `/api/products`

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "进口护肤品",
    "category": "护肤",
    "description": "美容院专用进口护肤品",
    "price": 299.99,
    "cost": 150.00,
    "stock": 50,
    "image": "https://example.com/product.jpg"
  }'
```

---

### 2. 获取所有产品
**GET** `/api/products?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 按分类获取产品
**GET** `/api/products/category/:category`

```bash
curl -X GET http://localhost:5000/api/products/category/护肤 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 搜索产品
**GET** `/api/products/search?keyword=护肤品`

```bash
curl -X GET "http://localhost:5000/api/products/search?keyword=护肤品" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 获取库存不足产品
**GET** `/api/products/low-stock?threshold=10`

```bash
curl -X GET "http://localhost:5000/api/products/low-stock?threshold=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 减少库存
**PUT** `/api/products/:id/decrease-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/decrease-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 5
  }'
```

---

### 7. 增加库存
**PUT** `/api/products/:id/increase-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/increase-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 20
  }'
```

---

### 8. 获取最畅销产品
**GET** `/api/products/top-selling?limit=10`

```bash
curl -X GET "http://localhost:5000/api/products/top-selling?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取产品统计
**GET** `/api/products/statistics`

```bash
curl -X GET http://localhost:5000/api/products/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "totalInventoryValue": "50000.00",
    "totalInventoryCost": "25000.00",
    "totalProfit": "25000.00",
    "totalSold": 1250
  }
}
```

---

### 10. 获取所有分类
**GET** `/api/products/categories`

```bash
curl -X GET http://localhost:5000/api/products/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": ["护肤", "美甲", "化妆", "护理"]
}
```

---

## 通用特性

### 分页

所有列表端点都支持分页：

```bash
GET /api/customers?page=2&limit=20
```

参数：
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)

### 搜索

许多端点支持搜索功能：

```bash
GET /api/customers?search=张三

GET /api/products/search?keyword=护肤品
```

### 排序

数据通常按以下规则排序：
- 客户：按最后访问时间降序
- 预约：按日期升序
- 美容师：按评分降序
- 产品：按名称升序

---

## 错误处理

### 常见错误码

| 状态码 | 错误代码 | 说明 |
|--------|---------|------|
| 400 | INVALID_INPUT | 输入数据无效 |
| 401 | UNAUTHORIZED | 未认证 |
| 403 | FORBIDDEN | 禁止访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | DUPLICATE | 数据重复（如电话号码已存在） |
| 500 | SERVER_ERROR | 服务器错误 |

### 错误响应示例

```json
{
  "success": false,
  "message": "电话号码已存在",
  "code": "DUPLICATE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🧪 完整测试流程

```bash
#!/bin/bash

TOKEN=""

# 1. 注册并获取Token
response=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }')

TOKEN=$(echo $response | jq -r '.data.token')
echo "✅ Token: $TOKEN"

# 2. 创建客户
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active"
  }'

echo "✅ 客户创建成功"

# 3. 获取客户列表
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

echo "✅ 客户列表获取成功"
```

---

## 📚 相关文档

- [认证 API](./API_TESTING_GUIDE.md)
- [后端 README](./README.md)
- [环境配置](../.env.example)


美容院管理系统的CRUD API完整文档和测试示例。

---

## 📋 目录

1. [客户管理 API](#客户管理-api)
2. [预约管理 API](#预约管理-api)
3. [美容师管理 API](#美容师管理-api)
4. [产品管理 API](#产品管理-api)
5. [通用特性](#通用特性)
6. [错误处理](#错误处理)

---

## 🔑 认证说明

所有CRUD API都需要有效的JWT Token。获取Token的方式：

```bash
# 1. 注册用户
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }'

# 2. 从响应中获取 token
# 3. 在后续请求中使用 Authorization: Bearer <token>
```

---

## 客户管理 API

### 1. 创建客户
**POST** `/api/customers`

```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active",
    "photo": "https://example.com/photo.jpg",
    "notes": "VIP客户"
  }'
```

**成功响应 (201):**
```json
{
  "success": true,
  "message": "创建成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": 0,
    "appointmentCount": 0,
    "status": "active",
    "createdAt": "2024-01-01T12:00:00.000Z",
    "updatedAt": "2024-01-01T12:00:00.000Z"
  }
}
```

---

### 2. 获取所有客户（分页）
**GET** `/api/customers?page=1&limit=10&search=张`

```bash
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "张三",
      "phone": "13800138000",
      "email": "zhangsan@example.com",
      "totalSpending": "500.00",
      "appointmentCount": 5,
      "status": "active"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### 3. 获取单个客户
**GET** `/api/customers/:id`

```bash
curl -X GET http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "totalSpending": "500.00",
    "appointmentCount": 5,
    "preferredStaff": null,
    "status": "active",
    "lastVisit": "2024-01-01T12:00:00.000Z",
    "notes": "VIP客户"
  }
}
```

---

### 4. 更新客户
**PUT** `/api/customers/:id`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "张三",
    "status": "inactive",
    "notes": "已转移到其他门店"
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "更新成功",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "张三",
    "phone": "13800138000",
    "status": "inactive"
  }
}
```

---

### 5. 删除客户
**DELETE** `/api/customers/:id`

```bash
curl -X DELETE http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除成功"
}
```

---

### 6. 批量删除客户
**POST** `/api/customers/batch/delete`

```bash
curl -X POST http://localhost:5000/api/customers/batch/delete \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "ids": [
      "550e8400-e29b-41d4-a716-446655440000",
      "660e8400-e29b-41d4-a716-446655440001"
    ]
  }'
```

**成功响应 (200):**
```json
{
  "success": true,
  "message": "删除 2 条记录",
  "data": {
    "deletedCount": 2
  }
}
```

---

### 7. 获取活跃客户
**GET** `/api/customers/status/active?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/active" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 获取风险客户
**GET** `/api/customers/status/atrisk?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/customers/status/atrisk" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 搜索客户
**GET** `/api/customers/search?keyword=张三`

```bash
curl -X GET "http://localhost:5000/api/customers/search?keyword=张三" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 更新客户消费
**PUT** `/api/customers/:id/spending`

```bash
curl -X PUT http://localhost:5000/api/customers/550e8400-e29b-41d4-a716-446655440000/spending \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "amount": 299.99
  }'
```

---

### 11. 获取客户统计
**GET** `/api/customers/statistics`

```bash
curl -X GET http://localhost:5000/api/customers/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "active": 75,
    "atrisk": 15,
    "inactive": 10,
    "activePercentage": "75.00"
  }
}
```

---

## 预约管理 API

### 1. 创建预约
**POST** `/api/appointments`

```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "customerId": "550e8400-e29b-41d4-a716-446655440000",
    "staffId": "550e8400-e29b-41d4-a716-446655440001",
    "customerName": "张三",
    "staffName": "李四",
    "service": "美甲服务",
    "date": "2024-01-15T00:00:00.000Z",
    "time": "14:00",
    "duration": 60,
    "price": 199.99,
    "status": "pending"
  }'
```

---

### 2. 获取所有预约
**GET** `/api/appointments?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取单个预约
**GET** `/api/appointments/:id`

```bash
curl -X GET http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 更新预约
**PUT** `/api/appointments/:id`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "time": "15:00",
    "notes": "客户要求延后一小时"
  }'
```

---

### 5. 删除预约
**DELETE** `/api/appointments/:id`

```bash
curl -X DELETE http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 确认预约
**PUT** `/api/appointments/:id/confirm`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/confirm \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 7. 完成预约
**PUT** `/api/appointments/:id/complete`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/complete \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 8. 取消预约
**PUT** `/api/appointments/:id/cancel`

```bash
curl -X PUT http://localhost:5000/api/appointments/550e8400-e29b-41d4-a716-446655440000/cancel \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取客户的预约
**GET** `/api/appointments/customer/:customerId`

```bash
curl -X GET http://localhost:5000/api/appointments/customer/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 10. 获取美容师的预约
**GET** `/api/appointments/staff/:staffId`

```bash
curl -X GET http://localhost:5000/api/appointments/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 11. 获取今天的预约
**GET** `/api/appointments/today`

```bash
curl -X GET http://localhost:5000/api/appointments/today \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 12. 获取待确认预约
**GET** `/api/appointments/pending?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/appointments/pending" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 13. 获取预约统计
**GET** `/api/appointments/statistics`

```bash
curl -X GET http://localhost:5000/api/appointments/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 100,
    "pending": 10,
    "confirmed": 30,
    "completed": 55,
    "cancelled": 5
  }
}
```

---

## 美容师管理 API

### 1. 创建美容师
**POST** `/api/staff`

```bash
curl -X POST http://localhost:5000/api/staff \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "李四",
    "phone": "13800138001",
    "email": "lisi@example.com",
    "specialty": ["美甲", "纹眉", "美睫"],
    "experience": 5,
    "status": "active",
    "certifications": "国家级美容师证"
  }'
```

---

### 2. 获取所有美容师
**GET** `/api/staff?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 获取活跃美容师
**GET** `/api/staff/active`

```bash
curl -X GET http://localhost:5000/api/staff/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 获取最高评分美容师
**GET** `/api/staff/top-rated?limit=10`

```bash
curl -X GET "http://localhost:5000/api/staff/top-rated?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 搜索美容师
**GET** `/api/staff/search?keyword=李四`

```bash
curl -X GET "http://localhost:5000/api/staff/search?keyword=李四" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 更新美容师评分
**PUT** `/api/staff/:id/rating`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001/rating \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "rating": 4.8
  }'
```

---

### 7. 更新美容师信息
**PUT** `/api/staff/:id`

```bash
curl -X PUT http://localhost:5000/api/staff/550e8400-e29b-41d4-a716-446655440001 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "status": "onleave",
    "specialty": ["美甲", "纹眉"]
  }'
```

---

### 8. 获取美容师统计
**GET** `/api/staff/statistics`

```bash
curl -X GET http://localhost:5000/api/staff/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 30,
    "active": 25,
    "onleave": 3,
    "inactive": 2
  }
}
```

---

## 产品管理 API

### 1. 创建产品
**POST** `/api/products`

```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "进口护肤品",
    "category": "护肤",
    "description": "美容院专用进口护肤品",
    "price": 299.99,
    "cost": 150.00,
    "stock": 50,
    "image": "https://example.com/product.jpg"
  }'
```

---

### 2. 获取所有产品
**GET** `/api/products?page=1&limit=10`

```bash
curl -X GET "http://localhost:5000/api/products?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 3. 按分类获取产品
**GET** `/api/products/category/:category`

```bash
curl -X GET http://localhost:5000/api/products/category/护肤 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 4. 搜索产品
**GET** `/api/products/search?keyword=护肤品`

```bash
curl -X GET "http://localhost:5000/api/products/search?keyword=护肤品" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 5. 获取库存不足产品
**GET** `/api/products/low-stock?threshold=10`

```bash
curl -X GET "http://localhost:5000/api/products/low-stock?threshold=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 6. 减少库存
**PUT** `/api/products/:id/decrease-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/decrease-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 5
  }'
```

---

### 7. 增加库存
**PUT** `/api/products/:id/increase-stock`

```bash
curl -X PUT http://localhost:5000/api/products/550e8400-e29b-41d4-a716-446655440000/increase-stock \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "quantity": 20
  }'
```

---

### 8. 获取最畅销产品
**GET** `/api/products/top-selling?limit=10`

```bash
curl -X GET "http://localhost:5000/api/products/top-selling?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

### 9. 获取产品统计
**GET** `/api/products/statistics`

```bash
curl -X GET http://localhost:5000/api/products/statistics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": {
    "total": 50,
    "totalInventoryValue": "50000.00",
    "totalInventoryCost": "25000.00",
    "totalProfit": "25000.00",
    "totalSold": 1250
  }
}
```

---

### 10. 获取所有分类
**GET** `/api/products/categories`

```bash
curl -X GET http://localhost:5000/api/products/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**成功响应:**
```json
{
  "success": true,
  "data": ["护肤", "美甲", "化妆", "护理"]
}
```

---

## 通用特性

### 分页

所有列表端点都支持分页：

```bash
GET /api/customers?page=2&limit=20
```

参数：
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)

### 搜索

许多端点支持搜索功能：

```bash
GET /api/customers?search=张三

GET /api/products/search?keyword=护肤品
```

### 排序

数据通常按以下规则排序：
- 客户：按最后访问时间降序
- 预约：按日期升序
- 美容师：按评分降序
- 产品：按名称升序

---

## 错误处理

### 常见错误码

| 状态码 | 错误代码 | 说明 |
|--------|---------|------|
| 400 | INVALID_INPUT | 输入数据无效 |
| 401 | UNAUTHORIZED | 未认证 |
| 403 | FORBIDDEN | 禁止访问 |
| 404 | NOT_FOUND | 资源不存在 |
| 409 | DUPLICATE | 数据重复（如电话号码已存在） |
| 500 | SERVER_ERROR | 服务器错误 |

### 错误响应示例

```json
{
  "success": false,
  "message": "电话号码已存在",
  "code": "DUPLICATE",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

---

## 🧪 完整测试流程

```bash
#!/bin/bash

TOKEN=""

# 1. 注册并获取Token
response=$(curl -s -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@example.com",
    "password": "Admin@123",
    "confirmPassword": "Admin@123",
    "role": "admin"
  }')

TOKEN=$(echo $response | jq -r '.data.token')
echo "✅ Token: $TOKEN"

# 2. 创建客户
curl -X POST http://localhost:5000/api/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "张三",
    "phone": "13800138000",
    "email": "zhangsan@example.com",
    "status": "active"
  }'

echo "✅ 客户创建成功"

# 3. 获取客户列表
curl -X GET "http://localhost:5000/api/customers?page=1&limit=10" \
  -H "Authorization: Bearer $TOKEN"

echo "✅ 客户列表获取成功"
```

---

## 📚 相关文档

- [认证 API](./API_TESTING_GUIDE.md)
- [后端 README](./README.md)
- [环境配置](../.env.example)







