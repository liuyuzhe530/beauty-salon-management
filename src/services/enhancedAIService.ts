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
  private useDemoMode = false;

  /**
   * 演示模式建议库
   */
  private demoRecommendations: { [key: string]: string } = {
    '风险': `【高风险客户分析报告】

分析对象：${this.systemData.customers?.highRiskCustomers?.length || 0} 名高风险客户

主要问题：
1. 客户流失率 ${this.systemData.customers?.churnRate || 0}% 需要关注
2. 30天未预约的客户：${this.systemData.customers?.highRiskCustomers?.map(c => c.name).join('、') || '无'}

建议方案：
• 立即回访高风险客户，了解不满意原因
• 提供特殊优惠（如首次消费返现20%）
• 推出VIP客户保留计划
• 建立客户满意度反馈机制

预期效果：
- 客户留存率提升 15-20%
- 流失率降低 5-8%`,

    '排班': `【员工排班优化建议】

当前数据分析：
- 本月预约总数：${this.systemData.appointments?.totalThisMonth || 0}
- 高峰时段：${this.systemData.appointments?.peakHours?.join('、') || '10:00-12:00, 14:00-16:00'}
- 平均预约时长：${this.systemData.appointments?.averageDuration || 60}分钟

员工表现排行：
${this.systemData.staff?.performanceRanking?.slice(0, 3).map((s, i) => `${i+1}. ${s.name} - 完成${s.appointmentsCompleted}个预约，确认率${s.confirmationRate}%`).join('\n') || '待更新'}

优化建议：
• 高峰时段(10:00-12:00, 14:00-16:00)增加排班人数
• 表现优秀员工(${this.systemData.staff?.performanceRanking?.[0]?.name})安排在高峰时段
• 周一至周五排班密集，周末可适当减少
• 建议排班周期为2周循环

预期收益：
- 预约确认率提升 8-12%
- 客户满意度提升 10%`,

    '定价': `【动态定价策略建议】

销售数据分析：
- 本月总收入：¥${this.systemData.sales?.revenueThisMonth || 0}
- 增长率：${this.systemData.sales?.growth || 0}%
- 热销TOP3产品：
${this.systemData.sales?.topProducts?.slice(0, 3).map(p => `  • ${p.name}: 销量${p.sales}件，收入¥${p.revenue}`).join('\n') || '  数据待更新'}

定价建议：
• 热销产品(销量>20件)可提价5-8%
• 冷门产品(销量<5件)可打折或捆绑销售
• 建议推出"低价引流+高价转化"的产品组合
• VIP客户提供专属定价折扣

预期效果：
- 整体收入增长 12-18%
- 产品销售均匀度提升 25%`,

    '营销': `【营销活动ROI分析与优化】

当前营销数据：
活动投入与效果分析：
${this.systemData.marketing?.activeActivities?.map(a => `• ${a.name}: 投入¥${a.cost}，ROI${a.roi}%，转化${a.conversions}人`).join('\n') || '• 社交媒体推广: 投入¥2000，ROI250%，转化15人\n• 新客体验优惠: 投入¥3000，ROI180%，转化22人'}

优化建议：
• 加大ROI最高活动(${this.systemData.marketing?.activeActivities?.sort((a, b) => b.roi - a.roi)[0]?.name || '社交媒体推广'})的投入
• 停止或改进ROI低于100%的活动
• 尝试新渠道：抖音、小红书等短视频平台
• 建立转介绍计划，提高客户转化率

预期收益：
- 市场营销ROI提升 40-60%
- 新客获取成本降低 25%`,

    '建议': `【完整智能运营建议报告】

═══════════════════════════════
综合业务评估 (${new Date().toLocaleDateString()})
═══════════════════════════════

【客户管理现状】
✓ 总客户数: ${this.systemData.customers?.total || 0}名
✗ 流失率: ${this.systemData.customers?.churnRate || 0}% (目标<10%)
⚠ 高风险客户: ${this.systemData.customers?.highRiskCustomers?.length || 0}名需关注

优先级1 - 高风险客户流失预警
→ 立即行动: 逐一回访高风险客户
→ 预期效果: 留存率↑15-20%

【预约运营现状】
✓ 月预约数: ${this.systemData.appointments?.totalThisMonth || 0}
✓ 确认率: ${this.systemData.appointments?.confirmationRate || 0}%
⚠ 爽约率: ${this.systemData.appointments?.noShowRate || 0}% (应<5%)

优先级2 - 高峰时段排班优化
→ 关键时段: ${this.systemData.appointments?.peakHours?.join('、') || '10:00-12:00, 14:00-16:00'}
→ 建议行动: 高峰时段增加排班
→ 预期效果: 确认率↑10-12%, 客户满意度↑8%

【员工管理现状】
✓ 在职员工: ${this.systemData.staff?.activeStaff || 0}/${this.systemData.staff?.total || 0}
✓ 表现最好: ${this.systemData.staff?.performanceRanking?.[0]?.name} (${this.systemData.staff?.performanceRanking?.[0]?.appointmentsCompleted}个预约)

优先级3 - 员工绩效提升
→ 行动: 建立员工激励制度
→ 预期效果: 服务质量↑15%, 客户满意度↑10%

【财务运营现状】
✓ 本月收入: ¥${this.systemData.sales?.revenueThisMonth || 0}
✓ 增长率: ${this.systemData.sales?.growth || 0}%

优先级4 - 收入增长策略
→ 方案: 热销产品提价5-8%, 冷门产品打折促销
→ 预期效果: 整体收入↑12-18%

【总体建议执行计划】
第1周: 完成高风险客户回访，制定留存方案
第2周: 优化排班表，减少高峰时段爽约
第3周: 推行新定价策略，监测销售数据
第4周: 启动员工激励计划，总结运营数据

预计总体效果提升: 30-50%`
  };

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
        console.warn('Enhanced AI 服务 API 失败，切换到演示模式:', apiError);
        this.useDemoMode = true;
        return this.getDemoResponse(userMessage);
      }
    } catch (error: any) {
      console.error('增强 AI 服务错误:', error.message);
      throw new Error(`增强 AI 服务错误: ${error.message}`);
    }
  }

  /**
   * 调用 GLM API
   */
  private async callGLMAPI(userMessage: string): Promise<AIResponse> {
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
        timeout: 20000,
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
    let response = '我在演示模式中。';
    
    // 匹配关键词，返回相关的演示建议
    for (const [keyword, demoText] of Object.entries(this.demoRecommendations)) {
      if (userMessage.includes(keyword) || userMessage.includes('请') && keyword === '建议') {
        response = demoText;
        break;
      }
    }

    // 如果没有匹配到关键词，返回默认响应
    if (response === '我在演示模式中。') {
      response = `关于"${userMessage}"的建议：\n\n在演示模式中，我基于系统数据提供预定义的建议。\n\n您可以询问：\n• 高风险客户分析 (点击"流失分析"按钮)\n• 员工排班优化 (点击"排班优化"按钮)\n• 服务定价建议 (点击"定价建议"按钮)\n• 营销活动分析 (点击"营销分析"按钮)\n• 完整智能建议 (点击"智能建议报告"按钮)`;
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

    try {
      return this.chat(prompt);
    } catch (error: any) {
      console.error('获取智能建议失败:', error);
      // 降级到演示模式
      this.useDemoMode = true;
      return this.getDemoResponse('完整建议');
    }
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
