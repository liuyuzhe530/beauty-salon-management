#  前后端集成指南

**目标**: 将前端React应用与后端Express API整合  
**前置条件**: 后端已验收，编译无误  
**预期时间**: 2-3小时

---

##  集成清单

- [ ] 1. 启动后端服务器
- [ ] 2. 验证后端健康检查
- [ ] 3. 配置前端API基础URL
- [ ] 4. 创建API客户端模块
- [ ] 5. 更新认证流程
- [ ] 6. 连接所有数据管理模块
- [ ] 7. 端到端测试
- [ ] 8. 性能优化

---

##  第1步: 启动后端服务器

### 在新终端打开：

```bash
cd backend
npm run dev
```

### 预期输出：

```
> beauty-salon-api@1.0.0 dev
> nodemon --exec ts-node src/server.ts

[nodemon] restarting due to changes...
[nodemon] starting `ts-node src/server.ts`
Database connected
Database synchronized
Server running on port 3001
```

** 确认**: 看到 "Server running on port 3001" 表示后端启动成功

---

##  第2步: 验证后端健康检查

```bash
# 在另一个终端测试
curl http://localhost:3001/api/health

# 预期响应：
# {"success":true,"message":"Server is running"}
```

---

##  第3步: 配置前端API基础URL

### 编辑 `src/api/client.ts` (或创建新文件)

```typescript
import axios from 'axios';

// 创建API客户端
export const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器 - 处理错误
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除并重定向到登录
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## ️ 第4步: 创建API服务模块

### 创建 `src/api/services/authService.ts`

```typescript
import apiClient from '../client';
import { AuthResponse, LoginRequest, RegisterRequest } from '../../types/auth';

export const authService = {
  // 用户注册
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/register', data);
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    return response.data;
  },

  // 用户登录
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', data);
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    return response.data;
  },

  // 验证token
  async verify() {
    const response = await apiClient.get('/auth/verify');
    return response.data;
  },

  // 登出
  logout() {
    localStorage.removeItem('authToken');
  },

  // 获取当前token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },
};
```

### 创建 `src/api/services/customerService.ts`

```typescript
import apiClient from '../client';

export const customerService = {
  // 获取所有客户
  async getAll() {
    const response = await apiClient.get('/customers');
    return response.data.data;
  },

  // 获取客户详情
  async getById(id: string) {
    const response = await apiClient.get(`/customers/${id}`);
    return response.data.data;
  },

  // 创建客户
  async create(data: any) {
    const response = await apiClient.post('/customers', data);
    return response.data.data;
  },

  // 更新客户
  async update(id: string, data: any) {
    const response = await apiClient.put(`/customers/${id}`, data);
    return response.data.data;
  },

  // 删除客户
  async delete(id: string) {
    await apiClient.delete(`/customers/${id}`);
  },

  // 按电话查询
  async getByPhone(phone: string) {
    const response = await apiClient.get(`/customers/phone/${phone}`);
    return response.data.data;
  },

  // 统计信息
  async getStats() {
    const response = await apiClient.get('/customers/stats');
    return response.data.data;
  },
};
```

### 创建 `src/api/services/appointmentService.ts`

```typescript
import apiClient from '../client';

export const appointmentService = {
  // 获取所有预约
  async getAll() {
    const response = await apiClient.get('/appointments');
    return response.data.data;
  },

  // 创建预约
  async create(data: any) {
    const response = await apiClient.post('/appointments', data);
    return response.data.data;
  },

  // 更新预约
  async update(id: string, data: any) {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data.data;
  },

  // 删除预约
  async delete(id: string) {
    await apiClient.delete(`/appointments/${id}`);
  },

  // 获取客户的预约
  async getByCustomer(customerId: string) {
    const response = await apiClient.get(`/appointments/customer/${customerId}`);
    return response.data.data;
  },

  // 获取即将到来的预约
  async getUpcoming(days: number = 7) {
    const response = await apiClient.get(`/appointments/upcoming?days=${days}`);
    return response.data.data;
  },

  // 统计信息
  async getStats() {
    const response = await apiClient.get('/appointments/stats');
    return response.data.data;
  },
};
```

### 创建 `src/api/services/staffService.ts`

```typescript
import apiClient from '../client';

