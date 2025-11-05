# 🏗️ 上传系统架构

**文档**: 系统上传功能的完整架构和工作流程  
**更新**: 2025-11-04  

---

## 📐 系统架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户浏览器                               │
│  http://localhost:5173                                          │
└────────┬────────────────────────────────────────────────────────┘
         │
         │ 1. 用户选择文件
         │    TongueCoatingDetection.tsx
         │
         ├─ 2a. 本地预览 (FileReader → Base64)
         │      显示图片给用户
         │
         └─ 2b. 上传到服务器 (FormData → POST)
              uploadService.ts → XHR 请求
              ↓
┌────────────────────────────────────────────────────────────────┐
│           后端服务器 (Node.js + Express)                       │
│           http://localhost:3001                                 │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Express App                                             │  │
│  │                                                         │  │
│  │  app.use('/uploads', express.static(...))               │  │
│  │  └─ 提供上传文件的静态访问                               │  │
│  │                                                         │  │
│  │  app.use('/api/upload', uploadRoutes)                   │  │
│  │  │                                                      │  │
│  │  └─ POST /api/upload/image                              │  │
│  │     │                                                   │  │
│  │     ├─ multer 中间件                                    │  │
│  │     │  ├─ 解析 multipart/form-data                      │  │
│  │     │  ├─ 验证文件类型 (MIME 检查)                      │  │
│  │     │  ├─ 检查文件大小 (10MB 限制)                      │  │
│  │     │  └─ 保存到磁盘 (/uploads 目录)                    │  │
│  │     │                                                   │  │
│  │     └─ 返回响应给前端                                   │  │
│  │        {                                                │  │
│  │          "success": true,                               │  │
│  │          "url": "http://localhost:3001/uploads/...",   │  │
│  │          "filename": "image-1730693234000.jpg"         │  │
│  │        }                                                │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                │
│  数据库:                                                        │
│  ├─ MySQL (可选: 记录上传历史)                                │
│  └─ [未实现]                                                  │
│                                                                │
│  文件系统:                                                      │
│  └─ /backend/uploads/                                         │
│     ├─ image-1730693234000.jpg                              │
│     ├─ photo-1730693245123.png                              │
│     └─ ...                                                  │
└────────────────────────────────────────────────────────────────┘
         │
         │ 3. 服务器返回 URL
         │    {success: true, url: "http://..."}
         │
         └─→ 前端处理响应
             └─ 保存 URL 或显示成功消息
             └─ 用户可以访问上传的文件
```

---

## 🔄 详细工作流程

### 1️⃣ 用户操作阶段

```
用户操作 (浏览器)
    ↓
TongueCoatingDetection 组件
    ↓
点击 "上传照片" 按钮
    ↓
<input type="file" onChange={handleImageUpload} />
    ↓
用户选择文件: image.jpg (1MB)
    ↓
handleImageUpload 事件触发
```

**代码**:
```typescript
const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];  // File 对象
    
    // 本地预览
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSelectedImage(reader.result);  // Base64 数据
    };
    
    // 上传到服务器
    const result = await uploadImage(file);  // 调用上传服务
  }
};
```

### 2️⃣ 前端上传阶段

```
uploadImage(file) - uploadService.ts
    ↓
创建 FormData
    ├─ formData.append('file', file)
    └─ file 是二进制数据
    ↓
创建 XMLHttpRequest
    ├─ method: POST
    ├─ url: http://localhost:3001/api/upload/image
    └─ body: formData (multipart/form-data)
    ↓
监听上传进度
    └─ request.upload.onprogress
    ↓
发送请求
    └─ request.send(formData)
    ↓
等待服务器响应
    ├─ 成功 (200) → 解析 JSON 响应
    └─ 失败 → 抛出错误
```

**代码** (`src/services/uploadService.ts`):
```typescript
export const uploadImage = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const request = new XMLHttpRequest();

  // 监听进度
  if (onProgress) {
    request.upload.addEventListener('progress', (event) => {
      const percent = (event.loaded / event.total) * 100;
      onProgress({ loaded: event.loaded, total: event.total, percent });
    });
  }

  // 发送请求
  request.open('POST', 'http://localhost:3001/api/upload/image');
  request.send(formData);
  
  // 处理响应...
};
```

### 3️⃣ 后端处理阶段

```
服务器接收 POST /api/upload/image 请求
    ↓
Express 中间件处理
    ├─ CORS 检查 ✓
    ├─ 解析请求头
    └─ Content-Type: multipart/form-data
    ↓
Multer 处理
    ├─ 检查文件是否存在
    ├─ 验证 MIME 类型
    │  └─ 只允许: image/jpeg, image/png, image/gif, image/webp, image/bmp
    ├─ 检查文件大小
    │  └─ 限制: 10MB
    └─ 保存文件到 /backend/uploads/
       ├─ 原始名称: image.jpg
       ├─ 时间戳: 1730693234000
       └─ 保存为: image-1730693234000.jpg
    ↓
