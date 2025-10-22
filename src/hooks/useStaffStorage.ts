import { useState, useCallback, useEffect } from 'react';
import { Staff } from '../types/index';
import { staffData as initialData } from '../data/staffData';

const STORAGE_KEY = 'beauty_salon_staff';

export const useStaffStorage = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStaff = () => {
      try {
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

  const addStaff = useCallback((newStaff: Omit<Staff, 'id'>) => {
    const id = Date.now().toString();
    const staffMember: Staff = {
      ...newStaff,
      id
    };

    setStaff(prev => {
      const updated = [...prev, staffMember];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });

    return staffMember;
  }, []);

  const updateStaff = useCallback((id: string, updates: Partial<Staff>) => {
    setStaff(prev => {
      const updated = prev.map(s =>
        s.id === id ? { ...s, ...updates } : s
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteStaff = useCallback((id: string) => {
    setStaff(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
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




