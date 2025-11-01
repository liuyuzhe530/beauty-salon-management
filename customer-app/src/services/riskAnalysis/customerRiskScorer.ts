/**
 * 客户流失风险评分服务
 * 使用多维度综合评估客户流失风险，而不仅基于预约频率
 */

export interface Customer {
  id: string;
  name: string;
  totalSpent: number;
  satisfaction?: number;
  joinDate?: string;
  lastAppointmentDate?: string;
}

export interface RiskAssessment {
  customerId: string;
  customerName: string;
  totalRiskScore: number; // 0-100
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  dimensionScores: {
    recency: number; // 近期性维度 (40%)
    frequency: number; // 频率维度 (20%)
    monetary: number; // 消费金额维度 (20%)
    satisfaction: number; // 满意度维度 (10%)
    signals: number; // 流失信号维度 (10%)
  };
  churnSignals: string[];
  retentionStrategy: {
    urgency: string;
    actions: string[];
    budget: number;
    expectedSuccess: number;
  };
}

export class CustomerRiskScorer {
  /**
   * 计算客户流失风险分数（0-100）
   * 使用加权多维度评分模型
   */
  calculateRiskScore(
    customer: Customer,
    allAppointments: any[] = [],
    allCustomers: any[] = []
  ): RiskAssessment {
    // 维度1: 近期性 (40%) - 最后预约距离现在多久
    const recencyScore = this.calculateRecencyScore(customer, allAppointments);

    // 维度2: 频率 (20%) - 预约频率如何
    const frequencyScore = this.calculateFrequencyScore(customer, allAppointments);

    // 维度3: 消费金额 (20%) - 总消费金额多少
    const monetaryScore = this.calculateMonetaryScore(customer);

    // 维度4: 满意度 (10%) - 客户满意度评分
    const satisfactionScore = this.calculateSatisfactionScore(customer);

    // 维度5: 流失信号 (10%) - 是否有明显流失迹象
    const churnSignals = this.detectChurnSignals(customer, allAppointments);
    const signalsScore = this.calculateSignalsScore(churnSignals);

    // 计算总分
    const totalRiskScore = Math.round(
      recencyScore * 0.4 +
      frequencyScore * 0.2 +
      monetaryScore * 0.2 +
      satisfactionScore * 0.1 +
      signalsScore * 0.1
    );

    // 分类风险等级
    const riskLevel = this.classifyRiskLevel(totalRiskScore);

    // 生成保留策略
    const retentionStrategy = this.generateRetentionStrategy(
      customer,
      totalRiskScore,
      churnSignals,
      allCustomers
    );

    return {
      customerId: customer.id,
      customerName: customer.name,
      totalRiskScore,
      riskLevel,
      dimensionScores: {
        recency: recencyScore,
        frequency: frequencyScore,
        monetary: monetaryScore,
        satisfaction: satisfactionScore,
        signals: signalsScore,
      },
      churnSignals,
      retentionStrategy,
    };
  }

  /**
   * 维度1: 近期性评分 (RFM 中的 R)
   * 关键：最后一次预约距离现在有多久
   */
  private calculateRecencyScore(customer: Customer, appointments: any[]): number {
    if (!customer.lastAppointmentDate && (!appointments || appointments.length === 0)) {
      return 100; // 从未预约，最高风险
    }

    const now = new Date();
    let lastAppointmentDate: Date;

    if (customer.lastAppointmentDate) {
      lastAppointmentDate = new Date(customer.lastAppointmentDate);
    } else {
      // 从预约记录中找最新的
      const customerAppointments = appointments.filter(
        (a) => a.customerId === customer.id || a.customerName === customer.name
      );
      if (customerAppointments.length === 0) {
        return 100;
      }
      lastAppointmentDate = new Date(
        Math.max(...customerAppointments.map((a) => new Date(a.date).getTime()))
      );
    }

    const daysSinceLastAppointment = Math.floor(
      (now.getTime() - lastAppointmentDate.getTime()) / (24 * 60 * 60 * 1000)
    );

    // 评分标准
    if (daysSinceLastAppointment <= 30) return 0; // 最近 1 个月内预约 → 最安全
    if (daysSinceLastAppointment <= 60) return 25; // 2 个月内 → 低风险
    if (daysSinceLastAppointment <= 90) return 50; // 3 个月内 → 中等风险
    if (daysSinceLastAppointment <= 180) return 75; // 6 个月内 → 高风险
    return 100; // 6 个月以上 → 最高风险
  }

