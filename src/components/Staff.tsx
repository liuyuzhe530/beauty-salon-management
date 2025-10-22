import React, { useState } from 'react';
import { Star, DollarSign, Users, TrendingUp, Plus, Search, Trash2, Edit2, Zap } from 'lucide-react';
import { useStaffStorage } from '../hooks/useStaffStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { StaffForm } from './StaffForm';
import { SmartManager } from './SmartManager';
import { Staff as StaffType } from '../types/index';

export const Staff: React.FC = () => {
  const { staff, addStaff, updateStaff, deleteStaff, searchStaff } = useStaffStorage();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'onleave' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'list' | 'smartmanager'>('list');

  // 搜索和筛选
  const searchResults = searchQuery.trim() ? searchStaff(searchQuery) : staff;
  const filtered = searchResults.filter(s =>
    filter === 'all' ? true : s.status === filter
  );

  // 获取状态颜色和标签
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'onleave': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return '在职';
      case 'onleave': return '请假';
      case 'inactive': return '离职';
      default: return status;
    }
  };

  // 打开添加对话框
  const handleOpenAddModal = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  // 打开编辑对话框
  const handleOpenEditModal = (staff: StaffType) => {
    setEditingStaff(staff);
    setIsModalOpen(true);
  };

  // 关闭对话框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStaff(null);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: Omit<StaffType, 'id'>) => {
    setIsLoading(true);
    try {
      if (editingStaff) {
        updateStaff(editingStaff.id, data);
        showToast('success', `已更新美容师 ${data.name}`, 3000);
      } else {
        addStaff(data);
        showToast('success', `已添加新美容师 ${data.name}`, 3000);
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除美容师
  const handleDeleteStaff = (id: string, name: string) => {
    if (confirm(`确定要删除美容师 ${name} 吗？`)) {
      try {
        deleteStaff(id);
        showToast('success', `已删除美容师 ${name}`, 3000);
      } catch (error) {
        showToast('error', '删除失败，请重试', 3000);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">美容师管理</h1>
          <p className="text-green-600 mt-1">共 {staff.length} 名美容师</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          新增美容师
        </button>
      </div>

      {/* 标签页导航 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'list'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          美容师列表
        </button>
        <button
          onClick={() => setActiveTab('smartmanager')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'smartmanager'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          智能店长
        </button>
      </div>

      {/* 美容师列表标签页 */}
      {activeTab === 'list' && (
        <>
          {/* 搜索和筛选 */}
          <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
            {/* 搜索框 */}
            <div className="flex items-center gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索美容师名称或电话..."
                className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* 筛选按钮 */}
            <div className="flex gap-3 flex-wrap">
              {(['all', 'active', 'onleave', 'inactive'] as const).map(status => (
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
                    {staff.filter(s => status === 'all' ? true : s.status === status).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 美容师卡片网格 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(s => (
              <div
                key={s.id}
                className="bg-white rounded-lg border border-green-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* 照片 */}
                <div className="w-full h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={s.photo}
                    alt={s.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>

                {/* 内容 */}
                <div className="p-6 space-y-4">
                  {/* 名字和评分 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{s.name}</h3>
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusColor(s.status)}`}>
                        {getStatusLabel(s.status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(s.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{s.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  {/* 专长标签 */}
                  <div className="flex gap-2 flex-wrap">
                    {Array.isArray(s.specialty) && s.specialty.slice(0, 2).map((spec, idx) => (
                      <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {spec}
                      </span>
                    ))}
                    {Array.isArray(s.specialty) && s.specialty.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        +{s.specialty.length - 2}
                      </span>
                    )}
                  </div>

                  {/* 统计数据 */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-200">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">经验</span>
                      </div>
                      <p className="font-semibold text-gray-900">{s.experience}年</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-600">客户</span>
                      </div>
                      <p className="font-semibold text-gray-900">{s.clientCount}</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">收入</span>
                      </div>
                      <p className="font-semibold text-gray-900">¥{(s.totalRevenue / 1000).toFixed(1)}k</p>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEditModal(s)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      编辑
                    </button>
                    <button
                      onClick={() => handleDeleteStaff(s.id, s.name)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium flex items-center justify-center gap-1"
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
              <p>暂无匹配的美容师</p>
            </div>
          )}
        </>
      )}

      {/* 智能店长标签页 */}
      {activeTab === 'smartmanager' && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <SmartManager />
        </div>
      )}

      {/* 添加/编辑美容师 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingStaff ? '编辑美容师' : '新增美容师'}
        onConfirm={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
        confirmText={editingStaff ? '保存' : '添加'}
        cancelText="取消"
        isLoading={isLoading}
      >
        <StaffForm
          initialData={editingStaff || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};
