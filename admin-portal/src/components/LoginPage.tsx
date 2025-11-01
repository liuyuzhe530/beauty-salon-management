import React, { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type UserRole = 'admin' | 'staff' | 'customer';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const { login, register, error: authError, clearError } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    clearError();

    try {
      if (!username || !password) {
        setError('请输入用户名和密码');
        setIsLoading(false);
        return;
      }

      // 使用 AuthContext 的 login 方法
      await login(username, password);
      console.log('登录成功');
      // 成功登陆后，调用 onLogin 回调
      onLogin('admin');
    } catch (err: any) {
      console.error('登录错误:', err);
      const errorMsg = err.message || '登录失败，请检查用户名和密码';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    clearError();

    try {
      if (!username || !email || !password) {
        setError('请填写所有必要字段');
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('密码不匹配');
        setIsLoading(false);
        return;
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('请输入有效的邮箱地址');
        setIsLoading(false);
        return;
      }

      // 使用 AuthContext 的 register 方法
      await register({
        username,
        email,
        password,
        confirmPassword,
        role: 'admin', // 管理员端强制使用 admin 角色
      });
      console.log('注册成功');
      // 成功注册后，调用 onLogin 回调
      onLogin('admin');
    } catch (err: any) {
      console.error('注册错误:', err);
      const errorMsg = err.message || '注册失败，请重试';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // 演示模式 - 直接进入系统
  const handleDemoMode = () => {
    console.log('进入演示模式');
    onLogin('admin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">美容院管理系统</h1>
          </div>
          <p className="text-gray-600">管理员端 - 一台手机掌控整个美容院</p>
        </div>

        {/* Login/Register Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Tab Switch */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
                clearError();
              }}
              className={`flex-1 py-2 font-semibold transition-colors ${
                isLogin
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
              }`}
            >
              登 录
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
                clearError();
              }}
              className={`flex-1 py-2 font-semibold transition-colors ${
                !isLogin
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 border-b-2 border-transparent hover:text-gray-900'
              }`}
            >
              注 册
            </button>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error || authError}
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isLoading ? '登录中...' : '登 录'}
              </button>

              <p className="text-center text-sm text-gray-600">
                没有账户？
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    clearError();
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  立即注册
                </button>
              </p>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="输入用户名"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="输入密码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
              >
                {isLoading ? '注册中...' : '注 册'}
              </button>

              <p className="text-center text-sm text-gray-600">
                已有账户？
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    clearError();
                  }}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  立即登录
                </button>
              </p>
            </form>
          )}

          {/* Demo Mode Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-xs text-gray-500 mb-3">✨ 演示模式</p>
            <button
              onClick={handleDemoMode}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-semibold py-3 rounded-lg transition-all duration-300 text-base"
            >
              🚀 立即体验管理员系统
            </button>
            <p className="text-center text-xs text-gray-600 mt-2">
              测试阶段：点击即可进入，无需账号密码
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

