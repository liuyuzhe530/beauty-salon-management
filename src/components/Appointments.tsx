import React, { useState } from 'react';
import { Calendar, Clock, User, DollarSign, Check, X, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { useAppointmentStorage } from '../hooks/useAppointmentStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { AppointmentForm } from './AppointmentForm';
import { Appointment } from '../types/index';

export const Appointments: React.FC = () => {
  const { appointments, addAppointment, updateAppointment, deleteAppointment, searchByCustomer } = useAppointmentStorage();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending' | 'completed' | 'cancelled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 搜索和筛选
  const searchResults = searchQuery.trim() ? searchByCustomer(searchQuery) : appointments;
  const filtered = searchResults.filter(a =>
    filter === 'all' ? true : a.status === filter
  );

  // 获取状态颜色和标签
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'confirmed': return '已确认';
      case 'pending': return '待确认';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  // 打开添加对话框
  const handleOpenAddModal = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  // 打开编辑对话框
  const handleOpenEditModal = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  // 关闭对话框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: Omit<Appointment, 'id'>) => {
    setIsLoading(true);
    try {
      if (editingAppointment) {
        updateAppointment(editingAppointment.id, data);
        showToast('success', `已更新预约 ${data.customerName}`, 3000);
      } else {
        addAppointment(data);
        showToast('success', `已添加新预约 ${data.customerName}`, 3000);
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除预约
  const handleDeleteAppointment = (id: string, customerName: string) => {
    if (confirm(`确定要删除 ${customerName} 的预约吗？`)) {
      try {
        deleteAppointment(id);
        showToast('success', `已删除预约`, 3000);
      } catch (error) {
        showToast('error', '删除失败，请重试', 3000);
      }
    }
  };

  // 标记为完成
  const handleCompleteAppointment = (appointment: Appointment) => {
    try {
      updateAppointment(appointment.id, { status: 'completed' });
      showToast('success', `已标记 ${appointment.customerName} 的预约为完成`, 3000);
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    }
  };

  // 取消预约
  const handleCancelAppointment = (appointment: Appointment) => {
    if (confirm(`确定要取消 ${appointment.customerName} 的预约吗？`)) {
      try {
        updateAppointment(appointment.id, { status: 'cancelled' });
        showToast('success', `已取消 ${appointment.customerName} 的预约`, 3000);
      } catch (error) {
        showToast('error', '操作失败，请重试', 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">预约管理</h1>
          <p className="text-green-600 mt-1">总计 {appointments.length} 个预约</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新建预约
        </button>
      </div>

      {/* 搜索和筛选 */}
      <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
        {/* 搜索框 */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索客户名称..."
            className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-3 flex-wrap">
          {(['all', 'confirmed', 'pending', 'completed', 'cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? '全部' : getStatusLabel(status)}
              <span className="ml-2 text-sm">
                {appointments.filter(a => status === 'all' ? true : a.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 预约列表 */}
      <div className="space-y-3">
        {filtered.map(apt => (
          <div
            key={apt.id}
            className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* 左侧内容 */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{apt.customerName}</h3>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(apt.status)}`}>
                    {getStatusLabel(apt.status)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                  <div className="flex items-start gap-2">
                    <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">美容师</p>
                      <p className="font-medium text-gray-900">{apt.staffName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">日期</p>
                      <p className="font-medium text-gray-900">{apt.date}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">时间</p>
                      <p className="font-medium text-gray-900">{apt.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">价格</p>
                      <p className="font-medium text-gray-900">¥{apt.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-gray-500">时长</p>
                      <p className="font-medium text-gray-900">{apt.duration}分</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3">服务: <span className="font-medium">{apt.service}</span></p>
                {apt.notes && (
                  <p className="text-sm text-gray-500 mt-2">备注: {apt.notes}</p>
                )}
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => handleOpenEditModal(apt)}
                  className="text-sm px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-4 h-4" />
                  编辑
                </button>
                {apt.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => handleCompleteAppointment(apt)}
                      className="text-sm px-3 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                    >
                      <Check className="w-4 h-4" />
                      完成
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(apt)}
                      className="text-sm px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                    >
                      <X className="w-4 h-4" />
                      取消
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteAppointment(apt.id, apt.customerName)}
                  className="text-sm px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-4 h-4" />
                  删除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-600">
          <p>暂无匹配的预约</p>
        </div>
      )}

      {/* 添加/编辑预约 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingAppointment ? '编辑预约' : '新建预约'}
        onConfirm={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
        confirmText={editingAppointment ? '保存' : '添加'}
        cancelText="取消"
        isLoading={isLoading}
      >
        <AppointmentForm
          initialData={editingAppointment || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};
