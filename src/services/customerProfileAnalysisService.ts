import { Customer, Staff } from '../types/index';

/**
 * 客户画像分析服务
 * 根据客户数据进行深度分析，提供美容师匹配建议
 */

export interface CustomerPortrait {
  customerId: string;
  customerName: string;
  
  // 客户特征
  characteristics: {
    skinType: string;
    primaryConcerns: string[];
    preferredBudget: string;
    visitFrequency: string;
  };

  // 家庭背景
  familyBackground: {
    maritalStatus: string;
    familySize: number;
    lifeStage: string;
  };

  // 消费行为分析
  consumptionBehavior: {
    averageSpending: number;
    visitPattern: string;
    servicePreferences: string[];
    productAffinities: string[];
  };

  // 美容师匹配建议
  staffMatchings: Array<{
    staffId: string;
    staffName: string;
    matchScore: number; // 0-100
    matchReasons: string[];
    complementarySkills: string[];
  }>;

  // AI 生成的客户洞察
  aiInsights: {
    personality: string;
    needsAnalysis: string[];
    recommendedServices: string[];
    purchaseMotivation: string;
    retentionStrategies: string[];
  };

  // 细分标签
  segments: string[];
}

class CustomerProfileAnalysisService {
  /**
   * 生成完整的客户画像
   */
  analyzeCustomerProfile(
    customer: Customer,
    staffList: Staff[] = []
  ): CustomerPortrait {
    try {
      const characteristics = this.analyzeCharacteristics(customer);
      const familyBackground = this.analyzeFamilyBackground(customer);
      const consumptionBehavior = this.analyzeConsumptionBehavior(customer);
      const staffMatchings = this.generateStaffMatchings(customer, staffList);
      const aiInsights = this.generateAIInsights(customer, characteristics);
      const segments = this.generateSegments(customer, characteristics);

      return {
        customerId: customer.id,
        customerName: customer.name,
        characteristics,
        familyBackground,
        consumptionBehavior,
        staffMatchings,
        aiInsights,
        segments,
      };
    } catch (error: any) {
      console.error('客户画像分析错误:', error.message);
      throw error;
    }
  }

  /**
   * 分析客户特征
   */
  private analyzeCharacteristics(customer: Customer) {
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};

