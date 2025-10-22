# 🔗 前端与后端 API 集成指南

## 📌 快速开始

### 1. 后端服务器状态
**状态**: ✅ **运行中**  
**地址**: http://localhost:5000  
**API基础URL**: http://localhost:5000/api

### 2. 创建 API 服务类

在 `src/services/api.ts` 中创建 API 服务:

```typescript
import axios, { AxiosInstance } from 'axios';

interface LoginResponse {
  message: string;
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    name: string;
  };
  token: string;
}

class ApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: 'http://localhost:5000/api',
      timeout: 10000,
    });

    // Add token to requests
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = \`Bearer \${this.token}\`;
      }
      return config;
    });

    // Load token from localStorage
    this.token = localStorage.getItem('authToken');
  }

  // Auth Methods
  async register(username: string, email: string, password: string, role: string) {
    const response = await this.api.post<LoginResponse>('/auth/register', {
      username,
      email,
      password,
      role,
    });
    this.setToken(response.data.token);
    return response.data;
  }

  async login(username: string, password: string) {
    const response = await this.api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });
    this.setToken(response.data.token);
    return response.data;
  }

  async verifyToken() {
    return await this.api.get('/auth/verify');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  // Customer Methods
  async getCustomers(search?: string, status?: string) {
    const response = await this.api.get('/customers', {
      params: { search, status },
    });
    return response.data;
  }

  async getCustomer(id: string) {
    const response = await this.api.get(\`/customers/\${id}\`);
    return response.data;
  }

  async createCustomer(data: any) {
    const response = await this.api.post('/customers', data);
    return response.data;
  }

  async updateCustomer(id: string, data: any) {
    const response = await this.api.put(\`/customers/\${id}\`, data);
    return response.data;
  }

  async deleteCustomer(id: string) {
    const response = await this.api.delete(\`/customers/\${id}\`);
    return response.data;
  }

  // Appointment Methods
  async getAppointments(status?: string, date?: string, staffName?: string) {
    const response = await this.api.get('/appointments', {
      params: { status, date, staffName },
    });
    return response.data;
  }

  async createAppointment(data: any) {
    const response = await this.api.post('/appointments', data);
    return response.data;
  }

  async updateAppointment(id: string, data: any) {
    const response = await this.api.put(\`/appointments/\${id}\`, data);
    return response.data;
  }

  async deleteAppointment(id: string) {
    const response = await this.api.delete(\`/appointments/\${id}\`);
    return response.data;
  }

  // Staff Methods
  async getStaff(search?: string, status?: string, specialty?: string) {
    const response = await this.api.get('/staff', {
      params: { search, status, specialty },
    });
    return response.data;
  }

  async createStaff(data: any) {
    const response = await this.api.post('/staff', data);
    return response.data;
  }

  async updateStaff(id: string, data: any) {
    const response = await this.api.put(\`/staff/\${id}\`, data);
    return response.data;
  }

  async deleteStaff(id: string) {
    const response = await this.api.delete(\`/staff/\${id}\`);
    return response.data;
  }

  // Product Methods
  async getProducts(search?: string, category?: string, status?: string) {
    const response = await this.api.get('/products', {
      params: { search, category, status },
    });
    return response.data;
  }

  async createProduct(data: any) {
    const response = await this.api.post('/products', data);
    return response.data;
  }

  async updateProduct(id: string, data: any) {
    const response = await this.api.put(\`/products/\${id}\`, data);
    return response.data;
  }

  async deleteProduct(id: string) {
    const response = await this.api.delete(\`/products/\${id}\`);
    return response.data;
  }

  async getCategories() {
    const response = await this.api.get('/products/categories/list');
    return response.data;
  }

  async getLowStockProducts() {
    const response = await this.api.get('/products/stock/low');
    return response.data;
  }
}

export const apiService = new ApiService();
```

---

## 📦 安装依赖

在前端项目中安装 axios:

```bash
cd E:\xincs\xincs
npm install axios
```

---

## 🔑 环境配置

在 `.env` 文件中添加:

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🎯 集成步骤

### 1. 修改登录流程

在 `src/App.tsx` 中添加认证逻辑:

```typescript
import { apiService } from './services/api';

// Login handler
const handleLogin = async (username: string, password: string) => {
  try {
    const result = await apiService.login(username, password);
    setUserRole(result.user.role);
    setCurrentPage('dashboard');
  } catch (error) {
    console.error('Login failed:', error);
    // Show error toast
  }
};
```

### 2. 修改客户管理获取数据

在 `useCustomerStorage.ts` 中集成 API:

```typescript
import { apiService } from '../services/api';

export const useCustomerStorage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  // Fetch from API
  const fetchCustomers = async () => {
    try {
      const result = await apiService.getCustomers();
      setCustomers(result.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    }
  };

  // Create customer
  const addCustomer = async (customer: Omit<Customer, 'id'>) => {
    try {
      const result = await apiService.createCustomer(customer);
      const newCustomer: Customer = { ...result.data, id: result.data._id };
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  };

  // Update customer
  const updateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const result = await apiService.updateCustomer(id, updates);
      const updated: Customer = { ...result.data, id: result.data._id };
      setCustomers(customers.map(c => c.id === id ? updated : c));
      return updated;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  };

  // Delete customer
  const deleteCustomer = async (id: string) => {
    try {
      await apiService.deleteCustomer(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    searchCustomers: (query: string) => /* ... */,
    filterByStatus: (status: string) => /* ... */,
  };
};
```

---

## 📊 迁移计划

### 当前状态
✅ 本地 localStorage 数据存储  
✅ 后端 API 完全实现  

### 迁移步骤
1. **保持现有逻辑** - 前端继续使用 localStorage
2. **逐步集成** - 模块一个接一个集成到后端
3. **数据同步** - 新增/修改/删除时同时保存到后端
4. **切换完成** - 完全迁移到后端

---

## 🧪 测试 API

### 使用 Postman 或 curl 测试

**测试登录**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin001","password":"password123"}'
```

**测试创建客户**:
```bash
curl -X POST http://localhost:5000/api/customers \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "name":"李雨晨",
    "phone":"13900000001",
    "email":"li@example.com",
    "status":"active"
  }'
```

---

## ⚠️ 常见问题

### Q: CORS 错误？
A: 后端已配置 CORS，确保后端服务正在运行。

### Q: 认证失败？
A: 检查 JWT Token 是否正确传递。

### Q: 数据不同步？
A: 确保 localStorage 和数据库的结构一致。

---

## 🚀 下一步

1. ✅ 后端 API 实现完成
2. ⏳ 前端集成 API 服务
3. ⏳ 数据迁移和验证
4. ⏳ 生产部署

---

**版本**: 1.0.0  
**最后更新**: 2025-10-21




