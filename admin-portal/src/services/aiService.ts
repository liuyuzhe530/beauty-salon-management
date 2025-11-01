import axios from 'axios';

const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY || 'bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt';
const GLM_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_MODEL = 'glm-4.5-flash';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface AIAnalysisResult {
  type: 'risk' | 'scheduling' | 'pricing' | 'general';
  content: string;
  recommendations: string[];
  score?: number;
}

class AIService {
  private conversationHistory: AIMessage[] = [];
  private maxHistoryLength = 10;
  private useDemoMode = false;

  /**
   * 演示模式响应库
   */
  private demoResponses: { [key: string]: string } = {
    '客户': '根据系统数据分析，您目前有 45 名活跃客户。其中 8 名高风险客户需要关注（30 天未预约）。建议通过回访和特殊优惠来提高客户留存。',
    '预约': '本月已完成 87 个预约，确认率 92%。高峰时段为 10:00-12:00 和 14:00-16:00。建议在这些时段增加员工排班。',
    '员工': '李美容师表现最好，完成 24 个预约。王美容师满意度评分 4.8。建议建立员工激励计划。',
    '销售': '本月销售收入 ¥28,500，环比增长 15%。热销产品为面部护理套装（销量 34 件）。',
    '营销': '社交媒体推广 ROI 最高（250%），新客体验优惠转化率 22%。建议继续加大这两项投入。',
    '排班': '根据预约数据，建议周一至周五增加排班，周末可保持现有安排。李、王、张三位美容师可轮流休息。',
    '定价': '当前面部护理价格 168 元，建议根据竞对保持不变。深层清洁价格 128 元可提升至 148 元。',
    '分析': '系统分析显示，您的业务总体健康。需要关注：(1) 高风险客户流失 (2) 周一预约不足 (3) 产品销售季节性波动。',
  };

  /**
   * 通用聊天功能
   */
  async chat(userMessage: string): Promise<AIResponse> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      if (this.conversationHistory.length > this.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      }

      // 如果启用演示模式或 API 不可用，使用演示响应
      if (this.useDemoMode) {
        return this.getDemoResponse(userMessage);
      }

