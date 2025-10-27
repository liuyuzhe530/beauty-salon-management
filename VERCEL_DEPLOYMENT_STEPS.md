# 🚀 Vercel 部署步骤 - 详细指南

**目标：** 将项目部署到 Vercel 获得公开 URL  
**预计时间：** 30 分钟  
**难度：** 简单

---

## ✅ 前置条件检查

在开始部署前，请确保：

```
✓ 代码已推送到 GitHub
  └─ Repository: https://github.com/liuyuzhe530/beauty-salon-management
  └─ Branch: main

✓ GitHub 账户已创建
  └─ 访问 https://github.com

✓ 有效的邮箱地址
  └─ 用于 Vercel 账户
```

---

## 📋 第一步：访问 Vercel

### 打开 Vercel 官网
```
1. 在浏览器中打开：https://vercel.com
2. 应该看到 Vercel 首页
3. 右上角有"Sign Up"或"Log In"按钮
```

**首页应该显示：**
- Vercel Logo（黑白相间）
- "Sign Up" 或 "Dashboard" 按钮
- "Deploy Now" 的宣传内容

---

## 📋 第二步：登录或注册账户

### 选项 A：如果您已有 Vercel 账户
```
1. 点击右上角"Log In"
2. 输入邮箱和密码
3. 完成登录
→ 直接跳转到仪表板
```

### 选项 B：如果您是新用户
```
1. 点击"Sign Up"
2. 选择"Continue with GitHub"（推荐）
3. 授权 Vercel 访问您的 GitHub
4. 完成账户创建
→ 自动登录并进入仪表板
```

**推荐用 GitHub 登录：**
- ✅ 更快更简便
- ✅ 自动关联 GitHub 账户
- ✅ 无需记住额外密码

---

## 📋 第三步：导入项目

### 进入项目导入界面

**在 Vercel 仪表板中：**
```
1. 点击右上角"Add New" 按钮
2. 选择"Project"（项目）
3. 看到"Import Git Repository"选项
```

### 搜索 GitHub 项目

**在导入界面：**
```
1. 在搜索框中输入：beauty-salon-management
2. 或输入完整 URL：github.com/liuyuzhe530/beauty-salon-management
3. 点击搜索结果中的项目
```

**确认项目信息：**
```
Project Name: beauty-salon-management
Repository: liuyuzhe530/beauty-salon-management
Owner: Your GitHub Account
```

---

## 📋 第四步：配置构建设置

### Vercel 应该自动检测配置

**预期看到的配置：**
```
Framework: Vite ✓
Root Directory: ./ (或 .) ✓
Build Command: npm run build ✓
Output Directory: dist ✓
Install Command: npm install ✓
```

**如果没有自动检测，手动设置：**

```
1. Framework Preset
   → 选择：Vite
   
2. Root Directory
   → 保留默认：./
   
3. Build Command
   → 输入：npm run build
   
4. Output Directory
   → 输入：dist
```

### 环境变量（可选）

如果需要配置环境变量（现在不需要）：
```
点击"Environment Variables"按钮添加
例如：
  - 名称：VITE_API_KEY
  - 值：your-api-key-here
```

**本项目不需要环境变量，可以跳过此步。**

---

## 📋 第五步：部署项目

### 点击 Deploy 按钮

**在配置确认后：**
```
1. 检查所有设置无误
2. 点击大的"Deploy"按钮
3. 等待部署开始
```

### 监控部署进度

**部署过程会显示：**
```
[1/4] 正在初始化...
[2/4] 正在安装依赖...
[3/4] 正在构建...
[4/4] 正在优化...
```

**预期时间：**
```
安装依赖：1-2 分钟
构建项目：1-2 分钟
部署：30 秒
总计：2-5 分钟
```

### 部署成功标志

**看到以下画面表示成功：**
```
✅ Deployment successful!
🎉 Congratulations!

Your project is now live at:
https://beauty-salon-management.vercel.app
```

---

## ✅ 第六步：获取公开 URL

### 部署完成后

**您会看到：**
```
┌─────────────────────────────────────┐
│ Deployment Complete                 │
│                                     │
│ Visit your project:                 │
│ https://beauty-salon-...-xxx.app   │
│                                     │
│ [Copy URL] [Visit]                  │
└─────────────────────────────────────┘
```

### 复制项目 URL

**可能的格式：**
```
https://beauty-salon-management-xxxxx.vercel.app
（xxxxx 是自动生成的后缀）

或

https://beauty-salon-management.vercel.app
（如果您关联了自定义域名）
```

**复制这个 URL 很重要！**

---

## 🧪 第七步：测试部署

### 打开您的项目 URL

```
1. 点击部署完成页面的"Visit"按钮
   或
2. 复制 URL 粘贴到浏览器地址栏
3. 按 Enter 打开
```

### 验证项目正常运行

**应该看到：**
```
✓ 系统首页加载
✓ 底部导航显示
✓ 可以进入商城装修
✓ 编辑器功能正常
✓ 预览功能正常
```

### 快速功能检查

```
1. 进入商城装修
   → 看到"🎨 小程序店铺装修"

2. 添加一个组件
   → 看到成功提示

3. 编辑组件配置
   → 能正常编辑

4. 预览效果
   → 预览模式正常工作
```

