import { SystemData } from './enhancedAIService';

/**
 * 预测分析服务 - 基于历史数据进行业务预测
 */

export interface Prediction {
  metric: string;        // 指标名称
  currentValue: number;  // 当前值
  predictedValue: number; // 预测值
  confidence: number;    // 置信度 0-100
  timeframe: string;     // 预测时间范围
  trend: 'up' | 'down' | 'stable'; // 趋势方向
  recommendation: string; // 建议
  urgency: 'low' | 'medium' | 'high' | 'critical'; // 紧急程度
}

export interface ChurnPrediction extends Prediction {
  customersAtRisk: Array<{
    id: string;
    name: string;
    riskScore: number; // 0-100
    daysSinceVisit: number;
    totalSpent: number;
  }>;
}

export interface RevenuePrediction extends Prediction {
  historicalData: number[];
  seasonality: number; // 季节性因子
}

export interface PeakHourPrediction {
  hour: string;
  expectedAppointments: number;
  recommendedStaff: number;
  confidence: number;
}

class PredictiveAnalysisService {
  /**
   * 预测客户流失风险
   */
  async predictCustomerChurn(systemData: SystemData): Promise<ChurnPrediction> {
    try {
      const customers = systemData.customers;
      const appointments = systemData.appointments;

      if (!customers || !appointments) {
        throw new Error('缺少必要的客户或预约数据');
      }

      // 计算当前流失率
      const currentChurnRate = customers.churnRate || 0;

      // 识别高风险客户
      const customersAtRisk = (customers.highRiskCustomers || [])
        .map((c: any) => ({
          ...c,
          riskScore: this.calculateChurnRisk(
            c.daysSinceLastAppointment,
            c.totalSpent
          ),
        }))
        .sort((a, b) => b.riskScore - a.riskScore)
        .slice(0, 10);

      // 预测下月流失率
      // 简单的线性趋势预测：如果流失率持续上升，下月可能继续上升
      const predictedChurnRate = Math.min(
        currentChurnRate * 1.1,
        35 // 最高不超过 35%
      );

      // 计算置信度
      const confidence = Math.min(
        75 + (customersAtRisk.length > 5 ? 10 : 0),
        95
      );

      // 确定紧急程度
      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (predictedChurnRate > 25) urgency = 'critical';
      else if (predictedChurnRate > 15) urgency = 'high';
      else if (predictedChurnRate > 10) urgency = 'medium';

      const trend = predictedChurnRate > currentChurnRate ? 'up' : 'down';

      return {
        metric: '客户流失率',
        currentValue: currentChurnRate,
        predictedValue: predictedChurnRate,
        confidence,
        timeframe: '下个月',
        trend,
        recommendation: this.generateChurnRecommendation(
          predictedChurnRate,
          customersAtRisk.length
        ),
        urgency,
        customersAtRisk,
      };
    } catch (error: any) {
      console.error('客户流失预测错误:', error.message);
      throw error;
    }
  }

  /**
   * 预测收入趋势
   */
  async predictRevenue(systemData: SystemData): Promise<RevenuePrediction> {
    try {
      const sales = systemData.sales;

      if (!sales) {
        throw new Error('缺少销售数据');
      }

      const currentRevenue = sales.revenueThisMonth || 0;
      const totalRevenue = sales.totalRevenue || 0;
      const growth = sales.growth || 5;

      // 简单的增长预测
      const predictedRevenue = currentRevenue * (1 + growth / 100);

      // 历史数据模拟（实际应该从数据库读取）
      const historicalData = [
        currentRevenue * 0.8,
        currentRevenue * 0.85,
        currentRevenue * 0.9,
        currentRevenue * 0.95,
        currentRevenue,
      ];

      // 计算季节性因子（假设Q4 增长 20%）
      const now = new Date();
      const month = now.getMonth();
      const seasonality = [10, 10, 5, 5, 15, 20, 15, 10, 5, 5, 10, 20][
        month
      ] / 10; // Q4 (10,11) 增长 20%

      const confidence = 70 + (growth > 0 ? 15 : -10);
      const trend =
        predictedRevenue > currentRevenue
          ? 'up'
          : predictedRevenue < currentRevenue
            ? 'down'
            : 'stable';

      let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
      if (growth < 0) urgency = 'high';
      if (growth < -5) urgency = 'critical';

      return {
        metric: '预期收入',
        currentValue: currentRevenue,
        predictedValue: predictedRevenue,
        confidence: Math.min(confidence, 95),
        timeframe: '下个月',
        trend,
        recommendation: this.generateRevenueRecommendation(growth),
        urgency,
        historicalData,
        seasonality,
      };
    } catch (error: any) {
      console.error('收入预测错误:', error.message);
      throw error;
    }
  }

  /**
   * 预测高峰时段
   */
  async predictPeakHours(
    systemData: SystemData
  ): Promise<PeakHourPrediction[]> {
    try {
      const appointments = systemData.appointments;

      if (!appointments) {
        throw new Error('缺少预约数据');
      }

      const peakHours = appointments.peakHours || [];

      // 将预测的高峰小时转换为详细预测
      const predictions: PeakHourPrediction[] = [];

      // 如果有高峰时段数据，基于此预测
      if (peakHours.length > 0) {
        peakHours.forEach((hour: string) => {
          predictions.push({
            hour,
            expectedAppointments: Math.floor(
              appointments.totalThisMonth / 5 / peakHours.length
            ),
            recommendedStaff: Math.ceil(
              (appointments.totalThisMonth / 5 / peakHours.length) / 5
            ),
            confidence: 75,
          });
        });
      } else {
        // 默认预测常见高峰时段
        const defaultPeaks = ['10:00', '14:00', '15:00'];
        defaultPeaks.forEach((hour) => {
          predictions.push({
            hour,
            expectedAppointments: 5,
            recommendedStaff: 2,
            confidence: 60,
          });
        });
      }

      return predictions;
    } catch (error: any) {
      console.error('高峰时段预测错误:', error.message);
      throw error;
    }
  }

