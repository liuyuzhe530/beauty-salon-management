#  立即启动系统 - 完整步骤指南

**时间**: 现在立即执行
**预计耗时**: 10-15分钟启动 + 15分钟快速测试 = 30分钟

---

##  前置检查

### 检查1: Node.js环境
```bash
node -v
npm -v
```

**必须看到**: 
- Node.js v16+ 
- npm 8+

### 检查2: MySQL
```bash
# 确保MySQL已启动
# Windows: 任务管理器查看 MySQL80 或 MariaDB
# 或在CMD运行: mysql -u root
```

---

##  分步启动

### 第一步：安装后端依赖 (3-5分钟)

**打开 Power Shell 并执行**:

```bash
cd E:\xincs\xincs\backend
npm install
```

**您会看到**: 
```
npm WARN 
added 150+ packages in 1m
```

 看到这个说明成功了

---

### 第二步：安装前端依赖 (3-5分钟)

**在另一个 Power Shell 中执行**:

```bash
cd E:\xincs\xincs
npm install
```

**您会看到**: 
```
npm WARN
added 300+ packages in 1m
```

 看到这个说明成功了

---

### 第三步：启动后端 API (在第一个 Power Shell 中)

```bash
cd E:\xincs\xincs\backend
npm run dev
```

**期望看到的输出**:
```
 数据库连接成功
 数据库模型同步成功
 美容院管理系统 API 服务已启动
服务器地址: http://localhost:5000
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第四步：启动前端 (在第二个 Power Shell 中)

```bash
cd E:\xincs\xincs
npm run dev
```

**期望看到的输出**:
```
VITE v4.x.x ready in 123ms

 Local:   http://localhost:3000/
 press h to show help
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第五步：打开浏览器

访问: **http://localhost:3000**

**您应该看到**:
- 登录/注册页面
- 蓝色的美容院品牌颜色
- 中文界面

 看到登录页面说明前端启动成功

---

##  快速功能检查 (15分钟)

在浏览器中依次执行以下操作：

### 测试1: 用户注册
```
1. 点击"注册"按钮
2. 填写:
   - 用户名: testuser01
   - 邮箱: test01@example.com
   - 密码: TestPass123!
   - 确认密码: TestPass123!
   - 角色: admin
3. 点击"注册"
```

**期望结果**:
```
 显示"注册成功"提示
 自动进入主页面
 看到用户菜单
```

---

### 测试2: 查看菜单
```
1. 点击"客户管理" → 看到客户列表页面
2. 点击"预约管理" → 看到预约列表页面
3. 点击"美容师" → 看到美容师列表页面
4. 点击"产品" → 看到产品列表页面
5. 点击"AI助手" → 看到AI助手页面
```

**期望结果**:
```
 所有菜单都能点击
 页面都能加载
 没有错误信息
```

---

### 测试3: 创建数据
```
1. 进入"客户管理"
2. 点击"新增客户"
3. 填写:
   - 姓名: 张三
   - 电话: 13800138000
   - 邮箱: zhangsan@example.com
4. 点击"保存"
```

**期望结果**:
```
 显示"创建成功"
 客户出现在列表中
 可以编辑和删除
```

---

### 测试4: 检查开发者工具

按 `F12` 打开开发者工具，检查：

```
Console标签:
 没有红色错误信息
 可能有黄色警告 (正常)

Network标签:
 请求都返回 200-201 状态码
 没有红色的失败请求

Application标签:
 localStorage中有 "authToken"
 Token以 "eyJ" 开头
```

---

## � 遇到问题？

### Q1: 后端启动失败 - "Error: connect ECONNREFUSED"

**原因**: MySQL未启动或配置错误

**解决**:
```
1. 打开任务管理器
2. 检查是否有 MySQL80 或 MariaDB 进程
3. 没有的话，启动 MySQL 服务
4. 或者手动连接: mysql -u root
5. 重新运行: npm run dev
```

---

### Q2: 前端白屏 - "Cannot GET /"

