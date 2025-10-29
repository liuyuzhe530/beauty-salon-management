/**
 * 美容院健康助手 AI 服务
 * 基于用户信息生成个性化护肤、健康、饮食建议
 */

export interface UserHealthProfile {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  skinType?: 'dry' | 'oily' | 'combination' | 'sensitive';
  sleepQuality?: 'good' | 'fair' | 'poor';
  stayUpLate?: boolean;
  dietPreference?: string;
  goals?: string[];
}

export interface AIResponse {
  success: boolean;
  advice?: string;
  skinCare?: string;
  diet?: string;
  lifestyle?: string;
  error?: string;
}

class HealthAssistantAIService {
  /**
   * 系统提示词（简洁版）
   * 作为 AI 的系统指令
   */
  private getSystemPrompt(): string {
    return `你是美容院专属健康助手，根据用户输入的年龄、性别、肤质、生活习惯和目标，提供个性化护肤、健康、饮食建议。

重要规则：
- 回答简洁、专业、亲切
- 避免医学诊断
- 不推销产品
- 基于用户提供的信息给出建议
- 分类呈现建议（护肤、饮食、生活习惯）
- 每条建议控制在一句话内`;
  }

  /**
   * 根据用户信息生成用户提示词
   */
  private generateUserPrompt(profile: UserHealthProfile): string {
    const parts: string[] = [];

    if (profile.age) parts.push(`年龄：${profile.age}岁`);
    
    if (profile.gender) {
      const genderMap = {
        'male': '男性',
        'female': '女性',
        'other': '其他'
      };
      parts.push(`性别：${genderMap[profile.gender]}`);
    }

    if (profile.skinType) {
      const skinTypeMap = {
        'dry': '干性',
        'oily': '油性',
        'combination': '混合性',
        'sensitive': '敏感性'
      };
      parts.push(`肤质：${skinTypeMap[profile.skinType]}`);
    }

    if (profile.sleepQuality) {
      const sleepMap = {
        'good': '睡眠充足',
        'fair': '睡眠一般',
        'poor': '睡眠不足'
      };
      parts.push(`睡眠：${sleepMap[profile.sleepQuality]}`);
    }

    if (profile.stayUpLate) {
      parts.push(`经常熬夜`);
    }

    if (profile.dietPreference) {
      parts.push(`饮食偏好：${profile.dietPreference}`);
    }

    if (profile.goals && profile.goals.length > 0) {
      parts.push(`目标：${profile.goals.join('、')}`);
    }

    return `用户信息：\n${parts.join('\n')}\n\n请基于以上信息提供个性化的护肤、饮食和生活习惯建议。`;
  }

  /**
   * 生成 AI 提示词对象
   */
  generatePrompts(profile: UserHealthProfile): { system: string; user: string } {
    return {
      system: this.getSystemPrompt(),
      user: this.generateUserPrompt(profile)
    };
  }

  /**
   * 解析 AI 响应，分类呈现建议
   */
  parseAIResponse(content: string): AIResponse {
    if (!content) {
      return {
        success: false,
        error: '未获得有效的 AI 响应'
      };
    }

    try {
      // 按照关键字分类建议
      const skinCareMatch = content.match(/护肤[：:]([^。\n]*)/);
      const dietMatch = content.match(/饮食[：:]([^。\n]*)/);
      const lifestyleMatch = content.match(/生活[：:]([^。\n]*)/);

      return {
        success: true,
        advice: content,
        skinCare: skinCareMatch ? skinCareMatch[1].trim() : '护肤建议已包含在综合建议中',
        diet: dietMatch ? dietMatch[1].trim() : '饮食建议已包含在综合建议中',
        lifestyle: lifestyleMatch ? lifestyleMatch[1].trim() : '生活习惯建议已包含在综合建议中'
      };
    } catch (error) {
      return {
        success: true,
        advice: content,
        skinCare: '',
        diet: '',
        lifestyle: ''
      };
    }
  }

  /**
   * 获取示例用户信息
   */
  getExampleProfile(): UserHealthProfile {
    return {
      age: 25,
      gender: 'female',
      skinType: 'oily',
      stayUpLate: true,
      dietPreference: '喜欢吃辣',
      goals: ['祛痘', '控油']
    };
  }

  /**
   * 获取示例 AI 输出
   */
  getExampleOutput(): string {
    return `护肤建议：选用含烟酰胺、水杨酸的清爽型产品，每周1次泥膜清洁毛孔。
饮食建议：避免高油辣食物，多吃富含锌的食物如南瓜子、燕麦。
生活习惯：建议23点前入睡，充足睡眠有助于控油祛痘。`;
  }

  /**
   * 验证用户信息的完整性
   */
  validateProfile(profile: UserHealthProfile): { valid: boolean; message?: string } {
    if (!profile.age && !profile.gender && !profile.skinType) {
      return {
        valid: false,
        message: '请至少填写一项信息'
      };
    }
    return { valid: true };
  }
}

export default new HealthAssistantAIService();
