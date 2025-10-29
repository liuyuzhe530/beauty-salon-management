/**
 * 海报生成 API 服务 - 使用真实 RunningHub API 格式
 * 官方文档: https://www.runninghub.cn/runninghub-api-doc-cn/api-279098421
 * API 地址: POST /task/openapi/ai-app/run
 */

import axios from 'axios';

export interface PosterGenerationRequest {
  content?: string;
  style?: 'modern' | 'elegant' | 'playful' | 'minimalist';
  format?: 'vertical' | 'horizontal';
  type?: 'promotion' | 'product' | 'skincare' | 'event' | 'seasonal' | 'general';
  includeQRCode?: boolean;
  [key: string]: any;
}

export interface PosterGenerationResponse {
  success: boolean;
  data?: {
    taskId?: string;
    taskStatus?: string;
    netWssUrl?: string;
    clientId?: string;
    posterUrl?: string;
    format: string;
    size: { width: number; height: number };
    design: {
      style: string;
      elements: string[];
      colorScheme?: any;
    };
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
  private apiTimeout = 15000; // 15秒超时（生成时间可能较长）
  private fallbackMode = true;
  
  // API 凭证 - 从环境变量读取
  private apiKey = import.meta.env.VITE_RUNNINGHUB_API_KEY || '';
  private webappId = import.meta.env.VITE_RUNNINGHUB_WEBAPP_ID || '1877265245566922753'; // 默认海报生成应用ID

  /**
   * 生成海报 - 真实 RunningHub API 调用
   */
  async generatePoster(request: PosterGenerationRequest): Promise<PosterGenerationResponse> {
    const startTime = Date.now();

    try {
      if (!this.apiKey) {
        throw new Error('未配置 API 密钥。请设置 REACT_APP_RUNNINGHUB_API_KEY 环境变量。');
      }

      // 1. 构建请求数据
      const payload = this.buildAPIPayload(request);

      console.log('🔄 调用 RunningHub API...', {
        endpoint: this.apiEndpoint,
        webappId: this.webappId,
        nodeCount: payload.nodeInfoList.length
      });

      // 2. 调用真实 API
      const response = await this.callRemoteAPI(payload);
      const duration = Date.now() - startTime;

      if (response.code === 0 && response.data) {
        console.log('✅ API 调用成功', {
          duration: duration,
          taskId: response.data.taskId,
          taskStatus: response.data.taskStatus
        });

        return {
          success: true,
          data: {
            taskId: response.data.taskId,
            taskStatus: response.data.taskStatus,
            netWssUrl: response.data.netWssUrl,
            clientId: response.data.clientId,
            format: 'vertical',
            size: {
              width: 1080,
              height: 1440
            },
            design: {
              style: request.style || 'modern',
              elements: ['generated_by_ai']
            }
          },
          meta: {
            source: 'api',
            processingTime: duration
          }
        };
      } else {
        // API 返回错误
        console.warn('⚠️ API 返回错误:', response.msg || response.error);
        return {
          success: false,
          error: {
            code: String(response.code || 'UNKNOWN_ERROR'),
            message: response.msg || '海报生成失败'
          }
        };
      }
    } catch (error: any) {
      console.error('❌ API 调用失败:', error.message);
      const duration = Date.now() - startTime;

      if (this.fallbackMode) {
        console.log('🔄 切换到离线模式...');
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
   * 根据官方文档格式: https://www.runninghub.cn/runninghub-api-doc-cn/api-279098421
   */
  private async callRemoteAPI(payload: any): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.apiTimeout);

    try {
      console.log('📤 发送请求到 RunningHub API:', this.apiEndpoint);
      
      const response = await axios.post(this.apiEndpoint, payload, {
        timeout: this.apiTimeout,
        signal: controller.signal as any,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      console.log('📨 收到 API 响应:', {
        status: response.status,
        code: response.data?.code,
        msg: response.data?.msg
      });

      return response.data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.code === 'ECONNABORTED') {
        throw new Error('API 请求超时 (15秒)');
      }

      throw error;
    }
  }

  /**
   * 构建真实 RunningHub API 请求体
   * 格式: { webappId, apiKey, nodeInfoList }
   */
  private buildAPIPayload(request: PosterGenerationRequest): any {
    const { content = '', style = 'modern' } = request;

    // 生成提示词
    const prompt = this.generatePrompt(content, request.type || 'general', style);

    // 根据官方文档格式构建请求
    return {
      // 必需字段
      webappId: this.webappId,
      apiKey: this.apiKey,
      
      // 节点信息列表 - 定义要修改的字段
      nodeInfoList: [
        {
          nodeId: '122', // 提示词节点 ID
          fieldName: 'prompt',
          fieldValue: prompt // 完整的 AI 提示词
        },
        {
          nodeId: '123', // 样式节点 ID
          fieldName: 'style',
          fieldValue: style
        }
      ]
    };
  }

  /**
   * 生成 AI 提示词
   */
  private generatePrompt(content: string, type: string, style: string): string {
    const styleDescriptions: { [key: string]: string } = {
      modern: '现代、简洁、专业',
      elegant: '优雅、高端、精致',
      playful: '活泼、开心、充满活力',
      minimalist: '简约、纯净、高效'
    };

    const typeDescriptions: { [key: string]: string } = {
      promotion: '促销活动',
      product: '产品展示',
      skincare: '护肤服务',
      event: '活动宣传',
      general: '商业推广'
    };

    const styleDesc = styleDescriptions[style] || '专业的';
    const typeDesc = typeDescriptions[type] || '商业推广';

    return `生成一个${styleDesc}的${typeDesc}海报。

内容: ${content}

设计要求:
- 视觉吸引力强
- 信息清晰易读
- 专业商业级设计
- 配色协调美观
- 适合微信分享和网页展示
- 竖版 1080x1440 格式
- 无其他品牌名称`;
  }

  /**
   * 降级方案 - 当 API 不可用时
   */
  private fallbackGeneratePoster(
    request: PosterGenerationRequest,
    apiDuration: number
  ): PosterGenerationResponse {
    return {
      success: false,
      error: {
        code: 'API_UNAVAILABLE',
        message: 'RunningHub API 暂时不可用。请检查网络连接和 API 密钥配置。'
      },
      meta: {
        source: 'local',
        processingTime: apiDuration
      }
    };
  }

  /**
   * 检查 API 可用性
   */
  async getAPIStatus(): Promise<{ available: boolean; status: string; lastCheck: string }> {
    try {
      if (!this.apiKey) {
        return {
          available: false,
          status: '未配置 API 密钥',
          lastCheck: new Date().toISOString()
        };
      }

      // 尝试调用 API 检查状态
      const testPayload = this.buildAPIPayload({
        content: '测试',
        type: 'general'
      });

      const response = await axios.post(this.apiEndpoint, testPayload, {
        timeout: 5000,
        headers: { 'Content-Type': 'application/json' }
      });

      const available = response.data?.code === 0 || response.status === 200;

      return {
        available: available,
        status: available ? '在线' : '错误',
        lastCheck: new Date().toISOString()
      };
    } catch (error: any) {
      return {
        available: false,
        status: error.code === 'ECONNABORTED' ? '超时' : '离线',
        lastCheck: new Date().toISOString()
      };
    }
  }

  /**
   * 设置 API 密钥
   */
  setAPIKey(key: string): void {
    this.apiKey = key;
    console.log('✅ API 密钥已设置');
  }

  /**
   * 设置 WebApp ID
   */
  setWebappId(id: string): void {
    this.webappId = id;
    console.log('✅ WebApp ID 已设置');
  }

  /**
   * 设置超时时间
   */
  setTimeout(ms: number): void {
    this.apiTimeout = ms;
  }

  /**
   * 设置降级模式
   */
  setAPIFallbackMode(enabled: boolean): void {
    this.fallbackMode = enabled;
    console.log(`🔄 降级模式: ${enabled ? '启用' : '禁用'}`);
  }
}

export const posterGenerationAPIService = new PosterGenerationAPIService();
export default posterGenerationAPIService;
