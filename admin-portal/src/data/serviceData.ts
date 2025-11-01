import { ServiceItem, BeauticianProfile, UserAddress } from '../types';

// 服务项目示例数据
export const serviceItems: ServiceItem[] = [
  {
    id: 's1',
    name: '深度保湿面部护理',
    category: '面部护理',
    description: '专业深层补水，恢复肌肤水润光泽',
    detailedDescription: '采用进口保湿精华，深入肌底补充水分，配合专业按摩手法，促进血液循环，让肌肤焕发自然光泽。适合各种肌肤类型。',
    price: 268,
    duration: 90,
    images: [
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=800',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'senior',
    suitableFor: ['干性肌肤', '混合性肌肤', '敏感肌肤'],
    benefits: ['深层补水', '改善粗糙', '提亮肤色', '收缩毛孔'],
    notes: ['有过敏史的顾客需提前告知', '建议提前30分钟到达'],
    tags: ['热门', '补水', '保湿', '面部'],
  },
  {
    id: 's2',
    name: '抗衰紧致面部护理',
    category: '面部护理',
    description: '专业抗老配方，抚平细纹，提升肌肤弹性',
    detailedDescription: '运用国际先进抗衰技术，富含胶原蛋白肽和透明质酸，有效减少细纹，提升肌肤紧致度，重现年轻光彩。',
    price: 368,
    duration: 120,
    images: [
      'https://images.unsplash.com/photo-1616394584738-fc6e612e785b?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'master',
    suitableFor: ['熟龄肌肤', '松弛肌肤'],
    benefits: ['抗衰老', '紧致提升', '淡化细纹', '恢复弹性'],
    notes: ['建议28岁以上使用', '需要系列护理效果更佳'],
    tags: ['抗衰', '紧致', '高端'],
  },
  {
    id: 's3',
    name: '全身放松SPA',
    category: 'SPA',
    description: '从头到脚的放松之旅，缓解疲劳，焕发活力',
    detailedDescription: '90分钟专业SPA疗程，包含头部按摩、背部按摩、腿部放松，配合香薰精油，让身心完全放松，焕发活力。',
    price: 488,
    duration: 90,
    images: [
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'senior',
    suitableFor: ['所有人', '上班族', '压力人群'],
    benefits: ['缓解疲劳', '放松身心', '改善睡眠', '提升免疫力'],
    notes: ['建议空腹或饭后1小时进行', '孕妇需提前告知'],
    tags: ['SPA', '放松', '热门'],
  },
  {
    id: 's4',
    name: '专业美甲服务',
    category: '美甲',
    description: '法式甲、渐变甲、彩绘等多款选择，专业服务',
    detailedDescription: '资深美甲师一对一服务，提供法式甲、渐变甲、彩绘等多种款式选择。使用进口无毒甲油，保护指甲健康。',
    price: 88,
    duration: 60,
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'junior',
    suitableFor: ['所有人'],
    benefits: ['美化指甲', '保护指甲', '时尚潮流'],
    notes: ['甲油可持续1-2周', '建议提前预约'],
    tags: ['美甲', '时尚'],
  },
  {
    id: 's5',
    name: '眼部护理精华',
    category: '眼部护理',
    description: '针对眼部细纹、黑眼圈的专业护理',
    detailedDescription: '运用眼霜和按摩手法，改善眼部细纹、黑眼圈、眼袋等问题，让双眼重新焕发明亮神采。',
    price: 128,
    duration: 45,
    images: [
      'https://images.unsplash.com/photo-1608245443803-ba990733b6bf?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'senior',
    suitableFor: ['眼部有困扰的所有人'],
    benefits: ['淡化黑眼圈', '抚平细纹', '缓解眼袋', '提亮眼部'],
    notes: ['每周1-2次效果更佳'],
    tags: ['眼部', '护理'],
  },
  {
    id: 's6',
    name: '舒缓肌肉按摩',
    category: '按摩',
    description: '针对肩颈、背部肌肉的专业按摩',
    detailedDescription: '通过专业按摩手法，放松紧张肌肉，缓解肩颈酸痛、背部疲劳，改善血液循环。',
    price: 158,
    duration: 60,
    images: [
      'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
    ],
    supportsHomeService: true,
    supportsInStoreService: true,
    beauticianLevel: 'junior',
    suitableFor: ['久坐人群', '肩颈不适'],
    benefits: ['缓解酸痛', '改善姿势', '放松肌肉'],
    notes: ['按摩后多喝水'],
    tags: ['按摩', '舒缓'],
  },
];

// 美容师档案示例数据
export const beauticianProfiles: BeauticianProfile[] = [
  {
    id: 'b1',
    name: '李美玲',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200',
    gender: 'female',
    age: 28,
    specialization: ['面部护理', '抗衰老', '眼部护理'],
    qualifications: ['高级美容师资格证', '国际美容师认证', '面部护理专业资质'],
    experience: 6,
    rating: 4.9,
    totalServices: 385,
    totalReviews: 156,
    bio: '拥有6年从业经验，擅长面部护理和抗衰老技术。以专业的服务态度和精湛的技术深受客户喜爱。',
    portfolio: [
      { id: 'p1', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e785b?w=400', description: '深度保湿护理效果', date: '2024-10-15' },
      { id: 'p2', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400', description: '抗衰护理前后对比', date: '2024-10-12' },
    ],
    schedules: [
      { date: '2024-10-26', availableSlots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
      { date: '2024-10-27', availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
    ],
    languages: ['中文', '英文'],
    serviceRadius: 15,
    basePrice: 50,
    availabilityStatus: 'available',
  },
  {
    id: 'b2',
    name: '王雅琪',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    gender: 'female',
    age: 25,
    specialization: ['美甲', '按摩', 'SPA'],
    qualifications: ['高级美甲师', '按摩师资格证', 'SPA技师认证'],
    experience: 4,
    rating: 4.8,
    totalServices: 290,
    totalReviews: 122,
    bio: '专业美甲技师，擅长各种美甲款式设计。同时精通按摩和SPA护理，为顾客提供全方位服务。',
    portfolio: [
      { id: 'p3', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400', description: '法式美甲作品', date: '2024-10-20' },
      { id: 'p4', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', description: 'SPA护理现场', date: '2024-10-18' },
    ],
    schedules: [
      { date: '2024-10-26', availableSlots: ['10:00', '13:00', '14:00', '15:00'] },
      { date: '2024-10-27', availableSlots: ['09:00', '10:00', '13:00', '14:00', '15:00'] },
    ],
    languages: ['中文'],
    serviceRadius: 10,
    basePrice: 40,
    availabilityStatus: 'available',
  },
  {
    id: 'b3',
    name: '张晨曦',
    avatar: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=200',
    gender: 'male',
    age: 30,
    specialization: ['面部护理', '男性护理', '抗衰老'],
    qualifications: ['首席美容师', '男性皮肤护理专家', '国际认证讲师'],
    experience: 8,
    rating: 5.0,
    totalServices: 520,
    totalReviews: 245,
    bio: '8年从业经验，擅长各类面部护理，特别精通男性皮肤护理。技术精湛，服务周到，好评如潮。',
    portfolio: [
      { id: 'p5', image: 'https://images.unsplash.com/photo-1616394584738-fc6e612e785b?w=400', description: '男士护肤效果', date: '2024-10-22' },
    ],
    schedules: [
      { date: '2024-10-26', availableSlots: ['09:00', '13:00', '14:00', '15:00', '16:00'] },
    ],
    languages: ['中文', '日文'],
    serviceRadius: 20,
    basePrice: 60,
    availabilityStatus: 'available',
  },
  {
    id: 'b4',
    name: '刘欣怡',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    gender: 'female',
    age: 27,
    specialization: ['眼部护理', '面部护理', '深层清洁'],
    qualifications: ['资深美容师', '眼部护理专业认证'],
    experience: 5,
    rating: 4.7,
    totalServices: 312,
    totalReviews: 138,
    bio: '专注于眼部护理和深层清洁，技术娴熟，善于根据客户需求定制护理方案。',
    portfolio: [
      { id: 'p6', image: 'https://images.unsplash.com/photo-1608245443803-ba990733b6bf?w=400', description: '眼部护理效果', date: '2024-10-21' },
    ],
    schedules: [
      { date: '2024-10-26', availableSlots: ['09:00', '10:00', '14:00', '15:00'] },
      { date: '2024-10-27', availableSlots: ['09:00', '11:00', '14:00', '16:00'] },
    ],
    languages: ['中文'],
    serviceRadius: 12,
    basePrice: 45,
    availabilityStatus: 'available',
  },
];

// 用户地址示例数据
export const userAddresses: UserAddress[] = [
  {
    id: 'a1',
    label: '家',
    name: '张女士',
    phone: '13800138001',
    address: '深圳市南山区',
    city: '深圳市',
    district: '南山区',
    details: '科技园南区科技南路100号A座1801室',
    latitude: 22.5329,
    longitude: 113.9375,
    isDefault: true,
  },
  {
    id: 'a2',
    label: '公司',
    name: '张女士',
    phone: '13800138001',
    address: '深圳市福田区',
    city: '深圳市',
    district: '福田区',
    details: '福田中心区福华路399号深圳国际商会大厦B座1508',
    latitude: 22.5406,
    longitude: 114.0583,
    isDefault: false,
  },
  {
    id: 'a3',
    label: '父母家',
    name: '张女士',
    phone: '13800138001',
    address: '深圳市龙华区',
    city: '深圳市',
    district: '龙华区',
    details: '龙华新区民治大道民治社区C区16栋501',
    latitude: 22.6617,
    longitude: 114.0480,
    isDefault: false,
  },
];

















