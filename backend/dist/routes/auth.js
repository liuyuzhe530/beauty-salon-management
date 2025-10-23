"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.post('/register', (req, res) => authController_1.default.register(req, res));
router.post('/login', (req, res) => authController_1.default.login(req, res));
router.get('/verify', auth_1.authMiddleware, (req, res) => authController_1.default.verify(req, res));
exports.default = router;
//# sourceMappingURL=auth.js.map