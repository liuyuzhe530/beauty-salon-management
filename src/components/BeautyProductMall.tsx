import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Search, Filter, ChevronDown, Zap, TrendingUp } from 'lucide-react';
import { useToast } from './Toast';

interface BeautyProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  description: string;
  isFeatured?: boolean;
  discount?: number;
  tags?: string[];
}

interface CartItem extends BeautyProduct {
  quantity: number;
}

export const BeautyProductMall: React.FC = () => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // 美容产品数据
  const beautyProducts: BeautyProduct[] = [
    {
      id: '1',
      name: '玻尿酸精华液',
      category: '精华液',
      price: 199,
      originalPrice: 299,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 328,
      stock: 50,
      description: '高效保湿，深层锁水',
      isFeatured: true,
      discount: 33,
      tags: ['保湿', '热卖', '新品']
    },
    {
      id: '2',
      name: '视黄醇修复面膜',
      category: '面膜',
      price: 129,
      originalPrice: 189,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 256,
      stock: 45,
      description: '深层修复，紧致肌肤',
      isFeatured: true,
      discount: 32,
      tags: ['抗衰', '修复', '热卖']
    },
    {
      id: '3',
      name: '维C亮白面霜',
      category: '面霜',
      price: 249,
      originalPrice: 349,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 412,
      stock: 60,
      description: '均匀肤色，提亮肌肤',
      isFeatured: true,
      discount: 29,
      tags: ['美白', '亮肤', '推荐']
    },
    {
      id: '4',
      name: '专业洁面乳',
      category: '洁面',
      price: 89,
      originalPrice: 129,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 189,
      stock: 100,
      description: '温和清洁，不伤皮肤',
      isFeatured: false,
      discount: 31,
      tags: ['洁面', '温和', '日用']
    },
    {
      id: '5',
      name: '黄金精油套装',
      category: '精油',
      price: 399,
      originalPrice: 599,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 567,
      stock: 35,
      description: '奢华护理，多效合一',
      isFeatured: true,
      discount: 33,
      tags: ['精油', '高端', '套装']
    },
    {
      id: '6',
      name: '眼霜修护',
      category: '眼霜',
      price: 149,
      originalPrice: 219,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 234,
      stock: 40,
      description: '淡化细纹，提亮眼周',
      isFeatured: false,
      discount: 32,
      tags: ['眼霜', '抗衰', '专业']
    },
    {
      id: '7',
      name: '积雪草舒缓水',
      category: '爽肤水',
      price: 119,
      originalPrice: 179,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 198,
      stock: 70,
      description: '镇定舒缓，修护敏感肌',
      isFeatured: false,
      discount: 34,
      tags: ['爽肤水', '舒缓', '敏感肌']
    },
    {
      id: '8',
      name: '防晒乳SPF50',
      category: '防晒',
      price: 139,
      originalPrice: 199,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 445,
      stock: 85,
      description: '全面防护，日常必备',
      isFeatured: true,
      discount: 30,
      tags: ['防晒', '日用', '必备']
    }
  ];

  const categories = ['all', '精华液', '面膜', '面霜', '洁面', '精油', '眼霜', '爽肤水', '防晒'];

  // 过滤和排序产品
  let filteredProducts = beautyProducts.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 排序
  if (sortBy === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  } else {
    // 默认热卖排序（特色产品优先）
    filteredProducts.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
  }

  // 添加到购物车
  const handleAddToCart = (product: BeautyProduct) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast('success', `${product.name} 已添加到购物车`, 2000);
  };

  // 计算购物车总额
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">美容产品商城</h1>
              <p className="text-gray-600 text-sm mt-1">精选专业美容护肤产品</p>
            </div>
            <button
              onClick={() => setShowCart(!showCart)}
              className="relative bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* 搜索和筛选 */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[250px] relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索产品名称或标签..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white hover:border-purple-500 transition-colors"
            >
              <option value="popular">热卖排序</option>
              <option value="price-low">价格低到高</option>
              <option value="price-high">价格高到低</option>
              <option value="rating">评分最高</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* 分类侧边栏 */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-lg p-4 shadow-sm sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                产品分类
              </h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-purple-600 text-white font-medium'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {cat === 'all' ? '全部产品' : cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 产品网格 */}
          <div className="flex-1">
            {showCart ? (
              // 购物车视图
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">购物车</h2>
                {cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">购物车为空</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map(item => (
                        <div key={item.id} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
                          <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">单价: ¥{item.price}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600 mb-2">数量: {item.quantity}</p>
                            <p className="font-bold text-purple-600">¥{item.price * item.quantity}</p>
                            <button
                              onClick={() => setCartItems(cartItems.filter(ci => ci.id !== item.id))}
                              className="text-xs text-red-600 hover:text-red-700 mt-2"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-bold text-gray-900">合计:</span>
                        <span className="text-2xl font-bold text-purple-600">¥{cartTotal.toFixed(2)}</span>
                      </div>
                      <button className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-colors">
                        去结算
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              // 产品网格视图
              <>
                <div className="mb-4 text-sm text-gray-600">
                  找到 {filteredProducts.length} 个产品
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                    >
                      {/* 产品图片 */}
                      <div className="relative overflow-hidden bg-gray-100 h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                        {product.discount && (
                          <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            -{product.discount}%
                          </div>
                        )}
                        {product.isFeatured && (
                          <div className="absolute top-3 left-3 bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            热卖
                          </div>
                        )}
                      </div>

                      {/* 产品信息 */}
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                        {/* 标签 */}
                        {product.tags && (
                          <div className="flex gap-1 mb-3 flex-wrap">
                            {product.tags.map(tag => (
                              <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* 评分 */}
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {product.rating} ({product.reviews}条评价)
                          </span>
                        </div>

                        {/* 价格 */}
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl font-bold text-purple-600">¥{product.price}</span>
                          {product.originalPrice && (
                            <span className="text-lg text-gray-400 line-through">¥{product.originalPrice}</span>
                          )}
                        </div>

                        {/* 库存 */}
                        <div className="text-xs text-gray-600 mb-4">
                          库存: <span className={product.stock > 10 ? 'text-green-600' : 'text-red-600'}>
                            {product.stock > 0 ? `${product.stock}件` : '缺货'}
                          </span>
                        </div>

                        {/* 按钮 */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            加入购物车
                          </button>
                          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-12 bg-white rounded-lg">
                    <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg">未找到匹配的产品</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
