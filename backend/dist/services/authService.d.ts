import { RegisterRequest, LoginRequest, AuthResponse } from '../types/auth';
export declare class AuthService {
    register(data: RegisterRequest): Promise<AuthResponse>;
    login(data: LoginRequest): Promise<AuthResponse>;
}
declare const _default: AuthService;
export default _default;
//# sourceMappingURL=authService.d.ts.map