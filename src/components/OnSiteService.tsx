import React, { useState } from 'react';
import { Star, MapPin, Clock, Users } from 'lucide-react';

interface Service {
  name: string;
  price: number;
  duration: number;
  rating: number;
  orders: number;
}

interface Beautician {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialties: string[];
  distance: number;
  available: boolean;
  response_time: number;
}

export const OnSiteService: React.FC = () => {
  const [selectedBeautician, setSelectedBeautician] = useState<Beautician | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const services: Service[] = [
    { name: '面部护理', price: 168, duration: 60, rating: 4.8, orders: 12500 },
    { name: '深层清洁', price: 128, duration: 45, rating: 4.7, orders: 9800 },
    { name: '祛痘护肤', price: 178, duration: 50, rating: 4.7, orders: 7420 },
    { name: '眼部护理', price: 128, duration: 30, rating: 4.8, orders: 6890 },
    { name: '全身SPA', price: 388, duration: 120, rating: 4.9, orders: 5640 }
  ];

  const beauticians: Beautician[] = [
    {
      id: 'b1',
      name: '李美女',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop',
      rating: 4.95,
      reviews: 2340,
      specialties: ['按摩', '深层清洁', '精油护理'],
      distance: 0.8,
      available: true,
      response_time: 5
    },
    {
      id: 'b2',
      name: '王静雨',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop',
      rating: 4.88,
      reviews: 1856,
      specialties: ['护肤', '祛痘', '抗衰'],
      distance: 1.2,
      available: true,
      response_time: 8
    },
    {
      id: 'b3',
      name: '张丽',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
      rating: 4.92,
      reviews: 2105,
      specialties: ['放松', '整体护理', 'SPA疗法'],
      distance: 0.5,
      available: false,
      response_time: 12
    },
    {
      id: 'b4',
      name: '刘娜',
      avatar: 'https://images.unsplash.com/photo-1517841905240-74386c494700?w=80&h=80&fit=crop',
      rating: 4.86,
      reviews: 1654,
      specialties: ['高端面部护理', '豪华护理', 'VIP服务'],
      distance: 2.1,
      available: true,
      response_time: 6
    },
    {
      id: 'b5',
      name: '陈慧',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&h=80&fit=crop',
      rating: 4.79,
      reviews: 1234,
      specialties: ['按摩', '穴位按压', '能量疗法'],
      distance: 1.8,
      available: true,
      response_time: 10
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200 p-6">
        <h2 className="text-2xl font-bold text-green-900">上门服务</h2>
        <p className="text-gray-600">专业美容师上门为您提供高端护理</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">可选服务</h3>
            <div className="space-y-3">
              {services.map((service, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedService(service)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedService?.name === service.name
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{service.name}</h4>
                      <div className="flex gap-4 mt-2 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {service.duration}分钟
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {service.orders.toLocaleString()}次预订
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">￥{service.price}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{service.rating}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-green-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">服务摘要</h3>
          {selectedService ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">服务项目</p>
                <p className="font-semibold text-gray-900">{selectedService.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">服务时长</p>
                <p className="font-semibold text-gray-900">{selectedService.duration}分钟</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">价格</p>
                <p className="font-bold text-green-600 text-xl">￥{selectedService.price}</p>
              </div>
              <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                预订服务
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">请选择服务继续</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-green-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">可用美容师</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                className="w-16 h-16 rounded-full mx-auto mb-3 object-cover"
              />
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{beautician.name}</h4>
              <div className="flex items-center justify-center gap-1 mb-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-sm font-medium">{beautician.rating}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">{beautician.reviews}条评价</p>
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600 mb-2">
                <MapPin className="w-3 h-3" />
                {beautician.distance}公里
              </div>
              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                beautician.available
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {beautician.available ? '可预约' : '忙碌'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {selectedBeautician && (
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">预约详情</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">美容师</label>
              <p className="text-gray-900 font-semibold">{selectedBeautician.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">服务</label>
              <p className="text-gray-900 font-semibold">{selectedService?.name || '请选择服务'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">日期与时间</label>
              <input type="datetime-local" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">上门地址</label>
              <input type="text" placeholder="请输入您的地址" className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">特殊要求</label>
              <textarea placeholder="请输入任何特殊需求" className="w-full px-3 py-2 border border-gray-300 rounded-lg" rows={3}></textarea>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
            确认预约
          </button>
        </div>
      )}
    </div>
  );
};
