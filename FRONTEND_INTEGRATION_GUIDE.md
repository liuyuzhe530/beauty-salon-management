#  前后端集成指南 - 第4步

##  目录

1. [环境配置](#环境配置)
2. [API服务集成](#api服务集成)
3. [认证流程](#认证流程)
4. [数据加载](#数据加载)
5. [错误处理](#错误处理)
6. [完整测试流程](#完整测试流程)

---

## 环境配置

### 1. 配置 `.env.local`

在项目根目录创建 `.env.local` 文件：

```env
# 后端API地址
VITE_API_URL=http://localhost:5000/api

# 应用名称
VITE_APP_NAME=美容院管理系统

# 日志级别
VITE_LOG_LEVEL=debug
```

### 2. 验证Vite配置

`vite.config.ts` 应该已经支持环境变量：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

---

## API服务集成

### 已创建的API服务类

文件：`src/services/api.ts`

#### 特性

 **统一的请求接口**
- 自动处理Token
- 统一的响应格式
- 标准的错误处理

 **完整的API方法**
- 认证相关 (6个)
- 客户管理 (11个)
- 预约管理 (10个)
- 美容师管理 (6个)
- 产品管理 (9个)

 **自动Token管理**
- localStorage存储
- 自动添加到请求头
- 登出时自动清除

### 使用示例

```typescript
import { apiService } from './services/api';

// 用户注册
const registerResult = await apiService.register({
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin@123',
  confirmPassword: 'Admin@123',
  role: 'admin'
});

// 用户登录
const loginResult = await apiService.login({
  username: 'admin',
  password: 'Admin@123'
});

// 获取客户列表
const customers = await apiService.getCustomers({
  page: 1,
  limit: 10
});

// 创建客户
const newCustomer = await apiService.createCustomer({
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  status: 'active'
});
```

---

## 认证流程

### LoginPage 组件集成

更新 `src/components/LoginPage.tsx`：

```typescript
import { useState } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import { UserRole } from '../types/index';

export function LoginPage({ onLoginSuccess }: { 
  onLoginSuccess: (role: UserRole) => void 
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as UserRole
  });

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      showToast('用户名和密码不能为空', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login({
        username: loginForm.username,
        password: loginForm.password
      });

      showToast('登录成功！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '登录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      showToast('请填写所有字段', 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(registerForm);
      showToast('注册成功，已自动登录！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '注册失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      {/* 登录/注册表单... */}
      {isLogin ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="密码"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      ) : (
        // 注册表单...
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="邮箱"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          {/* 其他字段... */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 数据加载

### CustomerManagement 组件集成

更新 `src/components/CustomerManagement.tsx`：

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';

export function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const { showToast } = useToast();

  // 加载客户列表
  const loadCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiService.getCustomers({
        page,
        limit: pagination.limit
      });

      setCustomers(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0
      });
    } catch (error: any) {
      showToast(error.message || '加载客户失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCustomers(1);
  }, []);

  // 创建客户
  const handleCreateCustomer = async (data: any) => {
    try {
      await apiService.createCustomer(data);
      showToast('创建成功', 'success');
      loadCustomers(1);
    } catch (error: any) {
      showToast(error.message || '创建失败', 'error');
    }
  };

  // 更新客户
  const handleUpdateCustomer = async (id: string, data: any) => {
    try {
      await apiService.updateCustomer(id, data);
      showToast('更新成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '更新失败', 'error');
    }
  };

  // 删除客户
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('确定要删除此客户吗？')) return;

    try {
      await apiService.deleteCustomer(id);
      showToast('删除成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  // 搜索客户
  const handleSearch = async (keyword: string) => {
    if (!keyword) {
      loadCustomers(1);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchCustomers(keyword);
      setCustomers(response.data || []);
    } catch (error: any) {
      showToast(error.message || '搜索失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* UI组件 - 列表、搜索、添加、编辑、删除等 */}
      <h1 className="text-2xl font-bold mb-6">客户管理</h1>
      
      {/* 加载状态 */}
      {loading && <div className="text-center py-8">加载中...</div>}

      {/* 客户列表 */}
      <div className="grid gap-4">
        {customers.map((customer: any) => (
          <div key={customer.id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold">{customer.name}</h3>
            <p className="text-gray-600">{customer.phone}</p>
            <p className="text-sm text-gray-500">状态: {customer.status}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateCustomer(customer.id, {...customer})}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                编辑
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => loadCustomers(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-4 py-2">
          第 {pagination.page} 页，共 {Math.ceil(pagination.total / pagination.limit)} 页
        </span>
        <button
          onClick={() => loadCustomers(pagination.page + 1)}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

---

## 错误处理

### 统一的错误处理

```typescript
import { useToast } from './Toast';

export function useApiError() {
  const { showToast } = useToast();

  const handleError = (error: any, defaultMessage = '操作失败') => {
    const message = error?.message || defaultMessage;
    const code = error?.code;

    // 根据错误代码显示不同的提示
    switch (code) {
      case 'UNAUTHORIZED':
        showToast('请重新登录', 'error');
        // 重定向到登录页
        break;
      case 'FORBIDDEN':
        showToast('您没有权限执行此操作', 'error');
        break;
      case 'NOT_FOUND':
        showToast('请求的资源不存在', 'error');
        break;
      default:
        showToast(message, 'error');
    }
  };

  return { handleError };
}
```

---

## 完整测试流程

### 1. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端开发服务器

```bash
npm install
npm run dev
```

### 3. 测试认证流程

- 打开 http://localhost:3000
- 选择注册或登录
- 使用后端API进行认证

### 4. 测试CRUD操作

- 登录成功后进入主页
- 测试客户管理功能
- 测试其他模块

### 5. 监控API调用

在浏览器开发者工具中查看网络请求：

- 所有API调用应该成功
- Token应该在Authorization头中
- 响应格式应该符合规范

---

##  关键集成点

| 功能 | 文件 | API |
|------|------|-----|
| 认证 | LoginPage.tsx | /api/auth/login, /api/auth/register |
| 客户管理 | CustomerManagement.tsx | /api/customers/* |
| 预约管理 | 预约组件 | /api/appointments/* |
| 美容师管理 | Staff.tsx | /api/staff/* |
| 产品管理 | Shop.tsx | /api/products/* |

---

##  相关文档

- 后端API文档: `backend/CRUD_API_GUIDE.md`
- API服务类: `src/services/api.ts`
- 认证指南: `backend/API_TESTING_GUIDE.md`

---

##  集成检查清单

- [ ] .env.local 配置正确
- [ ] 后端服务正在运行
- [ ] 前端服务正在运行
- [ ] 注册/登录功能正常
- [ ] 获取客户列表正常
- [ ] 创建/更新/删除客户正常
- [ ] 错误提示正确显示
- [ ] 加载状态正常显示
- [ ] 分页功能正常
- [ ] Token管理正常

---

**集成状态**:  进行中
**下一步**: 完整功能测试


##  目录

1. [环境配置](#环境配置)
2. [API服务集成](#api服务集成)
3. [认证流程](#认证流程)
4. [数据加载](#数据加载)
5. [错误处理](#错误处理)
6. [完整测试流程](#完整测试流程)

---

## 环境配置

### 1. 配置 `.env.local`

在项目根目录创建 `.env.local` 文件：

```env
# 后端API地址
VITE_API_URL=http://localhost:5000/api

# 应用名称
VITE_APP_NAME=美容院管理系统

# 日志级别
VITE_LOG_LEVEL=debug
```

### 2. 验证Vite配置

`vite.config.ts` 应该已经支持环境变量：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

---

## API服务集成

### 已创建的API服务类

文件：`src/services/api.ts`

#### 特性

 **统一的请求接口**
- 自动处理Token
- 统一的响应格式
- 标准的错误处理

 **完整的API方法**
- 认证相关 (6个)
- 客户管理 (11个)
- 预约管理 (10个)
- 美容师管理 (6个)
- 产品管理 (9个)

 **自动Token管理**
- localStorage存储
- 自动添加到请求头
- 登出时自动清除

### 使用示例

```typescript
import { apiService } from './services/api';

// 用户注册
const registerResult = await apiService.register({
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin@123',
  confirmPassword: 'Admin@123',
  role: 'admin'
});

// 用户登录
const loginResult = await apiService.login({
  username: 'admin',
  password: 'Admin@123'
});

// 获取客户列表
const customers = await apiService.getCustomers({
  page: 1,
  limit: 10
});

// 创建客户
const newCustomer = await apiService.createCustomer({
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  status: 'active'
});
```

---

## 认证流程

### LoginPage 组件集成

更新 `src/components/LoginPage.tsx`：

```typescript
import { useState } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import { UserRole } from '../types/index';

export function LoginPage({ onLoginSuccess }: { 
  onLoginSuccess: (role: UserRole) => void 
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as UserRole
  });

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      showToast('用户名和密码不能为空', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login({
        username: loginForm.username,
        password: loginForm.password
      });

      showToast('登录成功！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '登录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      showToast('请填写所有字段', 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(registerForm);
      showToast('注册成功，已自动登录！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '注册失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      {/* 登录/注册表单... */}
      {isLogin ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="密码"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      ) : (
        // 注册表单...
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="邮箱"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          {/* 其他字段... */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 数据加载

### CustomerManagement 组件集成

更新 `src/components/CustomerManagement.tsx`：

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';

export function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const { showToast } = useToast();

  // 加载客户列表
  const loadCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiService.getCustomers({
        page,
        limit: pagination.limit
      });

      setCustomers(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0
      });
    } catch (error: any) {
      showToast(error.message || '加载客户失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCustomers(1);
  }, []);

  // 创建客户
  const handleCreateCustomer = async (data: any) => {
    try {
      await apiService.createCustomer(data);
      showToast('创建成功', 'success');
      loadCustomers(1);
    } catch (error: any) {
      showToast(error.message || '创建失败', 'error');
    }
  };

  // 更新客户
  const handleUpdateCustomer = async (id: string, data: any) => {
    try {
      await apiService.updateCustomer(id, data);
      showToast('更新成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '更新失败', 'error');
    }
  };

  // 删除客户
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('确定要删除此客户吗？')) return;

    try {
      await apiService.deleteCustomer(id);
      showToast('删除成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  // 搜索客户
  const handleSearch = async (keyword: string) => {
    if (!keyword) {
      loadCustomers(1);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchCustomers(keyword);
      setCustomers(response.data || []);
    } catch (error: any) {
      showToast(error.message || '搜索失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* UI组件 - 列表、搜索、添加、编辑、删除等 */}
      <h1 className="text-2xl font-bold mb-6">客户管理</h1>
      
      {/* 加载状态 */}
      {loading && <div className="text-center py-8">加载中...</div>}

      {/* 客户列表 */}
      <div className="grid gap-4">
        {customers.map((customer: any) => (
          <div key={customer.id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold">{customer.name}</h3>
            <p className="text-gray-600">{customer.phone}</p>
            <p className="text-sm text-gray-500">状态: {customer.status}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateCustomer(customer.id, {...customer})}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                编辑
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => loadCustomers(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-4 py-2">
          第 {pagination.page} 页，共 {Math.ceil(pagination.total / pagination.limit)} 页
        </span>
        <button
          onClick={() => loadCustomers(pagination.page + 1)}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

---

## 错误处理

### 统一的错误处理

```typescript
import { useToast } from './Toast';

export function useApiError() {
  const { showToast } = useToast();

  const handleError = (error: any, defaultMessage = '操作失败') => {
    const message = error?.message || defaultMessage;
    const code = error?.code;

    // 根据错误代码显示不同的提示
    switch (code) {
      case 'UNAUTHORIZED':
        showToast('请重新登录', 'error');
        // 重定向到登录页
        break;
      case 'FORBIDDEN':
        showToast('您没有权限执行此操作', 'error');
        break;
      case 'NOT_FOUND':
        showToast('请求的资源不存在', 'error');
        break;
      default:
        showToast(message, 'error');
    }
  };

  return { handleError };
}
```

---

## 完整测试流程

### 1. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端开发服务器

```bash
npm install
npm run dev
```

### 3. 测试认证流程

- 打开 http://localhost:3000
- 选择注册或登录
- 使用后端API进行认证

### 4. 测试CRUD操作

- 登录成功后进入主页
- 测试客户管理功能
- 测试其他模块

### 5. 监控API调用

在浏览器开发者工具中查看网络请求：

- 所有API调用应该成功
- Token应该在Authorization头中
- 响应格式应该符合规范

---

##  关键集成点

| 功能 | 文件 | API |
|------|------|-----|
| 认证 | LoginPage.tsx | /api/auth/login, /api/auth/register |
| 客户管理 | CustomerManagement.tsx | /api/customers/* |
| 预约管理 | 预约组件 | /api/appointments/* |
| 美容师管理 | Staff.tsx | /api/staff/* |
| 产品管理 | Shop.tsx | /api/products/* |

---

##  相关文档

- 后端API文档: `backend/CRUD_API_GUIDE.md`
- API服务类: `src/services/api.ts`
- 认证指南: `backend/API_TESTING_GUIDE.md`

---

##  集成检查清单

- [ ] .env.local 配置正确
- [ ] 后端服务正在运行
- [ ] 前端服务正在运行
- [ ] 注册/登录功能正常
- [ ] 获取客户列表正常
- [ ] 创建/更新/删除客户正常
- [ ] 错误提示正确显示
- [ ] 加载状态正常显示
- [ ] 分页功能正常
- [ ] Token管理正常

---

**集成状态**:  进行中
**下一步**: 完整功能测试


##  目录

1. [环境配置](#环境配置)
2. [API服务集成](#api服务集成)
3. [认证流程](#认证流程)
4. [数据加载](#数据加载)
5. [错误处理](#错误处理)
6. [完整测试流程](#完整测试流程)

---

## 环境配置

### 1. 配置 `.env.local`

在项目根目录创建 `.env.local` 文件：

```env
# 后端API地址
VITE_API_URL=http://localhost:5000/api

# 应用名称
VITE_APP_NAME=美容院管理系统

# 日志级别
VITE_LOG_LEVEL=debug
```

### 2. 验证Vite配置

`vite.config.ts` 应该已经支持环境变量：

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

---

## API服务集成

### 已创建的API服务类

文件：`src/services/api.ts`

#### 特性

 **统一的请求接口**
- 自动处理Token
- 统一的响应格式
- 标准的错误处理

 **完整的API方法**
- 认证相关 (6个)
- 客户管理 (11个)
- 预约管理 (10个)
- 美容师管理 (6个)
- 产品管理 (9个)

 **自动Token管理**
- localStorage存储
- 自动添加到请求头
- 登出时自动清除

### 使用示例

```typescript
import { apiService } from './services/api';

// 用户注册
const registerResult = await apiService.register({
  username: 'admin',
  email: 'admin@example.com',
  password: 'Admin@123',
  confirmPassword: 'Admin@123',
  role: 'admin'
});

// 用户登录
const loginResult = await apiService.login({
  username: 'admin',
  password: 'Admin@123'
});

// 获取客户列表
const customers = await apiService.getCustomers({
  page: 1,
  limit: 10
});

// 创建客户
const newCustomer = await apiService.createCustomer({
  name: '张三',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  status: 'active'
});
```

---

## 认证流程

### LoginPage 组件集成

更新 `src/components/LoginPage.tsx`：

```typescript
import { useState } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';
import { UserRole } from '../types/index';

export function LoginPage({ onLoginSuccess }: { 
  onLoginSuccess: (role: UserRole) => void 
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'staff' as UserRole
  });

  // 处理登录
  const handleLogin = async () => {
    if (!loginForm.username || !loginForm.password) {
      showToast('用户名和密码不能为空', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login({
        username: loginForm.username,
        password: loginForm.password
      });

      showToast('登录成功！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '登录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 处理注册
  const handleRegister = async () => {
    if (!registerForm.username || !registerForm.email || !registerForm.password) {
      showToast('请填写所有字段', 'error');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      showToast('两次输入的密码不一致', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.register(registerForm);
      showToast('注册成功，已自动登录！', 'success');
      onLoginSuccess(response.data?.user?.role || 'staff');
    } catch (error: any) {
      showToast(error.message || '注册失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
      {/* 登录/注册表单... */}
      {isLogin ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={loginForm.username}
            onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="密码"
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '登录中...' : '登录'}
          </button>
        </div>
      ) : (
        // 注册表单...
        <div className="space-y-4">
          <input
            type="text"
            placeholder="用户名"
            value={registerForm.username}
            onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            placeholder="邮箱"
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            className="w-full px-4 py-2 border rounded"
          />
          {/* 其他字段... */}
          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## 数据加载

### CustomerManagement 组件集成

更新 `src/components/CustomerManagement.tsx`：

```typescript
import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { useToast } from './Toast';

export function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  const { showToast } = useToast();

  // 加载客户列表
  const loadCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await apiService.getCustomers({
        page,
        limit: pagination.limit
      });

      setCustomers(response.data || []);
      setPagination({
        page: response.pagination?.page || 1,
        limit: response.pagination?.limit || 10,
        total: response.pagination?.total || 0
      });
    } catch (error: any) {
      showToast(error.message || '加载客户失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 初始加载
  useEffect(() => {
    loadCustomers(1);
  }, []);

  // 创建客户
  const handleCreateCustomer = async (data: any) => {
    try {
      await apiService.createCustomer(data);
      showToast('创建成功', 'success');
      loadCustomers(1);
    } catch (error: any) {
      showToast(error.message || '创建失败', 'error');
    }
  };

  // 更新客户
  const handleUpdateCustomer = async (id: string, data: any) => {
    try {
      await apiService.updateCustomer(id, data);
      showToast('更新成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '更新失败', 'error');
    }
  };

  // 删除客户
  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('确定要删除此客户吗？')) return;

    try {
      await apiService.deleteCustomer(id);
      showToast('删除成功', 'success');
      loadCustomers(pagination.page);
    } catch (error: any) {
      showToast(error.message || '删除失败', 'error');
    }
  };

  // 搜索客户
  const handleSearch = async (keyword: string) => {
    if (!keyword) {
      loadCustomers(1);
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchCustomers(keyword);
      setCustomers(response.data || []);
    } catch (error: any) {
      showToast(error.message || '搜索失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* UI组件 - 列表、搜索、添加、编辑、删除等 */}
      <h1 className="text-2xl font-bold mb-6">客户管理</h1>
      
      {/* 加载状态 */}
      {loading && <div className="text-center py-8">加载中...</div>}

      {/* 客户列表 */}
      <div className="grid gap-4">
        {customers.map((customer: any) => (
          <div key={customer.id} className="border rounded p-4 bg-white shadow">
            <h3 className="font-bold">{customer.name}</h3>
            <p className="text-gray-600">{customer.phone}</p>
            <p className="text-sm text-gray-500">状态: {customer.status}</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleUpdateCustomer(customer.id, {...customer})}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                编辑
              </button>
              <button
                onClick={() => handleDeleteCustomer(customer.id)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 分页 */}
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => loadCustomers(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          上一页
        </button>
        <span className="px-4 py-2">
          第 {pagination.page} 页，共 {Math.ceil(pagination.total / pagination.limit)} 页
        </span>
        <button
          onClick={() => loadCustomers(pagination.page + 1)}
          disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          下一页
        </button>
      </div>
    </div>
  );
}
```

---

## 错误处理

### 统一的错误处理

```typescript
import { useToast } from './Toast';

export function useApiError() {
  const { showToast } = useToast();

  const handleError = (error: any, defaultMessage = '操作失败') => {
    const message = error?.message || defaultMessage;
    const code = error?.code;

    // 根据错误代码显示不同的提示
    switch (code) {
      case 'UNAUTHORIZED':
        showToast('请重新登录', 'error');
        // 重定向到登录页
        break;
      case 'FORBIDDEN':
        showToast('您没有权限执行此操作', 'error');
        break;
      case 'NOT_FOUND':
        showToast('请求的资源不存在', 'error');
        break;
      default:
        showToast(message, 'error');
    }
  };

  return { handleError };
}
```

---

## 完整测试流程

### 1. 启动后端服务

```bash
cd backend
npm install
npm run dev
```

### 2. 启动前端开发服务器

```bash
npm install
npm run dev
```

### 3. 测试认证流程

- 打开 http://localhost:3000
- 选择注册或登录
- 使用后端API进行认证

### 4. 测试CRUD操作

- 登录成功后进入主页
- 测试客户管理功能
- 测试其他模块

### 5. 监控API调用

在浏览器开发者工具中查看网络请求：

- 所有API调用应该成功
- Token应该在Authorization头中
- 响应格式应该符合规范

---

##  关键集成点

| 功能 | 文件 | API |
|------|------|-----|
| 认证 | LoginPage.tsx | /api/auth/login, /api/auth/register |
| 客户管理 | CustomerManagement.tsx | /api/customers/* |
| 预约管理 | 预约组件 | /api/appointments/* |
| 美容师管理 | Staff.tsx | /api/staff/* |
| 产品管理 | Shop.tsx | /api/products/* |

---

##  相关文档

- 后端API文档: `backend/CRUD_API_GUIDE.md`
- API服务类: `src/services/api.ts`
- 认证指南: `backend/API_TESTING_GUIDE.md`

---

##  集成检查清单

- [ ] .env.local 配置正确
- [ ] 后端服务正在运行
- [ ] 前端服务正在运行
- [ ] 注册/登录功能正常
- [ ] 获取客户列表正常
- [ ] 创建/更新/删除客户正常
- [ ] 错误提示正确显示
- [ ] 加载状态正常显示
- [ ] 分页功能正常
- [ ] Token管理正常

---

**集成状态**:  进行中
**下一步**: 完整功能测试







