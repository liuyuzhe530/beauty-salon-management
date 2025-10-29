import { SystemData } from './enhancedAIService';

/**
 * 趋势分析服务 - 识别业务中的长期趋势
 */

export interface Trend {
  name: string;
  direction: 'up' | 'down' | 'stable';
  strength: number;      // 1-10 (趋势强度)
  period: 'week' | 'month' | 'quarter';
  dataPoints: number[];  // 数据序列
  insight: string;       // 洞察
  action: string;        // 建议行动
  startValue?: number;   // 起始值
  endValue?: number;     // 结束值
  changePercent?: number; // 变化百分比
}

class TrendAnalysisService {
  /**
   * 分析客户增长趋势
   */
  async analyzeCustomerTrend(systemData: SystemData): Promise<Trend> {
    try {
      const customers = systemData.customers;

      if (!customers) {
        throw new Error('缺少客户数据');
      }

      const currentTotal = customers.total || 0;
      const newThisMonth = customers.newThisMonth || 0;
      const churnRate = customers.churnRate || 0;

      // 计算趋势指标
      const netGrowth = newThisMonth - (currentTotal * churnRate) / 100;
      const growthRate = currentTotal > 0 ? (netGrowth / currentTotal) * 100 : 0;

      // 判断趋势方向
      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (growthRate > 5) direction = 'up';
      else if (growthRate < -5) direction = 'down';

      // 计算趋势强度 (1-10)
      const strength = Math.min(Math.abs(growthRate / 5) + 1, 10);

      // 模拟历史数据（实际应该从数据库读取）
      const dataPoints = [
        currentTotal * 0.7,
        currentTotal * 0.75,
        currentTotal * 0.82,
        currentTotal * 0.9,
        currentTotal * 0.95,
        currentTotal,
      ];

      const insight = this.generateCustomerTrendInsight(
        direction,
        growthRate,
        newThisMonth,
        churnRate
      );

      const action = this.generateCustomerTrendAction(direction, growthRate);

      return {
        name: '客户增长趋势',
        direction,
        strength: Math.round(strength),
        period: 'month',
        dataPoints,
        insight,
        action,
        startValue: dataPoints[0],
        endValue: currentTotal,
        changePercent: growthRate,
      };
    } catch (error: any) {
      console.error('客户趋势分析错误:', error.message);
      throw error;
    }
  }

  /**
   * 分析收入趋势
   */
  async analyzeRevenueTrend(systemData: SystemData): Promise<Trend> {
    try {
      const sales = systemData.sales;

      if (!sales) {
        throw new Error('缺少销售数据');
      }

      const totalRevenue = sales.totalRevenue || 0;
      const revenueThisMonth = sales.revenueThisMonth || 0;
      const growth = sales.growth || 0;

      // 计算历史月均收入
      const avgMonthlyRevenue = totalRevenue / 6; // 假设 6 个月数据

      // 判断趋势方向
      let direction: 'up' | 'down' | 'stable' = 'stable';
      if (revenueThisMonth > avgMonthlyRevenue * 1.1) direction = 'up';
      else if (revenueThisMonth < avgMonthlyRevenue * 0.9) direction = 'down';

      // 计算趋势强度
      const revenueGrowth = avgMonthlyRevenue > 0
        ? ((revenueThisMonth - avgMonthlyRevenue) / avgMonthlyRevenue) * 100
        : 0;
      const strength = Math.min(Math.abs(revenueGrowth / 15) + 1, 10);

      // 模拟历史数据
      const dataPoints = [
        avgMonthlyRevenue * 0.8,
        avgMonthlyRevenue * 0.85,
        avgMonthlyRevenue * 0.9,
        avgMonthlyRevenue * 0.95,
        avgMonthlyRevenue,
        revenueThisMonth,
      ];

      const insight = this.generateRevenueTrendInsight(
        direction,
        growth,
        revenueGrowth
      );

      const action = this.generateRevenueTrendAction(direction, growth);

      return {
        name: '收入增长趋势',
        direction,
        strength: Math.round(strength),
        period: 'month',
        dataPoints,
        insight,
        action,
        startValue: dataPoints[0],
        endValue: revenueThisMonth,
        changePercent: revenueGrowth,
      };
    } catch (error: any) {
      console.error('收入趋势分析错误:', error.message);
      throw error;
    }
  }

