#  **GLM AI 集成完整方案**

**API 提供方：** 智谱清言 (GLM)  
**目标：** 在美容院管理系统中集成 AI 功能  
**时间：** 3-5 天完成第一阶段  
**难度：**  简单

---

## ** GLM API 准备**

您需要准备的信息：

```
□ GLM API Key          → 从智谱清言控制台获取
□ API Endpoint         → https://open.bigmodel.cn/api/paas/v4/chat/completions
□ Model Name           → glm-4 或 glm-3-turbo
□ 速率限制（RPM）      → 根据您的套餐
```

**获取步骤（如果还没有）：**
1. 访问 https://open.bigmodel.cn
2. 注册账户
3. 创建 API Key
4. 记下您的 Key

---

## ** 第一阶段：核心 AI 功能（3-5 天）**

### **1️⃣ AI 聊天助手（第 1-2 天）**

**功能：**
- 回答美容相关问题
- 提供服务建议
- 预约辅导
- 产品推荐

**集成文件清单：**
```
1. src/services/aiService.ts       (新建)
   └─ GLM API 调用封装

2. src/components/AIChat.tsx       (新建或修改)
   └─ 聊天界面组件

3. src/context/AIContext.tsx       (新建)
   └─ AI 状态管理

4. 环境变量配置
   └─ .env 中添加 GLM_API_KEY
```

**成本：**
- 代码编写：4-6 小时
- 测试调试：2-3 小时
- 总计：6-9 小时

---

### **2️⃣ 客户流失预警（第 2-3 天）**

**功能：**
- 分析客户预约历史
- 识别流失风险客户
- 生成预警建议
- 推荐激励方案

**实现方式：**
```
1. 分析引擎（src/services/predictionService.ts）
   - 计算客户活跃度分数
   - 预测流失风险
   - 生成报告

2. GLM 推荐（src/services/recommendationService.ts）
   - 调用 GLM 生成激励建议
   - 生成营销文案
```

**成本：**
- 代码编写：3-4 小时
- 算法优化：2-3 小时
- 总计：5-7 小时

---

### **3️⃣ 智能排班推荐（第 3-4 天）**

**功能：**
- 分析预约数据
- 推荐最优排班
- 成本优化建议

**实现方式：**
```
1. 数据分析（src/services/schedulingService.ts）
   - 统计预约分布
   - 计算员工效率

2. GLM 优化
   - 让 GLM 分析数据并给出建议
   - 生成排班优化报告
```

---

### **4️⃣ 动态定价建议（第 4-5 天）**

**功能：**
- 分析市场需求
- 建议调整价格
- 优化收益

---

## ** 实现步骤**

### **步骤 1：安装依赖（5 分钟）**

```bash
npm install @zhipu/sdk
# 或使用 HTTP 客户端（已有 axios）
```

### **步骤 2：创建 GLM 服务模块**

**文件：`src/services/aiService.ts`**

```typescript
import axios from 'axios';

const GLM_API_KEY = process.env.REACT_APP_GLM_API_KEY || process.env.VITE_GLM_API_KEY;
const GLM_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class AIService {
  private conversationHistory: AIMessage[] = [];

  async chat(userMessage: string): Promise<AIResponse> {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    try {
      const response = await axios.post(
        GLM_ENDPOINT,
        {
          model: 'glm-4',
          messages: this.conversationHistory,
          temperature: 0.7,
          top_p: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': `Bearer ${GLM_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const assistantMessage = response.data.choices[0].message.content;
      this.conversationHistory.push({
        role: 'assistant',
        content: assistantMessage,
      });

      return {
        content: assistantMessage,
        usage: response.data.usage,
      };
    } catch (error: any) {
      console.error('GLM API 错误:', error.message);
      throw new Error(`AI 服务错误: ${error.message}`);
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  async analyzeLossRisk(customerData: any): Promise<string> {
    const prompt = `
    分析以下客户数据，评估客户流失风险。
    客户数据: ${JSON.stringify(customerData)}
    
    请提供：
    1. 流失风险等级（高/中/低）
    2. 风险原因分析
    3. 建议的激励方案
    `;

    return (await this.chat(prompt)).content;
  }

  async optimizeSchedule(scheduleData: any): Promise<string> {
    const prompt = `
    根据以下预约数据，建议最优的员工排班安排。
    预约数据: ${JSON.stringify(scheduleData)}
    
    请提供：
    1. 推荐的排班方案
    2. 成本节省估计
    3. 客户满意度预测
    `;

    return (await this.chat(prompt)).content;
  }
}

export const aiService = new AIService();
export default aiService;
```

### **步骤 3：环境变量配置**

**文件：`.env`**

```
# GLM AI 配置
VITE_GLM_API_KEY=your_glm_api_key_here
```

**文件：`vite.config.ts`** (如果需要)

```typescript
// 确保环境变量能被正确读取
export default defineConfig({
  define: {
    'process.env': process.env,
  },
  // ... 其他配置
});
```

### **步骤 4：创建 AI 聊天组件**

**文件：`src/components/AIChat.tsx`**

```typescript
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import aiService from '../services/aiService';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 调用 GLM API
      const response = await aiService.chat(input);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.content }
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `错误: ${error.message}` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 浮窗按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col h-96">
          {/* 头部 */}
          <div className="bg-green-500 text-white p-4 flex justify-between items-center rounded-t-lg">
            <h3 className="font-bold">AI 助手</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-green-100 text-gray-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-lg">
                  AI 思考中...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入区域 */}
          <form onSubmit={handleSendMessage} className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入问题..."
              className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
```

---

## ** 立即开始的 3 个步骤**

### **第 1 步：收集 GLM 信息（5 分钟）**

```
□ 您的 GLM API Key
□ 选择模型：glm-4 (最好) 还是 glm-3-turbo (便宜)
□ 您的 API 速率限制
```

### **第 2 步：我创建代码（2 小时）**

```
□ 创建 aiService.ts
□ 创建 AIChat.tsx 组件
□ 集成到现有应用
```

### **第 3 步：测试 + 部署（1 小时）**

```
□ 本地测试
□ 提交 Git
□ 部署到 Vercel
```

---

## ** 成本估算**

**GLM API 调用成本：**

```
glm-4 模型:
  - 输入: 0.01 元/1000 tokens
  - 输出: 0.05 元/1000 tokens
  - 免费额度: 每月 3 百万 tokens

glm-3-turbo:
  - 输入: 0.0005 元/1000 tokens
  - 输出: 0.001 元/1000 tokens
  - 免费额度: 充足
```

**示例成本：**
- 每次聊天：0.01-0.05 元
- 100 次聊天：1-5 元
- 1000 次聊天：10-50 元

---

## ** 完整时间表**

```
今天：
   收集 GLM API Key
   创建 aiService.ts

明天：
   创建 AIChat 组件
   本地测试

后天：
   添加流失预警分析
   添加排班优化

第 4 天：
   添加定价优化
   全面测试

第 5 天：
   优化 + 清理代码
   部署到 Vercel
   准备演示
```

---

## ** 准备好了吗？**

**请告诉我：**

```
1. 您的 GLM API Key
   → 或者告诉我在哪里获取

2. 选择模型
    glm-4 (最强大，推荐)
    glm-3-turbo (便宜快速)

3. 优先级
    先做聊天助手
    全部功能一起做
```

---

**一旦您提供信息，我们立即开始集成！** 

这样 3-5 天内，您就有了一个**完整的 AI 智能美容院管理系统**！
