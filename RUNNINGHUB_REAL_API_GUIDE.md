# 🎯 RunningHub 真实 API 调用指南

**官方文档**: https://www.runninghub.cn/runninghub-api-doc-cn/api-279098421  
**API 端点**: `POST /task/openapi/ai-app/run`  
**服务器**: https://www.runninghub.cn

---

## 📌 关键理解

你之前问的"怎么调用这个模版的API"，关键是理解 RunningHub 的**真实 API 格式**。

### ❌ 错误的想法
```
"就是调用一个端点就行了"
```

### ✅ 正确的理解
```
需要指定:
1. webappId - 应用 ID
2. apiKey - API 密钥
3. nodeInfoList - 要修改的字段列表
```

---

## 🔌 真实 API 调用格式

### 请求体结构

```json
{
  "webappId": 1877265245566922753,
  "apiKey": "你的 API 密钥",
  "nodeInfoList": [
    {
      "nodeId": "122",
      "fieldName": "prompt",
      "fieldValue": "你的内容"
    },
    {
      "nodeId": "123",
      "fieldName": "style",
      "fieldValue": "modern"
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| **webappId** | 数字 | RunningHub 应用 ID（找到你的应用 ID） |
| **apiKey** | 字符串 | 你的 API 密钥（从控制台获取） |
| **nodeInfoList** | 数组 | 节点信息列表，定义要修改的字段 |
| **nodeId** | 字符串 | 节点 ID（在应用中定义，例如 "122" 是提示词节点） |
| **fieldName** | 字符串 | 字段名（例如 "prompt"、"style"） |
| **fieldValue** | 字符串/值 | 要设置的值 |

---

## 🎯 如何找到你的 webappId 和 nodeId

### 步骤 1：登录 RunningHub 控制台
```
访问: https://www.runninghub.cn/console
登录你的账户
```

### 步骤 2：找到你的应用
```
左侧菜单 → 我的应用
找到海报生成应用
点击进入应用详情
```

### 步骤 3：获取 webappId 和 nodeId
```
应用详情页中可以看到:
- webappId: 在应用 URL 或信息中
- nodeInfoList: 在"应用配置"或"API 调用示例"中显示

例如:
webappId: 1877265245566922753
nodeId 列表:
  - "122" → prompt (提示词)
  - "123" → style (样式)
```

---

## 💻 代码调用示例

### JavaScript/TypeScript

```typescript
import axios from 'axios';

async function generatePoster(content: string) {
  const payload = {
    webappId: 1877265245566922753,  // 你的应用 ID
    apiKey: 'your_api_key_here',     // 你的 API 密钥
    nodeInfoList: [
      {
        nodeId: "122",
        fieldName: "prompt",
        fieldValue: content  // 用户输入的内容
      },
      {
        nodeId: "123",
        fieldName: "style",
        fieldValue: "modern"
      }
    ]
  };

  try {
    const response = await axios.post(
      'https://www.runninghub.cn/task/openapi/ai-app/run',
      payload,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (response.data.code === 0) {
      console.log('✅ 成功！');
      console.log('任务 ID:', response.data.data.taskId);
      console.log('任务状态:', response.data.data.taskStatus);
      return response.data.data;
    } else {
      console.error('❌ 失败:', response.data.msg);
    }
  } catch (error) {
    console.error('❌ API 调用失败:', error);
  }
}

// 使用
generatePoster('春季护肤特价\n全场五折优惠');
```

### cURL 命令

```bash
curl --location --request POST 'https://www.runninghub.cn/task/openapi/ai-app/run' \
  --header 'Content-Type: application/json' \
  --data-raw '{
    "webappId": 1877265245566922753,
    "apiKey": "你的密钥",
    "nodeInfoList": [
      {
        "nodeId": "122",
        "fieldName": "prompt",
        "fieldValue": "春季护肤特价"
      }
    ]
  }'
```

### Python

```python
import requests

def generate_poster(content):
    url = 'https://www.runninghub.cn/task/openapi/ai-app/run'
    
    payload = {
        'webappId': 1877265245566922753,
        'apiKey': 'your_api_key_here',
        'nodeInfoList': [
            {
                'nodeId': '122',
                'fieldName': 'prompt',
                'fieldValue': content
            }
        ]
    }
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        if data['code'] == 0:
            print('✅ 成功！')
            print('任务ID:', data['data']['taskId'])
            return data['data']
        else:
            print('❌ 失败:', data['msg'])
    else:
        print('❌ 请求失败:', response.status_code)

# 使用
generate_poster('春季护肤特价')
```

---

## 📤 API 响应格式

### 成功响应 (code: 0)

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "netWssUrl": "wss://www.runninghub.cn:443/ws/...",
    "taskId": "1907035719658053634",
    "clientId": "14caa1db2110a81629c101b9bb4cb0ce",
    "taskStatus": "RUNNING",
    "promptTips": "{...}"
  }
}
```

### 字段说明

| 字段 | 说明 |
|------|------|
| **code** | 0 表示成功，非 0 表示失败 |
| **msg** | 消息（success 或 错误描述） |
| **taskId** | 任务 ID，用于查询进度 |
| **taskStatus** | 任务状态 (RUNNING / SUCCESS / FAILED) |
| **netWssUrl** | WebSocket 连接，用于实时获取进度 |
| **clientId** | 客户端 ID |

### 错误响应 (code ≠ 0)

```json
{
  "code": 500,
  "msg": "Invalid apiKey",
  "data": null
}
```

