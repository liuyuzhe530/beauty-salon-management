/**
 * 海报模板图片服务
 * 为每个海报模板提供对应的主题背景图片
 * 支持按主题动态切换标题图片
 */

export interface TemplateImage {
  templateId: string;
  templateName: string;
  category: string;
  imageUrl: string;
  gradient?: {
    from: string;
    to: string;
  };
  icon: string;
  colors: {
    primary: string;
    secondary: string;
  };
}

class PosterTemplateImageService {
  /**
   * 模板图片库 - 为每个模板提供独特的背景视觉
   */
  private templateImages: { [key: string]: TemplateImage } = {
    'promo-seasonal': {
      templateId: 'promo-seasonal',
      templateName: '季节促销',
      category: 'promotion',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#FF6B6B',
        to: '#FFE66D'
      },
      icon: '🌸',
      colors: {
        primary: '#FF6B6B',
        secondary: '#FFE66D'
      }
    },
    'new-product': {
      templateId: 'new-product',
      templateName: '新品上市',
      category: 'product',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#E8D5F2',
        to: '#9B59B6'
      },
      icon: '🎁',
      colors: {
        primary: '#E8D5F2',
        secondary: '#9B59B6'
      }
    },
    'skincare-routine': {
      templateId: 'skincare-routine',
      templateName: '护肤方案',
      category: 'skincare',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#FFF0F5',
        to: '#FF69B4'
      },
      icon: '✨',
      colors: {
        primary: '#FFF0F5',
        secondary: '#FF69B4'
      }
    },
    'member-card': {
      templateId: 'member-card',
      templateName: '会员卡权益',
      category: 'event',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#FFE5B4',
        to: '#FF8C00'
      },
      icon: '💳',
      colors: {
        primary: '#FFE5B4',
        secondary: '#FF8C00'
      }
    },
    'event-invitation': {
      templateId: 'event-invitation',
      templateName: '活动邀请',
      category: 'event',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#6C63FF',
        to: '#FF006E'
      },
      icon: '🎉',
      colors: {
        primary: '#6C63FF',
        secondary: '#FF006E'
      }
    },
    'course-promotion': {
      templateId: 'course-promotion',
      templateName: '课程推广',
      category: 'event',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#00A86B',
        to: '#87CEEB'
      },
      icon: '📚',
      colors: {
        primary: '#00A86B',
        secondary: '#87CEEB'
      }
    },
    'flash-sale': {
      templateId: 'flash-sale',
      templateName: '限时秒杀',
      category: 'promotion',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#FF4500',
        to: '#FFD700'
      },
      icon: '',
      colors: {
        primary: '#FF4500',
        secondary: '#FFD700'
      }
    },
    'referral-bonus': {
      templateId: 'referral-bonus',
      templateName: '推荐返利',
      category: 'promotion',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#FF1493',
        to: '#FFB6C1'
      },
      icon: '🎁',
      colors: {
        primary: '#FF1493',
        secondary: '#FFB6C1'
      }
    }
  };

  /**
   * 按模板 ID 获取模板图片
   */
  getTemplateImage(templateId: string): TemplateImage {
    return this.templateImages[templateId] || this.getDefaultImage();
  }

  /**
   * 按模板名称获取模板图片
   */
  getImageByTemplateName(templateName: string): TemplateImage {
    const image = Object.values(this.templateImages).find(
      img => img.templateName === templateName
    );
    return image || this.getDefaultImage();
  }

  /**
   * 按分类获取所有模板图片
   */
  getImagesByCategory(category: string): TemplateImage[] {
    return Object.values(this.templateImages).filter(
      img => img.category === category
    );
  }

  /**
   * 获取所有模板图片
   */
  getAllTemplateImages(): TemplateImage[] {
    return Object.values(this.templateImages);
  }

  /**
   * 获取默认图片
   */
  private getDefaultImage(): TemplateImage {
    return {
      templateId: 'default',
      templateName: '默认模板',
      category: 'general',
      imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=1200&h=400&fit=crop',
      gradient: {
        from: '#667eea',
        to: '#764ba2'
      },
      icon: '',
      colors: {
        primary: '#667eea',
        secondary: '#764ba2'
      }
    };
  }

  /**
   * 生成渐变背景样式
   */
  getGradientStyle(templateId: string): string {
    const image = this.getTemplateImage(templateId);
    if (image.gradient) {
      return `linear-gradient(135deg, ${image.gradient.from} 0%, ${image.gradient.to} 100%)`;
    }
    return `linear-gradient(135deg, ${image.colors.primary} 0%, ${image.colors.secondary} 100%)`;
  }

  /**
   * 获取颜色主题
   */
  getColorTheme(templateId: string): { primary: string; secondary: string } {
    const image = this.getTemplateImage(templateId);
    return image.colors;
  }

  /**
   * 动态更新模板图片
   */
  updateTemplateImage(templateId: string, imageUrl: string): void {
    if (this.templateImages[templateId]) {
      this.templateImages[templateId].imageUrl = imageUrl;
    }
  }

  /**
   * 获取主题相关的装饰文本
   */
  getThemeDecorationText(templateId: string): string {
    const decorations: { [key: string]: string } = {
      'promo-seasonal': '选择季节，开启优惠之旅',
      'new-product': '展示新品，吸引眼球',
      'skincare-routine': '护肤方案，定制美丽',
      'member-card': '会员专享，权益多多',
      'event-invitation': '邀请参加，共享盛事',
      'course-promotion': '学习成长，专业引领',
      'flash-sale': '限时秒杀，抢购盛宴',
      'referral-bonus': '推荐返利，分享收益'
    };
    return decorations[templateId] || '创意制作，专业呈现';
  }
}

export const posterTemplateImageService = new PosterTemplateImageService();
export default posterTemplateImageService;


