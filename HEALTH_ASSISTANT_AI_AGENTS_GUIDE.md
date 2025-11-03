# 健康助手 AI 智能体系统指南

## 📋 概览

健康助手现在配备了真实的AI智能体系统，每个检测项目都有专门的AI智能体进行实时分析，而不再使用固定数据。

---

## 🤖 智能体配置

### 1. **舌苔检测智能体** (Tongue Coating Agent)
- **ID**: `tongue-coating-agent`
- **AI模型**: GLM-4 Vision
- **功能**:
  - 分析舌苔图片的舌色、苔质、舌体特征
  - 识别体质类型（湿热、阳虚、阴虚、气虚等）
  - 提供中医调理建议
  - 推荐食疗和中成药

**系统提示词**:
```
你是一位资深的中医诊断专家。你的职责是：
1. 分析用户上传的舌苔图片
2. 识别舌色、苔质、舌体等特征
3. 诊断体质类型
4. 提供中医调理建议和食疗方案
5. 推荐适合的中成药和养生方法
```

---

### 2. **皮肤检测智能体** (Skincare Detection Agent)
- **ID**: `skincare-detection-agent`
- **AI模型**: GLM-4 Vision
- **功能**:
  - 分析肤质类型（干性、油性、混合、敏感）
  - 诊断皮肤问题（痘痘、黑头、细纹、暗沉等）
  - 评估皮肤健康状态
  - 推荐护肤产品和疗程

**分析规则**:
- `skin_type_detection` - 检测肤质类型
- `problem_identification` - 识别皮肤问题

---

### 3. **美容诊断智能体** (Beauty Diagnosis Agent)
- **ID**: `beauty-diagnosis-agent`
- **AI模型**: GLM-4
- **功能**:
  - 分析面部特征和气质
  - 评估肌肤状态和气色
  - 诊断美容需求
  - 制定个性化美容方案

**分析规则**:
- `facial_analysis` - 分析面部特征
- `beauty_needs` - 评估美容需求

---

### 4. **健康评估智能体** (Health Assessment Agent)
- **ID**: `health-assessment-agent`
- **AI模型**: GLM-4
- **功能**:
  - 综合分析健康指标
  - 评估生活方式和健康风险
  - 诊断潜在健康问题
  - 制定健康管理计划

---

## 🔧 配置 API 密钥

### 环境变量设置

在项目根目录创建 `.env.local` 文件：

```env
REACT_APP_GLM_API_KEY=your_glm_api_key_here
```

### 获取 GLM API 密钥