---

## 🔄 工作流程

```
步骤 1: 准备请求数据
├─ webappId: 你的应用 ID
├─ apiKey: 你的 API 密钥
└─ nodeInfoList: 要修改的字段

步骤 2: 发送 POST 请求到 API
├─ URL: https://www.runninghub.cn/task/openapi/ai-app/run
├─ 方法: POST
└─ 内容类型: application/json

步骤 3: 接收响应
├─ code = 0: 成功 ✅
│  ├─ taskId: 保存任务 ID
│  └─ taskStatus: 检查任务状态
│
└─ code ≠ 0: 失败 ❌
   └─ msg: 查看错误信息

步骤 4: 查询结果（可选）
├─ 用 taskId 查询进度
└─ 用 WebSocket 实时监听
```

---

## 🔍 常见问题

### Q1: 我在哪里找到 webappId？

**A**: 
1. 登录 RunningHub 控制台
2. 打开你的应用
3. 在应用详情中可以看到 webappId
4. 或者查看"API 调用示例"中的示例代码

### Q2: nodeId 有哪些？怎么知道是什么？

**A**:
每个应用都有不同的 nodeId，需要在 RunningHub 控制台查看。

**常见的 nodeId 示例**:
- "122" → 提示词 (prompt)
- "123" → 样式 (style)
- "124" → 尺寸 (size)

在应用的"应用配置"或"API 示例"中会明确列出。

### Q3: API 密钥怎么获取？

**A**:
1. 登录 RunningHub 控制台
2. 左侧菜单 → API 密钥
3. 点击"生成密钥"
4. 复制你的密钥
5. 不要分享给别人

### Q4: 返回 401 错误怎么办？

**A**:
- ✅ 检查 apiKey 是否正确
- ✅ 检查是否有多余的空格
- ✅ 确认密钥没有过期
- ✅ 重新生成密钥

### Q5: 如何监控任务进度？

**A**:
**方法 1**: 使用 WebSocket（实时）
```javascript
const ws = new WebSocket(response.data.netWssUrl);
ws.onmessage = (event) => {
  console.log('进度更新:', event.data);
};
```

**方法 2**: 轮询查询状态
```javascript
// 使用 taskId 查询状态
// API 文档中有查询接口
```

---

## 🚀 在我们的应用中如何配置

### 步骤 1: 获取你的凭证
```
1. 访问 RunningHub 控制台
2. 找到海报生成应用的 webappId
3. 生成 API 密钥
4. 记下应用中的 nodeId 列表
```

### 步骤 2: 配置环境变量
```env
REACT_APP_RUNNINGHUB_API_KEY=你的 API 密钥
REACT_APP_RUNNINGHUB_WEBAPP_ID=你的应用 ID
```

### 步骤 3: 修改配置（如需要）
```typescript
// 在代码中设置（如果环境变量无效）
posterGenerationAPIService.setAPIKey('你的密钥');
posterGenerationAPIService.setWebappId('你的应用ID');
```

### 步骤 4: 生成海报
```
在 UI 中输入内容 → 点击生成 → 等待结果
```

---

## 📊 API 调用示例对比

### 方式 1: 使用 axios（推荐）
```typescript
const response = await axios.post(
  'https://www.runninghub.cn/task/openapi/ai-app/run',
  {
    webappId: 1877265245566922753,
    apiKey: 'your_key',
    nodeInfoList: [{
      nodeId: '122',
      fieldName: 'prompt',
      fieldValue: 'content'
    }]
  }
);
```

### 方式 2: 使用 fetch
```javascript
const response = await fetch(
  'https://www.runninghub.cn/task/openapi/ai-app/run',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      webappId: 1877265245566922753,
      apiKey: 'your_key',
      nodeInfoList: [...]
    })
  }
);
```

### 方式 3: 使用 cURL
```bash
curl -X POST https://www.runninghub.cn/task/openapi/ai-app/run \
  -H 'Content-Type: application/json' \
  -d '{...}'
```

---

## ✅ 完整检查清单

- [ ] 已获得 webappId
- [ ] 已生成 API 密钥
- [ ] 已知道应用的 nodeId 列表
- [ ] 已在 .env.local 配置密钥
- [ ] 已配置 webappId
- [ ] 已在代码中正确构建 nodeInfoList
- [ ] 已测试 API 调用
- [ ] 看到了成功的响应 (code: 0)

---

## 📚 参考资源

| 资源 | 链接 |
|------|------|
| **官方 API 文档** | https://www.runninghub.cn/runninghub-api-doc-cn/api-279098421 |
| **RunningHub 控制台** | https://www.runninghub.cn/console |
| **API 密钥管理** | https://www.runninghub.cn/console/api-keys |
| **应用配置** | 登录后在应用详情中查看 |

---

## 🎓 总结

### 核心点
1. ✅ API 需要 `webappId` 和 `apiKey`
2. ✅ 通过 `nodeInfoList` 指定要修改的字段
3. ✅ 每个字段需要 `nodeId`、`fieldName` 和 `fieldValue`
4. ✅ 响应中的 `code` 为 0 表示成功
5. ✅ 使用 `taskId` 可以查询任务进度

### 下一步
1. 在 RunningHub 控制台获取你的凭证
2. 配置环境变量
3. 测试 API 调用
4. 在应用中使用

---

**现在你知道怎么调用这个模版的 API 了！** 🎉

**关键是理解 webappId + nodeInfoList 的概念！** 🔑
