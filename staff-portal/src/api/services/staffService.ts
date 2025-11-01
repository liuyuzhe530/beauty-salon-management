import apiClient from '../client';

interface Staff {
  id?: string;
  firstName: string;
  lastName?: string;
  specialization: string;
  phone: string;
  email?: string;
  isAvailable?: boolean;
}

export const staffService = {
  // 获取所有美容师
  async getAll() {
    try {
      const response = await apiClient.get('/staff');
      return response.data.data || [];
    } catch (error) {
      console.error('获取美容师列表失败:', error);
      throw error;
    }
  },

  // 获取美容师详情
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/staff/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('获取美容师详情失败:', error);
      throw error;
    }
  },

  // 创建美容师
  async create(data: Staff) {
    try {
      const response = await apiClient.post('/staff', data);
      return response.data.data;
    } catch (error) {
      console.error('创建美容师失败:', error);
      throw error;
    }
  },

  // 更新美容师
  async update(id: string, data: Staff) {
    try {
      const response = await apiClient.put(`/staff/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('更新美容师失败:', error);
      throw error;
    }
  },

  // 删除美容师
  async delete(id: string) {
    try {
      await apiClient.delete(`/staff/${id}`);
      return true;
    } catch (error) {
      console.error('删除美容师失败:', error);
      throw error;
    }
  },

  // 获取可用美容师
  async getAvailable() {
    try {
      const response = await apiClient.get('/staff/available');
      return response.data.data || [];
    } catch (error) {
      console.error('获取可用美容师失败:', error);
      throw error;
    }
  },

  // 获取统计信息
  async getStats() {
    try {
      const response = await apiClient.get('/staff/stats');
      return response.data.data;
    } catch (error) {
      console.error('获取美容师统计失败:', error);
      throw error;
    }
  },
};
