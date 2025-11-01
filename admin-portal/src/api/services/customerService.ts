import apiClient from '../client';

interface Customer {
  id?: string;
  firstName: string;
  lastName?: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  notes?: string;
}

export const customerService = {
  // 获取所有客户
  async getAll() {
    try {
      const response = await apiClient.get('/customers');
      return response.data.data || [];
    } catch (error) {
      console.error('获取客户列表失败:', error);
      throw error;
    }
  },

  // 获取客户详情
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/customers/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('获取客户详情失败:', error);
      throw error;
    }
  },

  // 创建客户
  async create(data: Customer) {
    try {
      const response = await apiClient.post('/customers', data);
      return response.data.data;
    } catch (error) {
      console.error('创建客户失败:', error);
      throw error;
    }
  },

  // 更新客户
  async update(id: string, data: Customer) {
    try {
      const response = await apiClient.put(`/customers/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('更新客户失败:', error);
      throw error;
    }
  },

  // 删除客户
  async delete(id: string) {
    try {
      await apiClient.delete(`/customers/${id}`);
      return true;
    } catch (error) {
      console.error('删除客户失败:', error);
      throw error;
    }
  },

  // 按电话查询
  async getByPhone(phone: string) {
    try {
      const response = await apiClient.get(`/customers/phone/${phone}`);
      return response.data.data;
    } catch (error) {
      console.error('按电话查询客户失败:', error);
      throw error;
    }
  },

  // 获取统计信息
  async getStats() {
    try {
      const response = await apiClient.get('/customers/stats');
      return response.data.data;
    } catch (error) {
      console.error('获取客户统计失败:', error);
      throw error;
    }
  },
};
