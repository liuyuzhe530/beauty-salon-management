import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { CustomerManagement } from './components/CustomerManagement';
import { AIChat } from './components/AIChat';
import { ToastProvider } from './components/Toast';
import { TrainingEducation } from './components/MiniProgramStore';
import { SmartPhotoSeries } from './components/SmartPhotoSeries';

// 美容师端：强制使用 staff 角色
const STAFF_ROLE = 'staff';

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [userRole] = useState(STAFF_ROLE);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
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
          console.log('美容师登录成功');
          setIsDemoMode(true);
          setCurrentPage('dashboard');
        }} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setCurrentPage('dashboard');
  };

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customermanagement':
        return <CustomerManagement />;
      case 'training':
        return <TrainingEducation />;
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
        userRole={STAFF_ROLE}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={STAFF_ROLE}
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
          <p>美容院管理系统 - 美容师端 | 淡绿色高端简洁设计 | 我的日程和客户管理</p>
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


