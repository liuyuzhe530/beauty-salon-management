import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Clock, User, Phone, DollarSign, Check, X, Edit2, Trash2, Eye } from 'lucide-react';

interface OnSiteAppointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceType: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceAddress: string;
  serviceArea: string;
  duration: number;
  price: number;
  staffName: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string;
  createdAt: string;
}

interface ServiceHistory {
  id: string;
  customerName: string;
  serviceType: string;
  completedDate: string;
  serviceAddress: string;
  staffName: string;
  price: number;
  duration: number;
  rating: number;
  feedback: string;
}

export const OnSiteServiceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'appointments' | 'history'>('appointments');
  const [appointments, setAppointments] = useState<OnSiteAppointment[]>([]);
  const [history, setHistory] = useState<ServiceHistory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    serviceType: '面部护理',
    appointmentDate: '',
    appointmentTime: '',
    serviceAddress: '',
    serviceArea: '',
    duration: 60,
    price: 168,
    staffName: '',
    notes: '',
  });

  // 初始化数据
  useEffect(() => {
    loadAppointments();
    loadHistory();
  }, []);

  const loadAppointments = () => {
    const saved = localStorage.getItem('onSiteAppointments');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // 默认示例数据
      setAppointments([
        {
          id: '1',
          customerName: '王女士',
          customerPhone: '13800138000',
          serviceType: '面部护理',
          appointmentDate: '2024-10-25',
          appointmentTime: '14:00',
          serviceAddress: '高新区科技路100号',
          serviceArea: '高新区',
          duration: 60,
          price: 168,
          staffName: '李美容师',
          status: 'confirmed',
          notes: '客户要求保湿护理，有敏感肌肤',
          createdAt: '2024-10-23',
        },
      ]);
    }
  };

  const loadHistory = () => {
    const saved = localStorage.getItem('onSiteServiceHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    } else {
      // 默认示例数据
      setHistory([
        {
          id: 'h1',
          customerName: '张女士',
          serviceType: '面部护理',
          completedDate: '2024-10-20',
          serviceAddress: '南山区中心路50号',
          staffName: '王美容师',
          price: 168,
          duration: 60,
          rating: 5,
          feedback: '非常满意，服务专业，环境舒适',
        },
        {
          id: 'h2',
          customerName: '李女士',
          serviceType: '深层清洁',
          completedDate: '2024-10-19',
          serviceAddress: '福田区华强北路',
          staffName: '陈美容师',
          price: 128,
          duration: 45,
          rating: 5,
          feedback: '皮肤清洁效果明显，非常推荐',
        },
        {
          id: 'h3',
          customerName: '刘女士',
          serviceType: '全身SPA',
          completedDate: '2024-10-18',
          serviceAddress: '罗湖区东门路',
          staffName: '李美容师',
          price: 388,
          duration: 120,
          rating: 5,
          feedback: '放松身心，服务一流',
        },
      ]);
    }
  };

  const saveAppointments = (data: OnSiteAppointment[]) => {
    localStorage.setItem('onSiteAppointments', JSON.stringify(data));
    setAppointments(data);
  };

  const saveHistory = (data: ServiceHistory[]) => {
    localStorage.setItem('onSiteServiceHistory', JSON.stringify(data));
    setHistory(data);
  };

  const handleAddAppointment = () => {
    if (!formData.customerName || !formData.appointmentDate) {
      alert('请填写必填项');
      return;
    }

    if (editingId) {
      // 编辑
      const updated = appointments.map(a => 
        a.id === editingId 
          ? { ...a, ...formData, id: a.id, createdAt: a.createdAt }
          : a
      );
      saveAppointments(updated);
      setEditingId(null);
    } else {
      // 新增
      const newAppointment: OnSiteAppointment = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
      };
      saveAppointments([...appointments, newAppointment]);
    }

    resetForm();
    setShowForm(false);
  };

  const handleEditAppointment = (appointment: OnSiteAppointment) => {
    setFormData({
      customerName: appointment.customerName,
      customerPhone: appointment.customerPhone,
      serviceType: appointment.serviceType,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      serviceAddress: appointment.serviceAddress,
      serviceArea: appointment.serviceArea,
      duration: appointment.duration,
      price: appointment.price,
      staffName: appointment.staffName,
      notes: appointment.notes,
    });
    setEditingId(appointment.id);
    setShowForm(true);
  };

  const handleDeleteAppointment = (id: string) => {
    if (confirm('确定要删除这个预约吗？')) {
      saveAppointments(appointments.filter(a => a.id !== id));
    }
  };

  const handleCompleteAppointment = (appointment: OnSiteAppointment) => {
    // 标记为完成
    const updated: OnSiteAppointment[] = appointments.map(a =>
      a.id === appointment.id ? { ...a, status: 'completed' as const } : a
    );
    saveAppointments(updated);

    // 添加到历史记录
    const historyItem: ServiceHistory = {
      id: 'h' + Date.now(),
      customerName: appointment.customerName,
      serviceType: appointment.serviceType,
      completedDate: new Date().toISOString().split('T')[0],
      serviceAddress: appointment.serviceAddress,
      staffName: appointment.staffName,
      price: appointment.price,
      duration: appointment.duration,
      rating: 5,
      feedback: '',
    };
    saveHistory([...history, historyItem]);

    alert('服务已标记为完成，已添加到历史记录');
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('确定要取消这个预约吗？')) {
      const updated: OnSiteAppointment[] = appointments.map(a =>
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      );
      saveAppointments(updated);
    }
  };

  const handleConfirmAppointment = (id: string) => {
    const updated: OnSiteAppointment[] = appointments.map(a =>
      a.id === id ? { ...a, status: 'confirmed' as const } : a
    );
    saveAppointments(updated);
  };

  const resetForm = () => {
    setFormData({
      customerName: '',
      customerPhone: '',
      serviceType: '面部护理',
      appointmentDate: '',
      appointmentTime: '',
      serviceAddress: '',
      serviceArea: '',
      duration: 60,
      price: 168,
      staffName: '',
      notes: '',
    });
    setEditingId(null);
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      pending: { label: '待确认', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: '已确认', color: 'bg-blue-100 text-blue-800' },
      completed: { label: '已完成', color: 'bg-green-100 text-green-800' },
      cancelled: { label: '已取消', color: 'bg-red-100 text-red-800' },
    };
    return labels[status] || { label: status, color: 'bg-gray-100' };
  };

  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const completedCount = appointments.filter(a => a.status === 'completed').length;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <MapPin className="text-green-500" size={28} />
          上门服务管理
        </h2>
        <p className="text-gray-600">管理上门预约和服务历史记录</p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-gray-600 text-sm">总预约数</p>
          <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-gray-600 text-sm">待确认</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-gray-600 text-sm">已完成</p>
          <p className="text-3xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
          <p className="text-gray-600 text-sm">历史记录数</p>
          <p className="text-3xl font-bold text-purple-600">{history.length}</p>
        </div>
      </div>

      {/* 标签切换 */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('appointments')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'appointments'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          预约记录 ({appointments.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 font-semibold transition ${
            activeTab === 'history'
              ? 'text-green-600 border-b-2 border-green-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          历史记录 ({history.length})
        </button>
      </div>

      {/* 预约记录标签 */}
      {activeTab === 'appointments' && (
        <div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="mb-6 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <Plus size={20} />
            {showForm ? '关闭表单' : '新建预约'}
          </button>

          {/* 添加/编辑表单 */}
          {showForm && (
            <div className="bg-gray-50 rounded-lg p-6 mb-6 border border-gray-200">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? '编辑预约' : '新建上门预约'}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="客户姓名"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="tel"
                  placeholder="客户电话"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <select
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option>面部护理</option>
                  <option>深层清洁</option>
                  <option>扶痕护肤</option>
                  <option>眼部护理</option>
                  <option>全身SPA</option>
                </select>
                <input
                  type="date"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="服务地址"
                  value={formData.serviceAddress}
                  onChange={(e) => setFormData({ ...formData, serviceAddress: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="服务区域（如：高新区、南山区）"
                  value={formData.serviceArea}
                  onChange={(e) => setFormData({ ...formData, serviceArea: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="服务时长（分钟）"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="number"
                  placeholder="服务价格"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <input
                  type="text"
                  placeholder="安排员工"
                  value={formData.staffName}
                  onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <textarea
                  placeholder="备注信息"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="col-span-2 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none h-20"
                />
              </div>
              <div className="flex gap-4 mt-4">
                <button
                  onClick={handleAddAppointment}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition"
                >
                  {editingId ? '更新预约' : '创建预约'}
                </button>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                >
                  取消
                </button>
              </div>
            </div>
          )}

          {/* 预约列表 */}
          <div className="space-y-4">
            {appointments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无预约记录</p>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{appointment.customerName}</h4>
                      <p className="text-gray-600 text-sm">{appointment.serviceType}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusLabel(appointment.status).color}`}>
                      {getStatusLabel(appointment.status).label}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {appointment.appointmentDate} {appointment.appointmentTime}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {appointment.serviceArea}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={16} />
                      ¥{appointment.price}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      {appointment.staffName}
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    <span className="font-semibold">地址：</span>{appointment.serviceAddress}
                  </p>

                  {appointment.notes && (
                    <p className="text-gray-600 text-sm mb-3 bg-yellow-50 p-2 rounded">
                      <span className="font-semibold">备注：</span>{appointment.notes}
                    </p>
                  )}

                  <div className="flex gap-2">
                    {appointment.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleConfirmAppointment(appointment.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 transition"
                        >
                          <Check size={16} /> 确认
                        </button>
                        <button
                          onClick={() => handleEditAppointment(appointment)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 transition"
                        >
                          <Edit2 size={16} /> 编辑
                        </button>
                      </>
                    )}
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleCompleteAppointment(appointment)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 transition"
                      >
                        <Check size={16} /> 完成服务
                      </button>
                    )}
                    {appointment.status !== 'completed' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm flex items-center gap-1 transition"
                      >
                        <X size={16} /> 取消
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1 rounded text-sm flex items-center gap-1 transition"
                    >
                      <Trash2 size={16} /> 删除
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* 历史记录标签 */}
      {activeTab === 'history' && (
        <div>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-gray-500 py-8">暂无历史记录</p>
            ) : (
              history.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-green-50 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-lg text-green-900">{item.customerName}</h4>
                      <p className="text-gray-600 text-sm">{item.serviceType}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < item.rating ? 'text-yellow-400' : 'text-gray-300'}>
                          
                        </span>
                      ))}
                      <span className="ml-2 font-semibold text-yellow-600">{item.rating}.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      {item.completedDate}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} />
                      {item.serviceAddress}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign size={16} />
                      ¥{item.price}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User size={16} />
                      {item.staffName}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm bg-white p-3 rounded mb-3 border border-green-200">
                    <span className="font-semibold">评价：</span>{item.feedback || '暂无评价'}
                  </p>

                  <div className="text-xs text-gray-500">
                    服务时长：{item.duration}分钟
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OnSiteServiceManagement;
