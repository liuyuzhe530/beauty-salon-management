import React, { useState } from 'react';
import { BarChart3, Users, ShoppingBag, Zap, LogOut, Home } from 'lucide-react';

interface BottomNavigationProps {
  currentPage: string;
  userRole: 'admin' | 'staff' | 'customer';
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentPage,
  userRole,
  onPageChange,
  onLogout
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  const menuItems = {
    admin: [
      { id: 'dashboard', label: '仪表盘', icon: BarChart3 },
      { id: 'customermanagement', label: '客户', icon: Users },
      { id: 'staff', label: '美容师', icon: Users },
      { id: 'shop', label: '商城', icon: ShoppingBag },
      { id: 'ai', label: 'AI', icon: Zap },
      { id: 'procurement', label: '采购', icon: ShoppingBag }
    ],
    staff: [
      { id: 'dashboard', label: '日程', icon: Users },
      { id: 'customermanagement', label: '客户', icon: Users },
      { id: 'ai', label: 'AI建议', icon: Zap },
      { id: 'shop', label: '产品', icon: ShoppingBag }
    ],
    customer: [
      { id: 'onsite-booking', label: '上门服务', icon: Home },
      { id: 'customermanagement', label: '预约', icon: Users },
      { id: 'shop', label: '商城', icon: ShoppingBag },
      { id: 'ai', label: '推荐', icon: Zap }
    ]
  };

  const items = menuItems[userRole];
  const visibleItems = items.slice(0, 5);
  const hasMore = items.length > 5;
  const moreIndex = hasMore ? 4 : -1;

  const handleMenuItemClick = (pageId: string) => {
    onPageChange(pageId);
    setShowMoreMenu(false);
  };

  return (
    <>
      {/* 底部导航栏 - 仅移动端显示 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-green-200 shadow-lg md:hidden z-40 safe-bottom">
        <div className="flex items-center justify-around h-16 relative">
          {visibleItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            // 最后一个位置显示更多菜单
            if (idx === moreIndex && hasMore) {
              return (
                <div key="more" className="relative flex-1 flex items-center justify-center">
                  <button
                    onClick={() => setShowMoreMenu(!showMoreMenu)}
                    className={`flex flex-col items-center justify-center py-2 px-3 w-full transition-colors ${
                      isActive || showMoreMenu
                        ? 'text-green-600 bg-green-50'
                        : 'text-gray-600 hover:text-green-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs mt-0.5 font-medium">更多</span>
                  </button>
                  
                  {/* 下拉菜单 - 点击显示/隐藏 */}
                  {showMoreMenu && (
                    <div className="absolute bottom-16 right-0 bg-white rounded-lg shadow-lg border border-green-200 mb-2 z-50 w-40">
                      {items.slice(5).map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = currentPage === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => handleMenuItemClick(subItem.id)}
                            className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center gap-2 border-b border-green-100 last:border-0 ${
                              isSubActive
                                ? 'bg-green-50 text-green-600 font-medium'
                                : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                            }`}
                          >
                            <SubIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleMenuItemClick(item.id);
                  setShowMoreMenu(false);
                }}
                className={`flex flex-col items-center justify-center py-2 px-3 flex-1 transition-colors ${
                  isActive
                    ? 'text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-green-500'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs mt-0.5 font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* 背景遮罩 - 点击关闭菜单 */}
      {showMoreMenu && (
        <div
          className="fixed inset-0 bg-black bg-opacity-0 md:hidden z-30"
          onClick={() => setShowMoreMenu(false)}
        />
      )}

      {/* 隐藏的登出按钮区域 - 可通过侧滑或长按访问 */}
      <div className="fixed bottom-20 right-4 md:hidden z-30">
        <button
          onClick={onLogout}
          className="p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-colors"
          title="登出"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </>
  );
};
