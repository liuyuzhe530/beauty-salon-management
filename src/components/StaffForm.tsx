import React, { useState } from 'react';
import { Staff } from '../types/index';

interface StaffFormProps {
  initialData?: Partial<Staff>;
  onSubmit: (data: Omit<Staff, 'id'>) => void;
  isLoading?: boolean;
}

export const StaffForm: React.FC<StaffFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    phone: initialData?.phone || '',
    specialty: Array.isArray(initialData?.specialty) ? initialData.specialty : [],
    experience: initialData?.experience || 0,
    rating: initialData?.rating || 0,
    totalRevenue: initialData?.totalRevenue || 0,
    clientCount: initialData?.clientCount || 0,
    status: initialData?.status || 'active' as const,
    startDate: initialData?.startDate || new Date().toISOString().split('T')[0],
    photo: initialData?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [specialtyInput, setSpecialtyInput] = useState(
    Array.isArray(formData.specialty) ? formData.specialty.join('、') : ''
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '美容师名称不能为空';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '手机号不能为空';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = '请输入有效的手机号';
    }

    if (formData.specialty.length === 0) {
      newErrors.specialty = '至少需要选择一项专长';
    }

    if (formData.experience < 0) {
      newErrors.experience = '工作年限不能为负数';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = '评分应在 0-5 之间';
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
      specialty: formData.specialty,
      experience: formData.experience,
      rating: formData.rating,
      totalRevenue: formData.totalRevenue,
      clientCount: formData.clientCount,
      status: formData.status,
      startDate: formData.startDate,
      photo: formData.photo
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' || name === 'rating' || name === 'totalRevenue' || name === 'clientCount'
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

  const handleSpecialtyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setSpecialtyInput(input);
    const specialties = input.split('、').map(s => s.trim()).filter(s => s);
    setFormData(prev => ({
      ...prev,
      specialty: specialties
    }));

    if (errors.specialty) {
      setErrors(prev => ({
        ...prev,
        specialty: ''
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 美容师名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          美容师名称 *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入美容师名称"
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

      {/* 专长 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          专长 (用"、"分隔) *
        </label>
        <input
          type="text"
          value={specialtyInput}
          onChange={handleSpecialtyChange}
          placeholder="如: 面部护理、全身SPA、美甲"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.specialty ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.specialty && (
          <p className="text-red-600 text-xs mt-1">{errors.specialty}</p>
        )}
        {formData.specialty.length > 0 && (
          <div className="flex gap-2 mt-2">
            {formData.specialty.map((spec: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                {spec}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 工作年限 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          工作年限
        </label>
        <input
          type="number"
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="0.5"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 评分 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          评分 (0-5)
        </label>
        <input
          type="number"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          placeholder="4.5"
          min="0"
          max="5"
          step="0.1"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.rating ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.rating && (
          <p className="text-red-600 text-xs mt-1">{errors.rating}</p>
        )}
      </div>

      {/* 总收入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          总收入 (元)
        </label>
        <input
          type="number"
          name="totalRevenue"
          value={formData.totalRevenue}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 客户数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          客户数
        </label>
        <input
          type="number"
          name="clientCount"
          value={formData.clientCount}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 工作状态 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          工作状态
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          <option value="active">在职</option>
          <option value="onleave">请假</option>
          <option value="inactive">离职</option>
        </select>
      </div>

      {/* 入职日期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          入职日期
        </label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      {/* 隐藏的提交按钮 */}
      <button type="submit" className="hidden" />
    </form>
  );
};
