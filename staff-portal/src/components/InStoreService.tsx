import React, { useState } from 'react';
import { Clock, Users, Star, Calendar } from 'lucide-react';

interface InStoreAppointment {
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

interface StaffBeautician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
  available: boolean;
  schedule: string[];
}

export const InStoreService: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'book' | 'appointments' | 'history' | 'staff'>('book');
  const [selectedService, setSelectedService] = useState('按摩护肤');
  const [selectedBeautician, setSelectedBeautician] = useState<StaffBeautician | null>(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookingTime, setBookingTime] = useState('10:00');
  const [selectedLocation, setSelectedLocation] = useState('朝阳店');

  const services = [
    { name: '按摩护肤', price: 198, duration: 60, rating: 4.9, orders: 12580 },
    { name: '深层清洁', price: 158, duration: 45, rating: 4.8, orders: 9320 },
    { name: '面部精油护理', price: 238, duration: 75, rating: 4.9, orders: 8650 },
    { name: '祛痘护肤', price: 178, duration: 50, rating: 4.7, orders: 7420 },
    { name: '眼部护理', price: 128, duration: 30, rating: 4.8, orders: 6890 },
    { name: '全身SPA', price: 388, duration: 120, rating: 4.9, orders: 5640 }
  ];

  const storeLocations = [
    { id: '1', name: '朝阳店', address: '朝阳区建国路88号', phone: '010-1234-5678', area: '500m2' },
    { id: '2', name: '海淀店', address: '海淀区中关村大街1号', phone: '010-1234-5679', area: '350m2' },
    { id: '3', name: '东城店', address: '东城区王府井大街100号', phone: '010-1234-5680', area: '400m2' },
    { id: '4', name: '西城店', address: '西城区宣武门50号', phone: '010-1234-5681', area: '300m2' }
  ];

  const beauticians: StaffBeautician[] = [
    {
      id: 's1',
      name: '李美女',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
      rating: 4.95,
      reviews: 2340,
      specialties: ['按摩护肤', '深层清洁', '面部精油护理'],
      available: true,
      schedule: ['10:00', '10:30', '11:00', '14:00', '15:00', '16:00']
    },
    {
      id: 's2',
      name: '王静雨',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      rating: 4.88,
      reviews: 1890,
      specialties: ['祛痘护肤', '眼部护理', '深层清洁'],
      available: true,
      schedule: ['09:00', '09:30', '10:00', '13:00', '14:00', '15:00']
    },
    {
      id: 's3',
      name: '张丽',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
      rating: 4.92,
      reviews: 2105,
      specialties: ['SPA', '放松', '高端护理'],
      available: true,
      schedule: ['11:00', '11:30', '14:00', '15:00', '16:00', '17:00']
    },
    {
      id: 's4',
      name: '刘娜',
      avatar: 'https://images.unsplash.com/photo-1517841905240-74386c494700?w=80&h=80&fit=crop',
      rating: 4.86,
      reviews: 1654,
      specialties: ['高端面部护理', '豪华护理', 'VIP服务'],
      available: false,
      schedule: ['10:00', '11:00', '14:00', '15:00']
    },
    {
      id: 's5',
      name: '陈慧',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop',
      rating: 4.79,
      reviews: 1234,
      specialties: ['按摩', '穴位', '能量疗法'],
      available: true,
      schedule: ['09:00', '10:00', '13:00', '14:00', '15:00', '16:00']
    }
  ];

  const appointments: InStoreAppointment[] = [
    {
      id: 'apt1',
      customerId: 'c1',
      customerName: '李美女',
      phone: '13800138000',
      serviceType: '面部护理',
      beautician: '李美女',
      rating: 4.8,
      date: '2025-10-22',
      time: '14:00',
      duration: 60,
      price: 198,
      status: 'confirmed',
      notes: '敏感肌肤',
      storeLocation: '朝阳店'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <h2 className="text-2xl font-bold text-green-900">到店服务</h2>
        <p className="text-gray-600">专业美容师为您提供高端护理服务</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {(['book', 'appointments', 'history', 'staff'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium ${
              activeTab === tab
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'book' && '预订服务'}
            {tab === 'appointments' && '我的预约'}
            {tab === 'history' && '历史记录'}
            {tab === 'staff' && '美容师'}
          </button>
        ))}
      </div>

      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg border border-green-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">选择服务</h3>
              <div className="space-y-2">
                {services.map(service => (
                  <button
                    key={service.name}
                    onClick={() => setSelectedService(service.name)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedService === service.name
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.duration}分钟 • {service.orders.toLocaleString()}次预订</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">￥{service.price}</p>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm">{service.rating}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">选择美容师</h3>
              <div className="grid grid-cols-2 gap-4">
                {beauticians.map(beautician => (
                  <button
                    key={beautician.id}
                    onClick={() => setSelectedBeautician(beautician)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      selectedBeautician?.id === beautician.id
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <img
                      src={beautician.avatar}
                      alt={beautician.name}
                      className="w-12 h-12 rounded-full mx-auto mb-2 object-cover"
                    />
                    <h4 className="font-semibold text-sm text-gray-900">{beautician.name}</h4>
                    <div className="flex items-center justify-center gap-1 text-sm mt-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span>{beautician.rating}</span>
                    </div>
                    <span className={`text-xs mt-1 inline-block px-2 py-1 rounded ${
                      beautician.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {beautician.available ? '可预约' : '忙碌中'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 p-6 h-fit">
            <h3 className="text-lg font-bold text-gray-900 mb-4">预约详情</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">门店位置</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {storeLocations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">日期</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">时间</label>
                <input
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <button className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                立即预约
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'appointments' && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">我的预约</h3>
          <div className="space-y-3">
            {appointments.map(apt => (
              <div key={apt.id} className="p-4 rounded-lg border border-gray-200 hover:border-green-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{apt.customerName}</h4>
                    <p className="text-sm text-gray-600">{apt.serviceType}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {apt.status === 'confirmed' ? '已确认' : apt.status === 'pending' ? '待确认' : '已完成'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {apt.date} {apt.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {apt.beautician}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {apt.duration}分钟
                  </div>
                  <div className="font-semibold text-green-600">￥{apt.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">服务历史</h3>
          <p className="text-gray-600 text-center py-8">暂无历史预约记录</p>
        </div>
      )}

      {activeTab === 'staff' && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">美容师团队</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {beauticians.map(beautician => (
              <div key={beautician.id} className="p-4 rounded-lg border border-gray-200 text-center">
                <img
                  src={beautician.avatar}
                  alt={beautician.name}
                  className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
                />
                <h4 className="font-semibold text-gray-900 text-sm">{beautician.name}</h4>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium">{beautician.rating}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{beautician.reviews}条评价</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
