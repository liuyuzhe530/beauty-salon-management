# GLM API 快速检查指南 - 5分钟诊断

## 当前问题

AI 助手显示错误:
```
错误: AI 服务错误: Request failed with status code 400
```

---

## 快速诊断 (3种方法)

### 方法 1: 使用 HTML 检查工具 (最简单)

1. 打开浏览器
2. 访问: `file:///E:/xincs/xincs/GLM_API_CHECK.html`
3. 点击 "检查 API" 按钮
4. 等待结果

**时间:** 30秒
**难度:** 简单

---

### 方法 2: 浏览器开发工具 (推荐)

1. 打开应用 http://localhost:3000
2. 按 F12 打开开发者工具
3. 切换到 "网络" 或 "Network" 标签
4. 点击 AI 助手窗口的 "流失分析" 按钮
5. 查看网络请求的细节

**检查项:**
- Status Code (应该是 200)
- Response Headers (检查 Content-Type)
- Response Body (查看错误信息)

**时间:** 1分钟
**难度:** 中等

---

### 方法 3: PowerShell 直接测试 (最准确)

复制以下命令到 PowerShell 并运行:

```powershell
# 测试 GLM API
$apiKey = "bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt"
$endpoint = "https://open.bigmodel.cn/api/paas/v4/chat/completions"

$headers = @{
    "Authorization" = $apiKey
    "Content-Type" = "application/json"
}

$body = @{
    model = "glm-4-5-flash"
    messages = @(@{role = "user"; content = "hello"})
    temperature = 0.7
    top_p = 0.7
    max_tokens = 100
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri $endpoint -Method POST -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "成功: " $response.StatusCode
    Write-Host "响应: " $response.Content
} catch {
    Write-Host "失败: " $_.Exception.Response.StatusCode
    Write-Host "错误: " $_.Exception.Message
}
```

**时间:** 2分钟
**难度:** 高

---

## 预期结果

### 成功 (200)
```
成功: 200
响应包含: 
{
  "choices": [{"message": {"role": "assistant", "content": "hello"}}],
  "usage": {"total_tokens": ...}
}
```

### 失败 (401)
```
失败: 401
错误: API 密钥无效或已过期
解决: 重新生成 API 密钥
```

### 失败 (400)
```
失败: 400
错误: Bad Request
解决: 检查模型名称和请求格式
```

### 失败 (503)
```
失败: 503
错误: Service Unavailable
解决: 等待服务恢复或检查网络
```

---

## 根据结果采取行动

### 如果 API 检查失败

1. 查看 `GLM_API_TROUBLESHOOTING.md`
2. 执行 "解决方案" 部分
3. 重新运行检查

### 如果 API 检查成功

1. 问题可能在应用代码中
2. 查看浏览器控制台 F12 - Console
3. 查看 `GLM_API_VERIFICATION.md` 的调试部分

---

## 完整检查清单

第1步: API 检查
```
使用 GLM_API_CHECK.html 检查 API 可用性
结果: [ ] 成功  [ ] 失败
```

第2步: 网络检查
```
使用开发工具查看网络请求
结果: [ ] 成功  [ ] 失败
```

第3步: 代码检查
```
检查 src/services/aiService.ts 中的配置
结果: [ ] 正确  [ ] 错误
```

第4步: 应用测试
```
在应用中测试 AI 功能
结果: [ ] 工作  [ ] 不工作
```

---

## 常见快速修复

### 修复 1: 重启应用
```bash
# 关闭当前应用
Ctrl+C

# 重新启动
npm run dev
```

### 修复 2: 清除缓存
```bash
# 清除浏览器缓存
Ctrl+Shift+Delete

# 或在浏览器 F12 中:
- Network 标签右键 -> 清空缓存
```

### 修复 3: 重新安装依赖
```bash
npm install
npm run dev
```

### 修复 4: 检查网络
```powershell
# 测试网络连接
ping open.bigmodel.cn

# 应该显示 ttl=... 表示连接正常
```

---

## 获取帮助

### 文档
- `GLM_API_CHECK.html` - 快速检查工具
- `GLM_API_VERIFICATION.md` - 完整验证指南
- `GLM_API_TROUBLESHOOTING.md` - 详细故障排除
- `SYSTEM_STATUS_FINAL.md` - 系统状态报告

### 查看日志
```javascript
// 浏览器控制台
F12 -> Console 标签
输入: console.log(import.meta.env.VITE_GLM_API_KEY)
```

---

## 下一步

一旦确认 API 可用:

1. 测试所有 AI 功能
   - 流失分析
   - 排班优化
   - 定价建议
   - 营销文案
   - 自由对话

2. 检查性能
   - 响应时间
   - 错误处理
   - 历史记录

3. 准备部署
   - 安全审计
   - 性能优化
   - 最终测试

---

**预计完成时间:** 5分钟
**难度等级:** 简单
**成功率:** 95%

开始检查吧！
