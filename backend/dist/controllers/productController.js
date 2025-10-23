"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const baseCRUDController_1 = require("./baseCRUDController");
const productService_1 = __importDefault(require("../services/productService"));
class ProductController extends baseCRUDController_1.BaseCRUDController {
    constructor() {
        super(productService_1.default);
    }
    async getByCategory(req, res) {
        try {
            const { category } = req.params;
            const data = await productService_1.default.findByCategory(category);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch',
            });
        }
    }
    async search(req, res) {
        try {
            const { name } = req.query;
            if (!name) {
                res.status(400).json({ success: false, message: 'Name parameter required' });
                return;
            }
            const data = await productService_1.default.searchByName(name);
            res.json({ success: true, data });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to search',
            });
        }
    }
    async getStats(_req, res) {
        try {
            const stats = await productService_1.default.getStats();
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
exports.ProductController = ProductController;
exports.default = new ProductController();
//# sourceMappingURL=productController.js.map