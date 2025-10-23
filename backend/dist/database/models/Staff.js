"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Staff = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../../config/database"));
const User_1 = require("./User");
class Staff extends sequelize_1.Model {
}
exports.Staff = Staff;
Staff.init({
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
    specialization: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
    },
    isAvailable: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: database_1.default,
    tableName: 'staff',
});
exports.default = Staff;
//# sourceMappingURL=Staff.js.map