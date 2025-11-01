import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, DollarSign, Package, Plus, Search, Trash2, Edit2 } from 'lucide-react';
import { useProductStorage } from '../hooks/useProductStorage';
import { useToast } from './Toast';
import { Modal } from './Modal';
import { ProductForm } from './ProductForm';
import { Product } from '../types/index';

export const Shop: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, searchProducts, getCategories, getLowStockProducts } = useProductStorage();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 搜索和筛选
  const searchResults = searchQuery.trim() ? searchProducts(searchQuery) : products;
  const filtered = filterCategory === 'all'
    ? searchResults
    : searchResults.filter(p => p.category === filterCategory);

  const categories = getCategories();
  const lowStockProducts = getLowStockProducts(20);

  // 统计数据
  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sold), 0);
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalCost = products.reduce((sum, p) => sum + (p.cost * p.stock), 0);

  // 打开添加对话框
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  // 打开编辑对话框
  const handleOpenEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  // 关闭对话框
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // 处理表单提交
  const handleFormSubmit = async (data: Omit<Product, 'id'>) => {
    setIsLoading(true);
    try {
      if (editingProduct) {
        updateProduct(editingProduct.id, data);
        showToast('success', `已更新产品 ${data.name}`, 3000);
      } else {
        addProduct(data);
        showToast('success', `已添加产品 ${data.name}`, 3000);
      }
      handleCloseModal();
    } catch (error) {
      showToast('error', '操作失败，请重试', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  // 删除产品
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`确定要删除产品 ${name} 吗？`)) {
      try {
        deleteProduct(id);
        showToast('success', `已删除产品 ${name}`, 3000);
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
          <h1 className="text-3xl font-bold text-green-900">商城管理</h1>
          <p className="text-green-600 mt-1">共 {products.length} 款产品</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          上架新品
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">库存总值</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalValue.toLocaleString()}</p>
            </div>
            <Package className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">成本总值</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalCost.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">销售收入</p>
              <p className="text-2xl font-bold text-gray-900">¥{totalRevenue.toLocaleString()}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600 opacity-20" />
          </div>
        </div>
        <div className={`bg-white rounded-lg border p-6 ${lowStockProducts.length > 0 ? 'border-red-200' : 'border-green-200'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">库存预警</p>
              <p className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {lowStockProducts.length}
              </p>
            </div>
            <AlertTriangle className={`w-8 h-8 opacity-20 ${lowStockProducts.length > 0 ? 'text-red-600' : 'text-green-600'}`} />
          </div>
        </div>
      </div>

      {/* 库存预警 */}
      {lowStockProducts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900 mb-2">️ 库存预警</h3>
              <p className="text-sm text-red-700 mb-2">以下产品库存不足，请及时补货：</p>
              <div className="flex flex-wrap gap-2">
                {lowStockProducts.map(p => (
                  <span key={p.id} className="inline-block px-3 py-1 bg-white text-red-700 text-xs rounded border border-red-200">
                    {p.name} ({p.stock}件)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="space-y-3 bg-white rounded-lg border border-green-200 p-4">
        {/* 搜索框 */}
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索产品名称或分类..."
            className="flex-1 px-3 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* 分类筛选 */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filterCategory === 'all'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            全部 <span className="ml-2 text-sm">{products.length}</span>
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterCategory === cat
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat} <span className="ml-2 text-sm">{products.filter(p => p.category === cat).length}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 产品表格 */}
      <div className="bg-white rounded-lg border border-green-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-green-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">产品</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">分类</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">价格</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">库存</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">销售</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">利润</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-green-200">
              {filtered.map(product => {
                const profit = (product.price - product.cost) * product.sold;
                const stockStatus = product.stock <= 20 ? 'text-red-600' : 'text-gray-900';
                return (
                  <tr key={product.id} className="hover:bg-green-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.description?.substring(0, 30)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">¥{product.price.toFixed(2)}</td>
                    <td className={`px-6 py-4 font-medium ${stockStatus}`}>
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{product.sold}</td>
                    <td className="px-6 py-4 font-medium text-green-600">¥{profit.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          编辑
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="text-sm px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          删除
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-600">
            <p>暂无匹配的产品</p>
          </div>
        )}
      </div>

      {/* 添加/编辑产品 Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? '编辑产品' : '上架新品'}
        onConfirm={() => {
          const form = document.querySelector('form') as HTMLFormElement;
          if (form) {
            form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
          }
        }}
        confirmText={editingProduct ? '保存' : '上架'}
        cancelText="取消"
        isLoading={isLoading}
      >
        <ProductForm
          initialData={editingProduct || undefined}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
        />
      </Modal>
    </div>
  );
};
