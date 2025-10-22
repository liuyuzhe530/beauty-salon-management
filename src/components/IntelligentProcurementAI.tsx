import React, { useState } from 'react';
import { Search, ShoppingCart, TrendingUp, Star, Filter, TrendingDown, Check, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  supplier: string;
  marketplace: string;
  rating: number;
  sales: number;
  image: string;
}

interface PriceComparison {
  id: string;
  productName: string;
  marketplace: string;
  supplier: string;
  price: number;
  rating: number;
  delivery: string;
  quantity: string;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
  products: number;
  response_time: string;
  location: string;
}

export const IntelligentProcurementAI: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'compare' | 'suppliers' | 'orders' | 'analytics'>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [selectedProductForCompare, setSelectedProductForCompare] = useState<string | null>(null);

  const products: Product[] = [
    {
      id: '1',
      name: '护肤精油套装30ML',
      price: 45,
      supplier: '浙江美妆有限公司',
      marketplace: '1688',
      rating: 4.8,
      sales: 12500,
      image: 'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: '面膜贴片100片装',
      price: 8,
      supplier: '广州美妆批发',
      marketplace: '阿里巴巴',
      rating: 4.7,
      sales: 28900,
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: '精华液50ML',
      price: 22,
      supplier: '上海美妆集团',
      marketplace: '1688',
      rating: 4.9,
      sales: 8650,
      image: 'https://images.unsplash.com/photo-1556228541-6b06b0f4b9e1?w=150&h=150&fit=crop'
    }
  ];

  // 比价数据 - 同一个商品在不同平台的价格
  const priceComparisons: PriceComparison[] = [
    {
      id: '1-1688',
      productName: '护肤精油套装30ML',
      marketplace: '1688',
      supplier: '浙江美妆有限公司',
      price: 45,
      rating: 4.8,
      delivery: '2-3天',
      quantity: '≥1件'
    },
    {
      id: '1-alibaba',
      productName: '护肤精油套装30ML',
      marketplace: '阿里巴巴',
      supplier: '浙江美妆工厂',
      price: 42,
      rating: 4.7,
      delivery: '3-5天',
      quantity: '≥5件'
    },
    {
      id: '1-douyin',
      productName: '护肤精油套装30ML',
      marketplace: '抖音电商',
      supplier: '浙江美妆零售',
      price: 48,
      rating: 4.6,
      delivery: '1-2天',
      quantity: '≥1件'
    },
    {
      id: '1-jd',
      productName: '护肤精油套装30ML',
      marketplace: '京东',
      supplier: '京东自营',
      price: 50,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件'
    },
    {
      id: '2-alibaba',
      productName: '面膜贴片100片装',
      marketplace: '阿里巴巴',
      supplier: '广州美妆批发',
      price: 8,
      rating: 4.7,
      delivery: '2-3天',
      quantity: '≥1件'
    },
    {
      id: '2-1688',
      productName: '面膜贴片100片装',
      marketplace: '1688',
      supplier: '广州美妆工厂',
      price: 6.5,
      rating: 4.5,
      delivery: '3-5天',
      quantity: '≥10件'
    },
    {
      id: '2-douyin',
      productName: '面膜贴片100片装',
      marketplace: '抖音电商',
      supplier: '广州美妆直供',
      price: 9,
      rating: 4.8,
      delivery: '1-2天',
      quantity: '≥1件'
    }
  ];

  const suppliers: Supplier[] = [
    {
      id: 's1',
      name: '浙江美妆有限公司',
      rating: 4.8,
      products: 450,
      response_time: '2小时',
      location: '杭州'
    },
    {
      id: 's2',
      name: '广州美妆批发',
      rating: 4.7,
      products: 680,
      response_time: '4小时',
      location: '广州'
    },
    {
      id: 's3',
      name: '上海美妆集团',
      rating: 4.9,
      products: 320,
      response_time: '1小时',
      location: '上海'
    }
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.price >= priceRange.min &&
    p.price <= priceRange.max
  );

  // 获取某个商品的所有比价信息
  const getProductComparisons = (productName: string) => {
    return priceComparisons.filter(c => c.productName === productName);
  };

  // 计算价格对比统计
  const calculateComparableStats = (productName: string) => {
    const comparisons = getProductComparisons(productName);
    if (comparisons.length === 0) return null;
    
    const prices = comparisons.map(c => c.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    return {
      minPrice,
      maxPrice,
      avgPrice,
      savingPercent: Math.round(((maxPrice - minPrice) / maxPrice) * 100)
    };
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
        <h2 className="text-2xl font-bold text-purple-900">智能采购助手</h2>
        <p className="text-gray-600">智能供应商匹配和产品采购 + 多平台比价系统</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {(['search', 'compare', 'suppliers', 'orders', 'analytics'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium whitespace-nowrap ${
              activeTab === tab
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'search' && '产品搜索'}
            {tab === 'compare' && '比价系统'}
            {tab === 'suppliers' && '供应商'}
            {tab === 'orders' && '订单'}
            {tab === 'analytics' && '分析'}
          </button>
        ))}
      </div>

      {activeTab === 'search' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">产品搜索</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="搜索产品..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">价格范围</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    placeholder="最低"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <span className="text-gray-600">至</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    placeholder="最高"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
                搜索产品
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">搜索结果 ({filteredProducts.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">{product.supplier}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-purple-600">￥{product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 mb-3">销量: {product.sales.toLocaleString()}</p>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors text-sm font-medium flex items-center justify-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        采购
                      </button>
                      <button 
                        onClick={() => {
                          setSelectedProductForCompare(product.name);
                          setActiveTab('compare');
                        }}
                        className="flex-1 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm font-medium">
                        比价
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'compare' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">多平台比价系统</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">选择商品</label>
              <select
                value={selectedProductForCompare || ''}
                onChange={(e) => setSelectedProductForCompare(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">-- 选择商品进行比价 --</option>
                {products.map(p => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>

            {selectedProductForCompare && (() => {
              const comparisons = getProductComparisons(selectedProductForCompare);
              const stats = calculateComparableStats(selectedProductForCompare);
              
              return (
                <div className="space-y-6">
                  {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-gray-600 mb-1">最低价</p>
                        <p className="text-2xl font-bold text-green-600">￥{stats.minPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-gray-600 mb-1">最高价</p>
                        <p className="text-2xl font-bold text-red-600">￥{stats.maxPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">平均价</p>
                        <p className="text-2xl font-bold text-blue-600">￥{stats.avgPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">价差</p>
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-5 h-5 text-purple-600" />
                          <p className="text-2xl font-bold text-purple-600">{stats.savingPercent}%</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">平台</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">供应商</th>
                          <th className="text-right py-3 px-4 font-semibold text-gray-900">价格</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">评分</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">发货</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">起购</th>
                          <th className="text-center py-3 px-4 font-semibold text-gray-900">操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisons.map((comp) => {
                          const stats = calculateComparableStats(selectedProductForCompare);
                          const isLowestPrice = stats && comp.price === stats.minPrice;
                          
                          return (
                            <tr key={comp.id} className={`border-b border-gray-100 hover:bg-gray-50 ${isLowestPrice ? 'bg-green-50' : ''}`}>
                              <td className="py-4 px-4">
                                <span className="font-medium text-gray-900">{comp.marketplace}</span>
                              </td>
                              <td className="py-4 px-4">
                                <span className="text-gray-700">{comp.supplier}</span>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <span className="text-lg font-bold text-purple-600">￥{comp.price.toFixed(2)}</span>
                                  {isLowestPrice && (
                                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">最低价</span>
                                  )}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center gap-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                  <span className="font-medium">{comp.rating}</span>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-gray-700">{comp.delivery}</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <span className="text-gray-700">{comp.quantity}</span>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <button className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline">
                                  选择
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">采购建议</h4>
                      <p className="text-sm text-blue-800">
                        根据价格、评分和发货速度综合考虑，建议选择最低价平台进行采购。如对方信誉度有疑虑，可选择次低价且评分更高的平台。
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">认证供应商</h3>
          <div className="space-y-4">
            {suppliers.map(supplier => (
              <div key={supplier.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{supplier.name}</h4>
                    <p className="text-sm text-gray-600">{supplier.location}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{supplier.rating}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-600">产品数</p>
                    <p className="font-semibold">{supplier.products}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">响应时间</p>
                    <p className="font-semibold">{supplier.response_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">状态</p>
                    <p className="font-semibold text-green-600">已认证</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm font-medium">
                  查看供应商
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">采购订单</h3>
          <div className="text-center py-8">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">还没有订单</p>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">总支出</h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">￥0</p>
            <p className="text-sm text-gray-600 mt-2">暂无采购</p>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">订单数</h3>
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="text-sm text-gray-600 mt-2">总订单数</p>
          </div>
        </div>
      )}
    </div>
  );
};

