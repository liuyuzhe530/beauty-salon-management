import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Search, Filter, ChevronDown, Zap, TrendingUp } from 'lucide-react';
import { useToast } from './Toast';
import { useProductStorage } from '../hooks/useProductStorage';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: string;
}

export const BeautyProductMall: React.FC = () => {
  const { showToast } = useToast();
  const { products } = useProductStorage();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState('popular');

  // 获取所有分类
  const categories = ['all', ...new Set(products.map(p => p.category))];

  // 筛选和排序产品
  const filteredProducts = products
    .filter(product => {
      const matchCategory = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch && product.stock > 0;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.sold - a.sold;
      return 0;
    });

  // 添加到购物车
  const handleAddToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCartItems(cartItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ));
        showToast(`已添加 "${product.name}" 到购物车`, 'success');
      } else {
        showToast('库存不足', 'error');
      }
    } else {
      setCartItems([...cartItems, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        category: product.category
      }]);
      showToast(`"${product.name}" 已添加到购物车！`, 'success');
    }
  };

  // 从购物车移除
  const handleRemoveFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  // 更新购物车数量
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      const product = products.find(p => p.id === productId);
      if (product && quantity <= product.stock) {
        setCartItems(cartItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        ));
      }
    }
  };

  // 计算购物车总价
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // 结算
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('购物车为空', 'error');
      return;
    }
    showToast(`✅ 订单已提交！总金额：¥${cartTotal.toFixed(2)}`, 'success');
    setCartItems([]);
    setShowCart(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">美容商城</h1>
          <p className="text-green-600 mt-1">精选美容产品，品质保证</p>
        </div>
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-green-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>购物车</span>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* 购物车面板 */}
      {showCart && (
        <div className="bg-white rounded-lg border border-green-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">购物车</h2>
            <button
              onClick={() => setShowCart(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {cartItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8">购物车为空</p>
          ) : (
            <>
              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cartItems.map(item => (
                  <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/64';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-green-600 font-bold">¥{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-12 text-center border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold">总金额:</span>
                  <span className="text-2xl font-bold text-green-600">¥{cartTotal.toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition font-bold"
                >
                  立即购买
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* 搜索和筛选 */}
      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索产品..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="popular">热卖排序</option>
            <option value="price-low">价格低到高</option>
            <option value="price-high">价格高到低</option>
          </select>
        </div>

        {/* 分类 */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category
                  ? 'bg-green-500 text-white'
                  : 'bg-white border border-green-200 text-green-600 hover:bg-green-50'
              }`}
            >
              {category === 'all' ? '全部' : category}
            </button>
          ))}
        </div>
      </div>

      {/* 产品列表 */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg border border-green-200 p-12 text-center">
          <p className="text-gray-500 text-lg">暂无符合条件的产品</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg border border-green-200 overflow-hidden hover:shadow-lg transition">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x300';
                  }}
                />
                <button className="absolute top-2 right-2 p-2 bg-white rounded-full hover:bg-red-50 transition">
                  <Heart className="w-5 h-5 text-red-500" />
                </button>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                
                {/* 评分 */}
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.round(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-gray-500">({product.sold})</span>
                </div>

                {/* 价格 */}
                <div className="mt-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-green-600">¥{product.price}</span>
                  </div>
                </div>

                {/* 库存状态 */}
                <div className="mt-3 text-xs text-gray-500">
                  库存: {product.stock}件
                </div>

                {/* 添加购物车按钮 */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  加入购物车
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
