# 🚀 数据库连接快速指南 (5分钟解决)

## 📌 您的信息

```
公网 IP: 112.117.97.242
数据库地址: 10.25.111.180:3306
用户名: root
密码: ma961120
数据库: ma961120-0gn5q3yfd523d6c0
```

---

## ⚡ 3 步快速连接

### **Step 1: 打开腾讯云**

```
访问: https://console.cloud.tencent.com/
用户名: (您的腾讯云账号)
密码: (您的密码)
```

### **Step 2: 进入 MySQL 配置**

```
左侧菜单 → 云产品 → 数据库 → MySQL
↓
找到实例: ma961120-0gn5q3yfd523d6c0
↓
点击实例名称
↓
找到"安全组"标签
↓
点击关联的安全组
↓
点击"编辑规则"
```

### **Step 3: 添加您的 IP**

**点击"新增规则"，填写：**

```
┌──────────────────────────────────────┐
│ 协议端口                             │
│   TCP:3306                           │
│                                      │
│ 授权对象                             │
│   112.117.97.242/32                  │
│                                      │
│ 策略: 允许                           │
│ 备注: Local Dev                      │
└──────────────────────────────────────┘
```

**点击"确定"保存**

---

## ✅ 验证成功

等待 1-2 分钟规则生效，然后运行：

```powershell
cd E:\xincs\xincs\backend
npm run dev
```

**如果看到这些信息，说明成功了！**

```
✅ Database connected successfully
✅ Database synchronized
✅ Server running on port 5000
```

---

## 📊 配置前后对比

### ❌ 配置前

```
⚠️ Database connection failed: connect ETIMEDOUT
❌ 数据库无法连接
❌ 数据只能本地存储
```

### ✅ 配置后

```
✅ Database connected successfully
✅ Database synchronized
✅ 所有数据保存到云数据库
✅ 系统生产环境就绪
```

---

## 🎯 就这么简单！

1. 登录腾讯云 ✅
2. 找到 MySQL 实例 ✅
3. 添加您的 IP 到安全组 ✅
4. 重启后端 ✅
5. 完成！ 🎉

需要详细步骤？查看：`DATABASE_CONNECTION_SOLUTION.md`


