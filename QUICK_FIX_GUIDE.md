#  **快速修复指南 - 数据库连接错误**

**问题**: `ConnectionRefusedError [SequelizeConnectionRefusedError]`  
**原因**: MySQL服务未启动  
**解决时间**: 5分钟

---

##  **立即修复步骤**

### 步骤1️⃣: 启动MySQL服务 (3分钟)

#### Windows 用户

```powershell
# 打开PowerShell (以管理员身份运行)
# 右键 → "以管理员身份运行"

# 执行命令启动MySQL
net start MySQL80

# 应该看到: MySQL80 服务已经启动成功

# 验证服务状态
Get-Service MySQL80 | Select-Object Status

# 应该显示: Status : Running 
```

#### Mac 用户

```bash
# 如果使用Homebrew安装
brew services start mysql

# 验证状态
brew services list | grep mysql
# 应该显示: mysql ... started
```

#### Linux 用户

```bash
# Ubuntu/Debian
sudo systemctl start mysql

# 验证状态
sudo systemctl status mysql
# 应该显示: ● mysql.service - MySQL Community Server ... active (running)
```

### 步骤2️⃣: 验证MySQL运行 (1分钟)

```bash
# 测试MySQL连接
mysql -h localhost -u root

# 如果出现 "mysql>" 提示，说明成功 
# 输入以下命令
SHOW DATABASES;

# 应该看到数据库列表
# 退出MySQL
exit
```

### 步骤3️⃣: 创建应用数据库 (1分钟)

```bash
# 连接到MySQL
mysql -h localhost -u root

# 创建beauty_salon数据库
CREATE DATABASE beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 验证创建成功
SHOW DATABASES;

# 应该看到 beauty_salon

# 退出
exit
```

### 步骤4️⃣: 测试后端连接 (1分钟)

```bash
# 进入后端目录
cd backend

# 运行诊断脚本
node test-connection.js

# 预期输出:
# ╔════════════════════════════════════════════════════╗
# ║     数据库连接测试工具                             ║
# ╚════════════════════════════════════════════════════╝
#
#  当前配置:
#   Host:      localhost
#   Port:      3306
#   User:      root
#   Database:  beauty_salon
#   Password:  (empty)
#
#  正在连接数据库...
#  数据库连接成功！
#
#  数据库信息:
#   当前数据库: beauty_salon
#   已有数据库: information_schema, mysql, performance_schema, beauty_salon
#   当前表数: 0
#
#  所有测试通过！
```

---

##  **启动后端服务**

完成上述步骤后，启动后端：

```bash
cd backend

# 重新编译 (可选，已有dist文件夹)
npm run build

# 启动服务器
npm run start

# 预期输出:
# Database connected 
# Database synchronized 
# Server running on port 3001 
```

---

##  **验证成功**

### 检查点1: 后端运行

```bash
# 在新终端测试API
curl http://localhost:3001/api/health

# 预期响应:
# {"success":true,"message":"Server is running"}
```

### 检查点2: 前端启动

```bash
# 在项目根目录
npm run dev

# 访问: http://localhost:5173
# 应该看到登录页面
```

### 检查点3: 登录测试

1. 打开浏览器DevTools (F12)
2. 进入Network标签
3. 尝试登录
4. 应该看到API请求被发送

---

##  **常见问题排除**

### 问题1: "The service was not found" (Windows)

**症状**: `net start MySQL80` 显示找不到服务

**解决方案**:
```powershell
# 检查实际的MySQL服务名
Get-Service | Select-String MySQL

# 可能是 MySQL57, MySQL56, MySQL, 等等
# 根据实际服务名启动，例如:
net start MySQL

# 或使用图形界面 (Services.msc)
services.msc
# 找到MySQL服务，右键启动
```

### 问题2: "ERROR 2002: Can't connect to local MySQL server" 

**症状**: `mysql` 命令连接失败

**解决方案**:
```bash
# 检查MySQL进程是否真的在运行
# Windows:
netstat -ano | find ":3306"

# Linux/Mac:
lsof -i :3306

# 如果没有输出，说明MySQL没有真正启动
# 重新启动服务
```

### 问题3: 数据库已创建但报错

**症状**: 连接测试仍失败

**解决方案**:
```bash
# 检查.env文件配置
cat backend/.env

# 确保这些字段正确:
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=(根据你的设置)
# DB_NAME=beauty_salon

# 如果密码为空但.env中有值，修正它:
# DB_PASSWORD=

# 保存后重试
```

---

##  **检查清单**

```
步骤1: MySQL服务启动
  [ ] Windows: net start MySQL80 成功
  [ ] Mac: brew services start mysql 成功
  [ ] Linux: sudo systemctl start mysql 成功

步骤2: 验证MySQL运行
  [ ] mysql -h localhost -u root 连接成功
  [ ] SHOW DATABASES; 显示数据库列表
  [ ] 可以看到 mysql, information_schema 等

步骤3: 创建数据库
  [ ] CREATE DATABASE beauty_salon 执行成功
  [ ] SHOW DATABASES; 显示 beauty_salon
  [ ] mysql> exit 成功退出

步骤4: 测试后端连接
  [ ] node test-connection.js 返回成功
  [ ] 显示  数据库连接成功！

步骤5: 启动后端
  [ ] npm run start 输出 "Server running on port 3001"
  [ ] 没有看到错误信息

步骤6: 验证API
  [ ] curl http://localhost:3001/api/health 返回成功
  [ ] npm run dev 前端启动成功
  [ ] 浏览器能访问 http://localhost:5173
```

---

##  **完成标志**

当你看到这些消息时，说明成功了 

```
 Database connected
 Database synchronized  
 Server running on port 3001
```

然后在浏览器中访问 http://localhost:5173，看到登录页面就完全成功了！

---

##  **提示**

- MySQL服务需要一直运行，应用才能连接
- 重启电脑后，需要重新启动MySQL服务
- 可以设置MySQL为自动启动服务 (可选)
- 如果还有问题，详见 SYSTEM_DIAGNOSTICS.md

---

**预计完成时间**: ️ 5-10分钟  
**难度等级**:  简单  
**成功率**:  99%
