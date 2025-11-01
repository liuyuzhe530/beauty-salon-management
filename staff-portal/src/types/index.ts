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
  // 新增：客户画像数据
  profile?: {
    // 家庭信息
    family?: {
      maritalStatus?: string; // 已婚/未婚/离异
      hasChildren?: boolean;
      familyMembers?: number;
    };
    // 喜好信息
    preferences?: {
      skinType?: string; // 肤质类型
      skinConcerns?: string[]; // 皮肤问题
      preferredServices?: string[]; // 偏好服务
      allergies?: string[]; // 过敏信息
      budget?: 'economy' | 'standard' | 'premium' | 'luxury';
    };
    // 美容师匹配
    staffAffinity?: {
      [staffId: string]: number; // 与美容师的亲和度 (0-100)
    };
    // 消费行为
    consumptionPattern?: {
      averagePerVisit?: number;
      preferredTimeSlot?: string; // 偏好时段
      visitFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'irregular';
      lastPurchaseCategory?: string;
    };
    // 生活方式
    lifestyle?: {
      occupation?: string;
      ageRange?: string;
      interests?: string[];
      socialMediaActive?: boolean;
    };
  };
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

// 服务项目
export interface ServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  detailedDescription: string;
  price: number;
  duration: number; // 分钟
  images: string[];
  supportsHomeService: boolean; // 是否支持上门
  supportsInStoreService: boolean; // 是否支持到店
  beauticianLevel: 'junior' | 'senior' | 'master'; // 需要的美容师级别
  suitableFor: string[]; // 适用人群
  benefits: string[]; // 功效
  notes: string[]; // 注意事项
  tags: string[];
}

// 美容师档案
export interface BeauticianProfile {
  id: string;
  name: string;
  avatar: string;
  gender: 'male' | 'female';
  age: number;
  specialization: string[]; // 专业领域
  qualifications: string[]; // 资质证书
  experience: number; // 从业年限
  rating: number;
  totalServices: number;
  totalReviews: number;
  bio: string;
  portfolio: {
    id: string;
    image: string;
    description: string;
    date: string;
  }[];
  schedules: {
    date: string;
    availableSlots: string[];
  }[];
  languages: string[];
  serviceRadius: number; // 服务半径（公里）
  basePrice: number; // 基础价格
  availabilityStatus: 'available' | 'busy' | 'offline';
}

// 用户地址
export interface UserAddress {
  id: string;
  label: string; // 如：家庭、公司
  name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  details: string; // 详细地址
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

// 预约详情
export interface AppointmentDetail extends OnSiteOrder {
  customerRequirements: {
    skinType: string;
    allergies: string[];
    concerns: string[];
    preferences: string;
  };
  serviceLocation: UserAddress;
  paymentMethod: 'wechat' | 'alipay' | 'cash';
  paymentStatus: 'unpaid' | 'partial' | 'paid';
  tipAmount?: number;
  reviewId?: string;
}

// 评价
export interface ServiceReview {
  id: string;
  orderId: string;
  customerName: string;
  customerAvatar: string;
  beauticianId: string;
  beauticianName: string;
  serviceType: string;
  rating: number;
  comment: string;
  images: string[];
  createdAt: string;
  helpfulCount: number;
  isFeatured: boolean; // 是否置顶
  response?: {
    beauticianName: string;
    content: string;
    createdAt: string;
  };
}

// 订单状态更新
export interface OrderStatusUpdate {
  orderId: string;
  status: OnSiteOrder['status'];
  timestamp: string;
  message: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