路由处理器处理
    ├─ 检查 req.file 是否存在
    ├─ 生成访问 URL
    │  └─ http://localhost:3001/uploads/image-1730693234000.jpg
    └─ 返回 JSON 响应
       {
         "success": true,
         "message": "上传成功",
         "url": "http://localhost:3001/uploads/image-1730693234000.jpg",
         "filename": "image-1730693234000.jpg",
         "originalName": "image.jpg",
         "size": 1048576,
         "mimeType": "image/jpeg"
       }
    ↓
响应返回给前端
```

**代码** (`backend/src/routes/upload.ts`):
```typescript
router.post('/image', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: '没有上传文件',
    });
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
```

### 4️⃣ 前端处理响应阶段

```
前端接收响应
    ├─ 状态码: 200
    └─ Body: JSON { success: true, url: "..." }
    ↓
前端检查 result.success
    ├─ true → 显示成功消息
    └─ false → 显示错误消息
    ↓
保存文件信息
    ├─ const fileUrl = result.url
    └─ 存储在 state 或本地存储
    ↓
更新 UI
    ├─ 显示成功提示
    ├─ 记录文件 URL
    └─ 允许用户进行下一步操作
    ↓
用户可以访问文件
    └─ http://localhost:3001/uploads/image-1730693234000.jpg
```

---

## 📁 文件结构

```
E:\xincs\xincs\
│
├─ 前端代码
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ TongueCoatingDetection.tsx    ← 上传功能
│  │  │  ├─ SkincareDetection.tsx         ← 上传功能
│  │  │  └─ BeautyDiagnosis.tsx           ← 上传功能
│  │  │
│  │  └─ services/
│  │     └─ uploadService.ts              ← ✨ 新增
│  │        ├─ uploadImage()
│  │        ├─ uploadImages()
│  │        └─ checkUploadService()
│  │
│  └─ package.json
│
└─ 后端代码
   ├─ src/
   │  ├─ server.ts                        ← 配置上传路由
   │  │  ├─ app.use('/uploads', express.static(...))
   │  │  └─ app.use('/api/upload', uploadRoutes)
   │  │
   │  └─ routes/
   │     └─ upload.ts                     ← ✨ 上传路由
   │        ├─ POST /api/upload/image
   │        └─ POST /api/upload/images
   │
   ├─ uploads/                             ← ✨ 新建（自动）
   │  ├─ image-1730693234000.jpg
   │  ├─ photo-1730693245123.png
   │  └─ ...
   │
   └─ package.json
      └─ multer: ^2.0.2
```

---

## 🔌 API 接口定义

### 单个文件上传

```
请求:
POST /api/upload/image HTTP/1.1
Host: localhost:3001
Content-Type: multipart/form-data; boundary=----FormBoundary

------FormBoundary
Content-Disposition: form-data; name="file"; filename="image.jpg"
Content-Type: image/jpeg

[二进制文件数据]
------FormBoundary--

响应 (200 OK):
{
  "success": true,
  "message": "上传成功",
  "url": "http://localhost:3001/uploads/image-1730693234000.jpg",
  "filename": "image-1730693234000.jpg",
  "originalName": "image.jpg",
  "size": 1048576,
  "mimeType": "image/jpeg"
}

错误响应 (400 Bad Request):
{
  "success": false,
  "message": "只允许上传图片文件 (jpeg, png, gif, webp, bmp)"
}
```

### 多个文件上传

```
请求:
POST /api/upload/images HTTP/1.1
Host: localhost:3001
Content-Type: multipart/form-data

[多个文件数据]

响应 (200 OK):
{
  "success": true,
  "message": "成功上传 2 个文件",
  "files": [
    { "url": "...", "filename": "..." },
    { "url": "...", "filename": "..." }
  ]
}
```

---

## 🔐 安全性检查

### 文件验证

```
1. MIME 类型检查
   ✓ 只允许图片: image/jpeg, image/png, image/gif, image/webp, image/bmp
   ✗ 拒绝: image/x-icon, application/json, text/plain 等

2. 文件大小检查
   ✓ 限制: 10 MB (10485760 字节)
   ✗ 超过限制: 返回 413 Payload Too Large

3. 文件名安全
   ✓ 使用时间戳 + 原始扩展名
   ✗ 避免路径遍历攻击 (../)
   ✗ 避免执行危险文件

4. 目录权限
   ✓ uploads 目录只读访问
   ✗ 防止任意文件执行
```

### 建议的额外安全措施

```
1. 用户认证
   router.post('/image', 
     authenticateUser,  ← 添加
     upload.single('file'),
     ...
   );

