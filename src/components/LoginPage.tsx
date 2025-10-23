import React, { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import { authService } from '../api';

type UserRole = 'admin' | 'staff' | 'customer';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!username || !password) {
        setError('请输入用户名和密码');
        setIsLoading(false);
        return;
      }

      // 调用后端API登录
      const response = await authService.login({
        username,
        password,
      });

      if (response.success && response.data) {
        console.log('登录成功:', response.data.user);
        // 使用后端返回的角色
        onLogin(response.data.user.role);
      } else {
        setError(response.message || '登录失败，请重试');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '登录失败';
      setError(errorMsg);
      console.error('登录错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

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

      // 调用后端API注册
      const response = await authService.register({
        username,
        email,
        password,
        confirmPassword,
        role,
      });

      if (response.success) {
        setError('');
        setIsLogin(true);
        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        // 注册成功后自动登录
        if (response.data) {
          onLogin(response.data.user.role);
        }
      } else {
        setError(response.message || '注册失败，请重试');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || '注册失败';
      setError(errorMsg);
      console.error('注册错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 演示模式 - 直接进入（保持兼容性）
  const handleDemoMode = (demoRole: UserRole) => {
    console.log('进入演示模式:', demoRole);
    onLogin(demoRole);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-green-900">Beauty Studio</h1>
          </div>
          <p className="text-gray-600">专业美容院管理系统</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                isLogin
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              登录
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 rounded-lg font-semibold transition-colors ${
                !isLogin
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              注册
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱地址"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    确认密码
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="确认密码"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    角色
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={isLoading}
                  >
                    <option value="customer">客户</option>
                    <option value="staff">美容师</option>
                    <option value="admin">管理员</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:bg-gray-400"
            >
              {isLoading ? '处理中...' : isLogin ? '登录' : '注册'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-4">快速访问选项：</p>

            <div className="space-y-2">
              {[
                { role: 'admin' as UserRole, label: '以管理员身份进入' },
                { role: 'staff' as UserRole, label: '以美容师身份进入' },
                { role: 'customer' as UserRole, label: '以客户身份进入' }
              ].map(item => (
                <button
                  key={item.role}
                  onClick={() => handleDemoMode(item.role)}
                  className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-200"
                  disabled={isLoading}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <p className="text-xs text-gray-500 text-center mt-4">
              💡 提示：使用演示模式可立即体验系统
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-4">
          美容院管理系统 v1.0 | 后端 API 集成版
        </p>
      </div>
    </div>
  );
};

