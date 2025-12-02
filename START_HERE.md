# 👈 从这里开始！

## 🎯 您现在需要做什么

您的问题：**如何链接数据库？太复杂了能帮我做吗？**

我的答案：**不用担心，我已经为您简化到最简单！**

---

## 📱 5 个最简单的步骤

### 第 1️⃣ 步：打开腾讯云
打开这个链接：
```
https://console.cloud.tencent.com/
```
登录您的账号

### 第 2️⃣ 步：进入 MySQL
左侧菜单 → 云产品 → 数据库 → MySQL

### 第 3️⃣ 步：找您的实例
搜索或在列表中找：
```
ma961120-0gn5q3yfd523d6c0
```

### 第 4️⃣ 步：进入安全组
点击实例 → 安全组 标签

### 第 5️⃣ 步：添加规则
编辑规则 → 添加规则

**填写：**
```
协议: TCP:3306
来源: 112.117.97.242/32
策略: 允许
```

点击确定

---

## ⏳ 然后做这个

```powershell
# 等待 2 分钟规则生效

# 打开 PowerShell 运行：
cd E:\xincs\xincs\backend
npm run dev
```

**如果显示：✅ Database connected successfully**

**恭喜！成功！** 🎉

---

## 📖 我为您准备了这些文件

| 文件 | 用途 |
|------|------|
| **EASY_SETUP_GUIDE.md** | 👈 最简单的傻瓜式指南 |
| **COPY_PASTE_SOLUTION.md** | 复制粘贴就行的方案 |
| **STEP_BY_STEP.txt** | 纯文本步骤 |
| test-db-connection.ps1 | 验证连接的工具 |

---

## 🆘 如果卡住了

### 卡在找实例？
→ 直接访问：https://console.cloud.tencent.com/cdb

### 卡在添加规则？
→ 看 EASY_SETUP_GUIDE.md 的第 5 步

### 不确定是否成功？
→ 运行这个命令验证：
```powershell
powershell -ExecutionPolicy Bypass -File test-db-connection.ps1
```

---

## 💡 核心信息（记住这些就够了）

```
您的 IP: 112.117.97.242
数据库端口: 3306
要添加的规则: TCP 3306 允许 您的 IP
```

---

## 🚀 现在就开始！

打开 **EASY_SETUP_GUIDE.md** 跟着步骤做

**最多 15 分钟就能完成！**

有任何问题，随时告诉我！ 💬
