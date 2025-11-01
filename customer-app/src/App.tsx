import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { BeautyProductMall } from './components/BeautyProductMall';
import { CustomerManagement } from './components/CustomerManagement';
import { AIChat } from './components/AIChat';
import { ToastProvider } from './components/Toast';
import { OnSiteServiceBooking } from './components/OnSiteServiceBooking';
import { SmartPhotoSeries } from './components/SmartPhotoSeries';

// 客户端：强制使用 customer 角色
const CUSTOMER_ROLE = 'customer';

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [userRole] = useState(CUSTOMER_ROLE);
  const [currentPage, setCurrentPage] = useState<string>('onsite-booking');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Check authentication status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  // If not authenticated AND not in demo mode, show login page
  if (!isAuthenticated && !isDemoMode && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <LoginPage onLogin={(_role) => {
          console.log('客户登录成功');
          setIsDemoMode(true);
          setCurrentPage('onsite-booking');
        }} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setCurrentPage('onsite-booking');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'onsite-booking':
        return <OnSiteServiceBooking />;
      case 'customermanagement':
        return <CustomerManagement />;
      case 'shop':
        return <BeautyProductMall />;
      case 'health-assistant':
        return <SmartPhotoSeries onSelectService={setCurrentPage} />;
      default:
        return <OnSiteServiceBooking />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-green">
      {/* 顶部导航栏 - 桌面端显示 */}
      <Navigation 
        currentPage={currentPage}
        userRole={CUSTOMER_ROLE}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={CUSTOMER_ROLE}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-8 md:py-8">
        {renderPage()}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-green-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-gray-600">
          <p>美容院服务 - 客户端 | 淡绿色高端简洁设计 | 上门服务和美容商城</p>
        </div>
      </footer>

      {/* GLM AI 助手浮窗 */}
      <AIChat />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  );
}