**原因**: 访问了错误的地址或前端未编译

**解决**:
```
1. 确保URL是 http://localhost:3000 (不是 5000)
2. 检查终端2有没有编译成功
3. 如果还是失败:
   cd E:\xincs\xincs
   npm run build
   npm run dev
4. 再试一次
```

---

### Q3: 注册失败 - "Error: Network error"

**原因**: 后端API未启动或无法连接

**解决**:
```
1. 检查终端1是否显示:
   " 美容院管理系统 API 服务已启动"
2. 打开 http://localhost:5000/health
3. 看是否返回 {"success":true,"message":"服务器正常运行"}
4. 如果不行，重新启动后端
```

---

### Q4: 依赖安装失败

**原因**: npm缓存问题或网络问题

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules
rm -r node_modules package-lock.json

# 重新安装
npm install

# 再试一次
npm run dev
```

---

##  成功标志

###  一切正常
-  后端启动，显示"API 服务已启动"
-  前端启动，显示"ready in Xms"
-  浏览器显示登录页面
-  能成功注册账户
-  能浏览所有菜单
-  能创建客户/预约
-  F12看不到红色错误

###  有小问题但可接受
- ️ 页面加载有点慢
- ️ 有一两个警告信息
- ️ 某个功能需要刷新才能显示

###  有严重问题
-  无法启动任何服务
-  无法进入任何页面
-  大量JavaScript错误
-  注册/登录完全失败

---

##  接下来

### 如果一切正常 

参考: `COMPLETE_TESTING_GUIDE.md`

执行完整的24个测试用例，记录结果到 `TEST_EXECUTION_REPORT.md`

---

### 如果有问题 ️

1. 记录具体错误信息
2. 查看上面的"遇到问题"部分
3. 尝试解决方案
4. 如果还是不行，查看 `QUICK_TEST_START.md` 的常见问题

---

##  快速参考

| 命令 | 作用 | 位置 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 后端/前端 |
| `npm run build` | 构建生产版本 | 前端 |
| `http://localhost:3000` | 前端地址 | 浏览器 |
| `http://localhost:5000` | 后端API地址 | 浏览器 |
| `F12` | 打开开发者工具 | 浏览器 |

---

##  现在就开始！

### 三个步骤启动全系统

**第1步 - 终端1**:
```bash
cd E:\xincs\xincs\backend
npm install
npm run dev
```

**第2步 - 终端2**:
```bash
cd E:\xincs\xincs
npm install
npm run dev
```

**第3步 - 浏览器**:
```
http://localhost:3000
```

---

### 就这么简单！

预计10-15分钟内就能看到系统运行。

**现在就行动！** 


**时间**: 现在立即执行
**预计耗时**: 10-15分钟启动 + 15分钟快速测试 = 30分钟

---

##  前置检查

### 检查1: Node.js环境
```bash
node -v
npm -v
```

**必须看到**: 
- Node.js v16+ 
- npm 8+

### 检查2: MySQL
```bash
# 确保MySQL已启动
# Windows: 任务管理器查看 MySQL80 或 MariaDB
# 或在CMD运行: mysql -u root
```

---

##  分步启动

### 第一步：安装后端依赖 (3-5分钟)

**打开 Power Shell 并执行**:

```bash
cd E:\xincs\xincs\backend
npm install
```

**您会看到**: 
```
npm WARN 
added 150+ packages in 1m
```

 看到这个说明成功了

---

### 第二步：安装前端依赖 (3-5分钟)

**在另一个 Power Shell 中执行**:

```bash
cd E:\xincs\xincs
npm install
```

**您会看到**: 
```
npm WARN
added 300+ packages in 1m
```

 看到这个说明成功了

---

### 第三步：启动后端 API (在第一个 Power Shell 中)

```bash
cd E:\xincs\xincs\backend
npm run dev
```