export const staffService = {
  // 获取所有美容师
  async getAll() {
    const response = await apiClient.get('/staff');
    return response.data.data;
  },

  // 创建美容师
  async create(data: any) {
    const response = await apiClient.post('/staff', data);
    return response.data.data;
  },

  // 更新美容师
  async update(id: string, data: any) {
    const response = await apiClient.put(`/staff/${id}`, data);
    return response.data.data;
  },

  // 删除美容师
  async delete(id: string) {
    await apiClient.delete(`/staff/${id}`);
  },

  // 获取可用美容师
  async getAvailable() {
    const response = await apiClient.get('/staff/available');
    return response.data.data;
  },

  // 统计信息
  async getStats() {
    const response = await apiClient.get('/staff/stats');
    return response.data.data;
  },
};
```

### 创建 `src/api/services/productService.ts`

```typescript
import apiClient from '../client';

export const productService = {
  // 获取所有产品
  async getAll() {
    const response = await apiClient.get('/products');
    return response.data.data;
  },

  // 创建产品
  async create(data: any) {
    const response = await apiClient.post('/products', data);
    return response.data.data;
  },

  // 更新产品
  async update(id: string, data: any) {
    const response = await apiClient.put(`/products/${id}`, data);
    return response.data.data;
  },

  // 删除产品
  async delete(id: string) {
    await apiClient.delete(`/products/${id}`);
  },

  // 按分类查询
  async getByCategory(category: string) {
    const response = await apiClient.get(`/products/category/${category}`);
    return response.data.data;
  },

  // 搜索产品
  async search(name: string) {
    const response = await apiClient.get(`/products/search?name=${name}`);
    return response.data.data;
  },

  // 统计信息
  async getStats() {
    const response = await apiClient.get('/products/stats');
    return response.data.data;
  },
};
```

---

##  第5步: 更新认证流程

### 编辑前端登录组件

```typescript
import { authService } from '../api/services/authService';

// 在登录处理中
const handleLogin = async (username: string, password: string) => {
  try {
    const response = await authService.login({
      username,
      password,
    });
    
    if (response.success && response.data) {
      // 保存用户信息到store或context
      setUser(response.data.user);
      setToken(response.data.token);
      // 重定向到仪表板
      navigate('/dashboard');
    } else {
      setError(response.message);
    }
  } catch (error) {
    setError('登录失败，请检查用户名和密码');
  }
};
```

---

##  第6步: 连接数据管理模块

### 更新客户管理页面

```typescript
import { customerService } from '../api/services/customerService';

// 获取客户列表
useEffect(() => {
  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('获取客户失败:', error);
    }
  };
  fetchCustomers();
}, []);

// 添加客户
const handleAddCustomer = async (customerData: any) => {
  try {
    const newCustomer = await customerService.create(customerData);
    setCustomers([...customers, newCustomer]);
    // 显示成功消息
  } catch (error) {
    console.error('添加客户失败:', error);
  }
};
```

### 更新预约管理页面

```typescript
import { appointmentService } from '../api/services/appointmentService';

// 获取预约列表
useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (error) {
      console.error('获取预约失败:', error);
    }
  };
  fetchAppointments();
}, []);

// 创建预约
const handleBookAppointment = async (appointmentData: any) => {
  try {
    const newAppointment = await appointmentService.create(appointmentData);
    setAppointments([...appointments, newAppointment]);
  } catch (error) {
    console.error('创建预约失败:', error);
  }
};
```

---

##  第7步: 端到端测试

### 测试场景 1: 用户认证流程

```
 测试步骤:
1. 打开应用 → http://localhost:5173
2. 点击"登录"
3. 输入用户名和密码
4. 点击"登录"按钮

预期结果:
- 登录成功
- 页面重定向到仪表板
- Token保存到localStorage
```

### 测试场景 2: 客户管理

```
 测试步骤:
