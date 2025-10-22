import { Appointment } from '../types/index';

export const appointmentData: Appointment[] = [
  {
    id: '1',
    customerName: '赵晓月',
    staffName: '李美娟',
    service: '深层护肤套餐',
    date: '2025-10-21',
    time: '10:00',
    duration: 120,
    status: 'confirmed',
    price: 398,
    notes: '首次客户，建议做皮肤测试'
  },
  {
    id: '2',
    customerName: '许文雯',
    staffName: '王雨晴',
    service: '美甲+美睫套餐',
    date: '2025-10-21',
    time: '14:00',
    duration: 90,
    status: 'confirmed',
    price: 280,
    notes: ''
  },
  {
    id: '3',
    customerName: '郑可欣',
    staffName: '张琳琳',
    service: '经典SPA护理',
    date: '2025-10-22',
    time: '15:30',
    duration: 150,
    status: 'confirmed',
    price: 520,
    notes: '客户对玫瑰精油过敏，请避免'
  },
  {
    id: '4',
    customerName: '黄思琪',
    staffName: '李美娟',
    service: '皮肤管理课程',
    date: '2025-10-20',
    time: '11:00',
    duration: 90,
    status: 'completed',
    price: 450,
    notes: '满意度：5星'
  },
  {
    id: '5',
    customerName: '李雨欣',
    staffName: '陈思语',
    service: '日常妆容',
    date: '2025-10-15',
    time: '16:00',
    duration: 60,
    status: 'completed',
    price: 180,
    notes: ''
  },
  {
    id: '6',
    customerName: '赵晓月',
    staffName: '王雨晴',
    service: '美甲护理',
    date: '2025-10-14',
    time: '13:00',
    duration: 45,
    status: 'completed',
    price: 150,
    notes: '要求保留现有美甲基础'
  },
  {
    id: '7',
    customerName: '郑可欣',
    staffName: '刘心怡',
    service: '头皮护理+烫染',
    date: '2025-10-23',
    time: '09:00',
    duration: 180,
    status: 'confirmed',
    price: 680,
    notes: '准备新产品烫卷试用'
  }
];
