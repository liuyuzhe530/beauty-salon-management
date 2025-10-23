"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentController = void 0;
const baseCRUDController_1 = require("./baseCRUDController");
const appointmentService_1 = __importDefault(require("../services/appointmentService"));
class AppointmentController extends baseCRUDController_1.BaseCRUDController {
    constructor() {
        super(appointmentService_1.default);
    }
    async getByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const data = await appointmentService_1.default.findByCustomer(customerId);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch',
            });
        }
    }
    async getUpcoming(_req, res) {
        try {
            const days = _req.query.days ? parseInt(_req.query.days) : 7;
            const data = await appointmentService_1.default.findUpcoming(days);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch',
            });
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await appointmentService_1.default.getStats();
            res.json({ success: true, data: stats });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch stats',
            });
        }
    }
}
exports.AppointmentController = AppointmentController;
exports.default = new AppointmentController();
//# sourceMappingURL=appointmentController.js.map