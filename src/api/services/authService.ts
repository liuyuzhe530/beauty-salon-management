import apiClient from '../client';

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'staff' | 'customer';
}

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'customer';
  isActive: boolean;
}

export const authService = {
  // 用户登录
  async login(data: LoginRequest) {
    try {
      const response = await apiClient.post('/auth/login', data);
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    }
  },

  // 用户注册
  async register(data: RegisterRequest) {
    try {
      const response = await apiClient.post('/auth/register', data);
      if (response.data.data?.token) {
        localStorage.setItem('authToken', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error) {
      console.error('注册失败:', error);
      throw error;
    }
  },

  // 验证token
  async verify() {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      console.error('验证失败:', error);
      throw error;
    }
  },

  // 登出
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  // 获取当前token
  getToken(): string | null {
    return localStorage.getItem('authToken');
  },

  // 获取当前用户
  getUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // 检查是否已登录
  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  },

  // 检查用户角色
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  },
};
