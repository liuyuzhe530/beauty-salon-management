// 美容师
export interface Staff {
  id: string;
  name: string;
  phone: string;
  specialty: string[];
  experience: number;
  rating: number;
  totalRevenue: number;
  clientCount: number;
  status: 'active' | 'onleave' | 'inactive';
  startDate: string;
  photo: string;
}

// 客户
export interface Customer {
  id: string;
  name: string;
  phone: string;
  totalSpending: number;
  lastVisit: string;
  appointmentCount: number;
  visitCount: number;
  preferredStaff: string;
  status: 'active' | 'atrisk' | 'inactive' | 'vip';
  photo: string;
}

// 预约
export interface Appointment {
  id: string;
  customerName: string;
  staffName: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes: string;
}

// 商品
export interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  price: number;
  cost: number;
  sold: number;
  description: string;
  image: string;
}

// 用户角色
export type UserRole = 'admin' | 'staff' | 'customer';

// 仪表盘指标
export interface Metrics {
  todayRevenue: number;
  monthlyRevenue: number;
  appointmentCount: number;
  customerCount: number;
  staffCount: number;
  churnRisk: number;
}

// AI推荐
export interface AIRecommendation {
  id: string;
  type: 'appointment' | 'service' | 'product' | 'customer';
  title: string;
  description: string;
  impact: string;
  action: string;
}

// 聊天消息
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// 门店位置
export interface StoreLocation {
  id: string;
  name: string;
  area: string;
  score: number;
  description: string;
  nearby: string[];
}

// 课程
export interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  progress: number;
  instructor: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

// 直播课程
export interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  time: string;
  viewers: number;
  status: 'live' | 'upcoming' | 'ended';
}

// 美容师晋升
export interface BeautycianPromotion {
  id: string;
  name: string;
  current: string;
  nextLevel: string;
  completedCourses: number;
  totalRequired: number;
  score: number;
  evaluationDate: string;
  status: 'ready' | 'in-progress' | 'pending';
}

// 到店服务预约接口
export interface InStoreAppointment {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  serviceType: string;
  beautician: string;
  rating: number;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'in-service' | 'completed' | 'cancelled';
  notes: string;
  storeLocation: string;
}

// 上门服务预约接口
export interface OnSiteOrder {
  id: string;
  customerId: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  beautician: string;
  rating: number;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'accepted' | 'en-route' | 'arrived' | 'in-service' | 'completed' | 'cancelled';
  notes: string;
  distance: number;
  estimatedArrival: number;
}

