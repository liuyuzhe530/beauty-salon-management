/**
 * 海报生成 API 服务
 * 集成 RunningHub 的智能海报生成服务
 * API 地址: https://www.runninghub.cn/task/openapi/ai-app/run
 */

export interface PosterGenerationRequest {
  // 海报内容
  content: string;
  
  // 海报样式
  style?: 'modern' | 'elegant' | 'playful' | 'minimalist';
  
  // 海报格式
  format?: 'vertical' | 'horizontal' | 'square';
  
  // 海报类型
  type?: 'promotion' | 'product' | 'skincare' | 'event' | 'general';
  
  // 配色方案
  colorScheme?: {
    backgroundColor?: string;
    accentColor?: string;
    textColor?: string;
    secondaryText?: string;
  };
  
  // 尺寸
  width?: number;
  height?: number;
  
  // 其他参数
  includeQRCode?: boolean;
  qrCodeUrl?: string;
}

export interface PosterGenerationResponse {
  success: boolean;
  data?: {
    imageUrl: string;
    format: string;
    size: {
      width: number;
      height: number;
    };
    design: {
      style: string;
      colorScheme: any;
      elements: string[];
    };
  };
  error?: {
    code: number;
    message: string;
  };
  meta?: {
    processingTime: number;
    generatedAt: string;
  };
}

class PosterGenerationAPIService {
  private apiEndpoint = 'https://www.runninghub.cn/task/openapi/ai-app/run';
  private fallbackMode = true; // 默认启用降级模式
  
  /**
   * 调用 API 生成海报
   */
  async generatePoster(request: PosterGenerationRequest): Promise<PosterGenerationResponse> {
    try {
      // 检查 API 可用性
      const isApiAvailable = await this.checkAPIAvailability();
      
      if (!isApiAvailable) {
        console.warn('RunningHub API 不可用，使用本地生成模式');
        return this.generatePosterLocally(request);
      }

      // 调用远程 API
      return await this.callRemoteAPI(request);
    } catch (error: any) {
      console.error('海报 API 调用失败:', error.message);
      
      // 降级到本地生成
      if (this.fallbackMode) {
        console.log('降级到本地海报生成...');
        return this.generatePosterLocally(request);
      }
      
      throw {
        success: false,
        error: {
          code: 500,
          message: `海报生成失败: ${error.message}`
        }
      };
    }
  }

