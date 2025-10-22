import { useState, useCallback, useEffect } from 'react';
import { Customer } from '../types/index';
import { customers as initialData } from '../data/customerData';

const STORAGE_KEY = 'beauty_salon_customers';

export const useCustomerStorage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化 - 从 localStorage
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 从本地存储加载
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setCustomers(JSON.parse(stored));
        } else {
          setCustomers(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Failed to load customers:', error);
        setError('加载客户数据失败');
        setCustomers(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  // 添加客户
  const addCustomer = useCallback((newCustomer: Omit<Customer, 'id'>) => {
    const id = Date.now().toString();
    const customer: Customer = {
      ...newCustomer,
      id
    };

    setCustomers(prev => {
      const updated = [...prev, customer];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return customer;
  }, []);

  // 更新客户
  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => {
      const updated = prev.map(c =>
        c.id === id ? { ...c, ...updates } : c
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 删除客户
  const deleteCustomer = useCallback((id: string) => {
    setCustomers(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 获取单个客户
  const getCustomer = useCallback((id: string) => {
    return customers.find(c => c.id === id);
  }, [customers]);

  // 搜索客户
  const searchCustomers = useCallback((keyword: string) => {
    if (!keyword.trim()) return customers;

    const lower = keyword.toLowerCase();
    return customers.filter(c =>
      c.name.toLowerCase().includes(lower) ||
      c.phone.toLowerCase().includes(lower)
    );
  }, [customers]);

  // 按状态筛选
  const filterByStatus = useCallback((status: Customer['status']) => {
    return customers.filter(c => c.status === status);
  }, [customers]);

  // 重置为初始数据
  const resetToInitial = useCallback(() => {
    setCustomers(initialData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }, []);

  return {
    customers,
    isLoading,
    error,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomer,
    searchCustomers,
    filterByStatus,
    resetToInitial
  };
};