  /**
   * 分析效率趋势
   */
  async analyzeEfficiencyTrend(systemData: SystemData): Promise<Trend> {
    try {
      const appointments = systemData.appointments;
      const staff = systemData.staff;

      if (!appointments || !staff) {
        throw new Error('缺少预约或员工数据');
      }

      // 计算效率指标
      const confirmationRate = appointments.confirmationRate || 0;
      const totalAppointments = appointments.totalThisMonth || 0;
      const activeStaff = staff.activeStaff || 1;

      // 人均日均预约数
      const appointmentsPerStaffPerDay = totalAppointments / (activeStaff * 30);

      // 判断趋势
      let direction: 'up' | 'down' | 'stable' = 'stable';
      const noShowRate = appointments.noShowRate || 0;
      const efficiency =
        (confirmationRate * (100 - noShowRate)) / 10000 * appointmentsPerStaffPerDay;

      if (confirmationRate > 92 && noShowRate < 3) direction = 'up';
      else if (confirmationRate < 85 || noShowRate > 5) direction = 'down';

      // 趋势强度
      const efficiencyChange =
        confirmationRate > 90 ? (confirmationRate - 85) / 5 : -(90 - confirmationRate) / 5;
      const strength = Math.min(Math.abs(efficiencyChange) + 3, 10);

      // 模拟历史数据
      const dataPoints = [80, 82, 85, 88, 90, confirmationRate];

      const insight = this.generateEfficiencyTrendInsight(
        direction,
        confirmationRate,
        noShowRate
      );

      const action = this.generateEfficiencyTrendAction(
        direction,
        confirmationRate
      );

      return {
        name: '运营效率趋势',
        direction,
        strength: Math.round(strength),
        period: 'month',
        dataPoints,
        insight,
        action,
        startValue: dataPoints[0],
        endValue: confirmationRate,
        changePercent: confirmationRate - dataPoints[0],
      };
    } catch (error: any) {
      console.error('效率趋势分析错误:', error.message);
      throw error;
    }
  }

  /**
   * 生成完整的趋势分析报告
   */
  async generateTrendReport(systemData: SystemData): Promise<string> {
    try {
      const customerTrend = await this.analyzeCustomerTrend(systemData);
      const revenueTrend = await this.analyzeRevenueTrend(systemData);
      const efficiencyTrend = await this.analyzeEfficiencyTrend(systemData);

      const report = `
【AI 趋势分析报告】

1. 客户增长趋势
   趋势方向：${this.directionEmoji(customerTrend.direction)} ${customerTrend.direction === 'up' ? '上升' : customerTrend.direction === 'down' ? '下降' : '稳定'}
   趋势强度：${'█'.repeat(customerTrend.strength)}${'░'.repeat(10 - customerTrend.strength)} (${customerTrend.strength}/10)
   变化幅度：${customerTrend.changePercent?.toFixed(1)}%
   洞察：${customerTrend.insight}
   建议：${customerTrend.action}

2. 收入增长趋势
   趋势方向：${this.directionEmoji(revenueTrend.direction)} ${revenueTrend.direction === 'up' ? '上升' : revenueTrend.direction === 'down' ? '下降' : '稳定'}
   趋势强度：${'█'.repeat(revenueTrend.strength)}${'░'.repeat(10 - revenueTrend.strength)} (${revenueTrend.strength}/10)
   变化幅度：${revenueTrend.changePercent?.toFixed(1)}%
   洞察：${revenueTrend.insight}
   建议：${revenueTrend.action}

3. 运营效率趋势
   趋势方向：${this.directionEmoji(efficiencyTrend.direction)} ${efficiencyTrend.direction === 'up' ? '提升' : efficiencyTrend.direction === 'down' ? '下降' : '稳定'}
   趋势强度：${'█'.repeat(efficiencyTrend.strength)}${'░'.repeat(10 - efficiencyTrend.strength)} (${efficiencyTrend.strength}/10)
   变化幅度：${efficiencyTrend.changePercent?.toFixed(1)}%
   洞察：${efficiencyTrend.insight}
   建议：${efficiencyTrend.action}

总体评价：
${this.generateOverallTrendAssessment(customerTrend, revenueTrend, efficiencyTrend)}
      `;

      return report;
    } catch (error: any) {
      console.error('生成趋势报告错误:', error.message);
      throw error;
    }
  }

  private generateCustomerTrendInsight(
    direction: string,
    growthRate: number,
    newThisMonth: number,
    churnRate: number
  ): string {
    if (direction === 'up' && growthRate > 10) {
      return `客户增长强劲，新增客户${newThisMonth}位，流失率${churnRate}%，年化客户增长可达${(growthRate * 12).toFixed(0)}%`;
    } else if (direction === 'up') {
      return `客户稳步增长，新增客户${newThisMonth}位，流失率${churnRate}%，需继续维持增长动力`;
    } else if (direction === 'down' && growthRate < -5) {
      return `客户增长停滞，甚至出现流失，流失率${churnRate}%，需立即采取行动`;
    } else if (direction === 'down') {
      return `客户增速放缓，流失率${churnRate}%，需要加强营销和客户关怀`;
    } else {
      return `客户总数基本稳定，在${newThisMonth}位新增和${churnRate}%流失之间达到平衡`;
    }
  }

