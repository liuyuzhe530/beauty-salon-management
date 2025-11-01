import { useState, Suspense, useCallback } from 'react';
import { UserRole } from './types/index';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { ToastProvider } from './components/Toast';
import { AIChat } from './components/AIChat';

// 使用 React.lazy 进行代码分割 - 按需加载组件
const Dashboard = ({ onSelectService }: any) => {
  const Component = require('./components/Dashboard').Dashboard;
  return <Component onSelectService={onSelectService} />;
};

const CustomerManagement = () => {
  const Component = require('./components/CustomerManagement').CustomerManagement;
  return <Component />;
};

const Staff = () => {
  const Component = require('./components/Staff').Staff;
  return <Component />;
};

const BeautyProductMall = () => {
  const Component = require('./components/BeautyProductMall').BeautyProductMall;
  return <Component />;
};

const MallPage = () => {
  const Component = require('./components/MallPage').MallPage;
  return <Component />;
};

const AIAssistant = () => {
  const Component = require('./components/AIAssistant').AIAssistant;
  return <Component />;
};

const Promotion = () => {
  const Component = require('./components/Promotion').Promotion;
  return <Component />;
};

const PromotionPlan = () => {
  const Component = require('./components/PromotionPlan').PromotionPlan;
  return <Component />;
};

const TrainingEducation = () => {
  const Component = require('./components/MiniProgramStore').TrainingEducation;
  return <Component />;
};

const OnSiteServiceManagement = () => {
  const Component = require('./components/OnSiteServiceManagement').OnSiteServiceManagement;
  return <Component />;
};

const OnSiteServiceBooking = () => {
  const Component = require('./components/OnSiteServiceBooking').OnSiteServiceBooking;
  return <Component />;
};

const IntelligentProcurementAI = () => {
  const Component = require('./components/IntelligentProcurementAI').IntelligentProcurementAI;
  return <Component />;
};

const SkincareDetection = () => {
  const Component = require('./components/SkincareDetection').SkincareDetection;
  return <Component />;
};

const BeautyDiagnosis = () => {
  const Component = require('./components/BeautyDiagnosis').BeautyDiagnosis;
  return <Component />;
};

const TongueCoatingDetection = () => {
  const Component = require('./components/TongueCoatingDetection').TongueCoatingDetection;
  return <Component />;
};

const SmartPhotoSeries = ({ onSelectService }: any) => {
  const Component = require('./components/SmartPhotoSeries').SmartPhotoSeries;
  return <Component onSelectService={onSelectService} />;
};

// 加载指示器组件
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
      <p className="text-gray-600">加载中...</p>
    </div>
  </div>
);

function AppContent() {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [isDemoMode, setIsDemoMode] = useState(false);

  // 使用 useCallback 缓存页面切换函数
  const handlePageChange = useCallback((page: string) => {
    setCurrentPage(page);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    setUserRole(null);
    setCurrentPage('dashboard');
  }, [logout]);

  // Check authentication status
  if (loading) {
    return <LoadingComponent />;
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

  const renderPage = () => {
    return (
      <Suspense fallback={<LoadingComponent />}>
        {currentPage === 'dashboard' && <Dashboard onSelectService={handlePageChange} />}
        {currentPage === 'customermanagement' && <CustomerManagement />}
        {currentPage === 'staff' && <Staff />}
        {currentPage === 'shop' && (userRole === 'admin' ? <MallPage /> : <BeautyProductMall />)}
        {currentPage === 'ai' && <AIAssistant />}
        {currentPage === 'promotion' && <Promotion />}
        {currentPage === 'promotion-plan' && <PromotionPlan />}
        {currentPage === 'training' && <TrainingEducation />}
        {currentPage === 'onsite' && <OnSiteServiceManagement />}
        {currentPage === 'onsite-booking' && <OnSiteServiceBooking />}
        {currentPage === 'procurement' && <IntelligentProcurementAI />}
        {currentPage === 'skincare-detection' && <SkincareDetection />}
        {currentPage === 'beauty-diagnosis' && <BeautyDiagnosis />}
        {currentPage === 'tongue-coating-detection' && <TongueCoatingDetection />}
        {currentPage === 'health-assistant' && <SmartPhotoSeries onSelectService={handlePageChange} />}
        {!['dashboard', 'customermanagement', 'staff', 'shop', 'ai', 'promotion', 'promotion-plan', 'training', 'onsite', 'onsite-booking', 'procurement', 'skincare-detection', 'beauty-diagnosis', 'tongue-coating-detection', 'health-assistant'].includes(currentPage) && <Dashboard onSelectService={handlePageChange} />}
      </Suspense>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-green">
      {/* 顶部导航栏 - 桌面端显示 */}
      <Navigation 
        currentPage={currentPage}
        userRole={(isDemoMode ? userRole : user?.role) as UserRole}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={(isDemoMode ? userRole : user?.role) as UserRole}
        onPageChange={handlePageChange}
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