**期望看到的输出**:
```
 数据库连接成功
 数据库模型同步成功
 美容院管理系统 API 服务已启动
服务器地址: http://localhost:5000
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第四步：启动前端 (在第二个 Power Shell 中)

```bash
cd E:\xincs\xincs
npm run dev
```

**期望看到的输出**:
```
VITE v4.x.x ready in 123ms

 Local:   http://localhost:3000/
 press h to show help
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第五步：打开浏览器

访问: **http://localhost:3000**

**您应该看到**:
- 登录/注册页面
- 蓝色的美容院品牌颜色
- 中文界面

 看到登录页面说明前端启动成功

---

##  快速功能检查 (15分钟)

在浏览器中依次执行以下操作：

### 测试1: 用户注册
```
1. 点击"注册"按钮
2. 填写:
   - 用户名: testuser01
   - 邮箱: test01@example.com
   - 密码: TestPass123!
   - 确认密码: TestPass123!
   - 角色: admin
3. 点击"注册"
```

**期望结果**:
```
 显示"注册成功"提示
 自动进入主页面
 看到用户菜单
```

---

### 测试2: 查看菜单
```
1. 点击"客户管理" → 看到客户列表页面
2. 点击"预约管理" → 看到预约列表页面
3. 点击"美容师" → 看到美容师列表页面
4. 点击"产品" → 看到产品列表页面
5. 点击"AI助手" → 看到AI助手页面
```

**期望结果**:
```
 所有菜单都能点击
 页面都能加载
 没有错误信息
```

---

### 测试3: 创建数据
```
1. 进入"客户管理"
2. 点击"新增客户"
3. 填写:
   - 姓名: 张三
   - 电话: 13800138000
   - 邮箱: zhangsan@example.com
4. 点击"保存"
```

**期望结果**:
```
 显示"创建成功"
 客户出现在列表中
 可以编辑和删除
```

---

### 测试4: 检查开发者工具

按 `F12` 打开开发者工具，检查：

```
Console标签:
 没有红色错误信息
 可能有黄色警告 (正常)

Network标签:
 请求都返回 200-201 状态码
 没有红色的失败请求

Application标签:
 localStorage中有 "authToken"
 Token以 "eyJ" 开头
```

---

## � 遇到问题？

### Q1: 后端启动失败 - "Error: connect ECONNREFUSED"

**原因**: MySQL未启动或配置错误

**解决**:
```
1. 打开任务管理器
2. 检查是否有 MySQL80 或 MariaDB 进程
3. 没有的话，启动 MySQL 服务
4. 或者手动连接: mysql -u root
5. 重新运行: npm run dev
```

---

### Q2: 前端白屏 - "Cannot GET /"

**原因**: 访问了错误的地址或前端未编译

**解决**:
```
1. 确保URL是 http://localhost:3000 (不是 5000)
2. 检查终端2有没有编译成功
3. 如果还是失败:
   cd E:\xincs\xincs
   npm run build
   npm run dev
4. 再试一次
```

---

### Q3: 注册失败 - "Error: Network error"

**原因**: 后端API未启动或无法连接

**解决**:
```
1. 检查终端1是否显示:
   " 美容院管理系统 API 服务已启动"
2. 打开 http://localhost:5000/health
3. 看是否返回 {"success":true,"message":"服务器正常运行"}
4. 如果不行，重新启动后端
```

---

### Q4: 依赖安装失败

**原因**: npm缓存问题或网络问题

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules
rm -r node_modules package-lock.json

# 重新安装
npm install

