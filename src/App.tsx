import { useState } from 'react';
import { UserRole } from './types/index';
import { LoginPage } from './components/LoginPage';
import { RoleSelector } from './components/RoleSelector';
import { Navigation } from './components/Navigation';
import { BottomNavigation } from './components/BottomNavigation';
import { Dashboard } from './components/Dashboard';
import { Staff } from './components/Staff';
import { CustomerManagement } from './components/CustomerManagement';
import { MallPage } from './components/MallPage';
import { AIAssistant } from './components/AIAssistant';
import { Promotion } from './components/Promotion';
import { FloatingAIChat } from './components/FloatingAIChat';
import { ToastProvider } from './components/Toast';
import { apiService } from './services/api';
import { TrainingEducation } from './components/MiniProgramStore';

function AppContent() {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [useLoginPage, setUseLoginPage] = useState(true);

  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('dashboard');
    apiService.clearToken();
    setUseLoginPage(true);
  };

  if (!userRole) {
    return useLoginPage ? (
      <LoginPage onLogin={handleSelectRole} />
    ) : (
      <RoleSelector onSelectRole={handleSelectRole} />
    );
  }

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
      case 'ai':
        return <AIAssistant />;
      case 'promotion':
        return <Promotion />;
      case 'training':
        return <TrainingEducation />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-green">
      {/* 顶部导航栏 - 桌面端显示 */}
      <Navigation 
        currentPage={currentPage}
        userRole={userRole}
        onPageChange={setCurrentPage}
        onLogout={handleLogout}
      />
      
      {/* 底部导航栏 - 手机端显示 */}
      <BottomNavigation
        currentPage={currentPage}
        userRole={userRole}
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

      {/* AI助手浮窗 */}
      <FloatingAIChat />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
