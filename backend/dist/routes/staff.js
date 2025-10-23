"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const staffController_1 = __importDefault(require("../controllers/staffController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const asAuthReq = (req) => req;
router.get('/', auth_1.authMiddleware, (req, res) => staffController_1.default.getAll(asAuthReq(req), res));
router.get('/stats', auth_1.authMiddleware, (req, res) => staffController_1.default.getStats(asAuthReq(req), res));
router.get('/available', auth_1.authMiddleware, (req, res) => staffController_1.default.getAvailable(asAuthReq(req), res));
router.get('/:id', auth_1.authMiddleware, (req, res) => staffController_1.default.getById(asAuthReq(req), res));
router.post('/', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), (req, res) => staffController_1.default.create(asAuthReq(req), res));
router.put('/:id', auth_1.authMiddleware, (0, auth_1.requireRole)('admin', 'staff'), (req, res) => staffController_1.default.update(asAuthReq(req), res));
router.delete('/:id', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), (req, res) => staffController_1.default.delete(asAuthReq(req), res));
exports.default = router;
//# sourceMappingURL=staff.js.map