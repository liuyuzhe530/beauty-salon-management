import React, { useState, useMemo } from 'react';
import { Users, Calendar, Plus, Search, Edit2, Trash2, CheckCircle, Clock, AlertCircle, TrendingUp, Zap, Brain, Target, Send } from 'lucide-react';
import { useCustomerStorage } from '../hooks/useCustomerStorage';
import { useAppointmentStorage } from '../hooks/useAppointmentStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { CustomerForm } from './CustomerForm';
import { AppointmentForm } from './AppointmentForm';
import { Customer, Appointment } from '../types/index';

interface AIRecommendation {
  id: string;
  type: 'booking' | 'customer' | 'optimization' | 'revenue';
  title: string;
  description: string;
  action: string;
  priority: 'high' | 'medium' | 'low';
  impact: string;
}

export const CustomerManagement: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchCustomers } = useCustomerStorage();
  const { appointments, addAppointment, updateAppointment, deleteAppointment } = useAppointmentStorage();
  const { showToast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'customers' | 'appointments' | 'operations' | 'insights'>('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [appointmentFilter, setAppointmentFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingData, setEditingData] = useState<Customer | Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointmentForEdit, setSelectedAppointmentForEdit] = useState<Appointment | null>(null);

  // ==================== 客户管理逻辑 ====================
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
      default: return status;
    }
  };

  // ==================== 预约管理逻辑 ====================
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

  // ==================== AI智能分析与推荐 ====================
  const appointmentStats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'pending').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    confirmedRate: appointments.length > 0 
      ? Math.round((appointments.filter(a => a.status !== 'cancelled').length / appointments.length) * 100)
      : 0
  }), [appointments]);

  const todayAppointments = useMemo(() =>
    appointments.filter(a => {
      const today = new Date().toLocaleDateString();
      const appointmentDate = new Date(a.date).toLocaleDateString();
      return appointmentDate === today;
    }), [appointments]);

  const upcomingAppointments = useMemo(() =>
    appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      const today = new Date();
      return appointmentDate > today && a.status !== 'cancelled';
    }).slice(0, 5), [appointments]);

  const pendingAppointments = useMemo(() =>
    appointments.filter(a => a.status === 'pending'), [appointments]);

  // AI推荐引擎
  const aiRecommendations: AIRecommendation[] = useMemo(() => {
    const recommendations: AIRecommendation[] = [];

    // 1. 预约转化率优化
    if (appointmentStats.pending > 0) {
      recommendations.push({
        id: 'pending-optimization',
        type: 'booking',
        title: '待确认预约优化',
        description: `共有 ${appointmentStats.pending} 个待确认预约，建议立即跟进`,
        action: '前往待处理预约',
        priority: 'high',
        impact: `若确认率提升10%，可增加${appointmentStats.pending}个确认预约`
      });
    }

    // 2. 客户流失预警
    const inactiveCustomers = customers.filter(c => c.status === 'inactive').length;
    if (inactiveCustomers > 0) {
      recommendations.push({
        id: 'customer-retention',
        type: 'customer',
        title: '客户流失预警',
        description: `${inactiveCustomers} 位客户长期不活跃，建议进行关怀活动`,
        action: '查看不活跃客户',
        priority: 'high',
        impact: `激活${Math.ceil(inactiveCustomers * 0.3)}位客户可增加${Math.ceil(inactiveCustomers * 0.3 * 500)}元月收入`
      });
    }

    // 3. 今日预约提醒
    if (todayAppointments.length > 0) {
      const pendingToday = todayAppointments.filter(a => a.status === 'pending').length;
      if (pendingToday > 0) {
        recommendations.push({
          id: 'today-pending',
          type: 'optimization',
          title: '今日待确认预约',
          description: `今天有 ${pendingToday} 个待确认的预约，建议立即确认`,
          action: '查看今日预约',
          priority: 'high',
          impact: '及时确认可提高客户满意度和上门率'
        });
      }
    }

    // 4. 收益优化建议
    const totalRevenue = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + a.price, 0);
    
    if (totalRevenue > 0) {
      recommendations.push({
        id: 'revenue-growth',
        type: 'revenue',
        title: '收益增长机会',
        description: `本月已完成预约收入 ¥${totalRevenue}，建议推荐增值服务`,
        action: '分析数据',
        priority: 'medium',
        impact: '推荐增值服务可增长15-25%的收入'
      });
    }

    // 5. VIP客户维护
    const vipCustomers = customers.filter(c => c.status === 'vip').length;
    if (vipCustomers > 0) {
      recommendations.push({
        id: 'vip-retention',
        type: 'customer',
        title: 'VIP客户维护',
        description: `${vipCustomers} 位VIP客户需定期关怀，建议制定专属方案`,
        action: '查看VIP客户',
        priority: 'medium',
        impact: 'VIP客户保留率每提升5%，收入增长10-15%'
      });
    }

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [appointments, customers, appointmentStats.pending, todayAppointments]);

  // ==================== 对话框处理 ====================
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
    setSelectedAppointmentForEdit(appointment);
    setEditingData(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingData(null);
    setSelectedAppointmentForEdit(null);
  };

  // ==================== 表单提交 ====================
  const handleFormSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      if (activeTab === 'customers' || !editingData || 'phone' in editingData) {
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
          showToast('success', `已更新预约`, 3000);
        } else {
          addAppointment(appointmentData);
          showToast('success', `已添加新预约`, 3000);
        }
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== 删除处理 ====================
  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`确定要删除客户 ${name} 吗？`)) {
      deleteCustomer(id);
      showToast('success', `已删除客户 ${name}`, 3000);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm(`确定要删除这个预约吗？`)) {
      deleteAppointment(id);
      showToast('success', `已删除预约`, 3000);
    }
  };

  // ==================== 预约状态更新 ====================
  const handleUpdateAppointmentStatus = (id: string, newStatus: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const appointment = appointments.find(a => a.id === id);
    if (appointment) {
      updateAppointment(id, { ...appointment, status: newStatus });
      showToast('success', `预约状态已更新为 ${getAppointmentStatusLabel(newStatus)}`, 3000);
    }
  };

  // ==================== 获取优先级颜色 ====================
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'border-l-4 border-red-500 bg-red-50';
      case 'medium': return 'border-l-4 border-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-4 border-blue-500 bg-blue-50';
      default: return 'border-l-4 border-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* ==================== Header ====================  */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">Intelligent Customer Management Center</h1>
          <p className="text-green-600 mt-1">
            {activeTab === 'customers' 
              ? `共 ${customers.length} 名客户` 
              : activeTab === 'appointments'
              ? `共 ${appointments.length} 个预约`
              : activeTab === 'operations'
              ? '预约操作与统计'
              : '智能分析与建议'}
          </p>
        </div>
        {(activeTab === 'customers' || activeTab === 'appointments') && (
          <button
            onClick={activeTab === 'customers' ? handleOpenAddCustomer : handleOpenAddAppointment}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            {activeTab === 'customers' ? '新增客户' : '新增预约'}
          </button>
        )}
      </div>

      {/* ==================== 标签页导航 ====================  */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('customers')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'customers'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="w-4 h-4" />
          客户列表
        </button>
        <button
          onClick={() => setActiveTab('appointments')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'appointments'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          预约列表
        </button>
        <button
          onClick={() => setActiveTab('operations')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'operations'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          操作中心
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'insights'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Brain className="w-4 h-4" />
          AI智能分析
        </button>
      </div>

      {/* ==================== 客户列表标签页 ====================  */}
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

            <div className="flex gap-3 flex-wrap">
              {(['all', 'active', 'vip', 'inactive'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setCustomerFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    customerFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '全部' : getCustomerStatusLabel(status)}
                  <span className="ml-2 text-sm">
                    {customers.filter(c => status === 'all' ? true : c.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-50 border-b border-green-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">客户名称</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">电话</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">状态</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">消费金额</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">预约次数</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCustomerStatusColor(customer.status)}`}>
                        {getCustomerStatusLabel(customer.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">¥{customer.totalSpending}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{customer.visitCount}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleOpenEditCustomer(customer)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        title="编辑客户"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        className="text-red-600 hover:text-red-700 font-medium"
                        title="删除客户"
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

      {/* ==================== 预约列表标签页 ====================  */}
      {activeTab === 'appointments' && (
        <>
          <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
            <div className="flex gap-3 flex-wrap">
              {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map(status => (
                <button
                  key={status}
                  onClick={() => setAppointmentFilter(status)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    appointmentFilter === status
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'all' ? '全部' : getAppointmentStatusLabel(status)}
                  <span className="ml-2 text-sm">
                    {appointments.filter(a => status === 'all' ? true : a.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-green-50 border-b border-green-200">
                <tr>
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
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id} className="border-b border-gray-200 hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{appointment.customerName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.staffName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{appointment.service}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} {appointment.time}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(appointment.status)}`}>
                        {getAppointmentStatusLabel(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">¥{appointment.price}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => handleOpenEditAppointment(appointment)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        title="编辑预约"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAppointment(appointment.id)}
                        className="text-red-600 hover:text-red-700 font-medium"
                        title="删除预约"
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

      {/* ==================== 操作中心标签页 ====================  */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">总预约数</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{appointmentStats.total}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-yellow-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">待确认</p>
                  <p className="text-2xl font-bold text-yellow-700 mt-2">{appointmentStats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-blue-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已确认</p>
                  <p className="text-2xl font-bold text-blue-700 mt-2">{appointmentStats.confirmed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-green-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已完成</p>
                  <p className="text-2xl font-bold text-green-700 mt-2">{appointmentStats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg border border-red-200 p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已取消</p>
                  <p className="text-2xl font-bold text-red-700 mt-2">{appointmentStats.cancelled}</p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          {/* 今日预约 */}
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">📅 今日预约 ({todayAppointments.length})</h2>
            {todayAppointments.length > 0 ? (
              <div className="space-y-3">
                {todayAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{apt.customerName} - {apt.service}</p>
                      <p className="text-sm text-gray-600">{apt.time} | 美容师: {apt.staffName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getAppointmentStatusColor(apt.status)}`}>
                        {getAppointmentStatusLabel(apt.status)}
                      </span>
                      <button
                        onClick={() => handleOpenEditAppointment(apt)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">今天没有预约</p>
            )}
          </div>

          {/* 即将到来的预约 */}
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">🚀 即将到来的预约 (后续5个)</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{apt.customerName} - {apt.service}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleDateString()} {apt.time} | 美容师: {apt.staffName}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.status !== 'confirmed' ? (
                        <button
                          onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                          className="px-3 py-1 rounded text-xs font-medium transition-colors bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        >
                          确认
                        </button>
                      ) : (
                        <span className="px-3 py-1 rounded text-xs font-medium bg-green-100 text-green-700">已确认</span>
                      )}
                      <button
                        onClick={() => handleOpenEditAppointment(apt)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">没有即将到来的预约</p>
            )}
          </div>

          {/* 待处理预约 */}
          <div className="bg-white rounded-lg border border-yellow-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">⏳ 待处理预约</h2>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-3">
                {pendingAppointments.map(apt => (
                  <div key={apt.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{apt.customerName} - {apt.service}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(apt.date).toLocaleDateString()} {apt.time} | ¥{apt.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateAppointmentStatus(apt.id, 'confirmed')}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                      >
                        确认
                      </button>
                      <button
                        onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                      >
                        取消
                      </button>
                      <button
                        onClick={() => handleOpenEditAppointment(apt)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">没有待处理的预约</p>
            )}
          </div>
        </div>
      )}

      {/* ==================== AI智能分析标签页 ====================  */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* AI分析头部 */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-gray-900">AI智能分析与建议</h2>
              <Zap className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-gray-700">
              基于实时数据分析，为您提供最优化的管理建议。系统已分析 {appointments.length} 个预约、
              {customers.length} 位客户数据，生成了 {aiRecommendations.length} 条核心建议。
            </p>
          </div>

          {/* 关键指标 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg border border-green-200 p-4">
              <p className="text-sm text-gray-600">预约确认率</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{appointmentStats.confirmedRate}%</p>
              <p className="text-xs text-gray-500 mt-2">优化目标: 95%+</p>
            </div>
            <div className="bg-white rounded-lg border border-blue-200 p-4">
              <p className="text-sm text-gray-600">活跃客户占比</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {customers.length > 0 ? Math.round((customers.filter(c => c.status === 'active' || c.status === 'vip').length / customers.length) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-500 mt-2">需要关怀: {customers.filter(c => c.status === 'inactive').length} 位</p>
            </div>
            <div className="bg-white rounded-lg border border-purple-200 p-4">
              <p className="text-sm text-gray-600">平均客户价值</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">
                ¥{customers.length > 0 ? Math.round(customers.reduce((sum, c) => sum + c.totalSpending, 0) / customers.length) : 0}
              </p>
              <p className="text-xs text-gray-500 mt-2">提升空间: 15-25%</p>
            </div>
          </div>

          {/* 推荐列表 */}
          <div className="space-y-3">
            <h3 className="text-lg font-bold text-gray-900">Smart Recommendations (Sorted by Priority)</h3>
            {aiRecommendations.length > 0 ? (
              aiRecommendations.map(rec => (
                <div key={rec.id} className={`rounded-lg p-4 ${getPriorityColor(rec.priority)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-lg">
                          {rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵'}
                        </span>
                        {rec.title}
                      </h4>
                      <p className="text-sm text-gray-700 mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      <Target className="w-3 h-3 inline mr-1" />
                      预期影响: {rec.impact}
                    </p>
                    <button
                      onClick={() => {
                        if (rec.type === 'booking') setActiveTab('operations');
                        else if (rec.type === 'customer') setActiveTab('customers');
                        showToast('success', `已导航到 ${rec.action}`, 2000);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600 transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      {rec.action}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <p className="text-gray-600">暂无优化建议，系统运行良好！</p>
              </div>
            )}
          </div>

          {/* 智能建议 */}
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">💡 智能决策支持</h3>
            <div className="space-y-3">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <p className="font-medium text-gray-900">✓ 预约管理</p>
                <p className="text-sm text-gray-700 mt-1">
                  建议优先处理 {pendingAppointments.length} 个待确认预约，预计可提升 15-20% 的确认率。
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="font-medium text-gray-900">✓ 客户关怀</p>
                <p className="text-sm text-gray-700 mt-1">
                  {customers.filter(c => c.status === 'inactive').length} 位不活跃客户建议进行主动关怀，预计可激活 20-30%。
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                <p className="font-medium text-gray-900">✓ 收益优化</p>
                <p className="text-sm text-gray-700 mt-1">
                  建议为完成预约的客户推荐增值服务，可增长 10-15% 的客单价。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 表单Modal ====================  */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={
          activeTab === 'customers'
            ? (editingData && 'phone' in editingData ? '编辑客户' : '新增客户')
            : (editingData && 'service' in editingData ? '编辑预约' : '新增预约')
        }
        onConfirm={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
        confirmText={editingData ? '保存' : '添加'}
        cancelText="取消"
        isLoading={isLoading}
      >
        {activeTab === 'customers' || (editingData && 'phone' in editingData) ? (
          <CustomerForm
            initialData={editingData && 'phone' in editingData ? (editingData as Customer) : undefined}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        ) : (
          <AppointmentForm
            initialData={selectedAppointmentForEdit || (editingData && 'service' in editingData ? (editingData as Appointment) : undefined)}
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        )}
      </Modal>
    </div>
  );
};
