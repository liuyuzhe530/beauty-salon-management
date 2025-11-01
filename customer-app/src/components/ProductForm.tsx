import React, { useState } from 'react';
import { Product } from '../types/index';

interface ProductFormProps {
  initialData?: Partial<Product>;
  onSubmit: (data: Omit<Product, 'id'>) => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '护肤品',
    price: initialData?.price || 0,
    cost: initialData?.cost || 0,
    stock: initialData?.stock || 0,
    sold: initialData?.sold || 0,
    description: initialData?.description || '',
    image: initialData?.image || 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = ['护肤品', '美体产品', '按摩工具', '套装', '其他'];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '产品名称不能为空';
    }

    if (formData.price <= 0) {
      newErrors.price = '产品价格必须大于 0';
    }

    if (formData.cost < 0) {
      newErrors.cost = '成本价不能为负数';
    }

    if (formData.cost > formData.price) {
      newErrors.cost = '成本价不能超过销售价';
    }

    if (formData.stock < 0) {
      newErrors.stock = '库存不能为负数';
    }

    if (formData.sold < 0) {
      newErrors.sold = '销售数不能为负数';
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
      category: formData.category,
      price: formData.price,
      cost: formData.cost,
      stock: formData.stock,
      sold: formData.sold,
      description: formData.description,
      image: formData.image
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'cost' || name === 'stock' || name === 'sold'
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

  const profit = formData.price - formData.cost;
  const profitMargin = formData.price > 0 ? ((profit / formData.price) * 100).toFixed(1) : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* 产品名称 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          产品名称 *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="请输入产品名称"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.name && (
          <p className="text-red-600 text-xs mt-1">{errors.name}</p>
        )}
      </div>

      {/* 产品分类 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          产品分类
        </label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* 销售价格 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          销售价格 (元) *
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

      {/* 成本价格 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          成本价格 (元)
        </label>
        <input
          type="number"
          name="cost"
          value={formData.cost}
          onChange={handleChange}
          placeholder="0"
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.cost ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.cost && (
          <p className="text-red-600 text-xs mt-1">{errors.cost}</p>
        )}
        {formData.price > 0 && formData.cost > 0 && (
          <p className="text-xs text-green-600 mt-1">
            利润: ¥{profit.toFixed(2)} ({profitMargin}%)
          </p>
        )}
      </div>

      {/* 库存 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          库存数量
        </label>
        <input
          type="number"
          name="stock"
          value={formData.stock}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.stock ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.stock && (
          <p className="text-red-600 text-xs mt-1">{errors.stock}</p>
        )}
      </div>

      {/* 销售数量 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          销售数量
        </label>
        <input
          type="number"
          name="sold"
          value={formData.sold}
          onChange={handleChange}
          placeholder="0"
          min="0"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
            errors.sold ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isLoading}
        />
        {errors.sold && (
          <p className="text-red-600 text-xs mt-1">{errors.sold}</p>
        )}
      </div>

      {/* 产品描述 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          产品描述
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="请输入产品描述"
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




