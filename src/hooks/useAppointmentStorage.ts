import { useState, useCallback, useEffect } from 'react';
import { Appointment } from '../types/index';
import { appointmentService } from '../api';
import { appointmentData as initialData } from '../data/appointmentData';

const STORAGE_KEY = 'beauty_salon_appointments';

export const useAppointmentStorage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 初始化 - 从API或localStorage
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        // 尝试从API加载
        try {
          const apiAppointments = await appointmentService.getAll();
          if (apiAppointments && apiAppointments.length > 0) {
            setAppointments(apiAppointments);
            // 同步到本地存储
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apiAppointments));
            return;
          }
        } catch (apiError) {
          console.warn('API加载预约失败，使用本地缓存:', apiError);
        }

        // 如果API失败，从本地存储加载
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setAppointments(JSON.parse(stored));
        } else {
          setAppointments(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Failed to load appointments from localStorage:', error);
        setAppointments(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // 添加预约
  const addAppointment = useCallback(async (newAppointment: Omit<Appointment, 'id'>) => {
    try {
      const appointmentData: any = newAppointment;
      const id = Date.now().toString();
      const appointment: Appointment = {
        ...appointmentData,
        id,
        customerId: appointmentData.customerId || '',
        staffId: appointmentData.staffId || '',
        appointmentDate: appointmentData.appointmentDate || new Date().toISOString(),
      };

      setAppointments(prev => {
        const updated = [...prev, appointment];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return appointment;
    } catch (error) {
      console.error('Failed to add appointment:', error);
      throw error;
    }
  }, []);

  // 更新预约
  const updateAppointment = useCallback((id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => {
      const updated = prev.map(a =>
        a.id === id ? { ...a, ...updates } : a
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // 删除预约
  const deleteAppointment = useCallback(async (id: string) => {
    try {
      // 尝试通过API删除
      try {
        await appointmentService.delete(id);
        setAppointments(prev => {
          const updated = prev.filter(a => a.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return;
      } catch (apiError) {
        console.warn('API删除预约失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setAppointments(prev => {
        const updated = prev.filter(a => a.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete appointment:', error);
      throw error;
    }
  }, []);

  // 获取单个预约
  const getAppointment = useCallback((id: string) => {
    return appointments.find(a => a.id === id);
  }, [appointments]);

  // 按客户搜索
  const searchByCustomer = useCallback((customerName: string) => {
    if (!customerName.trim()) return appointments;
    const lower = customerName.toLowerCase();
    return appointments.filter(a =>
      a.customerName.toLowerCase().includes(lower)
    );
  }, [appointments]);

  // 按状态筛选
  const filterByStatus = useCallback((status: Appointment['status']) => {
    return appointments.filter(a => a.status === status);
  }, [appointments]);

  // 按日期筛选
  const filterByDate = useCallback((startDate: string, endDate: string) => {
    return appointments.filter(a =>
      a.date >= startDate && a.date <= endDate
    );
  }, [appointments]);

  // 按美容师筛选
  const filterByStaff = useCallback((staffName: string) => {
    return appointments.filter(a => a.staffName === staffName);
  }, [appointments]);

  return {
    appointments,
    isLoading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment,
    searchByCustomer,
    filterByStatus,
    filterByDate,
    filterByStaff
  };
};