  /**
   * 维度2: 频率评分 (RFM 中的 F)
   * 关键：预约频率是否稳定
   */
  private calculateFrequencyScore(customer: Customer, appointments: any[]): number {
    const customerAppointments = appointments.filter(
      (a) => a.customerId === customer.id || a.customerName === customer.name
    );

    if (customerAppointments.length === 0) {
      return 100; // 从未预约 → 最高风险
    }

    const totalAppointments = customerAppointments.length;
    const now = new Date();
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // 统计 6 个月内的预约频率
    const recentAppointments = customerAppointments.filter(
      (a) => new Date(a.date) > sixMonthsAgo
    );

    const monthlyFrequency = (recentAppointments.length / 6).toFixed(1); // 平均每月预约次数

    // 评分标准（预期是每月 1-2 次）
    if (parseFloat(monthlyFrequency) >= 1.5) return 0; // 每月 1.5 次+ → 优秀
    if (parseFloat(monthlyFrequency) >= 1) return 20; // 每月 1 次 → 正常
    if (parseFloat(monthlyFrequency) >= 0.5) return 50; // 每月 0.5 次 → 下降
    if (parseFloat(monthlyFrequency) > 0) return 75; // 偶尔来 → 风险
    return 100; // 完全不来 → 最高风险
  }

  /**
   * 维度3: 消费金额评分 (RFM 中的 M)
   * 关键：客户生命周期价值（更值钱的客户需要重点关注）
   */
  private calculateMonetaryScore(customer: Customer): number {
    const totalSpent = customer.totalSpent || 0;

    // 评分标准（假设平均消费 ¥500 为基准）
    if (totalSpent >= 5000) return 0; // 大客户 5000+ → 最安全，必须保留
    if (totalSpent >= 2000) return 20; // 重要客户 2000+ → 价值高
    if (totalSpent >= 500) return 50; // 普通客户 500+ → 中等价值
    if (totalSpent > 0) return 75; // 小额客户 → 价值低
    return 100; // 从未消费 → 最低价值
  }

  /**
   * 维度4: 满意度评分
   * 关键：客户对服务的满意度
   */
  private calculateSatisfactionScore(customer: Customer): number {
    const satisfaction = customer.satisfaction || 0; // 假设是 0-100 分

    // 反向计算（满意度低 = 风险高）
    if (satisfaction >= 90) return 0; // 非常满意 → 最安全
    if (satisfaction >= 80) return 15; // 满意 → 低风险
    if (satisfaction >= 70) return 40; // 一般 → 中等风险
    if (satisfaction >= 60) return 70; // 不太满意 → 高风险
    return 100; // 很不满意 → 最高风险
  }

  /**
   * 检测流失信号
   * 关键：识别具体的风险迹象
   */
  private detectChurnSignals(customer: Customer, appointments: any[]): string[] {
    const signals: string[] = [];
    const customerAppointments = appointments.filter(
      (a) => a.customerId === customer.id || a.customerName === customer.name
    );

    if (customerAppointments.length === 0) return ['从未预约'];

    // 信号1: 预约频率下降
    const now = new Date();
    const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    const last3MonthsCount = customerAppointments.filter(
      (a) => new Date(a.date) > threeMonthsAgo
    ).length;
    const last6MonthsCount = customerAppointments.filter(
      (a) => new Date(a.date) > sixMonthsAgo
    ).length;

    if (last3MonthsCount < last6MonthsCount / 2) {
      signals.push('近期预约频率明显下降');
    }

    // 信号2: 取消或爽约
    const cancelledOrNoShow = customerAppointments.filter((a) => {
      const status = (a.status || '').toLowerCase();
      return status === 'cancelled' || status === 'no-show' || status === 'noshow';
    }).length;

    if (cancelledOrNoShow > 0) {
      signals.push(`有 ${cancelledOrNoShow} 次取消或爽约记录`);
    }

    // 信号3: 消费金额下降
    const recentSpent =
      customerAppointments
        .filter((a) => new Date(a.date) > threeMonthsAgo)
        .reduce((sum, a) => sum + (a.amount || 0), 0) || 0;
    const historicalSpent =
      customerAppointments
        .filter((a) => new Date(a.date) > sixMonthsAgo && new Date(a.date) <= threeMonthsAgo)
        .reduce((sum, a) => sum + (a.amount || 0), 0) || 0;

    if (historicalSpent > 0 && recentSpent < historicalSpent / 2) {
      signals.push('消费金额明显下降');
    }

    // 信号4: 负面反馈
    const negativeRatings = customerAppointments.filter((a) => (a.rating || 0) < 3).length;
    if (negativeRatings > 0) {
      signals.push(`有 ${negativeRatings} 次低评价`);
    }

    return signals.length > 0 ? signals : ['暂无明显风险信号'];
  }

