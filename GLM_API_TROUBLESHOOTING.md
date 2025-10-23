# GLM API 问题诊断与修复

## 问题现象

```
AI 服务错误: Request failed with status code 400
```

## 原因分析

HTTP 400 错误通常有以下几个原因：

### 1. API Key 无效或过期
```
症状：即使 API Key 正确也返回 400
原因：API Key 可能已过期或被禁用
```

### 2. 请求格式不正确
```
症状：API 无法解析请求
原因：JSON 格式错误或字段不匹配
```

### 3. 认证方式错误
```
症状：认证信息被拒绝
原因：授权头格式不对
```

### 4. 模型名称错误
```
症状：模型不存在
原因：glm-4-5-flash 模型标识错误
```

---

## 快速诊断步骤

### 步骤 1: 验证 API Key

```bash
# 检查 API Key 是否正确设置
# 在浏览器控制台运行：
console.log(import.meta.env.VITE_GLM_API_KEY)

# 应该返回您的 GLM API Key
```

### 步骤 2: 测试 API 连接

使用以下 curl 命令测试：

```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "glm-4-5-flash",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "top_p": 0.7
  }'
```

### 步骤 3: 检查响应

如果返回 400，可能的错误信息：

```json
{
  "error": {
    "code": "INVALID_REQUEST_BODY",
    "message": "Request body is invalid"
  }
}
```

---

## 解决方案

### 方案 A: 重新生成 API Key

1. 访问 https://open.bigmodel.cn (Zhipu AI 官网)
2. 登录您的账户
3. 进入 "API Keys" 页面
4. 删除旧的 Key
5. 生成新的 Key
6. 更新项目中的 Key

### 方案 B: 更新环境变量

创建或修改 `.env` 文件：

```
VITE_GLM_API_KEY=your_new_api_key_here
```

然后重启开发服务器：

```bash
npm run dev
```

### 方案 C: 检查 API 端点

确保使用正确的端点：

```
https://open.bigmodel.cn/api/paas/v4/chat/completions
```

### 方案 D: 验证模型名称

支持的模型列表：
- `glm-4-5-flash` (推荐，免费)
- `glm-4-5-air`
- `glm-4`

---

## 完整修复流程

### 如果以上方案都不管用：

1. 清除浏览器缓存：
   ```bash
   # Windows
   清除 AppData\Local\Temp 中的缓存
   
   # Mac/Linux
   rm -rf ~/.cache/*
   ```

2. 清除 npm 缓存：
   ```bash
   npm cache clean --force
   ```

3. 重新安装依赖：
   ```bash
   npm install
   ```

4. 重新启动开发服务器：
   ```bash
   npm run dev
   ```

---

## 成功标志

当修复成功时，您会看到：

```
AI 助手已就绪
由 GLM-4.5-Flash 提供支持
```

点击快速操作按钮时，应该看到：
- 流失分析
- 排班优化
- 定价建议
- 营销文案

---

## 常见问题

### Q: 如何确保 API Key 是正确的？
A: 在 https://open.bigmodel.cn 登录后，查看您的 API Key 是否与代码中的一致。

### Q: glm-4-5-flash 完全免费吗？
A: 是的，新账户有免费额度。具体请查看官网。

### Q: 如何切换其他模型？
A: 编辑 `src/services/aiService.ts`，将 `const GLM_MODEL = 'glm-4-5-flash'` 改为其他支持的模型名。

### Q: 为什么去掉了 emoji？
A: 某些系统环境下 emoji 可能导致编码问题，移除 emoji 可以提高兼容性。

---

## 需要帮助？

如果问题仍未解决，请检查：

1. 浏览器控制台的错误信息
2. 网络连接状态
3. API Key 的有效期
4. 防火墙/代理设置

---

## 更新日志

- 2024-10-23: 移除所有 emoji，修复认证头格式
- 2024-10-23: 更新为 glm-4-5-flash 免费版本
- 2024-10-23: 创建本诊断指南
