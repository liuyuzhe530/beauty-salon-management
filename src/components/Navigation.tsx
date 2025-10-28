import React from 'react';
import { BarChart3, Users, ShoppingBag, Zap, Store, LogOut, BookOpen, Home, TrendingUp } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  userRole: 'admin' | 'staff' | 'customer';
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  userRole,
  onPageChange,
  onLogout
}) => {
  const menuItems = {
    admin: [
      { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
      { id: 'customermanagement', label: '客户管理', icon: Users },
      { id: 'staff', label: '美容师', icon: Users },
      { id: 'shop', label: '商城装修', icon: ShoppingBag },
      { id: 'training', label: '培训教育', icon: BookOpen },
      { id: 'ai', label: 'AI', icon: Zap }
    ],
    staff: [
      { id: 'dashboard', label: '我的日程', icon: Users },
      { id: 'customermanagement', label: '我的客户', icon: Users },
      { id: 'training', label: '培训学习', icon: BookOpen },
      { id: 'ai', label: 'AI', icon: Zap },
      { id: 'shop', label: '产品', icon: ShoppingBag }
    ],
    customer: [
      { id: 'onsite-booking', label: '上门服务', icon: Home },
      { id: 'customermanagement', label: '我的预约', icon: Users },
      { id: 'shop', label: '商城', icon: ShoppingBag },
      { id: 'ai', label: 'AI', icon: Zap }
    ]
  };

  const items = menuItems[userRole];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Store className="w-6 h-6 text-gray-900" />
            <span className="text-lg font-semibold text-gray-900">美容院</span>
          </div>
          
          <div className="hidden md:flex items-center gap-1">
            {items.map(item => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              {userRole === 'admin' && '管理员'}
              {userRole === 'staff' && '美容师'}
              {userRole === 'customer' && '客户'}
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 移动端菜单 */}
        <div className="md:hidden flex overflow-x-auto gap-2 pb-2">
          {items.map(item => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