  /**
   * 根据流失信号计算得分
   */
  private calculateSignalsScore(signals: string[]): number {
    if (signals.length === 0) return 0;
    // 每个信号加 20 分，最多 100 分
    return Math.min(signals.length * 20, 100);
  }

  /**
   * 分类客户风险等级
   */
  private classifyRiskLevel(score: number): 'low' | 'medium' | 'high' | 'critical' {
    if (score < 25) return 'low';
    if (score < 50) return 'medium';
    if (score < 75) return 'high';
    return 'critical';
  }

  /**
   * 根据风险等级和客户价值生成个性化保留策略
   */
  private generateRetentionStrategy(
    customer: Customer,
    riskScore: number,
    signals: string[],
    allCustomers: any[] = []
  ): RiskAssessment['retentionStrategy'] {
    const riskLevel = this.classifyRiskLevel(riskScore);
    const totalSpent = customer.totalSpent || 0;

    // 根据风险等级确定紧迫性
    const urgencies: { [key: string]: string } = {
      low: '长期观察',
      medium: '关注与提醒',
      high: '主动介入',
      critical: '立即行动',
    };

    // 根据风险等级和客户价值确定策略
    let actions: string[] = [];
    let budget = 0;
    let expectedSuccess = 0;

    if (riskLevel === 'critical') {
      // 最高风险，需要立即行动
      actions = [
        '管理者直接致电或访问',
        '提供特殊优惠或折扣（基于客户价值调整）',
        '安排免费体验或升级服务',
        '了解不满意原因，制定改进方案',
      ];

      // 根据客户价值调整预算
      if (totalSpent >= 2000) {
        budget = 500; // 高价值客户
        expectedSuccess = 0.65;
        actions.push('考虑VIP保留计划');
      } else {
        budget = 200; // 普通客户
        expectedSuccess = 0.45;
      }
    } else if (riskLevel === 'high') {
      actions = [
        '员工主动联系，了解情况',
        '提供有针对性的优惠或新产品推荐',
        '邀请参加会员活动或新产品发布会',
        '赠送小礼物或免费体验',
      ];

      if (totalSpent >= 2000) {
        budget = 300;
        expectedSuccess = 0.55;
      } else {
        budget = 100;
        expectedSuccess = 0.35;
      }
    } else if (riskLevel === 'medium') {
      actions = [
        '定期发送个性化推荐',
        '邀请参加营销活动',
        '提供会员专属优惠',
      ];
      budget = 50;
      expectedSuccess = 0.7;
    } else {
      // 低风险
      actions = [
        '继续提供优质服务',
        '定期关怀和跟进',
        '邀请参加VIP活动',
      ];
      budget = 20;
      expectedSuccess = 0.9;
    }

    return {
      urgency: urgencies[riskLevel],
      actions,
      budget,
      expectedSuccess,
    };
  }

  /**
   * 批量评估多个客户的风险
   */
  assessBatch(customers: Customer[], appointments: any[] = []): RiskAssessment[] {
    return customers.map((customer) =>
      this.calculateRiskScore(customer, appointments, customers)
    );
  }

  /**
   * 获取高风险客户列表
   */
  getHighRiskCustomers(assessments: RiskAssessment[]): RiskAssessment[] {
    return assessments.filter((a) =>
      ['high', 'critical'].includes(a.riskLevel)
    );
  }

  /**
   * 获取最优保留预算分配
   */
  getOptimalBudgetAllocation(
    assessments: RiskAssessment[],
    totalBudget: number
  ): { customerId: string; customerName: string; budget: number }[] {
    return assessments
      .sort((a, b) => {
        // 优先级：高价值的高风险客户
        const aValue = a.retentionStrategy.expectedSuccess * a.retentionStrategy.budget;
        const bValue = b.retentionStrategy.expectedSuccess * b.retentionStrategy.budget;
        return bValue - aValue;
      })
      .slice(0, Math.ceil(totalBudget / 50)) // 假设平均预算 50
      .map((assessment) => ({
        customerId: assessment.customerId,
        customerName: assessment.customerName,
        budget: assessment.retentionStrategy.budget,
      }));
  }
}

// 导出单例
export const customerRiskScorer = new CustomerRiskScorer();
