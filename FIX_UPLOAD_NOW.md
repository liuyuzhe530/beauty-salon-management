# ⚡ 立即修复上传 - 简化版

**问题**: 后端无法启动 (MySQL 连接失败)  
**原因**: MySQL 服务未运行  
**解决**: 3 步启动所有服务  

---

## 🎯 3 步快速启动

### 第 1️⃣ 步: 启动 MySQL

打开 **PowerShell** (管理员模式):

```powershell
Start-Service MySQL80
```

等待 2 秒...

---

### 第 2️⃣ 步: 启动后端

打开 **第一个 Terminal**:

```bash
cd E:\xincs\xincs\backend
npm start
```

等待看到:
```
Database connected
Database synchronized
Server running on port 3001
Upload endpoint: http://localhost:3001/api/upload/image
```

---

### 第 3️⃣ 步: 启动前端

打开 **第二个 Terminal**:

```bash
cd E:\xincs\xincs
npm run dev
```

等待看到:
```
VITE v5.4.21 ready in xxx ms
➜ Local: http://localhost:5173/
```

---

## ✅ 验证所有服务运行中

应该看到:
- ✅ MySQL 运行中
- ✅ 后端运行在 localhost:3001
- ✅ 前端运行在 localhost:5173

---

## 🧪 测试上传功能

1. **打开浏览器**: http://localhost:5173/
2. **清除缓存**: Ctrl + Shift + R
3. **登录应用**: 选择任意角色
4. **进入舌苔检测**: 导航菜单 → 健康助手 → 舌苔检测
5. **上传图片**: 点击上传按钮，选择 PNG 或 JPG
6. **查看预览**: 图片应该显示
7. **点击分析**: 应该看到诊断结果

---

## 🎉 完成！

如果以上步骤都成功，**上传功能已完全可用**！

---

## 🆘 如果后端还是无法启动

### 检查 1: MySQL 是否真的运行

```powershell
Get-Service MySQL80 | Select-Object Status
```

应该显示: `Running`

### 检查 2: 创建数据库

打开 **命令行**, 运行:

```bash
mysql -h localhost -u root -e "CREATE DATABASE IF NOT EXISTS beauty_salon CHARACTER SET utf8mb4;"
```

### 检查 3: 重新启动后端

```bash
cd backend
npm start
```

---

## 📋 完整的启动步骤

```
1. 启动 MySQL          (已完成 ✓)
2. 启动后端服务器      (Terminal 1)
3. 启动前端开发服务器  (Terminal 2)
4. 打开浏览器
5. 测试上传功能
```

---

**现在就按照步骤 2-3 操作吧!** 🚀
