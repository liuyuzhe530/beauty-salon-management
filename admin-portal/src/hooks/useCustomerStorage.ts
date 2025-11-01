import { useState, useCallback, useEffect } from 'react';
import { Customer } from '../types/index';
import { customerService } from '../api';
import { customers as initialData } from '../data/customerData';

const STORAGE_KEY = 'beauty_salon_customers';

export const useCustomerStorage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初始化 - 从API或localStorage
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 尝试从API加载
        try {
          const apiCustomers = await customerService.getAll();
          if (apiCustomers && apiCustomers.length > 0) {
            setCustomers(apiCustomers);
            // 同步到本地存储
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apiCustomers));
            return;
          }
        } catch (apiError) {
          console.warn('API加载客户失败，使用本地缓存:', apiError);
        }

        // 如果API失败，从本地存储加载
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
  const addCustomer = useCallback(async (newCustomer: Omit<Customer, 'id'>) => {
    try {
      // 尝试通过API添加
      try {
        const apiCustomer = await customerService.create(newCustomer as any);
        setCustomers(prev => {
          const updated = [...prev, apiCustomer];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return apiCustomer;
      } catch (apiError) {
        console.warn('API添加客户失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      const id = Date.now().toString();
      const customer: Customer = {
        ...newCustomer as any,
        id
      };

      setCustomers(prev => {
        const updated = [...prev, customer];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return customer;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  }, []);

  // 更新客户
  const updateCustomer = useCallback(async (id: string, updates: Partial<Customer>) => {
    try {
      // 尝试通过API更新
      try {
        await customerService.update(id, updates as any);
        setCustomers(prev => {
          const updated = prev.map(c =>
            c.id === id ? { ...c, ...updates } : c
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return true;
      } catch (apiError) {
        console.warn('API更新客户失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setCustomers(prev => {
        const updated = prev.map(c =>
          c.id === id ? { ...c, ...updates } : c
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return true;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }, []);

  // 删除客户
  const deleteCustomer = useCallback(async (id: string) => {
    try {
      // 尝试通过API删除
      try {
        await customerService.delete(id);
        setCustomers(prev => {
          const updated = prev.filter(c => c.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return;
      } catch (apiError) {
        console.warn('API删除客户失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setCustomers(prev => {
        const updated = prev.filter(c => c.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
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
