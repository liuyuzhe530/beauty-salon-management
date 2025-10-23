"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const baseCRUDController_1 = require("./baseCRUDController");
const staffService_1 = __importDefault(require("../services/staffService"));
class StaffController extends baseCRUDController_1.BaseCRUDController {
    constructor() {
        super(staffService_1.default);
    }
    async getAvailable(_req, res) {
        try {
            const data = await staffService_1.default.findAvailable();
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
            const stats = await staffService_1.default.getStats();
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
exports.StaffController = StaffController;
exports.default = new StaffController();
//# sourceMappingURL=staffController.js.map