    return {
      skinType: preferences.skinType || '未知肤质',
      primaryConcerns: preferences.skinConcerns || ['综合护理'],
      preferredBudget: preferences.budget || 'standard',
      visitFrequency: profile.consumptionPattern?.visitFrequency || 'monthly',
    };
  }

  /**
   * 分析家庭背景
   */
  private analyzeFamilyBackground(customer: Customer) {
    const profile = customer.profile || {};
    const family = profile.family || {};
    const lifestyle = profile.lifestyle || {};

    const lifeStage = this.inferLifeStage(
      family.maritalStatus,
      family.hasChildren,
      lifestyle.ageRange
    );

    return {
      maritalStatus: family.maritalStatus || '未知',
      familySize: family.familyMembers || 1,
      lifeStage,
    };
  }

  /**
   * 推断生活阶段
   */
  private inferLifeStage(
    maritalStatus?: string,
    hasChildren?: boolean,
    ageRange?: string
  ): string {
    if (!maritalStatus) return '其他';

    if (maritalStatus === '已婚' && hasChildren) return '家庭期';
    if (maritalStatus === '已婚' && !hasChildren) return '新婚期';
    if (maritalStatus === '未婚' && ageRange?.includes('20-30')) return '职业起步期';
    if (maritalStatus === '未婚') return '单身期';
    if (maritalStatus === '离异') return '新生活期';

    return '其他';
  }

  /**
   * 分析消费行为
   */
  private analyzeConsumptionBehavior(customer: Customer) {
    const profile = customer.profile || {};
    const consumptionPattern = profile.consumptionPattern || {};
    const preferences = profile.preferences || {};

    return {
      averageSpending:
        consumptionPattern.averagePerVisit ||
        (customer.totalSpending / Math.max(customer.visitCount, 1)),
      visitPattern:
        consumptionPattern.visitFrequency === 'weekly'
          ? '高频'
          : consumptionPattern.visitFrequency === 'monthly'
            ? '常规'
            : consumptionPattern.visitFrequency === 'irregular'
              ? '低频'
              : '中频',
      servicePreferences: preferences.preferredServices || ['护肤'],
      productAffinities: this.inferProductAffinities(customer),
    };
  }

  /**
   * 推断产品偏好
   */
  private inferProductAffinities(customer: Customer): string[] {
    const affinities: string[] = [];
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};

    // 根据消费额推断偏好
    if (customer.totalSpending > 10000) {
      affinities.push('高端护肤品');
      affinities.push('定制产品');
    }
    if (customer.totalSpending > 5000) {
      affinities.push('专业护肤线');
      affinities.push('套装产品');
    }

    // 根据皮肤问题推断偏好
    if (preferences.skinConcerns?.includes('衰老')) {
      affinities.push('抗衰老产品');
      affinities.push('精华液');
    }
    if (preferences.skinConcerns?.includes('敏感')) {
      affinities.push('舒缓系列');
      affinities.push('天然成分');
    }
    if (preferences.skinConcerns?.includes('痘痘')) {
      affinities.push('控油产品');
      affinities.push('清洁系列');
    }

    return affinities.length > 0 ? affinities : ['基础护肤'];
  }

  /**
   * 生成美容师匹配建议
   */
  private generateStaffMatchings(customer: Customer, staffList: Staff[]): any[] {
    const profile = customer.profile || {};
    const staffAffinity = profile.staffAffinity || {};

    const matchings = staffList.map((staff) => {
      const score = this.calculateStaffMatchScore(customer, staff, staffAffinity);
      const reasons = this.generateMatchReasons(customer, staff, score);
      const skills = this.inferComplementarySkills(customer, staff);

      return {
        staffId: staff.id,
        staffName: staff.name,
        matchScore: score,
        matchReasons: reasons,
        complementarySkills: skills,
      };
    });

    // 按匹配分数排序
    return matchings.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * 计算美容师匹配分数
   */
  private calculateStaffMatchScore(
    customer: Customer,
    staff: Staff,
    affinities: { [key: string]: number }
  ): number {
    let score = 50; // 基础分

    // 1. 历史亲和度
    const historicalAffinity = affinities[staff.id] || 0;
    score += historicalAffinity * 0.3;

    // 2. 专业技能匹配
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};
    const primaryConcern = preferences.skinConcerns?.[0] || '';

    const skillMatch = staff.specialty.some((s) =>
      primaryConcern.toLowerCase().includes(s.toLowerCase())
    )
      ? 20
      : 0;
    score += skillMatch;

    // 3. 评分和经验
    const ratingBonus = (staff.rating / 5) * 15;
    score += ratingBonus;

    // 4. 客户量平衡（倾向客户少的美容师）
    const clientLoadPenalty = Math.max(0, (staff.clientCount - 20) * 0.5);
    score -= clientLoadPenalty;

    // 5. 消费能力匹配
    const budgetMatch = this.evaluateBudgetMatch(
      customer,
      staff.totalRevenue / Math.max(staff.clientCount, 1)
    );
    score += budgetMatch;

    return Math.min(100, Math.max(0, score));
  }

  /**
   * 评估消费能力匹配
   */
  private evaluateBudgetMatch(customer: Customer, staffAveragePrice: number): number {
    const profile = customer.profile || {};
    const consumptionPattern = profile.consumptionPattern || {};
    const customerAvgSpending =
      consumptionPattern.averagePerVisit ||
      (customer.totalSpending / Math.max(customer.visitCount, 1));

    const priceDifference = Math.abs(customerAvgSpending - staffAveragePrice);
    const similarity = Math.max(0, 20 - priceDifference / 20);

    return similarity;
  }

  /**
   * 生成匹配原因
   */
  private generateMatchReasons(customer: Customer, staff: Staff, score: number): string[] {
    const reasons: string[] = [];
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};

    // 评分高
    if (staff.rating >= 4.8) {
      reasons.push('美容师评分高（' + staff.rating + '星）');
    }

    // 专业技能匹配
    if (staff.specialty.length > 0) {
      reasons.push('专业技能：' + staff.specialty.slice(0, 2).join('、'));
    }

    // 经验丰富
    if (staff.experience >= 5) {
      reasons.push('经验丰富（' + staff.experience + '年）');
    }

    // 客户反馈好
    if (staff.clientCount > 50) {
      reasons.push('服务客户多，口碑好');
    }

    // 个性化建议
    if (score >= 80) {
      reasons.push('与您的需求高度匹配');
    } else if (score >= 60) {
      reasons.push('与您的需求匹配较好');
    }

    return reasons.length > 0 ? reasons : ['推荐美容师'];
  }

  /**
   * 推断互补技能
   */
  private inferComplementarySkills(customer: Customer, staff: Staff): string[] {
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};
    const primaryConcern = preferences.skinConcerns?.[0] || '';

    const skills: string[] = [];

    // 如果客户有皮肤问题，推荐相应美容师技能
    if (primaryConcern.includes('敏感')) {
      if (staff.specialty.includes('敏感肌护理')) {
        skills.push('敏感肌管理');
      }
    }
    if (primaryConcern.includes('衰老')) {
      if (staff.specialty.includes('抗衰')) {
        skills.push('抗衰老方案');
      }
    }

    // 推荐特色服务
    skills.push(...staff.specialty.slice(0, 2));

    return [...new Set(skills)];
  }

  /**
   * 生成 AI 洞察
   */
  private generateAIInsights(customer: Customer, characteristics: any) {
    const profile = customer.profile || {};
    const lifestyle = profile.lifestyle || {};
    const consumptionPattern = profile.consumptionPattern || {};

    return {
      personality: this.inferPersonality(customer, characteristics),
      needsAnalysis: this.analyzeNeeds(customer, characteristics),
      recommendedServices: this.recommendServices(customer, characteristics),
      purchaseMotivation: this.analyzePurchaseMotivation(customer),
      retentionStrategies: this.generateRetentionStrategies(customer, characteristics),
    };
  }

  /**
   * 推断客户性格
   */
  private inferPersonality(customer: Customer, characteristics: any): string {
    const profile = customer.profile || {};
    const lifestyle = profile.lifestyle || {};
    const status = customer.status;

    if (status === 'vip') {
      return '忠诚且有品味的客户，追求高质量服务和个性化体验';
    }
    if (status === 'active') {
      return '活跃消费者，对美容护理有持续的热情和需求';
    }
    if (status === 'atrisk') {
      return '需要关怀的客户，可能因为其他原因减少访问频率';
    }
    if (status === 'inactive') {
      return '曾经的客户，需要重新激发对美容服务的兴趣';
    }

    return '潜在客户，需要开发';
  }

  /**
   * 分析客户需求
   */
  private analyzeNeeds(customer: Customer, characteristics: any): string[] {
    const needs: string[] = [];
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};

    // 基于皮肤问题
    if (preferences.skinConcerns?.includes('衰老')) {
      needs.push('抗衰老解决方案');
      needs.push('定期深层护理');
    }
    if (preferences.skinConcerns?.includes('敏感')) {
      needs.push('温和护肤方案');
      needs.push('皮肤屏障修复');
    }
    if (preferences.skinConcerns?.includes('痘痘')) {
      needs.push('清洁和控油');
      needs.push('痘痘快速消退');
    }

    // 基于消费频率
    if (characteristics.visitFrequency === 'weekly') {
      needs.push('长期护肤规划');
      needs.push('会员权益优化');
    }

    // 基于消费金额
    if (customer.totalSpending > 10000) {
      needs.push('定制护肤方案');
      needs.push('VIP 服务体验');
    }

    return needs.length > 0 ? needs : ['基础护肤需求'];
  }

  /**
   * 推荐服务
   */
  private recommendServices(customer: Customer, characteristics: any): string[] {
    const recommendations: string[] = [];
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};

    // 推荐基础服务
    if (preferences.skinConcerns?.includes('衰老')) {
      recommendations.push('深层抗衰护理');
      recommendations.push('提拉紧致疗程');
    } else if (preferences.skinConcerns?.includes('敏感')) {
      recommendations.push('舒缓修护护理');
      recommendations.push('皮肤屏障修复');
    } else {
      recommendations.push('基础护肤套餐');
      recommendations.push('清洁护理');
    }

    // 推荐组合服务
    if (customer.visitCount > 10) {
      recommendations.push('定制护肤方案');
      recommendations.push('季节护理套餐');
    }

    return recommendations;
  }

  /**
   * 分析购买动机
   */
  private analyzePurchaseMotivation(customer: Customer): string {
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};
    const lifestyle = profile.lifestyle || {};

    if (preferences.budget === 'luxury' || customer.totalSpending > 10000) {
      return '追求高端品质和专业护肤效果';
    }
    if (customer.appointmentCount > 20) {
      return '对美容护肤有深度认知，定期维护肌肤';
    }
    if (customer.status === 'vip') {
      return '忠诚客户，信任美容师和服务质量';
    }
    if (preferences.skinConcerns && preferences.skinConcerns.length > 0) {
      return '针对特定皮肤问题寻求解决方案';
    }

    return '追求美丽与自信，提升生活品质';
  }

  /**
   * 生成留存策略
   */
  private generateRetentionStrategies(customer: Customer, characteristics: any): string[] {
    const strategies: string[] = [];
    const lastVisit = new Date(customer.lastVisit);
    const daysSinceVisit = Math.floor(
      (new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (customer.status === 'atrisk') {
      strategies.push('定期关怀电话，了解客户需求');
      strategies.push('提供特价优惠或免费体验服务');
      strategies.push('邀请参加新品发布或特别活动');
    }

    if (customer.status === 'active' || customer.status === 'vip') {
      strategies.push('建立VIP会员专属服务');
      strategies.push('定期推送个性化护肤建议');
      strategies.push('优先预约高评分美容师');
    }

    if (daysSinceVisit > 60) {
      strategies.push('生日或周年纪念特别优惠');
      strategies.push('免费皮肤诊断和方案设计');
    }

    strategies.push('建立转介绍奖励计划');
    strategies.push('提供在线护肤咨询服务');

    return strategies;
  }

  /**
   * 生成客户细分标签
   */
  private generateSegments(customer: Customer, characteristics: any): string[] {
    const segments: string[] = [];
    const profile = customer.profile || {};
    const preferences = profile.preferences || {};
    const consumptionPattern = profile.consumptionPattern || {};

    // 按消费金额分段
    if (customer.totalSpending > 10000) {
      segments.push('高价值客户');
    } else if (customer.totalSpending > 5000) {
      segments.push('中价值客户');
    } else {
      segments.push('基础客户');
    }

    // 按访问频率分段
    if (consumptionPattern.visitFrequency === 'weekly') {
      segments.push('高频客户');
    } else if (consumptionPattern.visitFrequency === 'monthly') {
      segments.push('常规客户');
    } else {
      segments.push('低频客户');
    }

    // 按状态分段
    if (customer.status === 'vip') {
      segments.push('VIP客户');
    } else if (customer.status === 'atrisk') {
      segments.push('流失风险');
    }

    // 按需求分段
    if (preferences.skinConcerns?.includes('敏感')) {
      segments.push('敏感肌用户');
    }
    if (preferences.skinConcerns?.includes('衰老')) {
      segments.push('抗衰需求');
    }

    return [...new Set(segments)];
  }
}

export const customerProfileAnalysisService = new CustomerProfileAnalysisService();
export default customerProfileAnalysisService;
