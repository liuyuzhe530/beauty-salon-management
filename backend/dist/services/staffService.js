"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const Staff_1 = __importDefault(require("../database/models/Staff"));
const baseService_1 = require("./baseService");
class StaffService extends baseService_1.BaseService {
    constructor() {
        super(Staff_1.default);
    }
    async findByPhone(phone) {
        return this.findOne({ where: { phone } });
    }
    async findAvailable() {
        return this.findAll({ where: { isAvailable: true } });
    }
    async getStats() {
        const total = await this.model.count();
        const available = await this.model.count({ where: { isAvailable: true } });
        return { totalStaff: total, availableStaff: available };
    }
}
exports.StaffService = StaffService;
exports.default = new StaffService();
//# sourceMappingURL=staffService.js.map