"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("./config/database"));
const auth_1 = __importDefault(require("./routes/auth"));
const customers_1 = __importDefault(require("./routes/customers"));
const staff_1 = __importDefault(require("./routes/staff"));
const appointments_1 = __importDefault(require("./routes/appointments"));
const products_1 = __importDefault(require("./routes/products"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/customers', customers_1.default);
app.use('/api/staff', staff_1.default);
app.use('/api/appointments', appointments_1.default);
app.use('/api/products', products_1.default);
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Server is running' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
});
// Start server
const startServer = async () => {
    try {
        await database_1.default.authenticate();
        console.log('Database connected');
        await database_1.default.sync({ alter: process.env.NODE_ENV === 'development' });
        console.log('Database synchronized');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map