1. 进入"客户管理"页面
2. 点击"新增客户"
3. 填写客户信息
4. 点击"保存"

预期结果:
- 客户添加成功
- 列表中显示新客户
- 后端数据库有记录
```

### 测试场景 3: 预约管理

```
 测试步骤:
1. 进入"预约管理"页面
2. 点击"新增预约"
3. 选择客户、美容师、服务、时间
4. 点击"保存"

预期结果:
- 预约创建成功
- 列表中显示新预约
- 美容师可用性更新
```

### 测试场景 4: 产品管理

```
 测试步骤:
1. 进入"产品管理"页面
2. 点击"新增产品"
3. 填写产品信息
4. 点击"保存"

预期结果:
- 产品添加成功
- 列表中显示新产品
```

---

##  常见问题排查

### 问题 1: CORS错误

**错误信息**: `Access to XMLHttpRequest has been blocked by CORS policy`

**解决方案**:
```typescript
// 检查后端 src/server.ts 中的CORS配置
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
```

### 问题 2: 401 Unauthorized

**错误信息**: `401: Unauthorized`

**解决方案**:
1. 检查token是否正确存储
2. 检查Authorization header格式 (Bearer token)
3. 检查JWT_SECRET是否匹配

### 问题 3: 404 Not Found

**错误信息**: `404: Not Found`

**解决方案**:
1. 检查API端点是否正确
2. 检查后端路由是否正确定义
3. 检查HTTP方法是否正确 (GET, POST, PUT, DELETE)

### 问题 4: 网络超时

**错误信息**: `Request timeout`

**解决方案**:
1. 确认后端服务器正在运行
2. 增加timeout设置 (目前为10000ms)
3. 检查localhost:3001是否可访问

---

##  集成测试检查清单

| 功能 | 前端 | 后端 | 状态 |
|------|------|------|------|
| 用户注册 |  |  | [ ] |
| 用户登录 |  |  | [ ] |
| Token验证 |  |  | [ ] |
| 获取客户列表 |  |  | [ ] |
| 创建客户 |  |  | [ ] |
| 更新客户 |  |  | [ ] |
| 删除客户 |  |  | [ ] |
| 获取预约列表 |  |  | [ ] |
| 创建预约 |  |  | [ ] |
| 更新预约 |  |  | [ ] |
| 删除预约 |  |  | [ ] |
| 获取美容师列表 |  |  | [ ] |
| 获取产品列表 |  |  | [ ] |
| 创建产品 |  |  | [ ] |
| 搜索功能 |  |  | [ ] |
| 统计信息 |  |  | [ ] |

---

##  集成完成标志

 **当以下条件全部满足时，集成完成：**

1.  后端服务器正常运行在 `http://localhost:3001`
2.  前端可以调用所有API端点
3.  认证流程正常工作
4.  所有CRUD操作可用
5.  错误处理正确
6.  没有控制台错误
7.  没有CORS问题
8.  数据持久化正常

---

##  文件清单

```
前端项目结构:
src/
├── api/
│   ├── client.ts                 (API客户端配置)
│   └── services/
│       ├── authService.ts        (认证服务)
│       ├── customerService.ts    (客户服务)
│       ├── appointmentService.ts (预约服务)
│       ├── staffService.ts       (美容师服务)
│       └── productService.ts     (产品服务)
├── pages/
│   ├── Login.tsx                 (更新为使用authService)
│   ├── Dashboard.tsx
│   ├── Customers.tsx             (更新为使用customerService)
│   ├── Appointments.tsx          (更新为使用appointmentService)
│   ├── Staff.tsx                 (更新为使用staffService)
│   └── Products.tsx              (更新为使用productService)
└── types/
    └── auth.ts                   (类型定义)
```

---

##  完成标准

集成可视为完成，当满足以下条件：

1.  所有API服务都已创建
2.  所有页面都连接到API
3.  完整的功能工作流测试通过
4.  没有控制台错误
5.  数据在前端和后端之间同步

---

**集成指南到此结束。按照此指南操作，您的前后端将完美集成！** 
