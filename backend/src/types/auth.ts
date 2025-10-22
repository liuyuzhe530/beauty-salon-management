/**
 * 认证相关的类型定义
 */

// 注册请求
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'staff' | 'customer';
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'staff' | 'customer';
      isActive: boolean;
    };
  };
  code?: string;
  timestamp?: string;
}

// Token验证响应
export interface VerifyResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
  };
  message: string;
}

// 错误响应
export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  timestamp: string;
}

 * 认证相关的类型定义
 */

// 注册请求
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'staff' | 'customer';
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'staff' | 'customer';
      isActive: boolean;
    };
  };
  code?: string;
  timestamp?: string;
}

// Token验证响应
export interface VerifyResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
  };
  message: string;
}

// 错误响应
export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  timestamp: string;
}

 * 认证相关的类型定义
 */

// 注册请求
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'staff' | 'customer';
}

// 登录请求
export interface LoginRequest {
  username: string;
  password: string;
}

// 认证响应
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      username: string;
      email: string;
      role: 'admin' | 'staff' | 'customer';
      isActive: boolean;
    };
  };
  code?: string;
  timestamp?: string;
}

// Token验证响应
export interface VerifyResponse {
  success: boolean;
  valid: boolean;
  user?: {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
  };
  message: string;
}

// 错误响应
export interface ErrorResponse {
  success: false;
  message: string;
  code: string;
  timestamp: string;
}







