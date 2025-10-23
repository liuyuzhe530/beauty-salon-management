"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customer = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const User_1 = require("./User");
class Customer extends sequelize_1.Model {
}
exports.Customer = Customer;
Customer.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
        references: { model: User_1.User, key: 'id' },
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
        unique: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    address: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    notes: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'customers',
});
exports.default = Customer;
//# sourceMappingURL=Customer.js.map