/**
 * 海报生成 API 服务 - 真实 RunningHub API 集成
 * 集成 RunningHub 的智能海报生成服务
 * API 地址: https://www.runninghub.cn/task/openapi/ai-app/run
 */

import axios from 'axios';

export interface PosterGenerationRequest {
  content?: string;
  style?: 'modern' | 'elegant' | 'playful' | 'minimalist';
  format?: 'vertical' | 'horizontal';
  type?: 'promotion' | 'product' | 'skincare' | 'event' | 'general';
  includeQRCode?: boolean;
  [key: string]: any;
}

export interface PosterGenerationResponse {
  success: boolean;
  data?: {
    format: string;
    size: { width: number; height: number };
    design: {
      style: string;
      elements: string[];
      colorScheme?: any;
    };
    posterUrl?: string;
    metadata?: any;
  };
  error?: {
    code: string;
    message: string;
  };
  meta?: {
    source: 'api' | 'local';
    processingTime: number;
  };
}

class PosterGenerationAPIService {
  // RunningHub API 配置
  private apiEndpoint = 'https://www.runninghub.cn/task/openapi/ai-app/run';
  private apiTimeout = 10000; // 10秒超时
  private fallbackMode = true; // 自动降级模式
  private apiKey = process.env.REACT_APP_RUNNINGHUB_API_KEY || ''; // 从环境变量读取

  /**
   * 生成海报 - 真实 API 调用
   */
  async generatePoster(request: PosterGenerationRequest): Promise<PosterGenerationResponse> {
    const startTime = Date.now();

    try {
      // 1. 构建请求数据
      const payload = this.buildAPIPayload(request);

      console.log('🔄 调用 RunningHub API...', {
        endpoint: this.apiEndpoint,
        payload: payload
      });

      // 2. 调用真实 API
      const response = await this.callRemoteAPI(payload);
      const duration = Date.now() - startTime;

      if (response.success) {
        console.log('✅ API 调用成功', {
          duration: duration,
          dataSize: JSON.stringify(response.data).length
        });

        return {
          success: true,
          data: response.data,
          meta: {
            source: 'api',
            processingTime: duration
          }
        };
      } else {
        // API 返回错误，使用降级方案
        console.warn('⚠️ API 返回错误:', response.error);
        return this.fallbackGeneratePoster(request, duration);
      }
    } catch (error: any) {
      console.error('❌ API 调用失败:', error.message);
      const duration = Date.now() - startTime;

      // 如果启用了降级模式，使用本地生成
      if (this.fallbackMode) {
        console.log('🔄 切换到本地生成...');
        return this.fallbackGeneratePoster(request, duration);
      } else {
        return {
          success: false,
          error: {
            code: 'API_ERROR',
            message: error.message
          }
        };
      }
    }
  }

  /**
   * 调用真实 RunningHub API
   */
  private async callRemoteAPI(payload: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);

    try {
      const response = await axios.post(this.apiEndpoint, payload, {
        timeout: this.apiTimeout,
        signal: controller.signal as any,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : undefined
        }
      });

      clearTimeout(timeoutId);

      console.log('📨 API 响应:', {
        status: response.status,
        code: response.data?.code,
        dataLength: response.data?.data ? JSON.stringify(response.data.data).length : 0
      });

