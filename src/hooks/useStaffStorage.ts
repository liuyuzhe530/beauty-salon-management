import { useState, useCallback, useEffect } from 'react';
import { Staff } from '../types/index';
import { staffService } from '../api';
import { staffData as initialData } from '../data/staffData';

const STORAGE_KEY = 'beauty_salon_staff';

export const useStaffStorage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = async () => {
      try {
        // 尝试从API加载
        try {
          const apiStaff = await staffService.getAll();
          if (apiStaff && apiStaff.length > 0) {
            setStaff(apiStaff);
            // 同步到本地存储
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apiStaff));
            return;
          }
        } catch (apiError) {
          console.warn('API加载美容师失败，使用本地缓存:', apiError);
        }

        // 如果API失败，从本地存储加载
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setStaff(JSON.parse(stored));
        } else {
          setStaff(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Failed to load staff from localStorage:', error);
        setStaff(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadStaff();
  }, []);

  // 添加员工
  const addStaff = useCallback((newStaff: Omit<Staff, 'id'>) => {
    const id = Date.now().toString();
    const staff: Staff = {
      ...newStaff as any,
      id
    };

    setStaff(prev => {
      const updated = [...prev, staff];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return staff;
  }, []);

  // 更新员工
  const updateStaff = useCallback((id: string, updates: Partial<Staff>) => {
    setStaff(prev => {
      const updated = prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteStaff = useCallback(async (id: string) => {
    try {
      // 尝试通过API删除
      try {
        await staffService.delete(id);
        setStaff(prev => {
          const updated = prev.filter(s => s.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return;
      } catch (apiError) {
        console.warn('API删除美容师失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setStaff(prev => {
        const updated = prev.filter(s => s.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete staff:', error);
      throw error;
    }
  }, []);

  const getStaff = useCallback((id: string) => {
    return staff.find(s => s.id === id);
  }, [staff]);

  const searchStaff = useCallback((keyword: string) => {
    if (!keyword.trim()) return staff;
    const lower = keyword.toLowerCase();
    return staff.filter(s =>
      s.name.toLowerCase().includes(lower) ||
      s.phone.toLowerCase().includes(lower)
    );
  }, [staff]);

  const filterBySpecialty = useCallback((specialty: string) => {
    return staff.filter(s => s.specialty.includes(specialty));
  }, [staff]);

  const filterByStatus = useCallback((status: Staff['status']) => {
    return staff.filter(s => s.status === status);
  }, [staff]);

  // 获取排名前N的美容师
  const getTopStaff = useCallback((limit: number = 5) => {
    return [...staff].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }, [staff]);

  return {
    staff,
    isLoading,
    addStaff,
    updateStaff,
    deleteStaff,
    getStaff,
    searchStaff,
    filterBySpecialty,
    filterByStatus,
    getTopStaff
  };
};




