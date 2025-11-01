import React, { useState } from 'react';
import { Search, ShoppingCart, TrendingUp, Star, Filter, TrendingDown, Check, AlertCircle, Zap } from 'lucide-react';
import { queryGlobalPrices, searchRelatedProducts, getPopularProducts } from '../services/priceQueryService';

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
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null);
  const [globalPriceResults, setGlobalPriceResults] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryError, setQueryError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'PO-20250101',
      productName: '护肤精油套装30ML',
      supplier: '浙江美妆有限公司',
      marketplace: '1688',
      quantity: 100,
      price: 45,
      totalAmount: 4500,
      status: '已发货',
      orderDate: '2025-01-10',
      deliveryDate: '2025-01-12',
      trackingNumber: 'SF123456789'
    },
    {
      id: 'PO-20250102',
      productName: '面膜贴片100片装',
      supplier: '广州美妆批发',
      marketplace: '阿里巴巴',
      quantity: 500,
      price: 8,
      totalAmount: 4000,
      status: '处理中',
      orderDate: '2025-01-15',
      deliveryDate: '待定',
      trackingNumber: '-'
    }
  ]);
  const [newOrder, setNewOrder] = useState({
    productName: '',
    supplier: '',
    quantity: '',
    price: '',
    marketplace: ''
  });

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

  // 全网价格查询处理函数
  const handleGlobalPriceQuery = async () => {
    if (!searchQuery.trim()) {
      setQueryError('请输入产品名称');
      return;
    }

    setIsQuerying(true);
    setQueryError(null);
    setGlobalPriceResults(null);

    try {
      const results = await queryGlobalPrices(searchQuery);
      if (results) {
        setGlobalPriceResults(results);
        setQueryError(null);
      } else {
        setQueryError(`未找到 "${searchQuery}" 的价格信息，请尝试搜索其他产品`);
        setGlobalPriceResults(null);
      }
    } catch (error) {
      setQueryError('查询出错，请重试');
      setGlobalPriceResults(null);
    } finally {
      setIsQuerying(false);
    }
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

              <button 
                onClick={handleGlobalPriceQuery}
                disabled={isQuerying}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors font-medium flex items-center justify-center gap-2">
                <Zap className="w-4 h-4" />
                {isQuerying ? '查询中...' : '全网查询价格'}
              </button>
            </div>
          </div>

          {queryError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-red-700 font-medium">{queryError}</p>
              </div>
            </div>
          )}

          {globalPriceResults && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900">全网价格查询结果</h3>
                  <span className="text-xs text-gray-600">查询时间: {globalPriceResults.queryTime}</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">最低价</p>
                    <p className="text-2xl font-bold text-green-600">￥{globalPriceResults.minPrice}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">最高价</p>
                    <p className="text-2xl font-bold text-red-600">￥{globalPriceResults.maxPrice}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">平均价</p>
                    <p className="text-2xl font-bold text-blue-600">￥{globalPriceResults.avgPrice}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">价格差</p>
                    <p className="text-2xl font-bold text-orange-600">￥{globalPriceResults.maxPrice - globalPriceResults.minPrice}</p>
                  </div>
                  <div className="bg-white rounded p-3">
                    <p className="text-xs text-gray-600 mb-1">可省</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(((globalPriceResults.maxPrice - globalPriceResults.minPrice) / globalPriceResults.maxPrice) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* 最佳采购推荐 */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  最佳采购推荐
                </h4>
                <div className="bg-white rounded p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{globalPriceResults.bestDeal.marketplace} - {globalPriceResults.bestDeal.supplier}</span>
                    <span className="text-lg font-bold text-green-600">￥{globalPriceResults.bestDeal.price}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs text-gray-600">
                    <div>
                      <p className="text-gray-500">评分: </p>
                      <p className="font-semibold text-gray-900">{globalPriceResults.bestDeal.rating}分</p>
                    </div>
                    <div>
                      <p className="text-gray-500">发货</p>
                      <p className="font-semibold text-gray-900">{globalPriceResults.bestDeal.delivery}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">起订</p>
                      <p className="font-semibold text-gray-900">{globalPriceResults.bestDeal.quantity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 全平台对比表 */}
              <div className="bg-white rounded-lg border border-purple-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">全平台价格对比 ({globalPriceResults.results.length}个)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-3 font-semibold">平台</th>
                        <th className="text-left py-2 px-3 font-semibold">供应商</th>
                        <th className="text-right py-2 px-3 font-semibold">价格</th>
                        <th className="text-center py-2 px-3 font-semibold">评分</th>
                        <th className="text-center py-2 px-3 font-semibold">发货</th>
                        <th className="text-center py-2 px-3 font-semibold">起订</th>
                      </tr>
                    </thead>
                    <tbody>
                      {globalPriceResults.results.map((result: any, idx: number) => (
                        <tr key={idx} className="border-t hover:bg-gray-50">
                          <td className="py-2 px-3 font-medium text-purple-600">{result.marketplace}</td>
                          <td className="py-2 px-3 text-gray-700">{result.supplier}</td>
                          <td className="py-2 px-3 text-right font-bold text-gray-900">￥{result.price}</td>
                          <td className="py-2 px-3 text-center">
                            <span className="text-yellow-500"></span> {result.rating}
                          </td>
                          <td className="py-2 px-3 text-center text-gray-600">{result.delivery}</td>
                          <td className="py-2 px-3 text-center text-gray-600">{result.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {!globalPriceResults && !queryError && (
            <div className="bg-white rounded-lg border border-purple-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">热门搜索</h3>
              <div className="flex flex-wrap gap-2">
                {getPopularProducts().map(product => (
                  <button
                    key={product}
                    onClick={() => {
                      setSearchQuery(product);
                    }}
                    className="px-3 py-1 bg-purple-100 text-purple-600 rounded hover:bg-purple-200 transition-colors text-sm font-medium">
                    {product}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">本地搜索结果 ({filteredProducts.length})</h3>
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
            <h3 className="text-lg font-bold text-gray-900 mb-4">多平台货源对比</h3>
            
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
              
              // 计算综合评分
              const calculateComprehensiveScore = (comp: PriceComparison, minPrice: number) => {
                const priceScore = ((minPrice / comp.price) * 100) * 0.4; // 40% 权重
                const ratingScore = (comp.rating / 5) * 100 * 0.3; // 30% 权重
                let deliveryScore = comp.delivery === '1-2天' ? 100 : comp.delivery === '2-3天' ? 90 : 80; // 发货速度
                deliveryScore *= 0.3; // 30% 权重
                return Math.round(priceScore + ratingScore + deliveryScore);
              };
              
              return (
                <div className="space-y-6">
                  {stats && (
                    <>
                      {/* 价格对比统计 */}
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                          <p className="text-xs text-gray-600 mb-1">最低价</p>
                          <p className="text-xl font-bold text-green-600">￥{stats.minPrice}</p>
                          <p className="text-xs text-green-600 mt-1">最佳选择</p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
                          <p className="text-xs text-gray-600 mb-1">最高价</p>
                          <p className="text-xl font-bold text-red-600">￥{stats.maxPrice}</p>
                          <p className="text-xs text-red-600 mt-1">避免选择</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">平均价</p>
                          <p className="text-xl font-bold text-blue-600">￥{stats.avgPrice.toFixed(1)}</p>
                          <p className="text-xs text-blue-600 mt-1">市场均价</p>
                        </div>
                        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                          <p className="text-xs text-gray-600 mb-1">价差范围</p>
                          <p className="text-xl font-bold text-orange-600">￥{(stats.maxPrice - stats.minPrice).toFixed(1)}</p>
                          <p className="text-xs text-orange-600 mt-1">可节省</p>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                          <p className="text-xs text-gray-600 mb-1">最大优惠</p>
                          <p className="text-xl font-bold text-purple-600">{stats.savingPercent}%</p>
                          <p className="text-xs text-purple-600 mt-1">省钱比例</p>
                        </div>
                      </div>

                      {/* 综合对比表 */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">排名</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">平台</th>
                              <th className="text-left py-3 px-4 font-semibold text-gray-900">供应商</th>
                              <th className="text-right py-3 px-4 font-semibold text-gray-900">价格</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">评分</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">发货时间</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">起购量</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">综合评分</th>
                              <th className="text-center py-3 px-4 font-semibold text-gray-900">操作</th>
                            </tr>
                          </thead>
                          <tbody>
                            {comparisons.sort((a, b) => a.price - b.price).map((comp, index) => {
                              const isLowestPrice = comp.price === stats.minPrice;
                              const comprehensiveScore = calculateComprehensiveScore(comp, stats.minPrice);
                              
                              return (
                                <tr key={comp.id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${isLowestPrice ? 'bg-green-50' : ''}`}>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center">
                                      {index === 0 ? (
                                        <span className="bg-gold-100 text-gold-700 px-2 py-1 rounded-full text-xs font-bold">第{index + 1}</span>
                                      ) : (
                                        <span className="text-gray-600 font-semibold">第{index + 1}</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className="font-medium text-gray-900">{comp.marketplace}</span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className="text-gray-700 text-sm">{comp.supplier}</span>
                                  </td>
                                  <td className="py-4 px-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <span className="text-lg font-bold text-purple-600">￥{comp.price}</span>
                                      {isLowestPrice && (
                                        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded">最低</span>
                                      )}
                                      {index === 1 && (
                                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">次选</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <span className="text-yellow-400"></span>
                                      <span className="font-medium">{comp.rating}</span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <span className={`text-sm font-medium ${comp.delivery === '1-2天' ? 'text-green-600' : 'text-gray-700'}`}>
                                      {comp.delivery}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <span className="text-gray-700 text-sm">{comp.quantity}</span>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <div className="flex items-center justify-center">
                                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                        <span className="text-sm font-bold text-purple-600">{comprehensiveScore}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4 text-center">
                                    <button className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors">
                                      采购
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* 详细对比分析 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                          <h4 className="font-semibold text-gray-900 mb-3">价格优势分析</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">最低价与平均价差：<span className="font-bold text-blue-600">￥{(stats.avgPrice - stats.minPrice).toFixed(1)}</span></p>
                            <p className="text-sm text-gray-700">低于平均价平台数：<span className="font-bold text-green-600">{comparisons.filter(c => c.price < stats.avgPrice).length} 个</span></p>
                            <p className="text-sm text-gray-700">价格波动范围：<span className="font-bold text-orange-600">{stats.savingPercent}%</span></p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                          <h4 className="font-semibold text-gray-900 mb-3">评价质量分析</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700">平均评分：<span className="font-bold text-green-600">{(comparisons.reduce((sum, c) => sum + c.rating, 0) / comparisons.length).toFixed(2)}</span></p>
                            <p className="text-sm text-gray-700">高评分平台(≥4.8)：<span className="font-bold">{comparisons.filter(c => c.rating >= 4.8).length} 个</span></p>
                            <p className="text-sm text-gray-700">快速发货(≤2天)：<span className="font-bold text-blue-600">{comparisons.filter(c => c.delivery === '1-2天').length} 个</span></p>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                          <h4 className="font-semibold text-gray-900 mb-3">采购建议</h4>
                          <div className="space-y-2">
                            <p className="text-sm text-gray-700 font-semibold">优先选择：</p>
                            <p className="text-sm text-purple-700">价格最低且评分高的平台</p>
                            <p className="text-sm text-gray-700 font-semibold mt-2">替代选择：</p>
                            <p className="text-sm text-purple-700">次低价但发货快的平台</p>
                          </div>
                        </div>
                      </div>

                      {/* 专家建议 */}
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">采购决策建议</h4>
                        <ul className="space-y-1 text-sm text-blue-800">
                          <li>• 最优方案：选择价格最低的平台（节省￥{(stats.maxPrice - stats.minPrice).toFixed(1)}）</li>
                          <li>• 平衡方案：选择评分最高且价格接近的平台</li>
                          <li>• 快速方案：优先选择发货时间为1-2天的平台</li>
                          <li>• 分散风险：多个平台分批采购，降低供应风险</li>
                        </ul>
                      </div>
                    </>
                  )}
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
        <div className="space-y-6">
          {/* 订单统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">总订单数</p>
              <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
              <p className="text-xs text-blue-600 mt-2">全部订单</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <p className="text-sm text-gray-600 mb-1">已发货</p>
              <p className="text-3xl font-bold text-green-600">{orders.filter(o => o.status === '已发货').length}</p>
              <p className="text-xs text-green-600 mt-2">在途订单</p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">处理中</p>
              <p className="text-3xl font-bold text-orange-600">{orders.filter(o => o.status === '处理中').length}</p>
              <p className="text-xs text-orange-600 mt-2">待处理</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">总金额</p>
              <p className="text-3xl font-bold text-purple-600">￥{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-2">采购总额</p>
            </div>
          </div>

          {/* 创建新订单表单 */}
          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">创建采购订单</h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">产品名称</label>
                <input
                  type="text"
                  value={newOrder.productName}
                  onChange={(e) => setNewOrder({...newOrder, productName: e.target.value})}
                  placeholder="输入产品名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">供应商</label>
                <input
                  type="text"
                  value={newOrder.supplier}
                  onChange={(e) => setNewOrder({...newOrder, supplier: e.target.value})}
                  placeholder="输入供应商名称"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">数量</label>
                <input
                  type="number"
                  value={newOrder.quantity}
                  onChange={(e) => setNewOrder({...newOrder, quantity: e.target.value})}
                  placeholder="输入数量"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">单价</label>
                <input
                  type="number"
                  value={newOrder.price}
                  onChange={(e) => setNewOrder({...newOrder, price: e.target.value})}
                  placeholder="输入单价"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">平台</label>
                <select
                  value={newOrder.marketplace}
                  onChange={(e) => setNewOrder({...newOrder, marketplace: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">选择平台</option>
                  <option value="1688">1688</option>
                  <option value="阿里巴巴">阿里巴巴</option>
                  <option value="抖音电商">抖音电商</option>
                  <option value="京东">京东</option>
                </select>
              </div>
            </div>
            <button
              onClick={() => {
                if (newOrder.productName && newOrder.supplier && newOrder.quantity && newOrder.price) {
                  const order = {
                    id: `PO-${Date.now()}`,
                    ...newOrder,
                    quantity: parseInt(newOrder.quantity),
                    price: parseFloat(newOrder.price),
                    totalAmount: parseInt(newOrder.quantity) * parseFloat(newOrder.price),
                    status: '待提交',
                    orderDate: new Date().toLocaleDateString('zh-CN'),
                    deliveryDate: '待定',
                    trackingNumber: '-'
                  };
                  setOrders([...orders, order]);
                  setNewOrder({ productName: '', supplier: '', quantity: '', price: '', marketplace: '' });
                }
              }}
              className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-medium"
            >
              创建订单
            </button>
          </div>

          {/* 订单列表 */}
          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">采购订单列表</h3>
            {orders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p>还没有订单，点击上方创建新订单</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">订单号</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">产品名称</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">供应商</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">数量</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-900">总金额</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">状态</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">订单日期</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">预计发货</th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-900">操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-semibold text-purple-600">{order.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-900 font-medium">{order.productName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-gray-700">{order.supplier}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="font-semibold text-gray-900">{order.quantity}</span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-bold text-purple-600">￥{order.totalAmount.toLocaleString()}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            order.status === '已发货' ? 'bg-green-100 text-green-700' :
                            order.status === '处理中' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-gray-700">{order.orderDate}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="text-gray-700">{order.deliveryDate}</span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button 
                            onClick={() => setSelectedOrderDetail(order)}
                            className="text-purple-600 hover:text-purple-700 font-medium text-sm hover:underline"
                          >
                            详情
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* 快速操作建议 */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">采购管理建议</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• 定期检查订单状态，及时跟进物流</li>
              <li>• 建立供应商档案，记录重要信息方便后续采购</li>
              <li>• 对比多个平台价格，选择最优采购方案</li>
              <li>• 定时统计采购成本，优化采购策略</li>
            </ul>
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
            <p className="text-3xl font-bold text-purple-600">￥{orders.reduce((sum, o) => sum + o.totalAmount, 0).toLocaleString()}</p>
            <p className="text-sm text-gray-600 mt-2">累计采购总额</p>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">订单数</h3>
              <Filter className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-purple-600">{orders.length}</p>
            <p className="text-sm text-gray-600 mt-2">总订单数</p>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">采购平台统计</h3>
            <div className="space-y-3">
              {Array.from(new Set(orders.map(o => o.marketplace))).map((marketplace) => {
                const count = orders.filter(o => o.marketplace === marketplace).length;
                const amount = orders.filter(o => o.marketplace === marketplace).reduce((sum, o) => sum + o.totalAmount, 0);
                const percentage = Math.round((count / orders.length) * 100) || 0;
                return (
                  <div key={marketplace}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{marketplace}</span>
                      <span className="text-sm font-bold text-purple-600">{count} 笔</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">金额: ￥{amount.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">订单状态分布</h3>
            <div className="space-y-3">
              {[
                { status: '待提交', color: 'bg-gray-100 text-gray-700' },
                { status: '处理中', color: 'bg-orange-100 text-orange-700' },
                { status: '已发货', color: 'bg-green-100 text-green-700' }
              ].map((item) => {
                const count = orders.filter(o => o.status === item.status).length;
                return count > 0 ? (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${item.color}`}>
                      {item.status}
                    </span>
                    <span className="text-lg font-bold text-purple-600">{count}</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">平均订单价值</h3>
            <p className="text-3xl font-bold text-purple-600">
              ￥{orders.length > 0 ? Math.round(orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length) : 0}
            </p>
            <p className="text-sm text-gray-600 mt-2">单笔平均采购额</p>
          </div>

          <div className="bg-white rounded-lg border border-purple-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">最常采购产品</h3>
            <div className="space-y-2">
              {Array.from(new Set(orders.map(o => o.productName))).slice(0, 5).map((product) => {
                const count = orders.filter(o => o.productName === product).length;
                const totalAmount = orders.filter(o => o.productName === product).reduce((sum, o) => sum + o.totalAmount, 0);
                return (
                  <div key={product} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{product}</span>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">{count}次</p>
                      <p className="text-xs text-gray-500">￥{totalAmount}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 采购成本分析 */}
          <div className="md:col-span-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">采购成本优化建议</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">最高单价产品</p>
                <p className="font-bold text-blue-600">
                  {orders.length > 0 
                    ? orders.reduce((max, o) => o.price > max.price ? o : max).productName 
                    : '暂无数据'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">最低单价产品</p>
                <p className="font-bold text-blue-600">
                  {orders.length > 0 
                    ? orders.reduce((min, o) => o.price < min.price ? o : min).productName 
                    : '暂无数据'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">采购笔数</p>
                <p className="font-bold text-blue-600">{orders.length} 笔</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 订单详情模态框 */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">订单详情 - {selectedOrderDetail.id}</h3>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 订单基本信息 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">订单号</p>
                  <p className="font-bold text-gray-900">{selectedOrderDetail.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">订单状态</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedOrderDetail.status === '已发货' ? 'bg-green-100 text-green-700' :
                    selectedOrderDetail.status === '处理中' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedOrderDetail.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">下单日期</p>
                  <p className="font-semibold text-gray-900">{selectedOrderDetail.orderDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">预计送达</p>
                  <p className="font-semibold text-gray-900">{selectedOrderDetail.deliveryDate}</p>
                </div>
              </div>

              {/* 产品信息 */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">产品信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">产品名称</p>
                    <p className="font-semibold text-gray-900">{selectedOrderDetail.productName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">采购数量</p>
                    <p className="font-semibold text-gray-900">{selectedOrderDetail.quantity} 件</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">单价</p>
                    <p className="font-semibold text-purple-600">￥{selectedOrderDetail.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">总金额</p>
                    <p className="font-bold text-purple-600">￥{selectedOrderDetail.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* 供应商信息 */}
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">供应商信息</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">供应商名称</p>
                    <p className="font-semibold text-gray-900">{selectedOrderDetail.supplier}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">采购平台</p>
                    <p className="font-semibold text-gray-900">{selectedOrderDetail.marketplace}</p>
                  </div>
                </div>
              </div>

              {/* 物流信息 */}
              {selectedOrderDetail.status === '已发货' && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">物流信息</h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">物流追踪号</p>
                    <p className="font-bold text-gray-900 mb-3">{selectedOrderDetail.trackingNumber}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <span className="text-green-600 font-bold mr-2"></span>
                        <span className="text-gray-700">已发货 - {selectedOrderDetail.orderDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-blue-600 font-bold mr-2">→</span>
                        <span className="text-gray-700">运输中</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-400 font-bold mr-2">◯</span>
                        <span className="text-gray-700">预计 {selectedOrderDetail.deliveryDate} 送达</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="border-t pt-4 flex gap-3">
                <button className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-colors font-medium">
                  编辑订单
                </button>
                <button className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                  取消订单
                </button>
                <button 
                  onClick={() => setSelectedOrderDetail(null)}
                  className="flex-1 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