      // 尝试调用实际 API
      try {
        return await this.callGLMAPI(userMessage);
      } catch (apiError) {
        console.warn('GLM API 调用失败，切换到演示模式:', apiError);
        this.useDemoMode = true;
        return this.getDemoResponse(userMessage);
      }
    } catch (error: any) {
      console.error('AI 服务错误:', error.message);
      throw new Error(`AI 服务错误: ${error.message}`);
    }
  }

  /**
   * 调用 GLM API
   */
  private async callGLMAPI(userMessage: string): Promise<AIResponse> {
    const systemPrompt = `你是一个美容院管理系统的AI助手。你的职责是帮助美容院员工管理业务。

【重要限制】
你只能回答以下两类问题：
1. 美容行业相关问题（美容服务、护肤知识、美容产品、行业最佳实践等）
2. 系统功能问题（如何预约、客户管理、员工排班、产品管理、数据分析等）

【禁止回答】
- 数学、科学、历史等与美容行业无关的问题
- 政治、宗教等敏感话题
- 任何其他领域的问题

【回答规则】
- 如果问题不相关，礼貌地拒绝并提示用户：'抱歉，我只能帮助您解决美容院相关问题或系统使用问题。'
- 如果是美容相关，提供专业的建议
- 如果是系统功能相关，解释如何使用该功能

【可用功能】
- 预约管理：帮助客户预约美容服务
- 客户管理：管理客户信息和历史
- 员工排班：优化员工工作安排
- 产品管理：管理美容产品库存
- 数据分析：分析营业数据
- 服务定价：提供定价建议
- 营销方案：生成营销文案`;

    const response = await axios.post(
      GLM_ENDPOINT,
      {
        model: GLM_MODEL,
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          ...this.conversationHistory,
        ],
        temperature: 0.7,
        top_p: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Authorization': GLM_API_KEY,
          'Content-Type': 'application/json',
        },
        timeout: 15000,
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
  }

  /**
   * 获取演示响应
   */
  private getDemoResponse(userMessage: string): AIResponse {
    let response = '我是美容院AI助手的演示版本。';
    
    // 匹配关键词，返回相关的演示响应
    for (const [keyword, demoText] of Object.entries(this.demoResponses)) {
      if (userMessage.includes(keyword)) {
        response = demoText;
        break;
      }
    }

    // 如果没有匹配到关键词，返回默认响应
    if (response === '我是美容院AI助手的演示版本。') {
      response = `您问了关于"${userMessage}"的问题。\n\n在演示模式中，我可以为您展示系统的AI功能。您可以问我：\n• 关于客户数据的问题\n• 员工排班优化建议\n• 销售和预约分析\n• 营销活动ROI分析\n• 服务定价建议\n\n实时API模式需要配置有效的 GLM API Key。`;
    }

    this.conversationHistory.push({
      role: 'assistant',
      content: response,
    });

    return {
      content: response,
      usage: undefined,
    };
  }

  /**
   * 清除对话历史
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * 分析客户流失风险
   */
  async analyzeLossRisk(customerData: any): Promise<AIAnalysisResult> {
    const prompt = `
    您是一位美容院管理专家。请分析以下客户数据，评估客户流失风险。
    
    客户数据:
    ${JSON.stringify(customerData, null, 2)}
    
    请提供以下信息（用JSON格式返回）：
    {
      "riskLevel": "高/中/低",
      "riskScore": 0-100,
      "riskAnalysis": "风险原因分析",
      "recommendations": ["建议1", "建议2", "建议3"]
    }
    `;

    try {
      const response = await this.chat(prompt);
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        return {
          type: 'risk',
          content: `风险等级: ${analysisData.riskLevel}\n分析: ${analysisData.riskAnalysis}`,
          recommendations: analysisData.recommendations || [],
          score: analysisData.riskScore,
        };
      }
      
      return {
        type: 'risk',
        content: response.content,
        recommendations: [],
      };
    } catch (error: any) {
      console.error('流失风险分析错误:', error.message);
      throw error;
    }
  }

  /**
   * 优化员工排班
   */
  async optimizeSchedule(scheduleData: any): Promise<AIAnalysisResult> {
    const prompt = `
    您是一位美容院经营管理顾问。根据以下预约数据，建议最优的员工排班安排。
    
    预约数据:
    ${JSON.stringify(scheduleData, null, 2)}
    
    请提供以下信息（用JSON格式返回）：
    {
      "optimalSchedule": "具体排班建议",
      "costSavings": "预计成本节省",
      "satisfactionScore": 80-100,
      "recommendations": ["建议1", "建议2", "建议3"]
    }
    `;

    try {
      const response = await this.chat(prompt);
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const scheduleData = JSON.parse(jsonMatch[0]);
        return {
          type: 'scheduling',
          content: `${scheduleData.optimalSchedule}\n成本节省: ${scheduleData.costSavings}`,
          recommendations: scheduleData.recommendations || [],
          score: scheduleData.satisfactionScore,
        };
      }
      
      return {
        type: 'scheduling',
        content: response.content,
        recommendations: [],
      };
    } catch (error: any) {
      console.error('排班优化错误:', error.message);
      throw error;
    }
  }

  /**
   * 动态定价建议
   */
  async suggestPricing(priceData: any): Promise<AIAnalysisResult> {
    const prompt = `
    您是一位美容行业定价策略专家。根据以下市场数据和服务信息，提供动态定价建议。
    
    数据:
    ${JSON.stringify(priceData, null, 2)}
    
    请提供以下信息（用JSON格式返回）：
    {
      "currentOptimal": "当前最优价格",
      "recommendations": ["建议1", "建议2", "建议3"],
      "revenuePotential": "预计收入增长",
      "strategy": "定价策略说明"
    }
    `;

    try {
      const response = await this.chat(prompt);
      const jsonMatch = response.content.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const pricingData = JSON.parse(jsonMatch[0]);
        return {
          type: 'pricing',
          content: `最优价格: ${pricingData.currentOptimal}\n策略: ${pricingData.strategy}`,
          recommendations: pricingData.recommendations || [],
        };
      }
      
      return {
        type: 'pricing',
        content: response.content,
        recommendations: [],
      };
    } catch (error: any) {
      console.error('定价建议错误:', error.message);
      throw error;
    }
  }

  /**
   * 生成营销文案
   */
  async generateMarketingCopy(product: any): Promise<string> {
    const prompt = `
    您是一位优秀的美容行业营销文案专家。为以下美容服务/产品生成吸引人的营销文案。
    
    产品信息:
    ${JSON.stringify(product, null, 2)}
    
    请生成：
    1. 一个吸引人的标题
    2. 3-5个核心卖点
    3. 一段行动号召文案
    
    使用简洁、有力的语言。
    `;

    try {
      const response = await this.chat(prompt);
      return response.content;
    } catch (error: any) {
      console.error('营销文案生成错误:', error.message);
      throw error;
    }
  }

  /**
   * 美容咨询
   */
  async beautyConsultation(question: string): Promise<string> {
    try {
      const response = await this.chat(question);
      return response.content;
    } catch (error: any) {
      console.error('美容咨询错误:', error.message);
      throw error;
    }
  }

  /**
   * 获取对话历史
   */
  getHistory(): AIMessage[] {
    return this.conversationHistory;
  }

  /**
   * 获取对话历史长度
   */
  getHistoryLength(): number {
    return this.conversationHistory.length;
  }

  /**
   * 设置是否使用演示模式
   */
  setDemoMode(enabled: boolean): void {
    this.useDemoMode = enabled;
  }

  /**
   * 获取演示模式状态
   */
  isDemoMode(): boolean {
    return this.useDemoMode;
  }
}

// 导出单例实例
export const aiService = new AIService();
export default aiService;
