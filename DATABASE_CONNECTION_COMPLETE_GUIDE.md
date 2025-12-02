# 🗄️ 腾讯云 MySQL 数据库连接完整指南

## 📋 **您当前的连接信息**

```
数据库主机: 10.25.111.180
数据库端口: 3306
数据库用户: root
数据库密码: ma961120
数据库名称: ma961120-0gn5q3yfd523d6c0
```

✅ **这些信息已保存在** `backend/.env` 文件中

---

## 🔧 **连接超时错误解决方案**

当前错误：`connect ETIMEDOUT`

这表示**无法到达数据库**，可能原因：

### **原因 1：网络安全组配置**

腾讯云 MySQL 需要配置安全组规则，允许您的 IP 访问。

**解决步骤：**

1. **登录腾讯云控制台**
   - 访问：https://console.cloud.tencent.com/

2. **找到您的 MySQL 实例**
   - 数据库 → MySQL
   - 找到实例：`ma961120-0gn5q3yfd523d6c0`

3. **配置安全组**
   - 点击实例 → 安全组
   - 编辑入站规则
   - 添加规则：
     ```
     协议: TCP
     端口: 3306
     来源: 您的 IP（查询方式见下面）
     或者: 0.0.0.0/0（允许所有 IP，仅用于测试）
     ```

4. **查询您的本地 IP**
   
   在 PowerShell 运行：
   ```powershell
   # 方式 1：查询本地 IP
   ipconfig
   
   # 方式 2：查询公网 IP
   (Invoke-WebRequest -Uri "http://checkip.amazonaws.com").Content
   ```

---

### **原因 2：数据库实例未启动**

1. 进入腾讯云控制台 → MySQL
2. 检查实例状态是否为**"运行中"**
3. 如果是**"已关闭"**，点击**"启动"**

---

### **原因 3：防火墙阻止**

**检查 Windows 防火墙：**

```powershell
# 查看防火墙状态
Get-NetFirewallProfile

# 如需关闭（仅用于测试）
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled $False
```

---

## ✅ **验证数据库连接**

### **方法 1：在后端测试连接**

```bash
cd backend
npm run dev
```

**成功标志：**
```
✅ Database connected successfully
✅ Database synchronized
✅ Server running on port 5000
```

### **方法 2：使用 MySQL 客户端测试**

**安装 MySQL 命令行工具：**

```powershell
# Windows: 使用 WSL 或安装 MySQL Workbench
# https://dev.mysql.com/downloads/workbench/

# 或使用 chocolatey
choco install mysql -y
```

**测试连接：**

```powershell
mysql -h 10.25.111.180 -P 3306 -u root -p
# 输入密码: ma961120
```

**连接成功后的命令：**

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 查看当前数据库
SELECT DATABASE();

-- 查看表
USE ma961120-0gn5q3yfd523d6c0;
SHOW TABLES;
```

---

## 🚀 **快速连接步骤（推荐）**

### **Step 1：配置安全组（最重要）**

```
1. 进入腾讯云控制台
2. MySQL → 您的实例
3. 安全组标签
4. 编辑入站规则
5. 添加规则：
   - 协议：TCP
   - 端口：3306
   - 来源：0.0.0.0/0（测试用）
   - 保存
```

### **Step 2：测试连接**

```powershell
# 查询您的公网 IP
(Invoke-WebRequest -Uri "http://checkip.amazonaws.com").Content

# 记下这个 IP，添加到腾讯云安全组
```

### **Step 3：重启后端**

```powershell
cd E:\xincs\xincs\backend
npm run dev
```

**等待看到：**
```
✅ Database connected successfully
✅ Server running on port 5000
```

---

## 📝 **检查清单**

- [ ] 登录腾讯云控制台
- [ ] 找到 MySQL 实例：`ma961120-0gn5q3yfd523d6c0`
- [ ] 检查实例状态是否"运行中"
- [ ] 配置安全组（允许 3306 端口）
- [ ] 获取您的公网 IP 并添加到安全组
- [ ] 在后端重启：`npm run dev`
- [ ] 检查控制台是否显示"✅ Database connected"

---

## 🆘 **常见问题**

### **Q1: 我不知道我的公网 IP**

**A:** 运行这个命令：
```powershell
(Invoke-WebRequest -Uri "http://checkip.amazonaws.com").Content
```

### **Q2: 腾讯云数据库地址是什么？**

**A:** 从您提供的信息：`10.25.111.180`（这是内网 IP）

查询公网 IP：
- 进入腾讯云控制台 → MySQL
- 点击实例
- 查看"公网地址"（如果有的话）

### **Q3: 连接后数据库为空**

**A:** 后端会自动创建表结构，运行：
```bash
npm run dev
```

后端会自动执行 `sequelize.sync()` 创建所有表。

### **Q4: 显示"Authentication failed"**

**A:** 检查密码：
```
用户名: root
密码: ma961120
```

在 `.env` 文件中验证：
```
DB_USER=root
DB_PASSWORD=ma961120
```

---

## 🔐 **安全建议**

⚠️ **不要把这些信息提交到 GitHub：**

1. ✅ `.env` 文件已在 `.gitignore` 中
2. ✅ 本地密码已安全保存
3. ✅ 生产环境应该使用不同的密码

**检查 .gitignore：**
```bash
cat .gitignore | grep -i env
```

应该看到：
```
.env
.env.local
```

---

## 📞 **如果还是连接失败**

请提供以下信息：

```
1. 腾讯云控制台中实例的状态：[ ]
2. 您的本地公网 IP：[ ]
3. 后端错误信息：[ ]
4. 运行这个命令的输出：
   telnet 10.25.111.180 3306
```

然后我可以帮您进一步调试！

---

## 🎯 **下一步**

连接成功后，系统将自动：

1. ✅ 创建所有数据表
2. ✅ 初始化数据结构
3. ✅ 开启所有后端 API
4. ✅ 完全支持数据库操作

所有前端功能会从**本地存储**转为**数据库存储**！