**✅ 如果所有项都正常 = 部署成功！**

---

## 📊 Vercel 仪表板功能

### 部署后在 Vercel 中

**访问您的项目主页：**
```
https://vercel.com/dashboard
```

**可以看到：**
```
项目列表
└─ beauty-salon-management
   ├─ Production URL: https://xxx.vercel.app
   ├─ Latest Deployment: Success ✓
   ├─ Deployments 历史
   ├─ Settings 设置
   └─ Analytics 分析
```

### 主要功能

| 功能 | 说明 |
|------|------|
| Deployments | 查看所有部署历史 |
| Settings | 配置项目设置 |
| Domains | 绑定自定义域名 |
| Integrations | 连接其他服务 |
| Analytics | 查看访问统计 |

---

## 🔄 重新部署

### 自动重新部署

**当您推送代码到 GitHub 时：**
```
1. Vercel 自动检测到新的推送
2. 自动触发新的部署
3. 几分钟后项目更新
4. 无需手动干预
```

### 手动重新部署

**如果需要手动部署：**
```
1. 在 Vercel 仪表板中找到项目
2. 点击"Deployments"标签
3. 找到最新的部署
4. 点击"Redeploy"按钮
5. 选择"Redeploy"确认
```

---

## 🌐 自定义域名（可选）

### 绑定自定义域名

**如果您有自己的域名：**
```
1. 在项目设置中进入"Domains"
2. 点击"Add"添加新域名
3. 输入您的域名（例如：mall.mycompany.com）
4. 按照说明配置 DNS
5. 等待 DNS 生效（通常需要 24-48 小时）
```

**本项目暂时使用 Vercel 提供的免费 URL，不需要配置自定义域名。**

---

## 🚨 部署问题排查

### 问题 1：构建失败

**症状：**
```
Build failed: Cannot find module...
或
npm ERR! ...
```

**解决方案：**
```
1. 检查本地代码是否有错误
2. 运行 npm run build 本地测试
3. 查看错误信息
4. 修复代码错误
5. 推送到 GitHub
6. Vercel 会自动重新部署
```

### 问题 2：页面加载失败

**症状：**
```
Deployment successful 但打开页面显示空白或错误
```

**解决方案：**
```
1. 打开浏览器开发者工具（F12）
2. 查看 Console 标签中的错误
3. 查看 Network 标签中的请求
4. 检查 dist 文件夹是否存在
5. 检查构建命令是否正确
```

### 问题 3：部署卡住

**症状：**
```
部署进度停留在某个阶段，不继续
```

**解决方案：**
```
1. 等待 10-15 分钟
2. 如果仍未完成，点击"Cancel"取消
3. 点击"Redeploy"重新部署
4. 检查 GitHub 是否有新的推送
```

### 问题 4：环境变量问题

**症状：**
```
API 不工作或配置未读取
```

**解决方案：**
```
1. 检查环境变量是否已设置
2. 检查变量名称是否正确
3. 重新部署以使环境变量生效
4. 清除浏览器缓存重新加载
```

---

## 📞 获取帮助

### Vercel 文档
```
官方文档：https://vercel.com/docs
部署指南：https://vercel.com/docs/deployments/deployment-overview
Vite 集成：https://vercel.com/docs/frameworks/vite
```

### 常见问题
```
FAQ：https://vercel.com/help
社区论坛：https://github.com/vercel/vercel/discussions
```

---

## 📊 部署完成清单

部署完成后，请检查以下项目：

```
部署阶段
□ 创建 Vercel 账户
□ 关联 GitHub 项目
□ 配置构建设置
□ 点击 Deploy 按钮
□ 等待部署完成

验证阶段
□ 部署成功信息显示
□ 获得公开 URL
□ 打开 URL 测试加载
□ 进入商城装修功能
□ 测试编辑器功能
□ 测试预览功能

分享阶段
□ 复制项目 URL
□ 发送给团队/客户
□ 演示项目功能
□ 收集反馈
```

---

## 🎉 部署成功！

**当您看到以下情况时，表示部署完全成功：**

```
✅ Deployment completed successfully
✅ 项目 URL 可以访问
✅ 所有功能正常工作
✅ 没有控制台错误
✅ 可以分享给客户
```

### 下一步

```
1. 本地测试完成 ✓
2. 部署到 Vercel 完成 ✓
3. 验证线上功能 ✓
4. 分享给客户/投资者 →

演示内容：
- 打开项目 URL
- 演示商城装修功能
- 演示编辑、预览、模板等功能
- 展示响应式设计（手机/桌面）
```

---

## 📝 常用 Vercel 命令

### 使用 Vercel CLI（可选）

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod

# 查看部署日志
vercel logs
```

**本指南中使用网页界面部署更简单，不需要 CLI。**

---

## ✨ 恭喜！

**您已经完成了整个部署流程！**

```
本地开发 ✓
→ 提交 GitHub ✓
→ 部署到 Vercel ✓
→ 获得公开 URL ✓
→ 可以分享给任何人 ✓
```

**您的项目现在已经在云端运行，可以从世界任何地方访问！** 🌍🚀
