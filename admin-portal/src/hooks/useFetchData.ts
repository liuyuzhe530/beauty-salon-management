import { useAPI } from './useAPI';
import { api, Customer, Appointment, Staff, Product, LiveClass } from '../services/api';

/**
 * =====================
 * Customer Hooks
 * =====================
 */

export function useCustomers(page: number = 1) {
  return useAPI(() => api.getCustomers(page), { dependencies: [page] });
}

export function useCustomer(id: string) {
  return useAPI(() => api.getCustomer(id), { 
    dependencies: [id],
    skip: !id 
  });
}

export function useActiveCustomers() {
  return useAPI(() => api.getActiveCustomers());
}

export function useAtRiskCustomers() {
  return useAPI(() => api.getAtRiskCustomers());
}

export function useCustomerStatistics() {
  return useAPI(() => api.getCustomerStatistics());
}

/**
 * =====================
 * Appointment Hooks
 * =====================
 */

export function useAppointments(page: number = 1) {
  return useAPI(() => api.getAppointments(page), { dependencies: [page] });
}

export function useAppointment(id: string) {
  return useAPI(() => api.getAppointment(id), { 
    dependencies: [id],
    skip: !id 
  });
}

export function useTodayAppointments() {
  return useAPI(() => api.getTodayAppointments());
}

export function usePendingAppointments() {
  return useAPI(() => api.getPendingAppointments());
}

export function useCustomerAppointments(customerId: string) {
  return useAPI(() => api.getCustomerAppointments(customerId), {
    dependencies: [customerId],
    skip: !customerId
  });
}

export function useStaffAppointments(staffId: string) {
  return useAPI(() => api.getStaffAppointments(staffId), {
    dependencies: [staffId],
    skip: !staffId
  });
}

export function useAppointmentStatistics() {
  return useAPI(() => api.getAppointmentStatistics());
}

/**
 * =====================
 * Staff Hooks
 * =====================
 */

export function useStaff(page: number = 1) {
  return useAPI(() => api.getStaff(page), { dependencies: [page] });
}

export function useStaffMember(id: string) {
  return useAPI(() => api.getStaffMember(id), { 
    dependencies: [id],
    skip: !id 
  });
}

export function useActiveStaff() {
  return useAPI(() => api.getActiveStaff());
}

export function useTopRatedStaff() {
  return useAPI(() => api.getTopRatedStaff());
}

export function useStaffStatistics() {
  return useAPI(() => api.getStaffStatistics());
}

/**
 * =====================
 * Product Hooks
 * =====================
 */

export function useProducts(page: number = 1) {
  return useAPI(() => api.getProducts(page), { dependencies: [page] });
}

export function useProduct(id: string) {
  return useAPI(() => api.getProduct(id), { 
    dependencies: [id],
    skip: !id 
  });
}

export function useProductsByCategory(category: string) {
  return useAPI(() => api.getProductsByCategory(category), {
    dependencies: [category],
    skip: !category
  });
}

export function useLowStockProducts() {
  return useAPI(() => api.getLowStockProducts());
}

export function useTopSellingProducts() {
  return useAPI(() => api.getTopSellingProducts());
}

export function useProductStatistics() {
  return useAPI(() => api.getProductStatistics());
}

export function useProductCategories() {
  return useAPI(() => api.getProductCategories());
}

/**
 * =====================
 * Live Classes Hooks
 * =====================
 */

export function useLiveClasses() {
  return useAPI(() => api.getLiveClasses());
}

export function useLiveClass(id: string) {
  return useAPI(() => api.getLiveClass(id), {
    dependencies: [id],
    skip: !id
  });
}
