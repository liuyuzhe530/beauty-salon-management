"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const sequelize_1 = require("sequelize");
const Appointment_1 = __importDefault(require("../database/models/Appointment"));
const baseService_1 = require("./baseService");
class AppointmentService extends baseService_1.BaseService {
    constructor() {
        super(Appointment_1.default);
    }
    async findByCustomer(customerId) {
        return this.findAll({
            where: { customerId },
            order: [['appointmentDate', 'DESC']],
        });
    }
    async findByStaff(staffId) {
        return this.findAll({
            where: { staffId },
            order: [['appointmentDate', 'DESC']],
        });
    }
    async findUpcoming(days = 7) {
        const now = new Date();
        const future = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
        return this.findAll({
            where: {
                appointmentDate: {
                    [sequelize_1.Op.between]: [now, future],
                },
                status: ['pending', 'confirmed'],
            },
            order: [['appointmentDate', 'ASC']],
        });
    }
    async getStats() {
        const total = await this.model.count();
        const confirmed = await this.model.count({ where: { status: 'confirmed' } });
        const completed = await this.model.count({ where: { status: 'completed' } });
        return { totalAppointments: total, confirmed, completed };
    }
}
exports.AppointmentService = AppointmentService;
exports.default = new AppointmentService();
//# sourceMappingURL=appointmentService.js.map