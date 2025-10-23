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

  /**
   * 通用聊天功能
   */
  async chat(userMessage: string): Promise<AIResponse> {
    try {
      this.conversationHistory.push({
        role: 'user',
        content: userMessage,
      });

      // 限制历史记录长度
      if (this.conversationHistory.length > this.maxHistoryLength) {
        this.conversationHistory = this.conversationHistory.slice(-this.maxHistoryLength);
      }

      const response = await axios.post(
        GLM_ENDPOINT,
        {
          model: GLM_MODEL,
          messages: this.conversationHistory,
          temperature: 0.7,
          top_p: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            'Authorization': GLM_API_KEY,
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
      if (error.response?.data) {
        console.error('API 响应:', error.response.data);
      }
      throw new Error(`AI 服务错误: ${error.message}`);
    }
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
    const systemPrompt = `
    You are an expert beauty salon consultant with deep knowledge of:
    - 美容服务和产品
    - 客户护理和满意度
    - 美容院管理
    - 美容健康知识
    
    Please provide helpful, professional advice in Chinese.
    `;

    try {
      // 添加系统提示
      this.conversationHistory.push({
        role: 'system',
        content: systemPrompt,
      });

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
}

// 导出单例实例
export const aiService = new AIService();
export default aiService;
