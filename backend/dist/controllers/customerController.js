"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerController = void 0;
const baseCRUDController_1 = require("./baseCRUDController");
const customerService_1 = __importDefault(require("../services/customerService"));
class CustomerController extends baseCRUDController_1.BaseCRUDController {
    constructor() {
        super(customerService_1.default);
    }
    async getByPhone(req, res) {
        try {
            const { phone } = req.params;
            const data = await customerService_1.default.findByPhone(phone);
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
            const stats = await customerService_1.default.getStats();
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
exports.CustomerController = CustomerController;
exports.default = new CustomerController();
//# sourceMappingURL=customerController.js.map