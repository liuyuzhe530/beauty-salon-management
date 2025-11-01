import React, { useState } from 'react';
import { Customer } from '../types/index';
import { Save, X } from 'lucide-react';

interface CustomerFormProps {
  initialData?: Partial<Customer>;
  onSubmit: (data: Omit<Customer, 'id'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    totalSpending: initialData?.totalSpending || 0,
    appointmentCount: initialData?.appointmentCount || 0,
    preferredStaff: initialData?.preferredStaff || '',
    status: initialData?.status || 'active' as const,
    lastVisit: initialData?.lastVisit || new Date().toISOString().split('T')[0],
    photo: initialData?.photo || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '客户名称不能为空';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '手机号不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    if (formData.totalSpending < 0) {
      newErrors.totalSpending = '消费额不能为负数';
    }

    if (formData.appointmentCount < 0) {
      newErrors.appointmentCount = '预约次数不能为负数';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      name: formData.name,
      phone: formData.phone,
      totalSpending: formData.totalSpending,
      appointmentCount: formData.appointmentCount,
      visitCount: formData.appointmentCount,
      preferredStaff: formData.preferredStaff,
      status: formData.status,
      lastVisit: formData.lastVisit,
      photo: formData.photo
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'totalSpending' || name === 'appointmentCount' 
        ? parseInt(value) || 0 
        : value
    }));

    // 清除该字段的错误信息
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 客户名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          客户名称 *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入客户名称"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* 手机号 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          手机号 *
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="请输入11位手机号"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.phone ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.phone && (
          <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* 总消费额 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          总消费额 (元)
        </label>
        <input
          type="number"
          name="totalSpending"
          value={formData.totalSpending}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.totalSpending ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.totalSpending && (
          <p className="text-red-600 text-xs mt-1">{errors.totalSpending}</p>
        )}
      </div>

      {/* 预约次数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预约次数
        </label>
        <input
          type="number"
          name="appointmentCount"
          value={formData.appointmentCount}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.appointmentCount ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.appointmentCount && (
          <p className="text-red-600 text-xs mt-1">{errors.appointmentCount}</p>
        )}
      </div>

      {/* 偏好美容师 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          偏好美容师
        </label>
        <input
          type="text"
          name="preferredStaff"
          value={formData.preferredStaff}
          onChange={handleChange}
          placeholder="选择偏好的美容师"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 客户状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          客户状态
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          <option value="active">活跃</option>
          <option value="atrisk">风险</option>
          <option value="inactive">不活跃</option>
        </select>
      </div>

      {/* 最后访问日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          最后访问日期
        </label>
        <input
          type="date"
          name="lastVisit"
          value={formData.lastVisit}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 按钮区域 */}
      <div className="flex gap-3 mt-6 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <X size={16} />
          取 消
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              保 存 中...
            </>
          ) : (
            <>
              <Save size={16} />
              确 认
            </>
          )}
        </button>
      </div>
    </form>
  );
};




