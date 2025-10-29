# 🔑 API 配置快速指南

**目的**: 配置真实的 RunningHub API 集成  
**耗时**: 5 分钟  
**难度**: ⭐ 简单

---

## 📋 步骤 1：获取 API 密钥

### 访问 RunningHub 控制台

1. 打开浏览器
2. 访问: https://www.runninghub.cn/console/api-keys
3. 登录您的账户
4. 点击"创建新密钥"
5. 复制生成的 API 密钥

### 你会得到
```
API Key: sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
App ID: app_xxxxxxxxxxxxx
```

---

## 📝 步骤 2：创建环境文件

### 在项目根目录创建 `.env.local` 文件

```bash
E:\xincs\xincs\.env.local
```

### 文件内容

```env
# RunningHub API 配置
REACT_APP_RUNNINGHUB_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_RUNNINGHUB_APP_ID=app_xxxxxxxxxxxxx
REACT_APP_RUNNINGHUB_TIMEOUT=10000
REACT_APP_RUNNINGHUB_FALLBACK=true
```

⚠️ **重要**: 
- 永远不要将 `.env.local` 提交到 Git
- 已在 `.gitignore` 中（通常）

---

## 🧪 步骤 3：验证配置

### 方法 1：检查浏览器控制台

1. 打开应用
2. 打开浏览器开发者工具 (F12)
3. 进入 "AI 助手中心" → "营销助手"
4. 在"AI 海报制作"中输入内容
5. 点击"生成"
6. 查看控制台输出

**成功的输出**:
```
🔄 调用 RunningHub API... {
  endpoint: 'https://www.runninghub.cn/task/openapi/ai-app/run',
  payload: {...}
}

📨 API 响应: {
  status: 200,
  code: 0,
  dataLength: 1234
}

✅ API 调用成功 {
  duration: 3500,
  dataSize: 5678
}
```

### 方法 2：检查应用显示

在海报预览区域查看：
- ✅ 显示海报图片 → API 成功
- ❌ 显示错误信息 → API 失败

---

## 🔍 步骤 4：测试不同场景

### 测试 1：促销海报

**输入**:
```
春季护肤特价
全场五折优惠
新客户专享
```

**预期结果**: ✅ 生成彩色促销海报

### 测试 2：产品海报

**输入**:
```
新品上市
高级护肤精油
专业美容师推荐
```

**预期结果**: ✅ 生成产品展示海报

### 测试 3：护肤海报

**输入**:
```
护肤方案
定制化护理
专属美容师服务
```

**预期结果**: ✅ 生成护肤服务海报

---

## ⚠️ 常见问题

### Q1: 我没有 RunningHub 账户怎么办？

**A**: 
1. 访问 https://www.runninghub.cn/register
2. 注册新账户
3. 申请 API 密钥
4. 通常需要 1-2 小时审核

### Q2: 如何获得 API 密钥？

**A**:
1. 登录 RunningHub 控制台
2. 左侧菜单 → API 管理
3. 点击"生成密钥"
4. 选择权限范围
5. 复制密钥

### Q3: 密钥泄露了怎么办？

**A**:
1. 立即在控制台删除该密钥
2. 生成新密钥
3. 更新 `.env.local`
4. 重启应用

### Q4: API 返回 401 错误？

**A**:
- ✅ 检查密钥是否正确复制
- ✅ 检查是否有多余的空格
- ✅ 确认 `.env.local` 被正确加载
- ✅ 重启开发服务器

### Q5: 如何检查 API 状态？

**A**: 
在浏览器控制台运行:
```javascript
// 检查 API 可用性
posterGenerationAPIService.getAPIStatus().then(status => {
  console.log('API 状态:', status);
});
```

---

## 🔐 安全提示

### ✅ 安全做法

- 使用 `.env.local` 存储敏感信息
- 不要在代码中硬编码密钥
- 定期轮换 API 密钥
- 使用有效期限制密钥

### ❌ 不安全做法

```javascript
// ❌ 错误：硬编码密钥
const apiKey = 'sk-xxxxxxxxxxxxx';

// ✅ 正确：使用环境变量
const apiKey = process.env.REACT_APP_RUNNINGHUB_API_KEY;
```

---

## 🚀 验证成功

### 完整检查清单

- [ ] `.env.local` 文件已创建
- [ ] API 密钥已正确配置
- [ ] 应用已重启
- [ ] 生成了至少 3 张海报
- [ ] 控制台显示成功日志
- [ ] 海报预览正常显示
- [ ] 没有 401/403 错误

**全部✅？恭喜！你已成功配置 API！**

---

## 📊 配置验证脚本

### 在浏览器控制台运行

```javascript
// 1. 检查环境变量
console.log('API Key:', process.env.REACT_APP_RUNNINGHUB_API_KEY ? '已设置' : '未设置');
console.log('App ID:', process.env.REACT_APP_RUNNINGHUB_APP_ID || '默认值');

// 2. 检查服务可用性
const service = window.posterGenerationAPIService;
if (service) {
  console.log('✅ 服务已加载');
  
  // 3. 检查 API 状态
  service.getAPIStatus().then(status => {
    console.log('API 状态:', status);
  });
} else {
  console.log('❌ 服务未加载');
}
```

---

## 💬 获取帮助

### 如果遇到问题

1. **查看控制台日志** - 通常会有详细的错误信息
2. **检查 API 状态** - 确认 RunningHub 服务在线
3. **验证网络连接** - 确保能访问外网
4. **查看文档** - `RUNNINGHUB_API_REAL_INTEGRATION.md`
5. **联系支持** - support@runninghub.cn

---

## 📞 快速参考

| 项目 | 值 |
|------|-----|
| **API 端点** | https://www.runninghub.cn/task/openapi/ai-app/run |
| **请求方法** | POST |
| **内容类型** | application/json |
| **超时时间** | 10 秒 |
| **模型** | DALL-E 3 |

---

**现在开始配置，5 分钟完成！** ⏱️

**配置完成后，你就拥有真实的 AI 海报生成能力！** 🎨✨
