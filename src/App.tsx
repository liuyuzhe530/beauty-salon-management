import { useState } from 'react';
import { UserRole } from './types/index';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RoleSelector } from './components/RoleSelector';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { Staff } from './components/Staff';
import { CustomerManagement } from './components/CustomerManagement';
import { BeautyProductMall } from './components/BeautyProductMall';
import { AIAssistant } from './components/AIAssistant';
import { Promotion } from './components/Promotion';
import { AIChat } from './components/AIChat';
import { ToastProvider } from './components/Toast';
import { TrainingEducation } from './components/MiniProgramStore';
import { OnSiteServiceManagement } from './components/OnSiteServiceManagement';
import { OnSiteServiceBooking } from './components/OnSiteServiceBooking';
import { IntelligentProcurementAI } from './components/IntelligentProcurementAI';
import { PromotionPlan } from './components/PromotionPlan';
import { SkincareDetection } from './components/SkincareDetection';
import { BeautyDiagnosis } from './components/BeautyDiagnosis';
import { TongueCoatingDetection } from './components/TongueCoatingDetection';
import { SmartPhotoSeries } from './components/SmartPhotoSeries';

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
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
        <LoginPage onLogin={(role) => {
          console.log('进入演示模式, 角色:', role);
          setUserRole(role);
          setIsDemoMode(true);
          setCurrentPage('dashboard');
        }} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    setUserRole(null);
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
        return <BeautyProductMall />;
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
      case 'onsite-booking':
        return <OnSiteServiceBooking />;
      case 'procurement':
        return <IntelligentProcurementAI />;
      case 'skincare-detection':
        return <SkincareDetection />;
      case 'beauty-diagnosis':
        return <BeautyDiagnosis />;
      case 'tongue-coating-detection':
        return <TongueCoatingDetection />;
      case 'smart-photo-series':
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
        userRole={(isDemoMode ? userRole : user?.role) as UserRole}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={(isDemoMode ? userRole : user?.role) as UserRole}
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
          <p>美容院管理系统 | 淡绿色高端简洁设计 | 一台手机掌控整个美容院</p>
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