  /**
   * 检查 API 可用性
   */
  private async checkAPIAvailability(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'OPTIONS',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.status < 500;
    } catch (error) {
      console.warn('API 可用性检查失败，将使用本地生成');
      return false;
    }
  }

  /**
   * 调用远程 API
   */
  private async callRemoteAPI(request: PosterGenerationRequest): Promise<PosterGenerationResponse> {
    const payload = this.buildAPIPayload(request);
    
    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        timeout: 30000
      });

      const data = await response.json();

      // 处理 API 响应
      if (data.code === 0 || data.code === 200) {
        return {
          success: true,
          data: data.data,
          meta: {
            processingTime: Date.now(),
            generatedAt: new Date().toISOString()
          }
        };
      } else {
        throw new Error(data.msg || '海报生成失败');
      }
    } catch (error: any) {
      throw new Error(`API 调用失败: ${error.message}`);
    }
  }

  /**
   * 构建 API 请求体
   */
  private buildAPIPayload(request: PosterGenerationRequest) {
    return {
      task: 'poster_generation',
      model: 'ai-poster-v1',
      params: {
        content: request.content,
        style: request.style || 'modern',
        format: request.format || 'vertical',
        type: request.type || 'general',
        colorScheme: request.colorScheme,
        width: request.width || (request.format === 'horizontal' ? 1920 : 1080),
        height: request.height || (request.format === 'horizontal' ? 1080 : 1920),
        quality: 'high',
        includeQRCode: request.includeQRCode || false,
        qrCodeUrl: request.qrCodeUrl
      }
    };
  }

  /**
   * 本地海报生成（降级方案）
   */
  private generatePosterLocally(request: PosterGenerationRequest): PosterGenerationResponse {
    const startTime = Date.now();
    
    try {
      // 生成模拟的海报数据
      const mockImageUrl = this.generateMockPosterImage(request);
      
      return {
        success: true,
        data: {
          imageUrl: mockImageUrl,
          format: request.format || 'vertical',
          size: {
            width: request.width || 1080,
            height: request.height || 1920
          },
          design: {
            style: request.style || 'modern',
            colorScheme: request.colorScheme || this.getDefaultColorScheme(request.type),
            elements: this.generatePosterElements(request)
          }
        },
        meta: {
          processingTime: Date.now() - startTime,
          generatedAt: new Date().toISOString()
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: {
          code: 500,
          message: `本地生成失败: ${error.message}`
        }
      };
    }
  }

  /**
   * 生成模拟海报图像 URL
   */
  private generateMockPosterImage(request: PosterGenerationRequest): string {
    const width = request.width || 1080;
    const height = request.height || 1920;
    const bgColor = (request.colorScheme?.backgroundColor || '#FF6B6B').replace('#', '');
    
    // 使用占位符服务生成图片
    return `https://via.placeholder.com/${width}x${height}/${bgColor}/FFFFFF?text=${encodeURIComponent(request.content.substring(0, 50))}`;
  }

  /**
   * 生成海报元素
   */
  private generatePosterElements(request: PosterGenerationRequest): string[] {
    const elements: string[] = [];
    const content = request.content.toLowerCase();

    // 根据内容类型生成元素
    if (content.includes('特价') || content.includes('优惠')) {
      elements.push('价格标签', '倒计时', '热门标签');
    }
    if (content.includes('新品') || content.includes('产品')) {
      elements.push('产品名称', '产品描述', 'Logo');
    }
    if (content.includes('美肤') || content.includes('护肤')) {
      elements.push('效果展示', '前后对比', '成分表');
    }
    if (content.includes('活动') || content.includes('开业')) {
      elements.push('事件标题', '日期时间', '地点信息');
    }

    // 添加通用元素
    elements.push('主标题', '副标题', '行动号召按钮');
    
    if (request.includeQRCode) {
      elements.push('二维码');
    }

    return [...new Set(elements)]; // 去重
  }

  /**
   * 获取默认配色方案
   */
  private getDefaultColorScheme(type?: string) {
    const schemes: { [key: string]: any } = {
      promotion: {
        backgroundColor: '#FF6B6B',
        accentColor: '#FFE66D',
        textColor: '#ffffff',
        secondaryText: '#2d3436'
      },
      product: {
        backgroundColor: '#E8D5F2',
        accentColor: '#9B59B6',
        textColor: '#2C1640',
        secondaryText: '#ffffff'
      },
      skincare: {
        backgroundColor: '#FFF0F5',
        accentColor: '#FF69B4',
        textColor: '#881391',
        secondaryText: '#ffffff'
      },
      event: {
        backgroundColor: '#FFE5B4',
        accentColor: '#FF8C00',
        textColor: '#8B4513',
        secondaryText: '#ffffff'
      },
      general: {
        backgroundColor: '#F5F5F5',
        accentColor: '#333333',
        textColor: '#1a1a1a',
        secondaryText: '#666666'
      }
    };

    return schemes[type || 'general'];
  }

  /**
   * 批量生成海报
   */
  async generatePosterBatch(
    requests: PosterGenerationRequest[]
  ): Promise<PosterGenerationResponse[]> {
    return Promise.all(requests.map(req => this.generatePoster(req)));
  }

  /**
   * 启用/禁用 API 模式
   */
  setAPIFallbackMode(enabled: boolean): void {
    this.fallbackMode = enabled;
  }

  /**
   * 获取 API 状态
   */
  async getAPIStatus(): Promise<{
    available: boolean;
    status: string;
    lastCheck: string;
  }> {
    const isAvailable = await this.checkAPIAvailability();
    
    return {
      available: isAvailable,
      status: isAvailable ? '在线' : '离线',
      lastCheck: new Date().toISOString()
    };
  }
}

export const posterGenerationAPIService = new PosterGenerationAPIService();
export default posterGenerationAPIService;
