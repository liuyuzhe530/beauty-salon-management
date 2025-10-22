import React, { useState } from 'react';
import { Appointment } from '../types/index';

interface AppointmentFormProps {
  initialData?: Partial<Appointment>;
  onSubmit: (data: Omit<Appointment, 'id'>) => void;
  isLoading?: boolean;
}

export const AppointmentForm: React.FC<AppointmentFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    customerName: initialData?.customerName || '',
    staffName: initialData?.staffName || '',
    service: initialData?.service || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || '09:00',
    duration: initialData?.duration || 60,
    price: initialData?.price || 0,
    status: initialData?.status || 'confirmed' as const,
    notes: initialData?.notes || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = '客户名称不能为空';
    }

    if (!formData.staffName.trim()) {
      newErrors.staffName = '美容师不能为空';
    }

    if (!formData.service.trim()) {
      newErrors.service = '服务项目不能为空';
    }

    if (!formData.date) {
      newErrors.date = '预约日期不能为空';
    }

    if (!formData.time) {
      newErrors.time = '预约时间不能为空';
    }

    if (formData.duration <= 0) {
      newErrors.duration = '服务时长必须大于 0';
    }

    if (formData.price < 0) {
      newErrors.price = '服务价格不能为负数';
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
      customerName: formData.customerName,
      staffName: formData.staffName,
      service: formData.service,
      date: formData.date,
      time: formData.time,
      duration: formData.duration,
      price: formData.price,
      status: formData.status,
      notes: formData.notes
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'price'
        ? parseFloat(value) || 0
        : value
    }));

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
          name="customerName"
          value={formData.customerName}
          onChange={handleChange}
          placeholder="请输入客户名称"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.customerName ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.customerName && (
          <p className="text-red-600 text-xs mt-1">{errors.customerName}</p>
        )}
      </div>

      {/* 美容师 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          美容师 *
        </label>
        <input
          type="text"
          name="staffName"
          value={formData.staffName}
          onChange={handleChange}
          placeholder="请输入美容师名称"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.staffName ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.staffName && (
          <p className="text-red-600 text-xs mt-1">{errors.staffName}</p>
        )}
      </div>

      {/* 服务项目 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服务项目 *
        </label>
        <input
          type="text"
          name="service"
          value={formData.service}
          onChange={handleChange}
          placeholder="如: 面部护理、全身SPA等"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.service ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.service && (
          <p className="text-red-600 text-xs mt-1">{errors.service}</p>
        )}
      </div>

      {/* 预约日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预约日期 *
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.date && (
          <p className="text-red-600 text-xs mt-1">{errors.date}</p>
        )}
      </div>

      {/* 预约时间 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预约时间 *
        </label>
        <input
          type="time"
          name="time"
          value={formData.time}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.time ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.time && (
          <p className="text-red-600 text-xs mt-1">{errors.time}</p>
        )}
      </div>

      {/* 服务时长 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服务时长 (分钟) *
        </label>
        <input
          type="number"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="60"
          min="15"
          step="15"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.duration ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.duration && (
          <p className="text-red-600 text-xs mt-1">{errors.duration}</p>
        )}
      </div>

      {/* 服务价格 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          服务价格 (元) *
        </label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.price ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.price && (
          <p className="text-red-600 text-xs mt-1">{errors.price}</p>
        )}
      </div>

      {/* 预约状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          预约状态
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          <option value="confirmed">已确认</option>
          <option value="pending">待确认</option>
          <option value="completed">已完成</option>
          <option value="cancelled">已取消</option>
        </select>
      </div>

      {/* 备注 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          备注
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="如: 客户特殊需求、过敏信息等"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 隐藏的提交按钮 */}
      <button type="submit" className="hidden" />
    </form>
  );
};




