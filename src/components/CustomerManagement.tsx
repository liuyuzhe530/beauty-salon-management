import React, { useState } from 'react';
import { Users, Calendar, Plus, Search, Edit2, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp, Home, MapPin } from 'lucide-react';
import { useCustomerStorage } from '../hooks/useCustomerStorage';
import { useAppointmentStorage } from '../hooks/useAppointmentStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';
import { InStoreService } from './InStoreService';
import { OnSiteService } from './OnSiteService';
import { Customer, Appointment } from '../types/index';

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchCustomers } = useCustomerStorage();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointmentStorage();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'customers' | 'appointments' | 'instore' | 'onsite' | 'operations'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Customer | Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      case 'vip': return '贵宾';
      case 'inactive': return '不活跃';
      case 'atrisk': return '风险客户';
      default: return status;
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
      default: return status;
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

  const handleOpenAddCustomer = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setEditingData(customer);
    setIsModalOpen(true);
  };

  const handleOpenAddAppointment = () => {
    setEditingData(null);
    setIsModalOpen(true);
  };

  const handleOpenEditAppointment = (appointment: Appointment) => {
    setEditingData(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
  };

  const handleFormSubmit = async (data: any) => {
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
  };

  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`确定要删除客户 ${name} 吗？`)) {
      deleteCustomer(id);
      showToast('success', `已删除客户 ${name}`, 3000);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('确定要删除这个预约吗？')) {
      deleteAppointment(id);
      showToast('success', '已删除预约', 3000);
    }
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      updateAppointment(id, { ...appointment, status: newStatus });
      showToast('success', `预约状态已更新为 ${getAppointmentStatusLabel(newStatus)}`, 3000);
    }
  };

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
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-2 font-medium whitespace-nowrap ${activeTab === 'operations' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-600'}`}
        >
          <TrendingUp className="w-4 h-4 inline mr-2" />
          运营
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
      {activeTab === 'onsite' && <OnSiteService />}

      {activeTab === 'operations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">待确认</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-2">{appointmentStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-300" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已确认</p>
                  <p className="text-2xl font-bold text-blue-700 mt-2">{appointmentStats.confirmed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-300" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{appointmentStats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-300" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已取消</p>
                  <p className="text-2xl font-bold text-red-700 mt-2">{appointmentStats.cancelled}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">即将到来的预约 (后续5个)</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{apt.customerName} - {apt.service}</p>
                      <p className="text-sm text-gray-600">{new Date(apt.date).toLocaleDateString()} {apt.time} | 美容师 {apt.staffName}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(apt.status)}`}>
                      {getAppointmentStatusLabel(apt.status)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">没有即将到来的预约</p>
            )}
          </div>

          <div className="bg-white rounded-lg border border-yellow-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">待处理预约</h2>
            {appointments.filter(a => a.status === 'pending').length > 0 ? (
              <div className="space-y-3">
                {appointments.filter(a => a.status === 'pending').map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{apt.customerName}</p>
                      <p className="text-sm text-gray-600">{apt.date} {apt.time}</p>
                    </div>
                    <button
                      onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200`}
                    >
                      确认
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">没有待处理的预约</p>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingData ? '编辑' : '新增'}
      >
        {activeTab === 'customers' ? (
          <CustomerForm
            initialData={editingData as Customer}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        ) : (
          <AppointmentForm
            initialData={editingData as Appointment}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};

