"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = __importDefault(require("../services/authService"));
class AuthController {
    async register(req, res) {
        const result = await authService_1.default.register(req.body);
        res.status(result.success ? 201 : 400).json(result);
    }
    async login(req, res) {
        const result = await authService_1.default.login(req.body);
        res.status(result.success ? 200 : 401).json(result);
    }
    async verify(req, res) {
        if (!req.user) {
            res.status(401).json({
                success: false,
                valid: false,
                message: 'No user authenticated',
            });
            return;
        }
        res.json({
            success: true,
            valid: true,
            user: req.user,
            message: 'Token is valid',
        });
    }
}
exports.AuthController = AuthController;
exports.default = new AuthController();
//# sourceMappingURL=authController.js.map