      // 检查 API 响应
      if (response.data?.code === 0 || response.data?.success) {
        return {
          success: true,
          data: {
            format: payload.format || 'vertical',
            size: {
              width: payload.format === 'horizontal' ? 1920 : 1080,
              height: payload.format === 'horizontal' ? 1080 : 1440
            },
            design: {
              style: payload.style || 'modern',
              elements: ['generated_by_ai'],
              colorScheme: response.data?.data?.colorScheme
            },
            posterUrl: response.data?.data?.url || response.data?.data?.posterUrl,
            metadata: response.data?.data
          }
        };
      } else {
        return {
          success: false,
          error: {
            code: response.data?.code || 'UNKNOWN_ERROR',
            message: response.data?.msg || response.data?.message || '未知错误'
          }
        };
      }
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.code === 'ECONNABORTED') {
        throw new Error('API 请求超时 (10秒)');
      }

      throw error;
    }
  }

  /**
   * 构建 API 请求体
   */
  private buildAPIPayload(request: PosterGenerationRequest): any {
    const { content = '', style = 'modern', format = 'vertical', type = 'general' } = request;

    // 根据内容生成提示词
    const prompt = this.generatePrompt(content, type, style);

    return {
      // RunningHub 特定字段
      app_id: process.env.REACT_APP_RUNNINGHUB_APP_ID || 'poster-generator',
      task_id: `poster_${Date.now()}`,

      // 海报参数
      poster_type: type,
      content: content,
      style: style,
      format: format === 'vertical' ? '竖版' : '横版',
      size: format === 'vertical' ? '1080x1440' : '1920x1080',

      // AI 提示词
      prompt: prompt,
      prompt_lang: 'zh',

      // 生成参数
      quality: 'high', // high | medium | low
      includeQRCode: request.includeQRCode ?? true,
      includeWatermark: false,
      
      // 高级配置
      ai_model: 'dall-e-3', // 使用高质量模型
      temperature: 0.7,
      seed: undefined // 随机生成
    };
  }

  /**
   * 根据类型和样式生成提示词
   */
  private generatePrompt(content: string, type: string, style: string): string {
    const styleDescriptions: { [key: string]: string } = {
      modern: '现代、简洁、专业的',
      elegant: '优雅、高端、精致的',
      playful: '活泼、开心、充满活力的',
      minimalist: '简约、纯净、高效的'
    };

    const typeDescriptions: { [key: string]: string } = {
      promotion: '促销活动',
      product: '产品展示',
      skincare: '护肤服务',
      event: '活动宣传',
      general: '通用推广'
    };

    const styleDesc = styleDescriptions[style] || '专业的';
    const typeDesc = typeDescriptions[type] || '推广';

    return `生成一个${styleDesc}${typeDesc}海报。
内容主题: ${content}
要求:
- 视觉吸引力强
- 信息清晰易读
- 专业商业级设计
- 符合${typeDesc}特点
- 配色协调美观
- 适合微信分享和网页展示`;
  }

  /**
   * 降级方案 - 本地生成（当 API 不可用时）
   */
  private fallbackGeneratePoster(
    request: PosterGenerationRequest,
    apiDuration: number
  ): PosterGenerationResponse {
    const startTime = Date.now();

    // 这里可以调用本地的 Canvas 绘制或返回错误
    return {
      success: false,
      error: {
        code: 'API_UNAVAILABLE',
        message: 'RunningHub API 暂时不可用，无法生成高质量海报。请稍后重试或联系技术支持。'
      },
      meta: {
        source: 'local',
        processingTime: apiDuration + (Date.now() - startTime)
      }
    };
  }

  /**
   * 批量生成海报
   */
  async generatePosterBatch(
    requests: PosterGenerationRequest[]
  ): Promise<PosterGenerationResponse[]> {
    const results: PosterGenerationResponse[] = [];

    // 串行处理，避免过度并发
    for (const request of requests) {
      try {
        const response = await this.generatePoster(request);
        results.push(response);
        // 延迟 100ms 避免 API 限流
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        results.push({
          success: false,
          error: {
            code: 'BATCH_ERROR',
            message: error.message
          }
        });
      }
    }

    return results;
  }

  /**
   * 检查 API 可用性
   */
  async getAPIStatus(): Promise<{ available: boolean; status: string; lastCheck: string }> {
    try {
      const response = await axios.get(
        `${this.apiEndpoint}?action=health`,
        { timeout: 3000 }
      );

      const available = response.status === 200 && (response.data?.code === 0 || response.data?.success);

      return {
        available: available,
        status: available ? 'ONLINE' : 'ERROR',
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        available: false,
        status: error.code === 'ECONNABORTED' ? 'TIMEOUT' : 'OFFLINE',
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * 设置降级模式
   */
  setAPIFallbackMode(enabled: boolean): void {
    this.fallbackMode = enabled;
    console.log(`🔄 降级模式: ${enabled ? '启用' : '禁用'}`);
  }

  /**
   * 设置 API 超时时间
   */
  setTimeout(ms: number): void {
    this.apiTimeout = ms;
  }

  /**
   * 设置 API 密钥
   */
  setAPIKey(key: string): void {
    this.apiKey = key;
  }
}

export const posterGenerationAPIService = new PosterGenerationAPIService();
export default posterGenerationAPIService;