1. 访问 [智谱清言开放平台](https://open.bigmodel.cn)
2. 登录账户
3. 创建新的 API 密钥
4. 复制密钥到 `.env.local`

---

## 📝 使用示例

### 在组件中调用智能体

```typescript
import { runAgentAnalysis } from '../services/healthAssistantAgents';

// 分析舌苔图片
const aiAnalysis = await runAgentAnalysis('tongue-coating', imageData);

// 处理结果
console.log('健康评分:', aiAnalysis.healthScore);
console.log('诊断结果:', aiAnalysis.diagnosis);
console.log('调理建议:', aiAnalysis.recommendations);
```

### 获取特定智能体配置

```typescript
import { getAgent } from '../services/healthAssistantAgents';

const agent = getAgent('tongue-coating');
console.log('智能体名称:', agent.name);
console.log('模型类型:', agent.modelType);
console.log('分析规则:', agent.analysisRules);
```

---

## 📊 智能体输出格式

### 舌苔检测结果

```typescript
{
  tongueColor: "淡红色",           // 舌质颜色
  coatingType: "薄白苔",            // 苔质类型
  healthScore: 85,                 // 健康评分 (0-100)
  diagnosis: "脾胃健康",             // 中医诊断
  problems: [                      // 主要问题列表
    "微有湿热",
    "消化需改善"
  ],
  recommendations: [               // 调理建议
    "加强脾胃功能",
    "适度运动",
    "饮食清淡"
  ],
  remedies: [                      // 推荐的中成药和食疗
    {
      id: "1",
      name: "健脾祛湿茶",
      category: "中成药",
      description: "健脾利湿",
      dosage: "日一剂"
    }
  ],
  adjustmentPlan: [               // 调理计划
    "第1-2周：加强脾胃保健",
    "第3-4周：调理消化功能",
    "第5-8周：巩固效果"
  ],
  confidence: 92,                 // 置信度 (0-100)
  visualFeatures: {               // 视觉特征分析
    brightness: 180,
    saturation: 65,
    hueRange: { min: 0, max: 15 },
    textureComplexity: 3,
    coatingCoverage: 25
  }
}
```

---

## ⚙️ 高级配置

### 修改智能体参数

```typescript
export const tongueCoatingAgent: AgentConfig = {
  // ...
  temperature: 0.6,              // 模型创意度 (0-2)
  maxTokens: 2000,               // 最大输出长度
  enabled: true,                 // 是否启用
  // ...
};
```

### 参数说明

| 参数 | 范围 | 说明 |
|------|------|------|
| `temperature` | 0-2 | 越高越创意，越低越稳定。建议0.5-0.7 |
| `maxTokens` | 100-4096 | 输出最大长度，越大越详细 |
| `enabled` | true/false | 是否启用该智能体 |

---

## 🔐 安全建议

1. **不要在代码中暴露 API 密钥**，使用环境变量
2. **定期更新** API 密钥
3. **监控 API 使用量**，设置配额限制
4. **生产环境**应使用后端代理调用 API

---

## 🐛 故障排查

### 问题1: 智能体无响应

**原因**:
- API 密钥配置不正确
- 网络连接问题
- API 额度已用尽

**解决方案**:
```bash
# 检查环境变量
echo $REACT_APP_GLM_API_KEY

# 查看浏览器控制台错误
# 检查 Network 标签中的 API 请求
```

### 问题2: 分析结果不准确

**原因**:
- 图片质量不佳
- 光线不足
- AI 模型需要优化提示词

**解决方案**:
- 提升图片质量
- 改进光线条件
- 调整 `systemPrompt` 和 `temperature`

---

## 📈 性能优化

### 1. 缓存结果

```typescript
const cache = new Map();

async function runAgentAnalysisWithCache(agentId: string, input: string) {
  const key = `${agentId}:${hash(input)}`;
  if (cache.has(key)) return cache.get(key);
  
  const result = await runAgentAnalysis(agentId, input);
  cache.set(key, result);
  return result;
}
```

### 2. 批量处理

```typescript
async function batchAnalyze(agentId: string, inputs: string[]) {
  return Promise.all(
    inputs.map(input => runAgentAnalysis(agentId, input))
  );
}
```

---

## 🚀 扩展智能体

### 添加新智能体

```typescript
export const myNewAgent: AgentConfig = {
  id: 'my-new-agent',
  name: '我的智能体',
  title: '我的智能体标题',
  description: '我的智能体描述',
  modelType: 'glm',
  systemPrompt: '...',
  temperature: 0.5,
  maxTokens: 2000,
  enabled: true,
  analysisRules: [
    {
      field: 'my_field',
      type: 'text',
      processor: async (input) => {
        // 您的分析逻辑
        return await callAIModel('text', {
          prompt: input
        });
      }
    }
  ],
  postProcessing: (result) => {
    // 后处理逻辑
    return result;
  }
};

// 注册智能体
export const healthAssistantAgents = {
  ...healthAssistantAgents,
  'my-new-agent': myNewAgent
};
```

---

## 📞 支持和反馈

如有任何问题或建议，请：
1. 查看错误日志
2. 检查 API 配置
3. 联系技术支持

---

**最后更新**: 2025年11月
**版本**: 1.0.0
