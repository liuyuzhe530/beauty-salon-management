"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appointmentController_1 = __importDefault(require("../controllers/appointmentController"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const asAuthReq = (req) => req;
router.get('/', auth_1.authMiddleware, (req, res) => appointmentController_1.default.getAll(asAuthReq(req), res));
router.get('/stats', auth_1.authMiddleware, (req, res) => appointmentController_1.default.getStats(asAuthReq(req), res));
router.get('/upcoming', auth_1.authMiddleware, (req, res) => appointmentController_1.default.getUpcoming(asAuthReq(req), res));
router.get('/customer/:customerId', auth_1.authMiddleware, (req, res) => appointmentController_1.default.getByCustomer(asAuthReq(req), res));
router.get('/:id', auth_1.authMiddleware, (req, res) => appointmentController_1.default.getById(asAuthReq(req), res));
router.post('/', auth_1.authMiddleware, (req, res) => appointmentController_1.default.create(asAuthReq(req), res));
router.put('/:id', auth_1.authMiddleware, (0, auth_1.requireRole)('admin', 'staff'), (req, res) => appointmentController_1.default.update(asAuthReq(req), res));
router.delete('/:id', auth_1.authMiddleware, (0, auth_1.requireRole)('admin'), (req, res) => appointmentController_1.default.delete(asAuthReq(req), res));
exports.default = router;
//# sourceMappingURL=appointments.js.map