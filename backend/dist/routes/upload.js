"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.default.Router();
// 配置上传目录
const uploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// 配置 multer 存储
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const ext = path_1.default.extname(file.originalname);
        const name = path_1.default.basename(file.originalname, ext);
        cb(null, `${name}-${timestamp}${ext}`);
    },
});
// 文件过滤器 - 只允许图片
const fileFilter = (_req, file, cb) => {
    const allowedMimes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
    ];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error('只允许上传图片文件 (jpeg, png, gif, webp, bmp)'));
    }
};
// 创建 multer 实例
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB 限制
    },
});
// 上传单个图片接口
router.post('/image', upload.single('file'), (req, res) => {
    if (!req.file) {
        res.status(400).json({
            success: false,
            message: '没有上传文件',
        });
        return;
    }
    const fileUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({
        success: true,
        message: '上传成功',
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimeType: req.file.mimetype,
    });
});
// 批量上传接口
router.post('/images', upload.array('files', 10), (req, res) => {
    if (!req.files || req.files.length === 0) {
        res.status(400).json({
            success: false,
            message: '没有上传文件',
        });
        return;
    }
    const files = req.files.map((file) => ({
        url: `http://localhost:3001/uploads/${file.filename}`,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimeType: file.mimetype,
    }));
    res.json({
        success: true,
        message: `成功上传 ${files.length} 个文件`,
        files,
    });
});
// 错误处理中间件
router.use((err, _req, res) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                success: false,
                message: '文件过大，最大限制 10MB',
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: err.message,
        });
        return;
    }
    if (err) {
        res.status(400).json({
            success: false,
            message: err.message || '上传失败',
        });
        return;
    }
    res.status(500).json({
        success: false,
        message: '内部服务器错误',
    });
});
exports.default = router;
//# sourceMappingURL=upload.js.map