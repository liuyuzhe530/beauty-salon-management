import React from 'react';
import { Trash2, Minus, Plus, ShoppingCart, Home } from 'lucide-react';
import { useToast } from './Toast';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const ShoppingCartComponent: React.FC<ShoppingCartProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  const { showToast } = useToast();

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity > 0) {
      onUpdateQuantity(id, newQuantity);
    }
  };

  const handleRemove = (id: string) => {
    onRemoveItem(id);
    showToast('success', '已从购物车移除', 2000);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      showToast('error', '购物车为空，请先添加商品', 2000);
      return;
    }
    onCheckout();
    showToast('success', '订单已生成', 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ShoppingCart className="w-8 h-8 text-green-600" />
        <h1 className="text-3xl font-bold text-green-900">购物车</h1>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">购物车为空</p>
          <p className="text-sm text-gray-500 mt-2">继续购物，将商品加入购物车</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {items.map(item => (
              <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                <div className="flex gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-green-600 font-bold text-lg mt-1">￥{item.price}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Minus className="w-4 h-4 text-gray-600" />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                        className="w-12 text-center border border-gray-300 rounded px-2 py-1"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Plus className="w-4 h-4 text-gray-600" />
                      </button>
                      <span className="ml-auto text-gray-600">小计: ￥{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="h-fit">
            <div className="bg-white rounded-lg border border-green-200 p-6 sticky top-20">
              <h2 className="text-lg font-bold text-gray-900 mb-4">订单汇总</h2>
              
              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">商品数量:</span>
                  <span className="font-semibold">{items.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">总件数:</span>
                  <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
              </div>

              <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-700">商品总价</span>
                  <span className="font-semibold">￥{totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">配送费</span>
                  <span className="font-semibold text-green-600">免费</span>
                </div>
              </div>

              <div className="mb-6 pt-2">
                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">合计</span>
                  <span className="font-bold text-green-600">￥{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
              >
                去结账
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                需要帮助？<a href="#" className="text-green-600 hover:underline">联系客服</a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
