/**
 * 数据验证和质量评分服务
 * 验证系统数据的完整性和准确性，并给出质量评分
 */

export interface ValidationResult {
  isValid: boolean;
  quality: number; // 0-100
  completeness: number; // 0-100 完整性
  consistency: number; // 0-100 一致性
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

export interface DataQualityReport {
  timestamp: Date;
  overallQuality: number;
  dataSourceScores: {
    customers: number;
    appointments: number;
    staff: number;
    products: number;
    marketing: number;
  };
  validationResults: {
    customers: ValidationResult;
    appointments: ValidationResult;
    staff: ValidationResult;
    products: ValidationResult;
    marketing: ValidationResult;
  };
  summary: string;
}

export class DataValidationService {
  /**
   * 验证客户数据
   */
  validateCustomerData(data: any[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let completenessScore = 0;
    let consistencyScore = 0;

    if (!data || data.length === 0) {
      return {
        isValid: false,
        quality: 0,
        completeness: 0,
        consistency: 0,
        errors: ['客户数据为空'],
        warnings: [],
        recommendations: ['添加客户数据以启用 AI 分析'],
      };
    }

    // 检查必需字段
    const requiredFields = ['id', 'name', 'totalSpent'];
    let fieldsPresent = 0;

    data.forEach((customer, idx) => {
      let hasRequired = true;
      requiredFields.forEach((field) => {
        if (!customer[field]) {
          hasRequired = false;
          errors.push(`客户 ${idx} 缺少字段: ${field}`);
        }
      });

      if (hasRequired) fieldsPresent++;

      // 数据类型检查
      if (customer.totalSpent && typeof customer.totalSpent !== 'number') {
        warnings.push(`客户 ${customer.name} 的 totalSpent 不是数字类型`);
      }

      if (customer.satisfaction && (customer.satisfaction < 0 || customer.satisfaction > 100)) {
        warnings.push(`客户 ${customer.name} 的满意度评分超出范围 (0-100)`);
      }
    });

    completenessScore = Math.round((fieldsPresent / data.length) * 100);

    // 检查数据一致性
    const totalSpentValues = data.map((c) => c.totalSpent || 0);
    const avgSpent = totalSpentValues.reduce((a, b) => a + b, 0) / totalSpentValues.length;

    // 异常值检测
    const abnormalCount = totalSpentValues.filter(
      (v) => v > avgSpent * 5 || v < avgSpent * 0.1
    ).length;

    if (abnormalCount > 0) {
      recommendations.push(
        `检测到 ${abnormalCount} 个异常消费金额，建议审查或清理`
      );
    }

    consistencyScore = Math.max(0, 100 - abnormalCount * 5);

    const isValid = errors.length === 0 && completenessScore >= 80;
    const quality = Math.round((completenessScore + consistencyScore) / 2);

    if (quality < 70) {
      recommendations.push('建议改进数据质量以获得更准确的 AI 建议');
    }

    return {
      isValid,
      quality,
      completeness: completenessScore,
      consistency: consistencyScore,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * 验证预约数据
   */
  validateAppointmentData(data: any[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];
    let completenessScore = 0;
    let consistencyScore = 0;

    if (!data || data.length === 0) {
      return {
        isValid: false,
        quality: 0,
        completeness: 0,
        consistency: 0,
        errors: ['预约数据为空'],
        warnings: [],
        recommendations: ['添加预约数据以进行分析'],
      };
    }

    // 检查必需字段
    const requiredFields = ['date', 'customerId', 'staffId', 'status'];
    let fieldsPresent = 0;

    data.forEach((appointment, idx) => {
      let hasRequired = true;
      requiredFields.forEach((field) => {
        if (!appointment[field]) {
          hasRequired = false;
          errors.push(`预约 ${idx} 缺少字段: ${field}`);
        }
      });

      if (hasRequired) fieldsPresent++;

      // 日期格式检查
      if (appointment.date) {
        try {
          new Date(appointment.date);
        } catch {
          errors.push(`预约 ${idx} 的日期格式无效: ${appointment.date}`);
        }
      }

      // 状态值检查
      const validStatuses = ['Confirmed', 'Completed', 'Cancelled', 'NoShow'];
      if (appointment.status && !validStatuses.includes(appointment.status)) {
        warnings.push(`预约 ${idx} 的状态值异常: ${appointment.status}`);
      }
    });

    completenessScore = Math.round((fieldsPresent / data.length) * 100);

    // 检查时间合理性
    const now = new Date();
    const futureAppointments = data.filter((a) => new Date(a.date) > now);
    const pastAppointments = data.filter((a) => new Date(a.date) <= now);

    if (futureAppointments.length === 0 && pastAppointments.length > 0) {
      recommendations.push('所有预约都是历史预约，建议检查数据是否为最新');
    }

    consistencyScore = Math.round((pastAppointments.length / data.length) * 100);

    const isValid = errors.length === 0 && completenessScore >= 80;
    const quality = Math.round((completenessScore + consistencyScore) / 2);

    return {
      isValid,
      quality,
      completeness: completenessScore,
      consistency: consistencyScore,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * 验证员工数据
   */
  validateStaffData(data: any[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!data || data.length === 0) {
      return {
        isValid: false,
        quality: 0,
        completeness: 0,
        consistency: 0,
        errors: ['员工数据为空'],
        warnings: [],
        recommendations: ['添加员工数据'],
      };
    }

    // 基本验证
    const requiredFields = ['id', 'name'];
    let fieldsPresent = 0;

    data.forEach((staff) => {
      let hasRequired = true;
      requiredFields.forEach((field) => {
        if (!staff[field]) {
          hasRequired = false;
          errors.push(`员工 ${staff?.name || 'unknown'} 缺少字段: ${field}`);
        }
      });
      if (hasRequired) fieldsPresent++;
    });

    const completenessScore = Math.round((fieldsPresent / data.length) * 100);
    const consistencyScore = 85; // 员工数据通常较稳定

    const isValid = errors.length === 0 && completenessScore >= 80;
    const quality = Math.round((completenessScore + consistencyScore) / 2);

    if (data.length < 3) {
      recommendations.push('员工人数较少，建议添加更多员工以获得更好的排班优化建议');
    }

    return {
      isValid,
      quality,
      completeness: completenessScore,
      consistency: consistencyScore,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * 验证产品/销售数据
   */
  validateProductData(data: any[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!data || data.length === 0) {
      return {
        isValid: false,
        quality: 0,
        completeness: 0,
        consistency: 0,
        errors: ['产品数据为空'],
        warnings: [],
        recommendations: ['添加产品数据以进行定价分析'],
      };
    }

    const requiredFields = ['name', 'price'];
    let fieldsPresent = 0;

    data.forEach((product) => {
      let hasRequired = true;
      requiredFields.forEach((field) => {
        if (!product[field]) {
          hasRequired = false;
          errors.push(`产品 ${product?.name || 'unknown'} 缺少字段: ${field}`);
        }
      });

      if (hasRequired) fieldsPresent++;

      // 价格检查
      if (product.price && product.price <= 0) {
        warnings.push(`产品 ${product.name} 的价格无效: ${product.price}`);
      }
    });

    const completenessScore = Math.round((fieldsPresent / data.length) * 100);
    const consistencyScore = 90;
    const isValid = errors.length === 0 && completenessScore >= 80;
    const quality = Math.round((completenessScore + consistencyScore) / 2);

    if (data.length < 5) {
      recommendations.push('产品数量较少，建议添加更多产品以提高销售分析的准确性');
    }

    return {
      isValid,
      quality,
      completeness: completenessScore,
      consistency: consistencyScore,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * 验证营销活动数据
   */
  validateMarketingData(data: any[]): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!data || data.length === 0) {
      return {
        isValid: true,
        quality: 50,
        completeness: 0,
        consistency: 0,
        errors: [],
        warnings: ['暂无营销活动数据'],
        recommendations: ['添加营销活动数据以获得 ROI 分析和优化建议'],
      };
    }

    const requiredFields = ['name', 'cost'];
    let fieldsPresent = 0;

    data.forEach((activity) => {
      let hasRequired = true;
      requiredFields.forEach((field) => {
        if (activity[field] === undefined) {
          hasRequired = false;
          errors.push(`活动 ${activity?.name || 'unknown'} 缺少字段: ${field}`);
        }
      });
      if (hasRequired) fieldsPresent++;
    });

    const completenessScore = Math.round((fieldsPresent / data.length) * 100);
    const consistencyScore = 85;
    const isValid = errors.length === 0 && completenessScore >= 80;
    const quality = Math.round((completenessScore + consistencyScore) / 2);

    return {
      isValid,
      quality,
      completeness: completenessScore,
      consistency: consistencyScore,
      errors,
      warnings,
      recommendations,
    };
  }

  /**
   * 生成完整的数据质量报告
   */
  generateQualityReport(
    customers: any[],
    appointments: any[],
    staff: any[],
    products: any[],
    marketing: any[]
  ): DataQualityReport {
    const customerValidation = this.validateCustomerData(customers);
    const appointmentValidation = this.validateAppointmentData(appointments);
    const staffValidation = this.validateStaffData(staff);
    const productValidation = this.validateProductData(products);
    const marketingValidation = this.validateMarketingData(marketing);

    const overallQuality = Math.round(
      (customerValidation.quality +
        appointmentValidation.quality +
        staffValidation.quality +
        productValidation.quality +
        marketingValidation.quality) / 5
    );

    const summary = this.generateSummary(
      overallQuality,
      customerValidation,
      appointmentValidation,
      staffValidation,
      productValidation,
      marketingValidation
    );

    return {
      timestamp: new Date(),
      overallQuality,
      dataSourceScores: {
        customers: customerValidation.quality,
        appointments: appointmentValidation.quality,
        staff: staffValidation.quality,
        products: productValidation.quality,
        marketing: marketingValidation.quality,
      },
      validationResults: {
        customers: customerValidation,
        appointments: appointmentValidation,
        staff: staffValidation,
        products: productValidation,
        marketing: marketingValidation,
      },
      summary,
    };
  }

  /**
   * 生成质量报告摘要
   */
  private generateSummary(
    overallQuality: number,
    ...validations: ValidationResult[]
  ): string {
    const qualityLevel =
      overallQuality >= 90
        ? '优秀'
        : overallQuality >= 80
        ? '良好'
        : overallQuality >= 70
        ? '一般'
        : '需要改进';

    const errorCount = validations.reduce((sum, v) => sum + v.errors.length, 0);
    const warningCount = validations.reduce((sum, v) => sum + v.warnings.length, 0);

    return `数据质量评分：${overallQuality}/100 (${qualityLevel})\n错误数：${errorCount}，警告数：${warningCount}\n建议定期审查和更新系统数据以确保 AI 建议的准确性。`;
  }

  /**
   * 获取数据质量建议
   */
  getDataImprovementPlan(report: DataQualityReport): string[] {
    const plan: string[] = [];

    Object.entries(report.validationResults).forEach(([source, validation]) => {
      if (!validation.isValid) {
        plan.push(`修复 ${source} 数据的 ${validation.errors.length} 个错误`);
      }
      if (validation.quality < 70) {
        plan.push(`提升 ${source} 数据质量（当前：${validation.quality}/100）`);
      }
      plan.push(...validation.recommendations.slice(0, 2));
    });

    return plan;
  }
}

// 导出单例
export const dataValidationService = new DataValidationService();
