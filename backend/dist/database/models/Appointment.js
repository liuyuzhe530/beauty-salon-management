"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const Customer_1 = require("./Customer");
const Staff_1 = require("./Staff");
class Appointment extends sequelize_1.Model {
}
exports.Appointment = Appointment;
Appointment.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    customerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: Customer_1.Customer, key: 'id' },
    },
    staffId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: { model: Staff_1.Staff, key: 'id' },
    },
    service: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    appointmentDate: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    duration: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 60,
    },
    status: {
        type: sequelize_1.DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled'),
        defaultValue: 'pending',
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
}, {
    sequelize: database_1.default,
    tableName: 'appointments',
});
exports.default = Appointment;
//# sourceMappingURL=Appointment.js.map