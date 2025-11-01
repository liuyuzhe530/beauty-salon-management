import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Clock,
  Star,
  Filter,
  Search,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Home,
  ShoppingBag,
  Navigation,
  CreditCard,
  FileText,
  Heart,
  Award,
  Settings,
  Camera,
  AlertCircle,
  Plus,
  BookOpen
} from 'lucide-react';
import { ServiceItem, BeauticianProfile, UserAddress, AppointmentDetail } from '../types';
import { serviceItems, beauticianProfiles, userAddresses } from '../data/serviceData';
import { useToast } from './Toast';

type TabType = 'services' | 'beauticians' | 'appointments' | 'addresses';
type ServiceMode = 'home' | 'store' | 'both';

interface OnSiteServiceBookingProps {
  mode?: 'customer' | 'admin';
}

export const OnSiteServiceBooking: React.FC<OnSiteServiceBookingProps> = ({ mode = 'customer' }) => {
  const { showToast } = useToast();
  
  // 管理员模式默认显示所有预约，客户模式显示服务项目
  const [activeTab, setActiveTab] = useState<TabType>(mode === 'admin' ? 'appointments' : 'services');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceMode, setServiceMode] = useState<ServiceMode>('both');
  const [showFilters, setShowFilters] = useState(false);

  // 预约相关状态
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [selectedBeautician, setSelectedBeautician] = useState<BeauticianProfile | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<UserAddress | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<Partial<AppointmentDetail>>({});

  // 地址管理（仅在客户模式下显示）
  const [addresses, setAddresses] = useState<UserAddress[]>(userAddresses);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  // 判断是否是管理员模式
  const isAdminMode = mode === 'admin';

  // 订单列表
  const [orders, setOrders] = useState<AppointmentDetail[]>([]);

  // 美容师筛选
  const [filterByGender, setFilterByGender] = useState<string>('全部');
  const [minRating, setMinRating] = useState<number>(0);

  useEffect(() => {
    // 加载保存的订单和地址
    const savedOrders = localStorage.getItem('onsiteOrders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
    const savedAddresses = localStorage.getItem('userAddresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
  }, []);

  // 保存订单
  const saveOrders = (newOrders: AppointmentDetail[]) => {
    setOrders(newOrders);
    localStorage.setItem('onsiteOrders', JSON.stringify(newOrders));
  };

  // 保存地址
  const saveAddresses = (newAddresses: UserAddress[]) => {
    setAddresses(newAddresses);
    localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
  };

  // 处理预约
  const handleBookService = (service: ServiceItem, beautician: BeauticianProfile) => {
    setSelectedService(service);
    setSelectedBeautician(beautician);
    setShowBookingModal(true);
    showToast('✅ 已选择服务和美容师', 'success');
  };

  // 确认预约
  const handleConfirmBooking = () => {
    if (!selectedService || !selectedBeautician || !selectedAddress) {
      showToast('请完整填写预约信息', 'error');
      return;
    }

    const newAppointment: AppointmentDetail = {
      id: Date.now().toString(),
      customerId: 'customer-001',
      customerName: '当前用户',
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      serviceType: selectedService.name,
      beautician: selectedBeautician.name,
      rating: selectedBeautician.rating,
      date: appointmentDetails.date || new Date().toISOString().split('T')[0],
      time: appointmentDetails.time || '10:00',
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'pending',
      notes: appointmentDetails.notes || '',
      distance: 0,
      estimatedArrival: 30,
      customerRequirements: {
        skinType: appointmentDetails.customerRequirements?.skinType || '',
        allergies: appointmentDetails.customerRequirements?.allergies || [],
        concerns: appointmentDetails.customerRequirements?.concerns || [],
        preferences: appointmentDetails.customerRequirements?.preferences || ''
      },
      serviceLocation: selectedAddress,
      paymentMethod: 'wechat',
      paymentStatus: 'unpaid'
    };

    saveOrders([...orders, newAppointment]);
    showToast('✅ 预约成功！请等待美容师确认', 'success');
    setShowBookingModal(false);
    setSelectedService(null);
    setSelectedBeautician(null);
    setActiveTab('appointments');
  };

  // 获取服务列表
  const getServices = () => {
    return serviceItems.filter(service => {
      const matchesCategory = selectedCategory === '全部' || service.category === selectedCategory;
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMode = 
        serviceMode === 'both' ||
        (serviceMode === 'home' && service.supportsHomeService) ||
        (serviceMode === 'store' && service.supportsInStoreService);
      return matchesCategory && matchesSearch && matchesMode;
    });
  };

  // 获取美容师列表
  const getBeauticians = () => {
    return beauticianProfiles.filter(beautician => {
      const matchesGender = filterByGender === '全部' || beautician.gender === filterByGender;
      const matchesRating = beautician.rating >= minRating;
      const matchesSearch = beautician.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesGender && matchesRating && matchesSearch;
    });
  };

  const services = getServices();
  const beauticians = getBeauticians();
  const categories = ['全部', ...new Set(serviceItems.map(s => s.category))];

  return (
    <div className="space-y-6">
      {/* 标签页 */}
      <div className="flex gap-2 border-b border-green-200">
        <button
          onClick={() => setActiveTab('services')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'services'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          服务项目
        </button>
        <button
          onClick={() => setActiveTab('beauticians')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'beauticians'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Star className="w-4 h-4 inline mr-2" />
          美容师
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'appointments'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          我的预约
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'addresses'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          地址管理
        </button>
      </div>

      {/* 服务项目 */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          {/* 搜索和筛选 */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索服务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-green-200 rounded-lg hover:bg-green-50 transition"
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            {/* 分类 */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition ${
                    selectedCategory === cat
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* 服务模式 */}
            {showFilters && (
              <div className="flex gap-2">
                <button
                  onClick={() => setServiceMode('both')}
                  className={`px-4 py-2 rounded-lg transition ${
                    serviceMode === 'both'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-green-200'
                  }`}
                >
                  全部服务
                </button>
                <button
                  onClick={() => setServiceMode('home')}
                  className={`px-4 py-2 rounded-lg transition ${
                    serviceMode === 'home'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-green-200'
                  }`}
                >
                  上门服务
                </button>
                <button
                  onClick={() => setServiceMode('store')}
                  className={`px-4 py-2 rounded-lg transition ${
                    serviceMode === 'store'
                      ? 'bg-green-500 text-white'
                      : 'bg-white border border-green-200'
                  }`}
                >
                  到店服务
                </button>
              </div>
            )}
          </div>

          {/* 服务列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-green-200">
                <p className="text-gray-500">没有找到匹配的服务</p>
              </div>
            ) : (
              services.map(service => (
                <div key={service.id} className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500">{service.category}</p>
                    </div>
                    <span className="text-2xl font-bold text-green-600">¥{service.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                  <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.duration}分钟
                    </span>
                  </div>

                  <button
                    onClick={() => setActiveTab('beauticians')}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    选择美容师预约
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 美容师列表 */}
      {activeTab === 'beauticians' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索美容师..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {beauticians.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-white rounded-lg border border-green-200">
                <p className="text-gray-500">没有找到匹配的美容师</p>
              </div>
            ) : (
              beauticians.map(beautician => (
                <div key={beautician.id} className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition">
                  <img
                    src={beautician.avatar}
                    alt={beautician.name}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/200';
                    }}
                  />
                  <h3 className="text-lg font-bold text-gray-900">{beautician.name}</h3>
                  
                  <div className="flex items-center gap-1 my-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.round(beautician.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">{beautician.rating}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {beautician.specialization.join('、')}
                  </p>

                  <button
                    onClick={() => handleBookService(services[0] || serviceItems[0], beautician)}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    预约该美容师
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 我的预约 */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-green-200">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-lg">暂无预约</p>
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white rounded-lg border border-green-200 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{order.serviceType}</h3>
                    <p className="text-sm text-gray-600">{order.beautician}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    order.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status === 'confirmed' ? '已确认' : order.status === 'completed' ? '已完成' : '待确认'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>📅 {order.date} {order.time}</p>
                  <p>💰 ¥{order.price}</p>
                  <p>⏱️ {order.duration}分钟</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 地址管理 */}
      {activeTab === 'addresses' && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setEditingAddress(null);
              setShowAddressModal(true);
            }}
            className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
          >
            <Plus className="w-5 h-5" />
            添加地址
          </button>

          <div className="space-y-2">
            {addresses.map(address => (
              <div key={address.id} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900">{address.label}</h3>
                    <p className="text-sm text-gray-600">{address.address}</p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                  </div>
                  {address.isDefault && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">默认</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 预约模态框 */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-900">确认预约</h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* 选择服务 */}
              <div>
                <label className="block font-semibold mb-2">选择服务</label>
                <div className="space-y-2">
                  {services.map(s => (
                    <div
                      key={s.id}
                      onClick={() => setSelectedService(s)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedService?.id === s.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{s.name}</span>
                          <p className="text-sm text-gray-600">¥{s.price} · {s.duration}分钟</p>
                        </div>
                        {selectedService?.id === s.id && (
                          <CheckCircle className="text-green-500" size={20} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 选择美容师 */}
              <div>
                <label className="block font-semibold mb-2">选择美容师</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {beauticians.map(b => (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBeautician(b)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedBeautician?.id === b.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{b.name}</span>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={12} className={i < Math.round(b.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                            ))}
                            {b.rating}
                          </p>
                        </div>
                        {selectedBeautician?.id === b.id && (
                          <CheckCircle className="text-green-500" size={20} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 选择地址 */}
              <div>
                <label className="block font-semibold mb-2">选择上门地址</label>
                <div className="space-y-2">
                  {addresses.map(addr => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3 border rounded-lg cursor-pointer transition ${
                        selectedAddress?.id === addr.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold">{addr.label}</span>
                          {addr.isDefault && <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded">默认</span>}
                        </div>
                        {selectedAddress?.id === addr.id && <CheckCircle className="text-green-500" size={20} />}
                      </div>
                      <p className="text-sm text-gray-600">{addr.address}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 日期和时间 */}
              <div>
                <label className="block font-semibold mb-2">选择日期和时间</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={appointmentDetails.date || ''}
                    onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="time"
                    value={appointmentDetails.time || ''}
                    onChange={(e) => setAppointmentDetails({ ...appointmentDetails, time: e.target.value })}
                    className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* 特殊需求 */}
              <div>
                <label className="block font-semibold mb-2">特殊需求（可选）</label>
                <textarea
                  placeholder="请描述您的肤质、过敏史或特殊需求..."
                  value={appointmentDetails.customerRequirements?.preferences || ''}
                  onChange={(e) => setAppointmentDetails({
                    ...appointmentDetails,
                    customerRequirements: {
                      ...appointmentDetails.customerRequirements,
                      preferences: e.target.value,
                    } as any,
                  })}
                  className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>

              {/* 支付方式 */}
              <div>
                <label className="block font-semibold mb-2">支付方式</label>
                <div className="grid grid-cols-3 gap-3">
                  {['wechat', 'alipay', 'cash'].map(method => (
                    <button
                      key={method}
                      onClick={() => setAppointmentDetails({ ...appointmentDetails, paymentMethod: method as any })}
                      className={`p-3 border rounded-lg transition font-medium ${
                        appointmentDetails.paymentMethod === method ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {method === 'wechat' ? '微信支付' : method === 'alipay' ? '支付宝' : '现金'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 确认和取消按钮 */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg transition font-semibold text-lg"
                >
                  ✓ 确认预约
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-lg transition font-semibold text-lg"
                >
                  ✕ 取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnSiteServiceBooking;
