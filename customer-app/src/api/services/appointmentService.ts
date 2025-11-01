import apiClient from '../client';

interface Appointment {
  id?: string;
  customerId: string;
  staffId: string;
  service: string;
  appointmentDate: string;
  duration?: number;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  price: number;
}

export const appointmentService = {
  // 获取所有预约
  async getAll() {
    try {
      const response = await apiClient.get('/appointments');
      return response.data.data || [];
    } catch (error) {
      console.error('获取预约列表失败:', error);
      throw error;
    }
  },

  // 获取预约详情
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/appointments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('获取预约详情失败:', error);
      throw error;
    }
  },

  // 创建预约
  async create(data: Appointment) {
    try {
      const response = await apiClient.post('/appointments', data);
      return response.data.data;
    } catch (error) {
      console.error('创建预约失败:', error);
      throw error;
    }
  },

  // 更新预约
  async update(id: string, data: Appointment) {
    try {
      const response = await apiClient.put(`/appointments/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('更新预约失败:', error);
      throw error;
    }
  },

  // 删除预约
  async delete(id: string) {
    try {
      await apiClient.delete(`/appointments/${id}`);
      return true;
    } catch (error) {
      console.error('删除预约失败:', error);
      throw error;
    }
  },

  // 获取客户的预约
  async getByCustomer(customerId: string) {
    try {
      const response = await apiClient.get(`/appointments/customer/${customerId}`);
      return response.data.data || [];
    } catch (error) {
      console.error('获取客户预约失败:', error);
      throw error;
    }
  },

  // 获取即将到来的预约
  async getUpcoming(days: number = 7) {
    try {
      const response = await apiClient.get(`/appointments/upcoming?days=${days}`);
      return response.data.data || [];
    } catch (error) {
      console.error('获取即将到来的预约失败:', error);
      throw error;
    }
  },

  // 获取统计信息
  async getStats() {
    try {
      const response = await apiClient.get('/appointments/stats');
      return response.data.data;
    } catch (error) {
      console.error('获取预约统计失败:', error);
      throw error;
    }
  },
};
