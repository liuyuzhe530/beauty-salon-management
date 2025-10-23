"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../database/models/User"));
const jwt_1 = require("../config/jwt");
class AuthService {
    async register(data) {
        try {
            // Check if user exists
            const existingUser = await User_1.default.findOne({
                where: { email: data.email },
            });
            if (existingUser) {
                return {
                    success: false,
                    message: 'Email already registered',
                    code: 'EMAIL_EXISTS',
                    timestamp: new Date().toISOString(),
                };
            }
            // Hash password
            const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
            // Create user
            const user = await User_1.default.create({
                username: data.username,
                email: data.email,
                password: hashedPassword,
                role: data.role || 'customer',
            });
            // Generate token
            const token = (0, jwt_1.generateToken)({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
            return {
                success: true,
                message: 'Registration successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isActive: user.isActive,
                    },
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Registration failed',
                code: 'REGISTRATION_ERROR',
                timestamp: new Date().toISOString(),
            };
        }
    }
    async login(data) {
        try {
            // Find user
            const user = await User_1.default.findOne({
                where: { username: data.username },
            });
            if (!user) {
                return {
                    success: false,
                    message: 'Invalid username or password',
                    code: 'INVALID_CREDENTIALS',
                    timestamp: new Date().toISOString(),
                };
            }
            // Verify password
            const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.password);
            if (!isPasswordValid) {
                return {
                    success: false,
                    message: 'Invalid username or password',
                    code: 'INVALID_CREDENTIALS',
                    timestamp: new Date().toISOString(),
                };
            }
            // Generate token
            const token = (0, jwt_1.generateToken)({
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
            return {
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        isActive: user.isActive,
                    },
                },
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            return {
                success: false,
                message: error instanceof Error ? error.message : 'Login failed',
                code: 'LOGIN_ERROR',
                timestamp: new Date().toISOString(),
            };
        }
    }
}
exports.AuthService = AuthService;
exports.default = new AuthService();
//# sourceMappingURL=authService.js.map