2. 病毒扫描
   import NodeClam from 'clamscan';
   const { isInfected } = await clamscan.scanFile(filePath);

3. 图片元数据移除
   import sharp from 'sharp';
   await sharp(filePath).withMetadata(false).toFile(...);

4. 访问控制
   使用 CDN 或反向代理限制访问
```

---

## 💾 存储架构

### 本地存储 (当前)

```
后端服务器磁盘
└─ /backend/uploads/
   ├─ image-1730693234000.jpg (1.5 MB)
   ├─ photo-1730693245123.png (2.3 MB)
   └─ document-1730693250000.pdf (5 MB)

总大小: 8.8 MB
访问方式: HTTP 静态文件服务
```

### 云存储 (未来可扩展)

```
可以升级到:

AWS S3 / Azure Blob Storage / Google Cloud Storage
  ↓
速度快 | 容量大 | 可靠性高 | 成本较高

或本地升级:
  ↓
增加磁盘 | 使用 NAS | 定期备份 | 成本低 | 维护复杂
```

---

## 🚀 启动和运行

### 系统启动流程

```
1. 启动后端
   $ cd backend
   $ npm install      # 安装依赖
   $ npm run build    # 编译 TypeScript
   $ npm start        # 启动服务器
   
   输出:
   ✓ Database connected
   ✓ Database synchronized
   ✓ Server running on port 3001
   ✓ Upload endpoint: http://localhost:3001/api/upload/image

2. 启动前端
   $ npm run dev
   
   输出:
   ✓ VITE v5.x.x ready in xxx ms
   ✓ Local: http://localhost:5173/

3. 打开浏览器
   http://localhost:5173
   
4. 测试功能
   健康助手 → 舌苔检测 → 上传照片
```

### 服务依赖关系

```
前端 (5173)
   ↓ (HTTP 请求)
   ├─ 需要后端 (3001) 运行 ✓
   ├─ 需要 CORS 配置 ✓
   └─ 需要 /api/upload 路由 ✓

后端 (3001)
   ├─ 需要 Node.js ✓
   ├─ 需要 multer 包 ✓
   ├─ 需要 uploads 目录 ✓ (自动创建)
   └─ 需要数据库 ✓ (SQLite/MySQL)
```

---

## 🔧 监控和日志

### 后端日志

```
// 启动日志
Database connected
Database synchronized
Server running on port 3001

// 上传请求日志
POST /api/upload/image
  file: image.jpg (1048576 bytes)
  mime: image/jpeg
  → 200 OK

// 错误日志
POST /api/upload/image
  file: document.pdf (5242880 bytes)
  error: 文件过大，最大限制 10MB
  → 400 Bad Request
```

### 前端日志

```
// 上传服务日志
uploadImage() 调用
  file: image.jpg
  size: 1048576 bytes

✅ 上传成功: { url: "...", filename: "..." }

或

❌ 上传错误: 后端服务未启动
```

---

## 📊 性能指标

### 上传速度

```
文件大小: 1 MB
网络速度: 1 Mbps (120 KB/s)
预期时间: ~8-10 秒

文件大小: 10 MB
网络速度: 1 Mbps
预期时间: ~80-100 秒

文件大小: 10 MB
网络速度: 10 Mbps (快速网络)
预期时间: ~8-10 秒
```

### 服务器资源

```
内存占用: ~50-100 MB
CPU 使用: < 5%
磁盘 I/O: 根据网络速度

本地存储空间: 需要 > 10 GB 空间用于上传
```

---

## ✅ 系统检查清单

启动系统前:
- [ ] Node.js 已安装
- [ ] npm 依赖已安装
- [ ] 防火墙允许端口 3001 和 5173

启动后验证:
- [ ] 后端运行在 http://localhost:3001
- [ ] 前端运行在 http://localhost:5173
- [ ] 可以访问 http://localhost:3001/api/health
- [ ] uploads 目录已创建
- [ ] 浏览器控制台无错误

上传功能测试:
- [ ] 可以选择文件
- [ ] 可以看到本地预览
- [ ] 文件出现在 backend/uploads/
- [ ] 可以通过 URL 访问文件
- [ ] 浏览器开发者工具显示 POST 请求成功

---

## 🎯 下一步优化

### 短期 (1 周)
- [ ] 添加用户认证
- [ ] 添加数据库记录
- [ ] 添加上传历史

### 中期 (1 月)
- [ ] 添加图片压缩
- [ ] 添加缩略图生成
- [ ] 添加存储统计

### 长期 (3 月+)
- [ ] 迁移到云存储
- [ ] 添加 CDN
- [ ] 添加分享功能

---

**架构版本**: 1.0  
**最后更新**: 2025-11-04  
**状态**: 已部署  

