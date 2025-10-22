/**
 * API 服务类 - 与后端 API 通信的统一接口
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  code?: string;
  data?: T;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  timestamp?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
}

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // 认证接口
  async register(data: { username: string; password: string; email: string }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { username: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async logout() {
    return this.request('/auth/logout', { method: 'POST' });
  }

  async verifyToken() {
    return this.request('/auth/verify', { method: 'POST' });
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  // 客户接口
  async getCustomers(params?: PaginationParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/customers${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  async getCustomer(id: string) {
    return this.request(`/customers/${id}`, { method: 'GET' });
  }

  async createCustomer(data: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string) {
    return this.request(`/customers/${id}`, { method: 'DELETE' });
  }

  // 预约接口
  async getAppointments(params?: PaginationParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/appointments${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  async getAppointment(id: string) {
    return this.request(`/appointments/${id}`, { method: 'GET' });
  }

  async createAppointment(data: any) {
    return this.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateAppointment(id: string, data: any) {
    return this.request(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteAppointment(id: string) {
    return this.request(`/appointments/${id}`, { method: 'DELETE' });
  }

  // 员工接口
  async getStaff(params?: PaginationParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/staff${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  async getStaffMember(id: string) {
    return this.request(`/staff/${id}`, { method: 'GET' });
  }

  async createStaff(data: any) {
    return this.request('/staff', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateStaff(id: string, data: any) {
    return this.request(`/staff/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteStaff(id: string) {
    return this.request(`/staff/${id}`, { method: 'DELETE' });
  }

  // 产品接口
  async getProducts(params?: PaginationParams) {
    const query = new URLSearchParams(params as any).toString();
    return this.request(`/products${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  }

  async getProduct(id: string) {
    return this.request(`/products/${id}`, { method: 'GET' });
  }

  async createProduct(data: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }
}

export const apiService = new ApiService();

