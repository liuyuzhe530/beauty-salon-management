import React, { useState, useCallback } from 'react';
import { Users, Calendar, Plus, Search, Edit2, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp, Home, MapPin, Target } from 'lucide-react';
import { useCustomerStorage } from '../hooks/useCustomerStorage';
import { useAppointmentStorage } from '../hooks/useAppointmentStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';
import { InStoreService } from './InStoreService';
import { OnSiteServiceBooking } from './OnSiteServiceBooking';
import { CustomerProfile } from './CustomerProfile';
import { Customer, Appointment, Staff } from '../types/index';
import { useStaffStorage } from '../hooks/useStaffStorage';
import { debounce } from '../utils/debounce';

// 分离出列表项组件并使用 React.memo 优化
const CustomerListItem = React.memo(({ 
  customer, 
  onEdit, 
  onDelete, 
  onViewProfile 
}: {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id: string) => void;
  onViewProfile: (customer: Customer) => void;
}) => (
  <div className="flex items-center justify-between p-3 bg-white border-b hover:bg-gray-50 transition">
    <div className="flex-1" onClick={() => onViewProfile(customer)}>
      <p className="font-semibold text-gray-900">{customer.name}</p>
      <p className="text-sm text-gray-500">{customer.phone}</p>
    </div>
    <div className="flex gap-2">
      <button onClick={() => onEdit(customer)} className="p-1 text-blue-600 hover:bg-blue-50 rounded">
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(customer.id)} className="p-1 text-red-600 hover:bg-red-50 rounded">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
));

CustomerListItem.displayName = 'CustomerListItem';

