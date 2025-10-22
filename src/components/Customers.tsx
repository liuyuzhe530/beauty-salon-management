import React, { useState } from 'react';
import { Calendar, DollarSign, Trash2, Edit2, Plus, Search } from 'lucide-react';
import { useCustomerStorage } from '../hooks/useCustomerStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { CustomerForm } from './CustomerForm';
import { Customer } from '../types/index';

export const Customers: React.FC = () => {
  const { customers, addCustomer, updateCustomer, deleteCustomer, searchCustomers } = useCustomerStorage();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<'all' | 'active' | 'atrisk' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 搜索和筛选数据
  const searchResults = searchQuery.trim() ? searchCustomers(searchQuery) : customers;
  const filtered = searchResults.filter(c =>
    filter === 'all' ? true : c.status === filter
  );

  // 获取状态的颜色和标签
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'atrisk': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return '活跃';
      case 'atrisk': return '风险';
      case 'inactive': return '不活跃';
      default: return status;
    }
  };

  // 打开添加客户对话框
  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  // 打开编辑客户对话框
  const handleOpenEditModal = (customer: Customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  // 关闭对话框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: Omit<Customer, 'id'>) => {
    setIsLoading(true);
    try {
      if (editingCustomer) {
        // 编辑模式
        updateCustomer(editingCustomer.id, data);
        showToast('success', `已更新客户 ${data.name}`, 3000);
      } else {
        // 新增模式
        addCustomer(data);
        showToast('success', `已添加新客户 ${data.name}`, 3000);
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除客户
  const handleDeleteCustomer = (id: string, name: string) => {
    if (confirm(`确定要删除客户 ${name} 吗？`)) {
      try {
        deleteCustomer(id);
        showToast('success', `已删除客户 ${name}`, 3000);
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
          <h1 className="text-3xl font-bold text-green-900">客户管理</h1>
          <p className="text-green-600 mt-1">总计 {customers.length} 名客户</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          添加客户
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
            placeholder="搜索客户名称或手机号..."
            className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 筛选按钮 */}
        <div className="flex gap-3 flex-wrap">
          {(['all', 'active', 'atrisk', 'inactive'] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === status
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status === 'all' ? '全部' : status === 'active' ? '活跃' : status === 'atrisk' ? '风险' : '不活跃'}
              <span className="ml-2 text-sm">
                {customers.filter(c => status === 'all' ? true : c.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 客户表格 */}
      <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">客户</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">状态</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">消费额</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">预约次数</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">最后访问</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200">
              {filtered.map(customer => (
                <tr key={customer.id} className="hover:bg-green-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={customer.photo}
                        alt={customer.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{customer.name}</p>
                        <p className="text-xs text-gray-500">{customer.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(customer.status)}`}>
                      {getStatusLabel(customer.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-900">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">{customer.totalSpending.toLocaleString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-900 font-medium">{customer.appointmentCount}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{customer.lastVisit}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenEditModal(customer)}
                        className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                      >
                        <Edit2 className="w-4 h-4" />
                        编辑
                      </button>
                      <button
                        onClick={() => handleDeleteCustomer(customer.id, customer.name)}
                        className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>暂无匹配的客户</p>
          </div>
        )}
      </div>

      {/* 添加/编辑客户 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCustomer ? '编辑客户' : '添加新客户'}
        onConfirm={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
        confirmText={editingCustomer ? '保存' : '添加'}
        cancelText="取消"
        isLoading={isLoading}
      >
        <CustomerForm
          initialData={editingCustomer || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};
