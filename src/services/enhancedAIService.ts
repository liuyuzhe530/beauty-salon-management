import axios from 'axios';

const GLM_API_KEY = import.meta.env.VITE_GLM_API_KEY || 'bddc38fc438e478cac87712b13d7a68f.KDOj6fpAoEOb8slt';
const GLM_ENDPOINT = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';
const GLM_MODEL = 'glm-4.5-flash';

// 系统数据接口
export interface SystemData {
  customers?: {
    total: number;
    newThisMonth: number;
    churnRate: number;
    activeCustomers: number;
    vipCustomers: number;
    highRiskCustomers: Array<{
      id: string;
      name: string;
      daysSinceLastAppointment: number;
      totalSpent: number;
    }>;
  };
  appointments?: {
    totalThisMonth: number;
    confirmationRate: number;
    peakHours: string[];
    averageDuration: number;
    noShowRate: number;
  };
  staff?: {
    total: number;
    activeStaff: number;
    performanceRanking: Array<{
      name: string;
      appointmentsCompleted: number;
      confirmationRate: number;
      customerSatisfaction: number;
    }>;
  };
  sales?: {
    totalRevenue: number;
    revenueThisMonth: number;
    topProducts: Array<{
      name: string;
      sales: number;
      revenue: number;
    }>;
    growth: number;
  };
  marketing?: {
    activeActivities: Array<{
      name: string;
      cost: number;
      roi: number;
      conversions: number;
    }>;
  };
}

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

class EnhancedAIService {
  private conversationHistory: AIMessage[] = [];
  private maxHistoryLength = 10;
  private systemData: SystemData = {};

  /**
   * 设置系统数据
   */
  setSystemData(data: SystemData): void {
    this.systemData = data;
  }

  /**
   * 获取系统数据摘要
   */
  private getDataSummary(): string {
    const { customers, appointments, staff, sales, marketing } = this.systemData;
    
    const summary = `
【当前系统数据摘要】

客户数据:
- 总客户数: ${customers?.total || '未知'}
- 本月新增: ${customers?.newThisMonth || 0}
- 客户流失率: ${customers?.churnRate || 0}%
- 活跃客户: ${customers?.activeCustomers || '未知'}
- VIP客户: ${customers?.vipCustomers || 0}
- 高风险客户: ${customers?.highRiskCustomers?.length || 0} 位（30天未预约）

预约数据:
- 本月预约总数: ${appointments?.totalThisMonth || '未知'}
- 预约确认率: ${appointments?.confirmationRate || 0}%
- 高峰时段: ${appointments?.peakHours?.join('、') || '未知'}
- 平均预约时长: ${appointments?.averageDuration || 0}分钟
- 爽约率: ${appointments?.noShowRate || 0}%

员工数据:
- 总员工数: ${staff?.total || '未知'}
- 在职员工: ${staff?.activeStaff || '未知'}
${staff?.performanceRanking?.slice(0, 3).map((s, i) => `- 员工${i+1}: ${s.name}，完成${s.appointmentsCompleted}个预约，确认率${s.confirmationRate}%`).join('\n') || ''}

销售数据:
- 总收入: ¥${sales?.totalRevenue || 0}
- 本月收入: ¥${sales?.revenueThisMonth || 0}
- 增长率: ${sales?.growth || 0}%
${sales?.topProducts?.slice(0, 3).map((p) => `- 热销产品: ${p.name}，销售${p.sales}件，收入¥${p.revenue}`).join('\n') || ''}

营销数据:
${marketing?.activeActivities?.map((a) => `- 活动: ${a.name}，投入¥${a.cost}，ROI${a.roi}%，转化${a.conversions}次`).join('\n') || '无活动'}
    `.trim();
    
    return summary;
  }

  /**
   * 通用聊天功能 - 集成系统数据
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

      // 构建增强的系统提示词
      const enhancedSystemPrompt = `你是一个美容院智能管理助手，拥有实时系统数据访问权。你的职责是帮助美容院经营者做出数据驱动的决策。

${this.getDataSummary()}

【您的职责】
1. 分析提供的系统数据，识别业务机遇和问题
2. 提供基于数据的具体建议和行动方案
3. 优先关注高风险客户和流失预警
4. 推荐营销活动优化和成本控制
5. 提出员工管理改进建议

【重要限制】
你只能回答以下三类问题：
1. 基于系统数据的业务分析和建议
2. 美容行业最佳实践
3. 系统功能使用

【禁止回答】
- 与美容院无关的问题
- 数学、科学等无关领域
- 敏感话题

【回答规则】
- 始终引用具体数据支持你的建议
- 提供可执行的行动步骤
- 明确指出预期结果或ROI
- 如果数据不足，明确说明需要哪些信息`;

      const response = await axios.post(
        GLM_ENDPOINT,
        {
          model: GLM_MODEL,
          messages: [
            {
              role: 'system',
              content: enhancedSystemPrompt,
            },
            ...this.conversationHistory,
          ],
          temperature: 0.7,
          top_p: 0.7,
          max_tokens: 1500,
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
      console.error('增强 AI 服务错误:', error.message);
      if (error.response?.data) {
        console.error('API 响应:', error.response.data);
      }
      throw new Error(`AI 服务错误: ${error.message}`);
    }
  }

  /**
   * 获取智能建议 - 自动分析系统数据
   */
  async getSmartRecommendations(): Promise<AIResponse> {
    const prompt = `请根据当前系统数据分析，提供以下方面的智能建议：

1. 客户管理：识别风险客户，提出留存策略
2. 预约优化：分析高峰时段，提出排班建议
3. 员工管理：评价员工表现，提出奖励或培训建议
4. 营销策略：分析营销ROI，提出下月营销建议
5. 收入增长：基于销售数据，提出增收方案

请用数据支持每个建议，并明确指出预期效果。`;

    return this.chat(prompt);
  }

  /**
   * 清除对话历史
   */
  clearHistory(): void {
    this.conversationHistory = [];
  }

  /**
   * 获取对话历史
   */
  getHistory(): AIMessage[] {
    return this.conversationHistory;
  }
}

// 导出单例实例
export const enhancedAIService = new EnhancedAIService();
export default enhancedAIService;
