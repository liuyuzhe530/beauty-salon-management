# 🚀 快速上传功能测试 - 立即开始

**所需时间**: 3 分钟  
**难度**: ⭐ 简单  
**目标**: 验证文件上传功能正常工作

---

## ✅ 前置条件

- ✅ multer 已安装
- ✅ 上传路由已创建
- ✅ 后端已编译
- ✅ 前端开发服务器正在运行

---

## 🎬 开始测试

### 方式 1️⃣: 浏览器测试 (推荐)

**步骤 1**: 打开新的 Terminal

```bash
cd backend
npm start
```

等待看到:
```
Database connected
Database synchronized
Server running on port 3001
Upload endpoint: http://localhost:3001/api/upload/image
```

**步骤 2**: 打开浏览器

访问: `http://localhost:5173/`

**步骤 3**: 进入舌苔检测

导航菜单 → 健康助手 → 舌苔检测

**步骤 4**: 上传图片

1. 点击 "📷 上传舌苔照片" 按钮
2. 选择本地的 PNG 或 JPG 文件
3. 看到图片预览
4. 点击 "开始分析" 按钮
5. 查看分析结果

✅ **完成！**

---

### 方式 2️⃣: 命令行测试

**步骤 1**: 准备测试图片

确保你有一张 JPG 或 PNG 图片，例如 `test.jpg`

**步骤 2**: 运行上传命令

```bash
curl -X POST \
  -F "file=@C:/path/to/test.jpg" \
  http://localhost:3001/api/upload/image
```

**步骤 3**: 查看响应

应该看到:
```json
{
  "success": true,
  "message": "上传成功",
  "url": "http://localhost:3001/uploads/test-1730506800000.jpg",
  "filename": "test-1730506800000.jpg",
  "size": 102400
}
```

✅ **完成！**

---

### 方式 3️⃣: 浏览器 DevTools 测试

**步骤 1**: 打开浏览器开发者工具

按 `F12` → 打开 Console 标签

**步骤 2**: 粘贴以下代码

```javascript
// 测试上传接口
async function testUpload() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('http://localhost:3001/api/upload/image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      console.log('✅ 上传成功:', data);
    } catch (err) {
      console.error('❌ 上传失败:', err);
    }
  };
  input.click();
}

testUpload();
```

**步骤 3**: 选择图片并查看结果

在 Console 中应该看到成功的响应

✅ **完成！**

---

## 📊 预期结果

### 成功上传

```
✅ 浏览器显示: 上传成功
✅ 图片预览显示选定的图片
✅ backend/uploads/ 目录中有新文件
✅ 分析结果显示在页面上
```

### 失败信号

```
❌ 403 错误 → 跨域问题，检查后端 CORS 配置
❌ 413 错误 → 文件过大，选择更小的图片
❌ 500 错误 → 后端错误，查看后端日志
❌ "找不到上传目录" → 手动创建 backend/uploads/
```

---

## 🔍 验证文件

### 检查上传目录

```bash
# 查看已上传的文件
dir backend/uploads

# 应该看到类似:
# test-1730506800000.jpg
# image-1730506800001.png
```

### 检查文件可访问性

在浏览器中打开:
```
http://localhost:3001/uploads/test-1730506800000.jpg
```

应该能看到上传的图片

---

## 🆘 快速调试

### 问题: 上传后 404

**检查**:
```bash
# 1. 后端是否运行
curl http://localhost:3001/api/health

# 2. 文件是否存在
dir backend/uploads

# 3. 路由是否正确
# 应该看到: http://localhost:3001/uploads/xxx.jpg
```

### 问题: CORS 错误

**检查**:
```bash
# 查看后端 CORS 配置
cat backend/src/server.ts | grep -A 5 "cors()"
```

### 问题: TypeScript 编译错误

**解决**:
```bash
cd backend
npm run build  # 重新编译
npm start      # 重新启动
```

---

## 📋 测试检查清单

- [ ] 后端启动成功 (看到启动日志)
- [ ] 前端访问正常 (看到应用界面)
- [ ] 上传界面可见 (可以点击上传按钮)
- [ ] 可以选择文件 (文件选择对话框出现)
- [ ] 看到预览 (上传的图片显示在页面上)
- [ ] 分析工作 (点击分析后看到结果)
- [ ] 文件保存 (backend/uploads/ 中有新文件)
- [ ] 文件可访问 (能在浏览器中访问)

**全部打勾 = ✅ 完全正常！**

---

## 📞 需要帮助?

### 问题排查步骤

1. **查看浏览器控制台** (F12 → Console)
   - 是否有红色错误?
   - 错误消息是什么?

2. **查看后端日志**
   - Terminal 中显示了什么?
   - 是否有错误堆栈?

3. **检查网络请求** (F12 → Network)
   - 上传请求是否发送?
   - 响应状态码是什么?
   - 响应内容是什么?

4. **检查文件系统**
   ```bash
   dir backend/uploads
   # 是否有新文件?
   ```

---

## 🎉 完成！

恭喜！您已经验证了上传功能。

现在您可以：
- ✅ 上传舌苔照片进行分析
- ✅ 上传护肤照片进行诊断
- ✅ 上传美容照片进行建议

**开始使用吧！** 🚀
