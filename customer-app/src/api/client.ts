import axios from 'axios';

// 创建API客户端实例
export const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误和过期token
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token过期或无效，清除token并重定向到登录
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
      console.warn('认证已过期，请重新登录');
    }
    
    if (error.response?.status === 403) {
      console.warn('权限不足:', error.response.data?.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
