"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const Customer_1 = __importDefault(require("../database/models/Customer"));
const baseService_1 = require("./baseService");
class CustomerService extends baseService_1.BaseService {
    constructor() {
        super(Customer_1.default);
    }
    async findByPhone(phone) {
        return this.findOne({ where: { phone } });
    }
    async findByEmail(email) {
        return this.findOne({ where: { email } });
    }
    async getStats() {
        const count = await this.model.count();
        return { totalCustomers: count };
    }
}
exports.CustomerService = CustomerService;
exports.default = new CustomerService();
//# sourceMappingURL=customerService.js.map