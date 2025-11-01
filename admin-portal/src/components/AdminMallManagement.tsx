import React, { useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, X, ShoppingBag, AlertCircle } from 'lucide-react';
import { useProductStorage } from '../hooks/useProductStorage';
import { useToast } from './Toast';
import { Product } from '../types/index';

export const AdminMallManagement: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStorage();
  const { showToast } = useToast();
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // 临时输入状态（本地输入框值）
  const [tempValues, setTempValues] = useState<Record<string, Record<string, number>>>({});

  // 表单状态
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    category: '护肤品',
    stock: 0,
    price: 0,
    cost: 0,
    sold: 0,
    description: '',
    image: ''
  });

  // 所有分类
  const categories = ['护肤品', '美甲用品', '美睫用品', 'SPA用品', '化妆工具', '其他'];

  // 防抖更新
  const debounceTimer = React.useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const handleTempInputChange = (productId: string, field: string, value: number) => {
    // 更新临时值
    setTempValues(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value
      }
    }));

    // 清除之前的定时器
    if (debounceTimer.current[`${productId}-${field}`]) {
      clearTimeout(debounceTimer.current[`${productId}-${field}`]);
    }

    // 延迟更新（500ms后执行）
    debounceTimer.current[`${productId}-${field}`] = setTimeout(async () => {
      try {
        if (field === 'stock') {
          await updateProduct(productId, { stock: value });
          showToast('success', '✅ 库存已更新');
        } else if (field === 'price') {
          await updateProduct(productId, { price: value });
          showToast('success', '✅ 价格已更新');
        }
      } catch (error) {
        showToast('error', '更新失败');
      }
    }, 500);
  };

  // 获取显示值（使用临时值或实际值）
  const getDisplayValue = (productId: string, field: string, actualValue: number) => {
    return tempValues[productId]?.[field] ?? actualValue;
  };

  // 添加产品
  const handleAddProduct = async () => {
    if (!formData.name || !formData.category) {
      showToast('error', '请填写产品名称和分类');
      return;
    }

    try {
      await addProduct(formData);
      showToast('success', `✅ 产品 "${formData.name}" 已上架！`);
      resetForm();
    } catch (error) {
      showToast('error', '添加产品失败');
    }
  };

  // 删除产品
  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (confirm(`确认要删除 "${productName}" 吗？`)) {
      try {
        await deleteProduct(productId);
        showToast('success', `✅ 产品 "${productName}" 已删除`);
      } catch (error) {
        showToast('error', '删除产品失败');
      }
    }
  };

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: '',
      category: '护肤品',
      stock: 0,
      price: 0,
      cost: 0,
      sold: 0,
      description: '',
      image: ''
    });
    setIsAddingProduct(false);
    setEditingId(null);
  };

  // 筛选产品
  const filteredProducts = filterCategory === 'all' 
    ? products 
    : products.filter(p => p.category === filterCategory);

  // 统计信息
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 20).length;
  const totalProducts = products.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
            <ShoppingBag className="w-8 h-8" />
            商城管理
          </h1>
          <p className="text-green-600 mt-1">管理店铺商品，更新库存和价格</p>
        </div>
        <button
          onClick={() => setIsAddingProduct(true)}
          className="bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
        >
          <Plus className="w-5 h-5" />
          上架新产品
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <p className="text-gray-600 text-sm">商品总数</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{totalProducts}</p>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <p className="text-gray-600 text-sm">库存总值</p>
          <p className="text-3xl font-bold text-green-600 mt-2">¥{totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg border border-red-200 p-6">
          <p className="text-gray-600 text-sm">库存预警</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{lowStockCount}</p>
          <p className="text-xs text-red-500 mt-1">库存≤20件的商品</p>
        </div>
      </div>

      {/* 分类筛选 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filterCategory === 'all'
              ? 'bg-green-500 text-white'
              : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
          }`}
        >
          全部分类
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-lg transition ${
              filterCategory === cat
                ? 'bg-green-500 text-white'
                : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 添加产品表单 */}
      {isAddingProduct && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">上架新产品</h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="产品名称"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="number"
              placeholder="库存数量"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="销售价格"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="成本价格"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="text"
              placeholder="产品图片URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <textarea
              placeholder="产品描述"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAddProduct}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              上架产品
            </button>
            <button
              onClick={resetForm}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {/* 产品列表 */}
      <div className="space-y-4">
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg border border-green-200 p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">暂无产品</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition">
              <div className="flex gap-4">
                {/* 产品图片 */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/100?text=No+Image';
                  }}
                />

                {/* 产品信息 */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.stock > 50 ? 'bg-green-100 text-green-700' :
                      product.stock > 20 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      库存: {product.stock}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>

                  {/* 库存和价格控制 */}
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    <div>
                      <label className="text-xs text-gray-500">库存数量</label>
                      <div className="flex items-center gap-1 mt-1">
                        <input
                          type="number"
                          value={getDisplayValue(product.id, 'stock', product.stock)}
                          onChange={(e) => handleTempInputChange(product.id, 'stock', parseInt(e.target.value) || 0)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">销售价格</label>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-sm">¥</span>
                        <input
                          type="number"
                          value={getDisplayValue(product.id, 'price', product.price)}
                          onChange={(e) => handleTempInputChange(product.id, 'price', parseFloat(e.target.value) || 0)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">已售</label>
                      <div className="mt-1 text-lg font-bold text-green-600">{product.sold}</div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">库存值</label>
                      <div className="mt-1 text-lg font-bold text-blue-600">
                        ¥{(product.price * product.stock).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* 库存预警 */}
                  {product.stock <= 20 && (
                    <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded mb-3">
                      <AlertCircle className="w-4 h-4" />
                      库存不足，请及时补货！
                    </div>
                  )}
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDeleteProduct(product.id, product.name)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="删除产品"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
