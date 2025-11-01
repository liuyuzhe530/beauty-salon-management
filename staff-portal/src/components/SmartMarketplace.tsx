import React, { useState } from 'react';
import { ShoppingCart, TrendingDown, Star, BarChart3 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  marketPrice: number;
  discount: number;
  stock: number;
  supplier: string;
  rating: number;
  sales: number;
  category: string;
  image: string;
}

export const SmartMarketplace: React.FC = () => {
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: '护肤精油套装30ML',
      price: 180,
      marketPrice: 220,
      discount: 18,
      stock: 50,
      supplier: '浙江美妆有限公司',
      rating: 4.8,
      sales: 12500,
      category: '护肤精油',
      image: 'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=150&h=150&fit=crop'
    },
    {
      id: '2',
      name: '面膜贴片100片装',
      price: 45,
      marketPrice: 65,
      discount: 31,
      stock: 100,
      supplier: '广州护肤品批发',
      rating: 4.6,
      sales: 8900,
      category: '面膜',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=150&h=150&fit=crop'
    },
    {
      id: '3',
      name: '精华液50ML',
      price: 120,
      marketPrice: 150,
      discount: 20,
      stock: 30,
      supplier: '国际美妆集团',
      rating: 4.9,
      sales: 25600,
      category: '精华液',
      image: 'https://images.unsplash.com/photo-1556228541-6b06b0f4b9e1?w=150&h=150&fit=crop'
    },
    {
      id: '4',
      name: '日常护肤套装',
      price: 88,
      marketPrice: 128,
      discount: 31,
      stock: 200,
      supplier: '拼多多优品',
      rating: 4.3,
      sales: 5200,
      category: '护肤套装',
      image: 'https://images.unsplash.com/photo-1607346256330-dee4af15f7cb?w=150&h=150&fit=crop'
    }
  ]);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [cartItems, setCartItems] = useState<number>(0);

  const handleAddToCart = () => {
    setCartItems(cartItems + 1);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-200 p-6">
        <h2 className="text-2xl font-bold text-blue-900">智能商城</h2>
        <p className="text-gray-600">AI驱动的产品推荐和价格优化</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-blue-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">智能产品</h3>
            <div className="space-y-3">
              {products.map(product => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedProduct?.id === product.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">{product.supplier}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-gray-600">库存: {product.stock}</span>
                        <span className="text-gray-600">销量: {product.sales.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-2">
                        <span className="line-through text-gray-400">￥{product.marketPrice}</span>
                        <span className="font-bold text-blue-600 text-lg">￥{product.price}</span>
                      </div>
                      <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                        省{product.discount}%
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-blue-200 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">产品详情</h3>
          {selectedProduct ? (
            <div className="space-y-4">
              <div>
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full h-40 rounded-lg object-cover"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">商品名称</p>
                <p className="font-semibold text-gray-900">{selectedProduct.name}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-sm text-gray-600">价格</p>
                  <p className="font-bold text-blue-600">￥{selectedProduct.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">评分</p>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-semibold">{selectedProduct.rating}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                加入购物车
              </button>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                AI分析
              </button>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">选择一个产品查看详情</p>
          )}
        </div>
      </div>

      {showAnalysis && selectedProduct && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-purple-900">AI市场分析</h3>
            <BarChart3 className="w-5 h-5 text-purple-600" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">市场排名</p>
              <p className="text-2xl font-bold text-purple-600 mt-2">#{Math.floor(Math.random() * 10) + 1}</p>
              <p className="text-xs text-gray-500 mt-1">在该分类中</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">价格趋势</p>
              <div className="flex items-center gap-2 mt-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <p className="text-xl font-bold text-green-600">↓ 5.2%</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">最近30天</p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-gray-600">需求评分</p>
              <p className="text-2xl font-bold text-blue-600 mt-2">8.7/10</p>
              <p className="text-xs text-gray-500 mt-1">高需求</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>AI推荐：</strong> 该产品市场潜力很大，评分好，销量高。建议增加库存。
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-blue-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">购物车</h3>
            <p className="text-sm text-gray-600 mt-1">购物车中有 {cartItems} 件商品</p>
          </div>
          <ShoppingCart className="w-8 h-8 text-blue-600" />
        </div>
        {cartItems === 0 && (
          <p className="text-gray-500 text-center mt-4">购物车为空。添加产品开始购物。</p>
        )}
        {cartItems > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">商品总数: <strong>{cartItems}</strong></p>
            <button className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              结算
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

