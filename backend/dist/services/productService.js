"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const Product_1 = __importDefault(require("../database/models/Product"));
const baseService_1 = require("./baseService");
class ProductService extends baseService_1.BaseService {
    constructor() {
        super(Product_1.default);
    }
    async findByCategory(category) {
        return this.findAll({
            where: { category, isActive: true },
        });
    }
    async findActive() {
        return this.findAll({ where: { isActive: true } });
    }
    async searchByName(name) {
        const { Op } = await Promise.resolve().then(() => __importStar(require('sequelize')));
        return this.findAll({
            where: {
                name: { [Op.like]: `%${name}%` },
                isActive: true,
            },
        });
    }
    async getStats() {
        const total = await this.model.count();
        const active = await this.model.count({ where: { isActive: true } });
        return { totalProducts: total, activeProducts: active };
    }
}
exports.ProductService = ProductService;
exports.default = new ProductService();
//# sourceMappingURL=productService.js.map