import { Request } from 'express';
/**
 * Authentication Type Definitions
 */
export interface RegisterRequest {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: 'admin' | 'staff' | 'customer';
}
export interface LoginRequest {
    username: string;
    password: string;
}
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
export interface ErrorResponse {
    success: false;
    message: string;
    code: string;
    timestamp: string;
}
export interface JWTPayload {
    id: string;
    username: string;
    email: string;
    role: 'admin' | 'staff' | 'customer';
}
export interface AuthenticatedRequest extends Request {
    user?: JWTPayload;
}
//# sourceMappingURL=auth.d.ts.map