  private generateCustomerTrendAction(
    direction: string,
    growthRate: number
  ): string {
    if (direction === 'up' && growthRate > 10) {
      return '继续加大营销投入，优化客户体验，建立客户转介绍体系，实现更高的增长';
    } else if (direction === 'up') {
      return '保持现有营销策略，同时测试新的获客渠道，提升客户满意度';
    } else if (direction === 'down') {
      return '紧急启动客户留存计划，分析流失原因，改善服务质量，推出回客优惠';
    } else {
      return '优化客户获取和保留的平衡，提升新客转化率和客户生命周期价值';
    }
  }

  private generateRevenueTrendInsight(
    direction: string,
    growth: number,
    revenueGrowth: number
  ): string {
    if (growth > 15) {
      return `收入增长强劲，环比增长${revenueGrowth.toFixed(1)}%，增长率${growth}%，持续增长势头良好`;
    } else if (growth > 5) {
      return `收入稳步增长，环比增长${revenueGrowth.toFixed(1)}%，增长率${growth}%，基础稳定`;
    } else if (growth >= -5) {
      return `收入基本持平或小幅波动，环比变化${revenueGrowth.toFixed(1)}%，需要新的增收驱动力`;
    } else {
      return `收入出现下滑趋势，环比下降${Math.abs(revenueGrowth).toFixed(1)}%，需要立即采取对策`;
    }
  }

  private generateRevenueTrendAction(direction: string, growth: number): string {
    if (growth > 15) {
      return '扩大营销投入，优化产品定价，发展高端客户，目标是实现更高的增长率';
    } else if (growth > 5) {
      return '继续优化营销策略，推出新服务或产品，提升客户消费频次';
    } else if (growth >= -5) {
      return '分析销售数据找出瓶颈，尝试新营销渠道，考虑推出促销或优惠活动';
    } else {
      return '紧急采取行动：分析下降原因，启动客户回访计划，推出力度较大的促销活动';
    }
  }

  private generateEfficiencyTrendInsight(
    direction: string,
    confirmationRate: number,
    noShowRate: number
  ): string {
    if (confirmationRate > 92 && noShowRate < 3) {
      return `运营效率优秀，预约确认率${confirmationRate}%，爽约率${noShowRate}%，服务质量和流程设计良好`;
    } else if (confirmationRate > 85) {
      return `运营效率良好，预约确认率${confirmationRate}%，爽约率${noShowRate}%，基本达到预期`;
    } else if (confirmationRate < 75 || noShowRate > 7) {
      return `运营效率下降，预约确认率${confirmationRate}%，爽约率${noShowRate}%，需改善预约管理`;
    } else {
      return `运营效率中等，预约确认率${confirmationRate}%，爽约率${noShowRate}%，有提升空间`;
    }
  }

  private generateEfficiencyTrendAction(
    direction: string,
    confirmationRate: number
  ): string {
    if (confirmationRate > 92) {
      return '继续保持现有流程，可考虑扩展服务时段或提升客户等级服务';
    } else if (confirmationRate > 85) {
      return '分析确认率数据，优化提醒机制，改善排班计划，提升客户粘性';
    } else if (confirmationRate > 75) {
      return '改进预约确认流程，加强客户提醒，培训员工确认技巧';
    } else {
      return '紧急改革预约管理系统，分析爽约原因，优化预约时间段，制定奖惩机制';
    }
  }

  private generateOverallTrendAssessment(
    customerTrend: Trend,
    revenueTrend: Trend,
    efficiencyTrend: Trend
  ): string {
    const upCount = [customerTrend, revenueTrend, efficiencyTrend].filter(
      (t) => t.direction === 'up'
    ).length;

    if (upCount === 3) {
      return '业务全面发展，三大指标均向上，建议抓住机遇，加大投入和创新力度，实现突破性增长';
    } else if (upCount === 2) {
      return '业务整体向好，两大主要指标向上，建议巩固优势，同时关注下滑指标的改善';
    } else if (upCount === 1) {
      return '业务发展不均衡，需要全面诊断问题所在，制定均衡发展战略';
    } else {
      return '业务面临压力，三大指标均处于下滑或停滞，需要紧急采取全面改革措施';
    }
  }

  private directionEmoji(direction: string): string {
    if (direction === 'up') return '';
    if (direction === 'down') return '';
    return '️';
  }
}

export const trendAnalysisService = new TrendAnalysisService();
export default trendAnalysisService;