# 再试一次
npm run dev
```

---

##  成功标志

###  一切正常
-  后端启动，显示"API 服务已启动"
-  前端启动，显示"ready in Xms"
-  浏览器显示登录页面
-  能成功注册账户
-  能浏览所有菜单
-  能创建客户/预约
-  F12看不到红色错误

###  有小问题但可接受
- ️ 页面加载有点慢
- ️ 有一两个警告信息
- ️ 某个功能需要刷新才能显示

###  有严重问题
-  无法启动任何服务
-  无法进入任何页面
-  大量JavaScript错误
-  注册/登录完全失败

---

##  接下来

### 如果一切正常 

参考: `COMPLETE_TESTING_GUIDE.md`

执行完整的24个测试用例，记录结果到 `TEST_EXECUTION_REPORT.md`

---

### 如果有问题 ️

1. 记录具体错误信息
2. 查看上面的"遇到问题"部分
3. 尝试解决方案
4. 如果还是不行，查看 `QUICK_TEST_START.md` 的常见问题

---

##  快速参考

| 命令 | 作用 | 位置 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 后端/前端 |
| `npm run build` | 构建生产版本 | 前端 |
| `http://localhost:3000` | 前端地址 | 浏览器 |
| `http://localhost:5000` | 后端API地址 | 浏览器 |
| `F12` | 打开开发者工具 | 浏览器 |

---

##  现在就开始！

### 三个步骤启动全系统

**第1步 - 终端1**:
```bash
cd E:\xincs\xincs\backend
npm install
npm run dev
```

**第2步 - 终端2**:
```bash
cd E:\xincs\xincs
npm install
npm run dev
```

**第3步 - 浏览器**:
```
http://localhost:3000
```

---

### 就这么简单！

预计10-15分钟内就能看到系统运行。

**现在就行动！** 


**时间**: 现在立即执行
**预计耗时**: 10-15分钟启动 + 15分钟快速测试 = 30分钟

---

##  前置检查

### 检查1: Node.js环境
```bash
node -v
npm -v
```

**必须看到**: 
- Node.js v16+ 
- npm 8+

### 检查2: MySQL
```bash
# 确保MySQL已启动
# Windows: 任务管理器查看 MySQL80 或 MariaDB
# 或在CMD运行: mysql -u root
```

---

##  分步启动

### 第一步：安装后端依赖 (3-5分钟)

**打开 Power Shell 并执行**:

```bash
cd E:\xincs\xincs\backend
npm install
```

**您会看到**: 
```
npm WARN 
added 150+ packages in 1m
```

 看到这个说明成功了

---

### 第二步：安装前端依赖 (3-5分钟)

**在另一个 Power Shell 中执行**:

```bash
cd E:\xincs\xincs
npm install
```

**您会看到**: 
```
npm WARN
added 300+ packages in 1m
```

 看到这个说明成功了

---

### 第三步：启动后端 API (在第一个 Power Shell 中)

```bash
cd E:\xincs\xincs\backend
npm run dev
```

**期望看到的输出**:
```
 数据库连接成功
 数据库模型同步成功
 美容院管理系统 API 服务已启动
服务器地址: http://localhost:5000
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第四步：启动前端 (在第二个 Power Shell 中)

```bash
cd E:\xincs\xincs
npm run dev
```

**期望看到的输出**:
```
VITE v4.x.x ready in 123ms

 Local:   http://localhost:3000/
 press h to show help
```

️ **重要**: 保持这个终端打开，不要关闭

---

### 第五步：打开浏览器

访问: **http://localhost:3000**

**您应该看到**:
- 登录/注册页面
- 蓝色的美容院品牌颜色
- 中文界面

 看到登录页面说明前端启动成功

---

##  快速功能检查 (15分钟)

在浏览器中依次执行以下操作：

### 测试1: 用户注册
```
1. 点击"注册"按钮
2. 填写:
   - 用户名: testuser01
   - 邮箱: test01@example.com
   - 密码: TestPass123!
   - 确认密码: TestPass123!
   - 角色: admin
3. 点击"注册"
```

**期望结果**:
```
 显示"注册成功"提示
 自动进入主页面
 看到用户菜单
```

---

### 测试2: 查看菜单
```
1. 点击"客户管理" → 看到客户列表页面
2. 点击"预约管理" → 看到预约列表页面
3. 点击"美容师" → 看到美容师列表页面
4. 点击"产品" → 看到产品列表页面
5. 点击"AI助手" → 看到AI助手页面
```

**期望结果**:
```
 所有菜单都能点击
 页面都能加载
 没有错误信息
