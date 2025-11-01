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
} from 'lucide-react';
import { ServiceItem, BeauticianProfile, UserAddress, AppointmentDetail } from '../types';
import { serviceItems, beauticianProfiles, userAddresses } from '../data/serviceData';

type TabType = 'services' | 'beauticians' | 'appointments' | 'addresses';
type ServiceMode = 'home' | 'store' | 'both';

interface OnSiteServiceBookingProps {
  mode?: 'customer' | 'admin';
}

export const OnSiteServiceBooking: React.FC<OnSiteServiceBookingProps> = ({ mode = 'customer' }) => {
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

  // 获取服务分类
  const categories = ['全部', ...new Set(serviceItems.map(s => s.category))];

  // 筛选服务
  const filteredServices = serviceItems.filter(service => {
    const matchCategory = selectedCategory === '全部' || service.category === selectedCategory;
    const matchSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchMode = serviceMode === 'both' ||
      (serviceMode === 'home' && service.supportsHomeService) ||
      (serviceMode === 'store' && service.supportsInStoreService);
    return matchCategory && matchSearch && matchMode;
  });

  // 筛选美容师
  const filteredBeauticians = beauticianProfiles.filter(beautician => {
    const matchGender = filterByGender === '全部' || beautician.gender === filterByGender;
    const matchRating = beautician.rating >= minRating;
    return matchGender && matchRating;
  });

  // 开始预约
  const handleStartBooking = (service: ServiceItem) => {
    setSelectedService(service);
    setShowBookingModal(true);
    setAppointmentDetails({
      serviceType: service.name,
      price: service.price,
      duration: service.duration,
    });
  };

  // 选择美容师
  const handleSelectBeautician = (beautician: BeauticianProfile) => {
    setSelectedBeautician(beautician);
    // 如果已选择服务，自动跳到预约步骤
    if (selectedService) {
      setShowBookingModal(true);
    }
  };

  // 选择地址
  const handleSelectAddress = (address: UserAddress) => {
    setSelectedAddress(address);
  };

  // 添加新地址
  const handleAddAddress = () => {
    setEditingAddress(null);
    setShowAddressModal(true);
  };

  // 编辑地址
  const handleEditAddress = (address: UserAddress) => {
    setEditingAddress(address);
    setShowAddressModal(true);
  };

  // 删除地址
  const handleDeleteAddress = (id: string) => {
    if (window.confirm('确定要删除这个地址吗？')) {
      const newAddresses = addresses.filter(a => a.id !== id);
      if (newAddresses.length > 0) {
        // 如果没有默认地址了，设置第一个为默认
        if (!newAddresses.some(a => a.isDefault)) {
          newAddresses[0].isDefault = true;
        }
      }
      saveAddresses(newAddresses);
      if (selectedAddress?.id === id) {
        setSelectedAddress(newAddresses[0] || null);
      }
    }
  };

  // 提交预约
  const handleSubmitBooking = () => {
    if (!selectedService || !selectedBeautician || !selectedAddress) {
      alert('请选择服务、美容师和地址');
      return;
    }

    const newOrder: AppointmentDetail = {
      id: Date.now().toString(),
      customerId: 'user1',
      customerName: selectedAddress.name,
      phone: selectedAddress.phone,
      address: selectedAddress.details,
      serviceType: selectedService.name,
      beautician: selectedBeautician.name,
      rating: 0,
      date: appointmentDetails.date || '',
      time: appointmentDetails.time || '',
      duration: selectedService.duration,
      price: selectedService.price,
      status: 'pending',
      notes: '',
      distance: 5, // 模拟距离
      estimatedArrival: 0,
      customerRequirements: {
        skinType: appointmentDetails.customerRequirements?.skinType || '混合性',
        allergies: appointmentDetails.customerRequirements?.allergies || [],
        concerns: appointmentDetails.customerRequirements?.concerns || [],
        preferences: appointmentDetails.customerRequirements?.preferences || '',
      },
      serviceLocation: selectedAddress,
      paymentMethod: appointmentDetails.paymentMethod || 'wechat',
      paymentStatus: 'unpaid',
    };

    saveOrders([...orders, newOrder]);
    alert('预约成功！');
    setShowBookingModal(false);
    setSelectedService(null);
    setSelectedBeautician(null);
    setSelectedAddress(null);
    setAppointmentDetails({});
    setActiveTab('appointments');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Home className="text-pink-500" size={28} />
          {isAdminMode ? '上门服务管理' : '上门服务预约'}
        </h2>
        <p className="text-gray-600">
          {isAdminMode ? '查看和管理所有客户的上门服务预约' : '选择服务项目，预约专业美容师上门服务'}
        </p>
      </div>

      {/* 标签导航 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {[
          { id: 'services' as TabType, label: '服务项目', icon: ShoppingBag, show: true },
          { id: 'beauticians' as TabType, label: '美容师', icon: User, show: true },
          { id: 'addresses' as TabType, label: '我的地址', icon: MapPin, show: !isAdminMode },
          { id: 'appointments' as TabType, label: isAdminMode ? '所有预约' : '我的订单', icon: Calendar, show: true },
        ].filter(({ show }) => show).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-3 font-semibold transition flex items-center gap-2 whitespace-nowrap ${
              activeTab === id
                ? 'text-pink-600 border-b-2 border-pink-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Icon size={18} />
            {label}
          </button>
        ))}
      </div>

      {/* 服务项目标签 */}
      {activeTab === 'services' && (
        <div>
          {/* 搜索和筛选 */}
          <div className="mb-6 space-y-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索服务..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* 分类筛选 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition ${
                    selectedCategory === category
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* 服务方式筛选 */}
            <div className="flex gap-4 items-center">
              <span className="text-gray-600 font-semibold">服务方式：</span>
              {[
                { id: 'both' as ServiceMode, label: '全部' },
                { id: 'home' as ServiceMode, label: '上门服务', icon: '' },
                { id: 'store' as ServiceMode, label: '到店服务', icon: '' },
              ].map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setServiceMode(id)}
                  className={`px-4 py-2 rounded-lg transition ${
                    serviceMode === id
                      ? 'bg-pink-100 text-pink-600 border border-pink-500'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-pink-300'
                  }`}
                >
                  {icon && <span className="mr-2">{icon}</span>}
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 服务列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredServices.map(service => (
              <div key={service.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-pink-100 to-purple-100 relative">
                  {service.images[0] && (
                    <img src={service.images[0]} alt={service.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {service.supportsHomeService && (
                      <span className="bg-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Home size={14} /> 上门
                      </span>
                    )}
                    {service.supportsInStoreService && (
                      <span className="bg-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <ShoppingBag size={14} /> 到店
                      </span>
                    )}
                  </div>
                  {service.tags.includes('热门') && (
                    <span className="absolute top-2 left-2 bg-pink-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      热门
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                    <span className="text-xl font-bold text-pink-500">¥{service.price}</span>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">{service.description}</p>

                  <div className="flex gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {service.duration}分钟
                    </span>
                    <span className="flex items-center gap-1">
                      <Award size={14} /> {service.beauticianLevel === 'junior' ? '初级' : service.beauticianLevel === 'senior' ? '高级' : '大师'}美容师
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {service.benefits.map((benefit, idx) => (
                        <span key={idx} className="bg-pink-50 text-pink-600 px-2 py-1 rounded text-xs">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartBooking(service)}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-lg transition font-semibold"
                  >
                    立即预约
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 美容师标签 */}
      {activeTab === 'beauticians' && (
        <div>
          {/* 筛选条件 */}
          <div className="mb-6 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">性别</label>
              <select
                value={filterByGender}
                onChange={(e) => setFilterByGender(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="全部">全部</option>
                <option value="female">女</option>
                <option value="male">男</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">最低评分</label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="0">不限</option>
                <option value="4">4.0星以上</option>
                <option value="4.5">4.5星以上</option>
                <option value="4.8">4.8星以上</option>
              </select>
            </div>
          </div>

          {/* 美容师列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBeauticians.map(beautician => (
              <div key={beautician.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                <div className="flex gap-4 mb-4">
                  <img src={beautician.avatar} alt={beautician.name} className="w-20 h-20 rounded-full object-cover" />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{beautician.name}</h3>
                        <p className="text-gray-600 text-sm">{beautician.gender === 'female' ? '女' : '男'} · {beautician.age}岁 · {beautician.experience}年经验</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        beautician.availabilityStatus === 'available' ? 'bg-green-100 text-green-800' : 
                        beautician.availabilityStatus === 'busy' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {beautician.availabilityStatus === 'available' ? '在线' : beautician.availabilityStatus === 'busy' ? '忙碌' : '离线'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < Math.floor(beautician.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                      <span className="text-sm font-semibold text-gray-700">{beautician.rating}</span>
                      <span className="text-sm text-gray-500 ml-1">({beautician.totalReviews}条评价)</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{beautician.bio}</p>

                <div className="mb-3">
                  <div className="flex flex-wrap gap-1">
                    {beautician.specialization.map((spec, idx) => (
                      <span key={idx} className="bg-purple-50 text-purple-600 px-2 py-1 rounded text-xs">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 text-sm text-gray-600 mb-4">
                  <span>服务半径：{beautician.serviceRadius}公里</span>
                  <span>·</span>
                  <span>上门基础费：¥{beautician.basePrice}</span>
                </div>

                <button
                  onClick={() => handleSelectBeautician(beautician)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded-lg transition font-semibold"
                >
                  选择此美容师
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 我的地址标签 */}
      {activeTab === 'addresses' && (
        <div>
          <button
            onClick={handleAddAddress}
            className="mb-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus /> 添加新地址
          </button>

          <div className="space-y-4">
            {addresses.map(address => (
              <div key={address.id} className={`border rounded-lg p-4 hover:shadow-lg transition ${selectedAddress?.id === address.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{address.label}</span>
                      {address.isDefault && (
                        <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-xs">默认</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{address.name} {address.phone}</p>
                  </div>
                  <button
                    onClick={() => handleSelectAddress(address)}
                    className="px-3 py-1 border border-pink-500 text-pink-600 rounded hover:bg-pink-50 transition text-sm"
                  >
                    选择
                  </button>
                </div>
                <p className="text-gray-700">{address.details}</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleEditAddress(address)}
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    编辑
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="text-red-600 hover:text-red-700 text-sm ml-4"
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 我的订单/所有预约标签 */}
      {activeTab === 'appointments' && (
        <div>
          {isAdminMode && (
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-semibold"> 管理视图</p>
              <p className="text-blue-600 text-sm mt-1">查看所有客户的上门服务预约和状态</p>
            </div>
          )}
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Calendar size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">{isAdminMode ? '暂无预约记录' : '暂无订单'}</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{order.serviceType}</h4>
                      <p className="text-gray-600 text-sm">{order.beautician}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'en-route' ? 'bg-purple-100 text-purple-800' :
                      order.status === 'arrived' ? 'bg-green-100 text-green-800' :
                      order.status === 'in-service' ? 'bg-indigo-100 text-indigo-800' :
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status === 'pending' ? '待确认' :
                       order.status === 'accepted' ? '已接受' :
                       order.status === 'en-route' ? '前往中' :
                       order.status === 'arrived' ? '已到达' :
                       order.status === 'in-service' ? '服务中' :
                       order.status === 'completed' ? '已完成' :
                       '已取消'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      {order.date} {order.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={16} />
                      ¥{order.price}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} />
                      {order.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {order.customerName} {order.phone}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 预约模态框 */}
      {showBookingModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">确认预约</h3>
              <button onClick={() => setShowBookingModal(false)}>
                <XCircle size={24} className="text-gray-500" />
              </button>
            </div>

            {/* 服务信息 */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedService.name}</h4>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>价格：¥{selectedService.price}</span>
                <span>时长：{selectedService.duration}分钟</span>
              </div>
            </div>

            {/* 美容师选择 */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">选择美容师</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBeauticians.map(b => (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBeautician(b)}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      selectedBeautician?.id === b.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={b.avatar} alt={b.name} className="w-12 h-12 rounded-full" />
                      <div className="flex-1">
                        <div className="font-semibold">{b.name}</div>
                        <div className="flex items-center gap-1 text-sm">
                          <Star size={14} className="fill-yellow-400 text-yellow-400" />
                          {b.rating}
                        </div>
                      </div>
                      {selectedBeautician?.id === b.id && (
                        <CheckCircle className="text-pink-500" size={24} />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 地址选择 */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">选择服务地址</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {addresses.map(addr => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`p-3 border rounded-lg cursor-pointer transition ${
                      selectedAddress?.id === addr.id ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">{addr.label}</span>
                        {addr.isDefault && <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-0.5 rounded">默认</span>}
                      </div>
                      {selectedAddress?.id === addr.id && <CheckCircle className="text-pink-500" size={20} />}
                    </div>
                    <p className="text-sm text-gray-600">{addr.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 预约时间 */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">选择日期时间</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  value={appointmentDetails.date || ''}
                  onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <input
                  type="time"
                  value={appointmentDetails.time || ''}
                  onChange={(e) => setAppointmentDetails({ ...appointmentDetails, time: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>

            {/* 特殊需求 */}
            <div className="mb-4">
              <label className="block font-semibold mb-2">特殊需求（如过敏史、肤质等）</label>
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
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
                rows={3}
              />
            </div>

            {/* 支付方式 */}
            <div className="mb-6">
              <label className="block font-semibold mb-2">支付方式</label>
              <div className="grid grid-cols-3 gap-3">
                {['wechat', 'alipay', 'cash'].map(method => (
                  <button
                    key={method}
                    onClick={() => setAppointmentDetails({ ...appointmentDetails, paymentMethod: method as any })}
                    className={`p-3 border rounded-lg transition ${
                      appointmentDetails.paymentMethod === method ? 'border-pink-500 bg-pink-50' : 'border-gray-200'
                    }`}
                  >
                    {method === 'wechat' ? '微信支付' : method === 'alipay' ? '支付宝' : '现金'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSubmitBooking}
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-lg transition font-semibold"
              >
                确认预约
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="px-6 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg transition font-semibold"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnSiteServiceBooking;
