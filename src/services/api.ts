// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const AUTH_TOKEN_KEY = 'authToken';
const USER_KEY = 'currentUser';

// Types for API responses
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'staff' | 'manager';
  isActive: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalSpending: number;
  appointmentCount: number;
  preferredStaff?: string;
  status: 'active' | 'atrisk' | 'inactive';
  lastVisit?: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  customerId: string;
  staffId: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Staff {
  id: string;
  name: string;
  phone: string;
  email: string;
  specialty: string;
  experience: number;
  rating: number;
  totalRevenue: number;
  clientCount: number;
  status: 'active' | 'inactive';
  certifications?: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  sold: number;
  image?: string;
}

export interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  duration: string;
  students: number;
  status: 'live' | 'upcoming' | 'ended';
  topic: string;
  image?: string;
  description?: string;
  capacity?: number;
  tags?: string[];
  avgRating?: number;
  reviews?: number;
}

// Main API Client Class
export class APIClient {
  private baseURL: string;
  private token: string | null;
  private user: User | null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = this.getStoredToken();
    this.user = this.getStoredUser();
  }

  /**
   * Storage Management
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  private getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  private saveToken(token: string): void {
    this.token = token;
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  private saveUser(user: User): void {
    this.user = user;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Core Request Method
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });

      // Handle 401 Unauthorized
      if (response.status === 401) {
        this.clearAuth();
        window.location.href = '/login';
        throw new Error('Authentication failed. Please login again.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * =====================
   * Authentication APIs
   * =====================
   */

  async register(data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/auth/register', data);
    this.saveToken(response.token);
    this.saveUser(response.user);
    return response;
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('POST', '/auth/login', {
      username,
      password,
    });
    this.saveToken(response.token);
    this.saveUser(response.user);
    return response;
  }

  async verify(): Promise<{ valid: boolean; user?: User }> {
    return this.request('GET', '/auth/verify');
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('GET', '/auth/me');
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<{ message: string }> {
    return this.request('POST', '/auth/change-password', {
      oldPassword,
      newPassword,
    });
  }

  async logout(): Promise<void> {
    this.clearAuth();
  }

  /**
   * =====================
   * Customer APIs (11 endpoints)
   * =====================
   */

  async createCustomer(data: Partial<Customer>): Promise<Customer> {
    return this.request<Customer>('POST', '/customers', data);
  }

  async getCustomers(page: number = 1, limit: number = 10): Promise<{ customers: Customer[]; total: number }> {
    return this.request('GET', `/customers?page=${page}&limit=${limit}`);
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>('GET', `/customers/${id}`);
  }

  async updateCustomer(id: string, data: Partial<Customer>): Promise<Customer> {
    return this.request<Customer>('PUT', `/customers/${id}`, data);
  }

  async deleteCustomer(id: string): Promise<{ message: string }> {
    return this.request('DELETE', `/customers/${id}`);
  }

  async deleteCustomersBatch(ids: string[]): Promise<{ message: string; deleted: number }> {
    return this.request('POST', '/customers/batch/delete', { ids });
  }

  async getActiveCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('GET', '/customers/status/active');
  }

  async getAtRiskCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('GET', '/customers/status/atrisk');
  }

  async searchCustomers(query: string): Promise<Customer[]> {
    return this.request<Customer[]>('GET', `/customers/search?q=${encodeURIComponent(query)}`);
  }

  async updateCustomerSpending(id: string, amount: number): Promise<Customer> {
    return this.request<Customer>('PUT', `/customers/${id}/spending`, { amount });
  }

  async getCustomerStatistics(): Promise<any> {
    return this.request('GET', '/customers/statistics');
  }

  /**
   * =====================
   * Appointment APIs (13 endpoints)
   * =====================
   */

  async createAppointment(data: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>('POST', '/appointments', data);
  }

  async getAppointments(page: number = 1, limit: number = 10): Promise<{ appointments: Appointment[]; total: number }> {
    return this.request('GET', `/appointments?page=${page}&limit=${limit}`);
  }

  async getAppointment(id: string): Promise<Appointment> {
    return this.request<Appointment>('GET', `/appointments/${id}`);
  }

  async updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment> {
    return this.request<Appointment>('PUT', `/appointments/${id}`, data);
  }

  async deleteAppointment(id: string): Promise<{ message: string }> {
    return this.request('DELETE', `/appointments/${id}`);
  }

  async deleteAppointmentsBatch(ids: string[]): Promise<{ message: string; deleted: number }> {
    return this.request('POST', '/appointments/batch/delete', { ids });
  }

  async getTodayAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('GET', '/appointments/today');
  }

  async getPendingAppointments(): Promise<Appointment[]> {
    return this.request<Appointment[]>('GET', '/appointments/pending');
  }

  async getCustomerAppointments(customerId: string): Promise<Appointment[]> {
    return this.request<Appointment[]>('GET', `/appointments/customer/${customerId}`);
  }

  async getStaffAppointments(staffId: string): Promise<Appointment[]> {
    return this.request<Appointment[]>('GET', `/appointments/staff/${staffId}`);
  }

  async confirmAppointment(id: string): Promise<Appointment> {
    return this.request<Appointment>('PUT', `/appointments/${id}/confirm`);
  }

  async completeAppointment(id: string): Promise<Appointment> {
    return this.request<Appointment>('PUT', `/appointments/${id}/complete`);
  }

  async cancelAppointment(id: string): Promise<Appointment> {
    return this.request<Appointment>('PUT', `/appointments/${id}/cancel`);
  }

  async getAppointmentStatistics(): Promise<any> {
    return this.request('GET', '/appointments/statistics');
  }

  /**
   * =====================
   * Staff APIs (11 endpoints)
   * =====================
   */

  async createStaff(data: Partial<Staff>): Promise<Staff> {
    return this.request<Staff>('POST', '/staff', data);
  }

  async getStaff(page: number = 1, limit: number = 10): Promise<{ staff: Staff[]; total: number }> {
    return this.request('GET', `/staff?page=${page}&limit=${limit}`);
  }

  async getStaffMember(id: string): Promise<Staff> {
    return this.request<Staff>('GET', `/staff/${id}`);
  }

  async updateStaff(id: string, data: Partial<Staff>): Promise<Staff> {
    return this.request<Staff>('PUT', `/staff/${id}`, data);
  }

  async deleteStaff(id: string): Promise<{ message: string }> {
    return this.request('DELETE', `/staff/${id}`);
  }

  async deleteStaffBatch(ids: string[]): Promise<{ message: string; deleted: number }> {
    return this.request('POST', '/staff/batch/delete', { ids });
  }

  async getActiveStaff(): Promise<Staff[]> {
    return this.request<Staff[]>('GET', '/staff/active');
  }

  async getTopRatedStaff(): Promise<Staff[]> {
    return this.request<Staff[]>('GET', '/staff/top-rated');
  }

  async searchStaff(query: string): Promise<Staff[]> {
    return this.request<Staff[]>('GET', `/staff/search?q=${encodeURIComponent(query)}`);
  }

  async updateStaffRating(id: string, rating: number): Promise<Staff> {
    return this.request<Staff>('PUT', `/staff/${id}/rating`, { rating });
  }

  async getStaffStatistics(): Promise<any> {
    return this.request('GET', '/staff/statistics');
  }

  /**
   * =====================
   * Product APIs (14 endpoints)
   * =====================
   */

  async createProduct(data: Partial<Product>): Promise<Product> {
    return this.request<Product>('POST', '/products', data);
  }

  async getProducts(page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number }> {
    return this.request('GET', `/products?page=${page}&limit=${limit}`);
  }

  async getProduct(id: string): Promise<Product> {
    return this.request<Product>('GET', `/products/${id}`);
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<Product> {
    return this.request<Product>('PUT', `/products/${id}`, data);
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    return this.request('DELETE', `/products/${id}`);
  }

  async deleteProductsBatch(ids: string[]): Promise<{ message: string; deleted: number }> {
    return this.request('POST', '/products/batch/delete', { ids });
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.request<Product[]>('GET', `/products/category/${encodeURIComponent(category)}`);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.request<Product[]>('GET', `/products/search?q=${encodeURIComponent(query)}`);
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.request<Product[]>('GET', '/products/low-stock');
  }

  async getTopSellingProducts(): Promise<Product[]> {
    return this.request<Product[]>('GET', '/products/top-selling');
  }

  async decreaseProductStock(id: string, quantity: number): Promise<Product> {
    return this.request<Product>('PUT', `/products/${id}/decrease-stock`, { quantity });
  }

  async increaseProductStock(id: string, quantity: number): Promise<Product> {
    return this.request<Product>('PUT', `/products/${id}/increase-stock`, { quantity });
  }

  async getProductStatistics(): Promise<any> {
    return this.request('GET', '/products/statistics');
  }

  async getProductCategories(): Promise<string[]> {
    return this.request<string[]>('GET', '/products/categories');
  }

  /**
   * =====================
   * Live Classes APIs (for Training & Education)
   * =====================
   */

  async getLiveClasses(): Promise<LiveClass[]> {
    return this.request<LiveClass[]>('GET', '/live-classes');
  }

  async getLiveClass(id: string): Promise<LiveClass> {
    return this.request<LiveClass>('GET', `/live-classes/${id}`);
  }

  /**
   * =====================
   * Utility Methods
   * =====================
   */

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUserInfo(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }

  setToken(token: string): void {
    this.saveToken(token);
  }
}

// Export singleton instance
export const api = new APIClient();

