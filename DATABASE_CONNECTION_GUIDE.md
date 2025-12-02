# 数据库连接配置指南

## 🎯 **快速配置（3 步）**

### 步骤 1：在后端目录创建 `.env` 文件

在 `backend/` 文件夹下创建 `.env` 文件，内容如下：

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=beauty_salon

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here
```

**说明：**
- `DB_HOST`: MySQL 服务器地址（本地填 localhost）
- `DB_PORT`: MySQL 端口（默认 3306）
- `DB_USER`: MySQL 用户名（通常是 root）
- `DB_PASSWORD`: MySQL 密码（如果没设密码留空）
- `DB_NAME`: 数据库名称

---

### 步骤 2：确保 MySQL 已运行

**在 Windows 上：**

```cmd
# 方法1：使用 Services 启动 MySQL
# 搜索 "Services" → 找到 "MySQL80" → 右键"启动"

# 方法2：命令行启动（如果 MySQL 在 Program Files）
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
```

**验证 MySQL 是否运行：**

```bash
mysql -u root -p
# 输入密码后，如果进入 MySQL 命令行，说明已启动
quit
```

---

### 步骤 3：创建数据库

```bash
# 登录 MySQL
mysql -u root -p

# 在 MySQL 命令行执行：
CREATE DATABASE beauty_salon;
EXIT;
```

---

## 🚀 **启动后端**

配置完成后，重新启动后端服务：

```bash
cd backend
npm run dev
```

**成功标志：** 看到 `Server running on http://localhost:5000`

---

## 💡 **如果还是无法连接**

### 检查 MySQL 是否真的在运行

```bash
netstat -an | findstr 3306
```

如果有输出说明 MySQL 已启动。

### 检查连接参数是否正确

```bash
mysql -h localhost -P 3306 -u root -p
```

---

## 🎉 **成功后**

- ✅ 后端正在运行（http://localhost:5000）
- ✅ 前端正在运行（http://localhost:5173）
- ✅ 数据库已连接
- ✅ 可以进行数据的增删改查操作

---

## 📊 **完整系统现在运行：**

```
前端：React (http://localhost:5173)
  ↓
后端：Express (http://localhost:5000)
  ↓
数据库：MySQL (localhost:3306)
```

现在系统完全就绪！


