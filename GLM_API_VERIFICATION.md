# GLM API 验证与诊断指南

日期: 2024-10-23
状态: 进行中

---

## 当前配置

| 项目 | 值 |
|-----|---|
| 模型 | glm-4-5-flash |
| 端点 | https://open.bigmodel.cn/api/paas/v4/chat/completions |
| API 密钥 | bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt |
| 认证方式 | Authorization: API_KEY |

---

## 错误现象

用户界面显示:
```
错误: AI 服务错误: Request failed with status code 400
```

---

## 检查步骤

### 步骤 1: 直接测试 API

使用 PowerShell 测试 API 连接:

```powershell
# 测试 API 连接
$apiKey = "bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt"
$model = "glm-4-5-flash"
$endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

$headers = @{
    "Authorization" = $apiKey
    "Content-Type" = "application/json"
}

$body = @{
    model = $model
    messages = @(
        @{
            role = "user"
            content = "你好"
        }
    )
    temperature = 0.7
    top_p = 0.7
    max_tokens = 100
} | ConvertTo-Json

Invoke-WebRequest -Uri $endpoint -Method POST -Headers $headers -Body $body
```

### 步骤 2: 使用检查工具

打开浏览器打开文件:
```
file:///E:/xincs/xincs/GLM_API_CHECK.html
```

点击 "检查 API" 按钮进行快速测试。

### 步骤 3: 查看浏览器控制台

1. 打开浏览器开发者工具 (F12)
2. 切换到 "控制台" 标签
3. 打开 AI 助手并发送消息
4. 查看网络请求和错误信息

---

## 可能的问题及解决方案

### 问题 1: 401 未授权错误

症状:
```
错误代码: 401
错误信息: Unauthorized
```

原因:
- API 密钥无效
- API 密钥已过期
- API 密钥格式错误

解决方案:
```
1. 访问 https://open.bigmodel.cn
2. 登录您的账户
3. 进入 API Keys 页面
4. 检查密钥是否有效
5. 复制新密钥
6. 更新项目中的密钥
```

### 问题 2: 400 请求错误

症状:
```
错误代码: 400
错误信息: Bad Request
```

原因:
- 请求体格式错误
- 模型名称不存在
- 参数值无效

解决方案:
```
1. 检查模型名称是否正确:
   - glm-4-5-flash (免费)
   - glm-4-5-air
   - glm-4
   
2. 验证请求参数:
   - model: 模型名称
   - messages: 消息数组
   - temperature: 0.7
   - top_p: 0.7
   - max_tokens: 1000
```

### 问题 3: 429 速率限制

症状:
```
错误代码: 429
错误信息: Too Many Requests
```

原因:
- 请求过于频繁
- 超过了免费额度限制

解决方案:
```
1. 等待一段时间后重试
2. 检查免费额度是否已用尽
3. 升级账户或购买付费计划
```

### 问题 4: 503 服务不可用

症状:
```
错误代码: 503
错误信息: Service Unavailable
```

原因:
- API 服务器维护中
- 服务器过载
- 网络连接问题

解决方案:
```
1. 检查网络连接
2. 访问 https://open.bigmodel.cn 检查服务状态
3. 稍后重试
```

---

## 完整检查清单

### 环境检查
- [ ] 网络连接正常
- [ ] 能访问 open.bigmodel.cn
- [ ] 防火墙未阻止
- [ ] 代理设置正确

### 配置检查
- [ ] API 密钥正确
- [ ] 模型名称正确
- [ ] 端点 URL 正确
- [ ] 认证头格式正确

### 代码检查
- [ ] aiService.ts 中的配置正确
- [ ] 认证头没有 "Bearer" 前缀
- [ ] 请求体格式正确
- [ ] 没有拼写错误

### 功能检查
- [ ] 简单问题能得到回复
- [ ] 复杂问题能正常处理
- [ ] 错误消息清晰
- [ ] 历史记录保存正确

---

## 快速诊断命令

### 测试网络连接
```bash
ping open.bigmodel.cn
```

### 测试 API 端点
```bash
curl -X POST https://open.bigmodel.cn/api/paas/v4/chat/completions \
  -H "Authorization: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model":"glm-4-5-flash","messages":[{"role":"user","content":"hi"}]}'
```

### 检查环境变量
```bash
echo $env:VITE_GLM_API_KEY
```

---

## 验证步骤

### 第一步: 验证 API 密钥

```javascript
// 在浏览器控制台运行:
console.log(import.meta.env.VITE_GLM_API_KEY)
```

应该显示:
```
bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt
```

### 第二步: 验证请求格式

打开浏览器的 Network 标签，查看请求:

请求头应该包含:
```
Authorization: bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt
Content-Type: application/json
```

请求体应该是:
```json
{
  "model": "glm-4-5-flash",
  "messages": [
    {
      "role": "user",
      "content": "用户消息"
    }
  ],
  "temperature": 0.7,
  "top_p": 0.7,
  "max_tokens": 1000
}
```

### 第三步: 验证响应

成功的响应应该是:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "AI 回复"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 10,
    "completion_tokens": 20,
    "total_tokens": 30
  }
}
```

---

## 成功标志

当一切正常时，您应该看到:

1. 浏览器显示无错误
2. AI 助手窗口显示欢迎消息
3. 输入框可以接收输入
4. 提交后有加载动画
5. 收到 AI 的回复

---

## 调试技巧

### 启用详细日志

编辑 `src/services/aiService.ts`:

```typescript
// 在 chat 方法中添加日志
console.log('发送请求:', {
  endpoint: GLM_ENDPOINT,
  model: GLM_MODEL,
  messagesCount: this.conversationHistory.length
});

// 在 catch 中添加日志
console.error('完整错误对象:', error);
console.error('响应状态:', error.response?.status);
console.error('响应数据:', error.response?.data);
```

### 使用浏览器开发工具

1. 打开 F12
2. 进入 Network 标签
3. 筛选 "fetch/XHR"
4. 查看请求和响应

### 检查控制台错误

在浏览器控制台查看:
```
- 网络错误
- CORS 错误
- 解析错误
- 其他 JavaScript 错误
```

---

## 成功验证流程

1. 打开应用 (http://localhost:3000)
2. 点击 "AI 助手" 按钮
3. 看到欢迎消息
4. 输入 "测试"
5. 应该收到 AI 的回复
6. 检查浏览器控制台没有错误

---

## 后续步骤

一旦 API 验证成功:

1. 测试所有 AI 功能
2. 进行性能测试
3. 检查错误处理
4. 验证用户体验
5. 准备部署

---

**检查日期:** 2024-10-23
**状态:** 待验证
**下一步:** 运行检查工具并提供结果
