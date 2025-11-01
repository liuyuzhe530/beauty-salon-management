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

    return `用户信息：\n${parts.join('\n')}\n\n请基于以上信息提供详细的个性化建议，包括具体的护肤步骤、推荐的食物、生活调理方案。`;
  }

  /**
   * 生成更详细的建议内容
   */
  private generateDetailedAdvice(profile: UserHealthProfile): string {
    let advice = '';

    // 护肤建议
    advice += this.generateSkinCareAdvice(profile);
    advice += '\n\n';

    // 饮食建议
    advice += this.generateDietAdvice(profile);
    advice += '\n\n';

    // 生活习惯建议
    advice += this.generateLifestyleAdvice(profile);

    return advice;
  }

  /**
   * 生成护肤建议
   */
  private generateSkinCareAdvice(profile: UserHealthProfile): string {
    let advice = '护肤建议：\n';
    const skinType = profile.skinType || 'oily';
    const goals = profile.goals || [];

    // 基础护肤步骤
    advice += '早上护肤步骤：洁面 → 爽肤水 → 精华液 → 乳液 → 防晒（必须）\n';
    advice += '晚间护肤步骤：洁面 → 爽肤水 → 精华液 → 面霜 → 眼霜\n';

    // 根据肤质的具体建议
    if (skinType === 'oily') {
      advice += '油性肤质：使用含烟酰胺、水杨酸的清爽型产品，每周2-3次深层清洁面膜。\n';
      advice += '重点护理：T 字区加强控油，使用吸油面纸和控油精华。\n';
    } else if (skinType === 'dry') {
      advice += '干性肤质：选择含透明质酸、甘油的滋润型产品，每周1次补水面膜。\n';
      advice += '重点护理：加强保湿，使用精油或面霜加强滋润度。\n';
    } else if (skinType === 'combination') {
      advice += '混合性肤质：分区护理，T 字区清爽型产品，面颊部位选择滋润型。\n';
      advice += '重点护理：平衡油水，使用平衡精华，定期深层清洁。\n';
    } else if (skinType === 'sensitive') {
      advice += '敏感性肤质：使用温和无刺激的产品，避免含酒精和香精的产品。\n';
      advice += '重点护理：舒缓修复，使用含神经酰胺、泛醇的修复面膜。\n';
    }

    // 根据目标的针对性建议
    if (goals.includes('祛痘')) {
      advice += '祛痘方案：使用含水杨酸、果酸的产品，每周1-2次深层清洁，避免用手挤压。\n';
      advice += '配合：口服维生素 B、锌补充剂，改善肠道健康。\n';
    }
    if (goals.includes('美白')) {
      advice += '美白方案：使用含烟酰胺、传明酸、维生素C的产品，坚持使用6-8周可见效果。\n';
      advice += '配合：严格防晒，避免日晒，夜间使用美白精华。\n';
    }
    if (goals.includes('抗老')) {
      advice += '抗老方案：使用含视黄醇、肽类的产品，每周使用2-3次，可配合面部提拉仪。\n';
      advice += '重点区域：眼周、法令纹、颈部加强护理。\n';
    }
    if (goals.includes('补水')) {
      advice += '补水方案：每周做1-2次补水面膜，使用保湿喷雾定时补水，多喝水。\n';
      advice += '配合：使用加湿器，室内湿度保持在 40-60%。\n';
    }

    return advice;
  }

  /**
   * 生成饮食建议
   */
  private generateDietAdvice(profile: UserHealthProfile): string {
    let advice = '饮食建议：\n';
    const goals = profile.goals || [];
    const age = profile.age || 25;

    // 基础营养建议
    advice += '基础饮食：多吃新鲜蔬菜水果（日均500g），优质蛋白（鱼、鸡蛋、豆类），全谷物。\n';
    advice += '保健食材：黑芝麻、核桃、红枣、蜂蜜、绿茶、燕麦。\n';

    // 根据年龄的建议
    if (age >= 25 && age < 35) {
      advice += '25-35岁：注重抗衰老营养，增加胶原蛋白摄入（鱼类、猪皮、骨汤）。\n';
    } else if (age >= 35 && age < 45) {
      advice += '35-45岁：加强钙质吸收，多吃豆制品、牛奶，预防骨质流失。\n';
    }

    // 根据肤质的建议
    if (profile.skinType === 'oily') {
      advice += '油性肌肤：避免辛辣刺激、油腻食物，减少糖分和咖啡因摄入。\n';
      advice += '推荐食物：绿豆、冬瓜、薏米、苦瓜、黄瓜。\n';
    } else if (profile.skinType === 'dry') {
      advice += '干性肌肤：增加油脂摄入，多吃坚果、牛油果、橄榄油。\n';
      advice += '推荐食物：银耳、百合、蜂蜜、豆浆、鱼类。\n';
    }

    // 根据目标的建议
    if (goals.includes('祛痘')) {
      advice += '祛痘食谱：增加锌摄入（牡蛎、南瓜子、鸡蛋），维生素 A（胡萝卜、菠菜、红薯）。\n';
      advice += '忌口：油炸食物、巧克力、坚果类过量、辛辣刺激食物。\n';
    }
    if (goals.includes('美白')) {
      advice += '美白食谱：高维生素 C 食物（柑橘、猕猴桃、草莓、番茄、西兰花）。\n';
      advice += '推荐饮品：柠檬蜂蜜水、番茄汁、绿茶。\n';
    }
    if (goals.includes('补水')) {
      advice += '补水食谱：高水分食物（冬瓜、冰淇淋、西瓜），多喝温水，每天 8 杯以上。\n';
      advice += '推荐饮品：黄瓜汁、绿茶、白开水、骨汤。\n';
    }
    if (goals.includes('瘦身')) {
      advice += '瘦身食谱：增加纤维素和蛋白质，减少精细碳水化合物。\n';
      advice += '推荐食物：鸡胸肉、鱼类、豆制品、燕麦、糙米。\n';
    }

    return advice;
  }

  /**
   * 生成生活习惯建议
   */
  private generateLifestyleAdvice(profile: UserHealthProfile): string {
    let advice = '生活习惯建议：\n';
    const sleepQuality = profile.sleepQuality || 'fair';
    const goals = profile.goals || [];

    // 睡眠建议
    if (profile.stayUpLate) {
      advice += '作息调理：建议11点前入睡，23点前睡眠为最佳，每晚保证7-8小时睡眠。\n';
      advice += '调理方法：使用褪黑素辅助、避免睡前看手机、使用眼罩和耳塞。\n';
    } else {
      advice += '睡眠维护：保持规律作息，每天同一时间入睡，周末最多晚睡2小时。\n';
      advice += '睡眠环境：室温18-22°C，避免光线和噪音干扰。\n';
    }

    // 运动建议
    advice += '运动计划：每周3-5次运动，每次30-60分钟，可选有氧+力量结合。\n';
    advice += '推荐运动：快走、慢跑、瑜伽、普拉提、游泳、健身房锻炼。\n';

    // 压力管理
    advice += '压力管理：学习冥想和深呼吸，每天10分钟冥想有助于舒缓压力。\n';
    advice += '放松方式：泡澡、听音乐、阅读、与朋友聊天。\n';

    // 防晒建议
    advice += '防晒措施：全年坚持防晒，SPF30以上，每2小时补涂一次。\n';
    advice += '防晒方式：物理防晒（帽子、墨镜）+ 化学防晒结合。\n';

    // 专项建议
    if (goals.includes('祛痘')) {
      advice += '痘肌护理：避免手部接触面部，定期更换枕套和毛巾。\n';
      advice += '调理周期：通常需要 4-8 周才能看到明显改善。\n';
    }
    if (goals.includes('抗老')) {
      advice += '抗衰调理：定期进行专业面部护理（每月1-2次），坚持运动增加皮肤弹性。\n';
      advice += '预防措施：戒烟限酒，避免过度日晒，减少表情纹。\n';
    }

    // 季节性建议
    advice += '季节护理：春季控油预防过敏、夏季防晒补水、秋季加强保湿、冬季深层滋润。\n';

    return advice;
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
   * 生成更详细的建议（直接版本）
   */
  generateDetailedAdvices(profile: UserHealthProfile): string {
    return this.generateDetailedAdvice(profile);
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
      const skinCareMatch = content.match(/护肤[：:]([\s\S]*?)(?=饮食|生活|$)/);
      const dietMatch = content.match(/饮食[：:]([\s\S]*?)(?=生活|护肤|$)/);
      const lifestyleMatch = content.match(/生活[：:]([\s\S]*?)(?=护肤|饮食|$)/);

      return {
        success: true,
        advice: content,
        skinCare: skinCareMatch ? skinCareMatch[1].trim() : '详细护肤建议已包含在完整建议中',
        diet: dietMatch ? dietMatch[1].trim() : '详细饮食建议已包含在完整建议中',
        lifestyle: lifestyleMatch ? lifestyleMatch[1].trim() : '详细生活建议已包含在完整建议中'
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
    return this.generateDetailedAdvice(this.getExampleProfile());
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