  /**
   * 计算客户流失风险分数
   */
  private calculateChurnRisk(daysSinceVisit: number, totalSpent: number): number {
    let riskScore = 0;

    // 基于天数计算
    if (daysSinceVisit >= 90) riskScore += 40;
    else if (daysSinceVisit >= 60) riskScore += 30;
    else if (daysSinceVisit >= 30) riskScore += 15;
    else riskScore += 5;

    // 基于消费金额调整（消费越多，风险越严重）
    if (totalSpent > 3000) riskScore += 20; // 高价值客户流失更严重
    else if (totalSpent > 1500) riskScore += 10;

    return Math.min(riskScore, 100);
  }

  /**
   * 生成流失预防建议
   */
  private generateChurnRecommendation(
    predictedRate: number,
    atRiskCount: number
  ): string {
    if (predictedRate > 20 && atRiskCount > 5) {
      return '流失风险严重，建议立即启动客户关怀计划。重点关注高价值客户，提供专属优惠和个性化服务。预期可挽回30-50%的高风险客户。';
    } else if (predictedRate > 15) {
      return '流失风险较高，建议增加客户沟通频率。发送关怀信息，提供回客优惠，计划开展特色活动吸引回头客。';
    } else if (predictedRate > 10) {
      return '流失风险中等，建议加强客户体验。优化服务质量，收集反馈，改进预约流程。';
    } else {
      return '流失风险可控，建议继续维持现有客户服务质量，定期跟进客户反馈。';
    }
  }

  /**
   * 生成收入预测建议
   */
  private generateRevenueRecommendation(growth: number): string {
    if (growth > 15) {
      return '收入增长强劲。建议：1) 扩大营销投入，乘胜追击；2) 优化产品组合，提高客单价；3) 培养忠诚客户，建立会员体系。预期可实现更高增长。';
    } else if (growth > 5) {
      return '收入稳步增长。建议：1) 继续优化营销策略；2) 推出新服务或产品；3) 提高员工服务质量以提升客户满意度和消费频次。';
    } else if (growth >= 0) {
      return '收入基本持平。建议：1) 分析销售数据找出瓶颈；2) 尝试新的营销渠道；3) 推出促销活动激活客户；4) 考虑提价或推出高价产品。';
    } else if (growth > -10) {
      return '收入轻微下滑。建议：1) 立即分析原因；2) 检查客户满意度；3) 启动客户回访计划；4) 考虑临时促销活动刺激消费。';
    } else {
      return '收入下滑幅度较大，需要立即采取行动。建议：1) 紧急诊断业务问题；2) 启动客户留存计划；3) 推出力度较大的促销活动；4) 考虑调整价格策略；5) 可能需要改革经营模式。';
    }
  }

  /**
   * 生成完整的预测报告
   */
  async generatePredictionReport(systemData: SystemData): Promise<string> {
    try {
      const churnPrediction = await this.predictCustomerChurn(systemData);
      const revenuePrediction = await this.predictRevenue(systemData);
      const peakPredictions = await this.predictPeakHours(systemData);

      const report = `
【AI 预测分析报告】

1. 客户流失预测
   当前流失率：${churnPrediction.currentValue.toFixed(1)}%
   预测流失率：${churnPrediction.predictedValue.toFixed(1)}%
   预测方向：${churnPrediction.trend === 'up' ? '↑ 上升' : churnPrediction.trend === 'down' ? '↓ 下降' : '→ 稳定'}
   高风险客户：${churnPrediction.customersAtRisk.length} 位
   紧急程度：${this.urgencyLabel(churnPrediction.urgency)}
   建议：${churnPrediction.recommendation}

2. 收入预测
   当前月收入：¥${revenuePrediction.currentValue.toFixed(0)}
   预测月收入：¥${revenuePrediction.predictedValue.toFixed(0)}
   预期增长：${((revenuePrediction.predictedValue / revenuePrediction.currentValue - 1) * 100).toFixed(1)}%
   季节性因子：${revenuePrediction.seasonality.toFixed(1)}x
   建议：${revenuePrediction.recommendation}

3. 高峰时段预测
   ${peakPredictions.map((p) => `   ${p.hour}: 预计 ${p.expectedAppointments} 个预约，建议安排 ${p.recommendedStaff} 名员工`).join('\n')}

置信度：
   - 流失预测：${churnPrediction.confidence}%
   - 收入预测：${revenuePrediction.confidence}%
      `;

      return report;
    } catch (error: any) {
      console.error('生成预测报告错误:', error.message);
      throw error;
    }
  }

  private urgencyLabel(
    urgency: 'low' | 'medium' | 'high' | 'critical'
  ): string {
    const labels: Record<
      'low' | 'medium' | 'high' | 'critical',
      string
    > = {
      low: '低 - 常规关注',
      medium: '中 - 需要注意',
      high: '高 - 需要立即行动',
      critical: '严重 - 需要紧急处理',
    };
    return labels[urgency];
  }
}

export const predictiveAnalysisService = new PredictiveAnalysisService();
export default predictiveAnalysisService;