```

---

### 测试3: 创建数据
```
1. 进入"客户管理"
2. 点击"新增客户"
3. 填写:
   - 姓名: 张三
   - 电话: 13800138000
   - 邮箱: zhangsan@example.com
4. 点击"保存"
```

**期望结果**:
```
 显示"创建成功"
 客户出现在列表中
 可以编辑和删除
```

---

### 测试4: 检查开发者工具

按 `F12` 打开开发者工具，检查：

```
Console标签:
 没有红色错误信息
 可能有黄色警告 (正常)

Network标签:
 请求都返回 200-201 状态码
 没有红色的失败请求

Application标签:
 localStorage中有 "authToken"
 Token以 "eyJ" 开头
```

---

## � 遇到问题？

### Q1: 后端启动失败 - "Error: connect ECONNREFUSED"

**原因**: MySQL未启动或配置错误

**解决**:
```
1. 打开任务管理器
2. 检查是否有 MySQL80 或 MariaDB 进程
3. 没有的话，启动 MySQL 服务
4. 或者手动连接: mysql -u root
5. 重新运行: npm run dev
```

---

### Q2: 前端白屏 - "Cannot GET /"

**原因**: 访问了错误的地址或前端未编译

**解决**:
```
1. 确保URL是 http://localhost:3000 (不是 5000)
2. 检查终端2有没有编译成功
3. 如果还是失败:
   cd E:\xincs\xincs
   npm run build
   npm run dev
4. 再试一次
```

---

### Q3: 注册失败 - "Error: Network error"

**原因**: 后端API未启动或无法连接

**解决**:
```
1. 检查终端1是否显示:
   " 美容院管理系统 API 服务已启动"
2. 打开 http://localhost:5000/health
3. 看是否返回 {"success":true,"message":"服务器正常运行"}
4. 如果不行，重新启动后端
```

---

### Q4: 依赖安装失败

**原因**: npm缓存问题或网络问题

**解决**:
```bash
# 清除缓存
npm cache clean --force

# 删除node_modules
rm -r node_modules package-lock.json

# 重新安装
npm install

# 再试一次
npm run dev
```

---

##  成功标志

###  一切正常
-  后端启动，显示"API 服务已启动"
-  前端启动，显示"ready in Xms"
-  浏览器显示登录页面
-  能成功注册账户
-  能浏览所有菜单
-  能创建客户/预约
-  F12看不到红色错误

###  有小问题但可接受
- ️ 页面加载有点慢
- ️ 有一两个警告信息
- ️ 某个功能需要刷新才能显示

###  有严重问题
-  无法启动任何服务
-  无法进入任何页面
-  大量JavaScript错误
-  注册/登录完全失败

---

##  接下来

### 如果一切正常 

参考: `COMPLETE_TESTING_GUIDE.md`

执行完整的24个测试用例，记录结果到 `TEST_EXECUTION_REPORT.md`

---

### 如果有问题 ️

1. 记录具体错误信息
2. 查看上面的"遇到问题"部分
3. 尝试解决方案
4. 如果还是不行，查看 `QUICK_TEST_START.md` 的常见问题

---

##  快速参考

| 命令 | 作用 | 位置 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 后端/前端 |
| `npm run build` | 构建生产版本 | 前端 |
| `http://localhost:3000` | 前端地址 | 浏览器 |
| `http://localhost:5000` | 后端API地址 | 浏览器 |
| `F12` | 打开开发者工具 | 浏览器 |

---

##  现在就开始！

### 三个步骤启动全系统

**第1步 - 终端1**:
```bash
cd E:\xincs\xincs\backend
npm install
npm run dev
```

**第2步 - 终端2**:
```bash
cd E:\xincs\xincs
npm install
npm run dev
```

**第3步 - 浏览器**:
```
http://localhost:3000
```

---

### 就这么简单！

预计10-15分钟内就能看到系统运行。

**现在就行动！** 







