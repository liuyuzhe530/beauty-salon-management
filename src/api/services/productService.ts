import apiClient from '../client';

interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock?: number;
  isActive?: boolean;
}

export const productService = {
  // 获取所有产品
  async getAll() {
    try {
      const response = await apiClient.get('/products');
      return response.data.data || [];
    } catch (error) {
      console.error('获取产品列表失败:', error);
      throw error;
    }
  },

  // 获取产品详情
  async getById(id: string) {
    try {
      const response = await apiClient.get(`/products/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('获取产品详情失败:', error);
      throw error;
    }
  },

  // 创建产品
  async create(data: Product) {
    try {
      const response = await apiClient.post('/products', data);
      return response.data.data;
    } catch (error) {
      console.error('创建产品失败:', error);
      throw error;
    }
  },

  // 更新产品
  async update(id: string, data: Product) {
    try {
      const response = await apiClient.put(`/products/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.error('更新产品失败:', error);
      throw error;
    }
  },

  // 删除产品
  async delete(id: string) {
    try {
      await apiClient.delete(`/products/${id}`);
      return true;
    } catch (error) {
      console.error('删除产品失败:', error);
      throw error;
    }
  },

  // 按分类查询
  async getByCategory(category: string) {
    try {
      const response = await apiClient.get(`/products/category/${category}`);
      return response.data.data || [];
    } catch (error) {
      console.error('按分类查询产品失败:', error);
      throw error;
    }
  },

  // 搜索产品
  async search(name: string) {
    try {
      const response = await apiClient.get(`/products/search?name=${name}`);
      return response.data.data || [];
    } catch (error) {
      console.error('搜索产品失败:', error);
      throw error;
    }
  },

  // 获取统计信息
  async getStats() {
    try {
      const response = await apiClient.get('/products/stats');
      return response.data.data;
    } catch (error) {
      console.error('获取产品统计失败:', error);
      throw error;
    }
  },
};
