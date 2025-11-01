import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { Staff } from './components/Staff';
import { CustomerManagement } from './components/CustomerManagement';
import { MallPage } from './components/MallPage';
import { AdminMallManagement } from './components/AdminMallManagement';
import { AIAssistant } from './components/AIAssistant';
import { Promotion } from './components/Promotion';
import { AIChat } from './components/AIChat';
import { ToastProvider } from './components/Toast';
import { TrainingEducation } from './components/MiniProgramStore';
import { OnSiteServiceManagement } from './components/OnSiteServiceManagement';
import { PromotionPlan } from './components/PromotionPlan';
import { SmartPhotoSeries } from './components/SmartPhotoSeries';

// 管理员端：强制使用 admin 角色
const ADMIN_ROLE = 'admin';

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [userRole] = useState(ADMIN_ROLE);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // 检查加载状态
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

  // 如果未认证且不在演示模式，显示登陆页面
  if (!isAuthenticated && !isDemoMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <LoginPage onLogin={(_role) => {
          console.log('管理员进入演示模式');
          setIsDemoMode(true);
          setCurrentPage('dashboard');
        }} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setIsDemoMode(false);
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customermanagement':
        return <CustomerManagement />;
      case 'staff':
        return <Staff />;
      case 'shop':
        return <MallPage />;
      case 'mall-admin':
        return <AdminMallManagement />;
      case 'ai':
        return <AIAssistant />;
      case 'promotion':
        return <Promotion />;
      case 'promotion-plan':
        return <PromotionPlan />;
      case 'training':
        return <TrainingEducation />;
      case 'onsite':
        return <OnSiteServiceManagement />;
      case 'health-assistant':
        return <SmartPhotoSeries onSelectService={setCurrentPage} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-green">
      {/* 顶部导航栏 - 桌面端显示 */}
      <Navigation 
        currentPage={currentPage}
        userRole={ADMIN_ROLE}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={ADMIN_ROLE}
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
          <p>美容院管理系统 - 管理员端 | 淡绿色高端简洁设计 | 一台手机掌控整个美容院</p>
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