const CustomerManagementContent: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchCustomers } = useCustomerStorage();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointmentStorage();
  const { staff: staffList } = useStaffStorage();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'customers' | 'appointments' | 'instore' | 'onsite' | 'profile'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Customer | Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [onsiteAppointments, setOnsiteAppointments] = useState<any[]>([]);
  const [onsiteHistory, setOnsiteHistory] = useState<any[]>([]);

  // 使用 useCallback 缓存搜索函数
  const handleSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
    }, 500),
    []
  );

  const searchResults = searchQuery.trim() ? searchCustomers(searchQuery) : customers;
  const filteredCustomers = searchResults.filter(c =>
    customerFilter === 'all' ? true : c.status === customerFilter
  );

  const getCustomerStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'vip': return 'bg-purple-100 text-purple-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCustomerStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return '活跃';
      case 'vip': return 'VIP';
      case 'inactive': return '不活跃';
      default: return '未知';
    }
  };

  const filteredAppointments = appointments.filter(a =>
    appointmentFilter === 'all' ? true : a.status === appointmentFilter
  );

  const getAppointmentStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentStatusLabel = (status: string) => {
    switch(status) {
      case 'pending': return '待确认';
      case 'confirmed': return '已确认';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return '未知';
    }
  };

  const appointmentStats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length
  };

  const upcomingAppointments = appointments.filter(a => {
    const appointmentDate = new Date(a.date);
    const today = new Date();
    return appointmentDate > today && a.status !== 'cancelled';
  }).slice(0, 5);

  const handleOpenAddCustomer = useCallback(() => {
    setEditingData(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditCustomer = useCallback((customer: Customer) => {
    setEditingData(customer);
    setIsModalOpen(true);
  }, []);

  const handleOpenAddAppointment = useCallback(() => {
    setEditingData(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditAppointment = useCallback((appointment: Appointment) => {
    setEditingData(appointment);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingData(null);
  }, []);

  const handleFormSubmit = useCallback(async (data: any) => {
    setIsLoading(true);
    try {
      if (activeTab === 'customers') {
        const customerData = data as Omit<Customer, 'id'>;
        if (editingData && 'phone' in editingData) {
          updateCustomer((editingData as Customer).id, customerData);
          showToast('success', `已更新客户 ${customerData.name}`, 3000);
        } else {
          addCustomer(customerData);
          showToast('success', `已添加新客户 ${customerData.name}`, 3000);
        }
      } else {
        const appointmentData = data as Omit<Appointment, 'id'>;
        if (editingData && 'service' in editingData) {
          updateAppointment((editingData as Appointment).id, appointmentData);
          showToast('success', '已更新预约', 3000);
        } else {
          addAppointment(appointmentData);
          showToast('success', '已添加新预约', 3000);
        }
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, editingData, addCustomer, updateCustomer, addAppointment, updateAppointment, showToast, handleCloseModal]);

  const handleDeleteCustomer = useCallback((id: string, name: string) => {
    if (confirm(`确定要删除客户 ${name} 吗？`)) {
      deleteCustomer(id);
      showToast('success', `已删除客户 ${name}`, 3000);
    }
  }, [deleteCustomer, showToast]);

  const handleDeleteAppointment = useCallback((id: string) => {
    if (confirm('确定要删除这个预约吗？')) {
      deleteAppointment(id);
      showToast('success', '已删除预约', 3000);
    }
  }, [deleteAppointment, showToast]);

  const handleUpdateAppointmentStatus = useCallback((id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      updateAppointment(id, { ...appointment, status: newStatus });
      showToast('success', `预约状态已更新为 ${getAppointmentStatusLabel(newStatus)}`, 3000);
    }
  }, [appointments, updateAppointment, showToast]);

  const handleViewCustomerServices = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    
    // 从 localStorage 获取上门预约
    const onsiteAppts = localStorage.getItem('onSiteAppointments');
    const onsiteApptsList = onsiteAppts ? JSON.parse(onsiteAppts).filter((a: any) => a.customerName === customer.name) : [];
    
    // 从 localStorage 获取上门历史
    const onsiteHist = localStorage.getItem('onSiteServiceHistory');
    const onsiteHistList = onsiteHist ? JSON.parse(onsiteHist).filter((h: any) => h.customerName === customer.name) : [];
    
    setOnsiteAppointments(onsiteApptsList);
    setOnsiteHistory(onsiteHistList);
    setShowServiceModal(true);
  }, []);

  const handleViewProfile = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setActiveTab('profile');
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">客户管理</h1>
          <p className="text-green-600 mt-1">
            {activeTab === 'customers' 
              ? `共 ${customers.length} 名客户` 
              : activeTab === 'appointments'
              ? `共 ${appointments.length} 个预约`
              : activeTab === 'instore'
              ? `共 ${appointments.filter(a => a.service === 'instore').length} 个到店服务`
              : activeTab === 'onsite'
              ? `共 ${appointments.filter(a => a.service === 'onsite').length} 个上门服务`
              : '预约操作与统计'}
          </p>
        </div>
        {(activeTab === 'customers' || activeTab === 'appointments') && (
          <button
            onClick={activeTab === 'customers' ? handleOpenAddCustomer : handleOpenAddAppointment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            新增
          </button>
        )}
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'customers' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          客户
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'appointments' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <Calendar className="w-4 h-4 inline mr-2" />
          预约
        </button>
        <button
          onClick={() => setActiveTab('instore')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'instore' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <Home className="w-4 h-4 inline mr-2" />
          到店
        </button>
        <button
          onClick={() => setActiveTab('onsite')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'onsite' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          上门
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'profile' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <Target className="w-4 h-4 inline mr-2" />
          客户画像
        </button>
      </div>

      {activeTab === 'customers' && (
        <>
          <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="搜索客户名称或电话..."
                className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'active', 'vip', 'inactive'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setCustomerFilter(filter as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    customerFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? '全部' : filter === 'active' ? '活跃' : filter === 'vip' ? 'VIP' : '不活跃'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">名称</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">电话</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">总消费</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">访问</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-t border-green-100 hover:bg-green-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCustomerStatusColor(customer.status)}`}>
                        {getCustomerStatusLabel(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">￥{customer.totalSpending}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{customer.visitCount}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleOpenEditCustomer(customer)}
                        className="text-green-600 hover:text-green-700 mr-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewCustomerServices(customer)}
                        className="text-blue-600 hover:text-blue-700 ml-2"
                      >
                        <MapPin className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewProfile(customer)}
                        className="text-purple-600 hover:text-purple-700 ml-2"
                      >
                        <Target className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredCustomers.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <p>暂无匹配的客户</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'appointments' && (
        <>
          <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
            <div className="flex gap-3 flex-wrap">
              {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(filter => (
                <button
                  key={filter}
                  onClick={() => setAppointmentFilter(filter as any)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    appointmentFilter === filter
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all' ? '全部' : filter === 'pending' ? '待确认' : filter === 'confirmed' ? '已确认' : filter === 'completed' ? '已完成' : '已取消'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">客户</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">美容师</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">服务项目</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">日期时间</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">价格</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(apt => (
                  <tr key={apt.id} className="border-t border-green-100 hover:bg-green-50">
                    <td className="px-6 py-3 text-sm text-gray-900">{apt.customerName}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{apt.staffName}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{apt.service}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{apt.date} {apt.time}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(apt.status)}`}>
                        {getAppointmentStatusLabel(apt.status)}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900">￥{apt.price}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleOpenEditAppointment(apt)}
                        className="text-green-600 hover:text-green-700 mr-2"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <p>暂无匹配的预约</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'instore' && <InStoreService />}
      {activeTab === 'onsite' && <OnSiteServiceBooking mode="admin" />}
      
      {/* 客户画像标签页 */}
      {activeTab === 'profile' && (
        <div>
          {selectedCustomer ? (
            <CustomerProfile customer={selectedCustomer} staffList={staffList} />
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">请从左侧客户列表中选择一个客户来查看其详细的画像分析</p>
            </div>
          )}
        </div>
      )}

      {/* 客户上门服务模态框 */}
      {showServiceModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCustomer.name} - 上门服务记录
              </h2>
              <button
                onClick={() => setShowServiceModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-600" />
                  上门预约 ({onsiteAppointments.length})
                </h3>
                {onsiteAppointments.length > 0 ? (
                  <div className="space-y-2">
                    {onsiteAppointments.map(apt => (
                      <div key={apt.id} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{apt.serviceType}</p>
                            <p className="text-sm text-gray-600">
                              {apt.appointmentDate} {apt.appointmentTime} | 
                              <span className="ml-2">员工: {apt.staffName}</span>
                            </p>
                            <p className="text-sm text-gray-600">地址: {apt.serviceAddress}</p>
                            <p className="text-sm font-semibold text-green-600 mt-1">
                              ¥{apt.price} | {apt.duration}分钟
                            </p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            apt.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            apt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            apt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {apt.status === 'confirmed' ? '已确认' :
                             apt.status === 'pending' ? '待确认' :
                             apt.status === 'completed' ? '已完成' :
                             '已取消'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">暂无上门预约</p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-600" />
                  上门历史 ({onsiteHistory.length})
                </h3>
                {onsiteHistory.length > 0 ? (
                  <div className="space-y-2">
                    {onsiteHistory.map(hist => (
                      <div key={hist.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{hist.serviceType}</p>
                            <p className="text-sm text-gray-600">
                              完成时间: {hist.completedDate} | 
                              <span className="ml-2">员工: {hist.staffName}</span>
                            </p>
                            <p className="text-sm text-gray-600">地址: {hist.serviceAddress}</p>
                            <p className="text-sm font-semibold text-purple-600 mt-1">
                              ¥{hist.price} | {hist.duration}分钟
                            </p>
                            {hist.feedback && (
                              <p className="text-sm text-gray-700 mt-2 italic">
                                反馈: {hist.feedback}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 whitespace-nowrap">
                            {Array.from({ length: hist.rating }).map((_, i) => (
                              <span key={i} className="text-yellow-400"></span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-4">暂无上门历史</p>
                )}
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 模态框 */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingData ? '编辑' : '新增'}
      >
        {activeTab === 'customers' ? (
          <CustomerForm
            initialData={editingData as Customer}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            isLoading={isLoading}
          />
        ) : (
          <AppointmentForm
            initialData={editingData as Appointment}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};

// 使用 React.memo 包装整个组件
export const CustomerManagement = React.memo(CustomerManagementContent);

