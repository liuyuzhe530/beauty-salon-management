/**
 * 健康助手 AI 智能体配置系统
 * 为每个检测项目配置真实的智能体，支持动态AI调用
 */

import axios from 'axios';

export interface AgentConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  modelType: 'glm' | 'chatgpt' | 'custom';
  systemPrompt: string;
  temperature: number;
  maxTokens: number;
  enabled: boolean;
  analysisRules: AnalysisRule[];
  postProcessing: (result: any) => any;
}

export interface AnalysisRule {
  field: string;
  type: 'image' | 'text' | 'numeric';
  processor: (input: any) => Promise<any>;
}

// ===== 舌苔检测智能体 =====
export const tongueCoatingAgent: AgentConfig = {
  id: 'tongue-coating-agent',
  name: '舌苔诊断AI',
  title: '中医舌苔检测智能体',
  description: '基于中医理论的AI舌苔诊断系统，实时分析舌象特征',
  modelType: 'glm',
  systemPrompt: `你是一位资深的中医诊断专家。你的职责是：
1. 分析用户上传的舌苔图片
2. 识别舌色、苔质、舌体等特征
3. 诊断体质类型（如湿热、阳虚、阴虚、气虚等）
4. 提供中医调理建议和食疗方案
5. 推荐适合的中成药和养生方法

请根据舌象特征提供专业、科学、实用的诊断结果。`,
  temperature: 0.6,
  maxTokens: 2000,
  enabled: true,
  analysisRules: [
    {
      field: 'image_analysis',
      type: 'image',
      processor: async (imageData: string) => {
        // 调用 Vision API 分析舌苔图片
        return await analyzeTongueImage(imageData);
      }
    },
    {
      field: 'pattern_matching',
      type: 'text',
      processor: async (features: string) => {
        // 匹配中医舌象模式
        return await matchTonguePatterns(features);
      }
    }
  ],
  postProcessing: (result: any) => {
    // 后处理：规范化输出格式
    return {
      ...result,
      confidence: Math.min(100, Math.max(0, result.confidence || 70)),
      healthScore: Math.min(100, Math.max(0, result.healthScore || 50))
    };
  }
};

// ===== 皮肤检测智能体 =====
export const skincareDetectionAgent: AgentConfig = {
  id: 'skincare-detection-agent',
  name: '皮肤诊断AI',
  title: '智能皮肤检测系统',
  description: '专业的皮肤分析和护肤建议AI系统',
  modelType: 'glm',
  systemPrompt: `你是一位专业的皮肤科医学顾问和护肤专家。你的职责是：
1. 分析用户的皮肤图片，识别肤质类型（干性、油性、混合、敏感等）
2. 诊断皮肤问题（痘痘、黑头、细纹、暗沉等）
3. 评估皮肤健康状态
4. 推荐针对性的护肤产品和疗程
5. 提供科学的护肤方案

请基于图像分析提供专业、详细的皮肤诊断报告。`,
  temperature: 0.5,
  maxTokens: 2500,
  enabled: true,
  analysisRules: [
    {
      field: 'skin_type_detection',
      type: 'image',
      processor: async (imageData: string) => {
        return await detectSkinType(imageData);
      }
    },
    {
      field: 'problem_identification',
      type: 'image',
      processor: async (imageData: string) => {
        return await identifySkinProblems(imageData);
      }
    }
  ],
  postProcessing: (result: any) => {
    return {
      ...result,
      skinScore: Math.min(100, Math.max(0, result.skinScore || 60)),
      severity: result.severity || 'mild'
    };
  }
};

// ===== 美容诊断智能体 =====
export const beautyDiagnosisAgent: AgentConfig = {
  id: 'beauty-diagnosis-agent',
  name: '美容评估AI',
  title: '个性化美容方案系统',
  description: '基于多维度分析的美容咨询AI系统',
  modelType: 'glm',
  systemPrompt: `你是一位资深的美容顾问和美学专家。你的职责是：
1. 分析用户的整体容貌特征
2. 评估肌肤状态、气质、气色等
3. 诊断美容需求（护肤、医美、造型等）
4. 制定个性化的美容方案
5. 推荐合适的美容疗程和产品

请提供专业、科学、个性化的美容建议。`,
  temperature: 0.6,
  maxTokens: 2000,
  enabled: true,
  analysisRules: [
    {
      field: 'facial_analysis',
      type: 'image',
      processor: async (imageData: string) => {
        return await analyzeFacialFeatures(imageData);
      }
    },
    {
      field: 'beauty_needs',
      type: 'text',
      processor: async (userInput: string) => {
        return await assessBeautyNeeds(userInput);
      }
    }
  ],
  postProcessing: (result: any) => {
    return {
      ...result,
      beautyScore: Math.min(100, Math.max(0, result.beautyScore || 70))
    };
  }
};

// ===== 健康评估智能体 =====
export const healthAssessmentAgent: AgentConfig = {
  id: 'health-assessment-agent',
  name: '健康评估AI',
  title: '综合健康分析系统',
  description: '多维度健康状态评估和建议系统',
  modelType: 'glm',
  systemPrompt: `你是一位专业的健康管理顾问。你的职责是：
1. 综合分析用户的各项健康指标
2. 评估生活方式和健康风险
3. 诊断潜在的健康问题
4. 提供科学的健康改善建议
5. 制定个性化的健康管理计划

请基于数据提供专业、实用的健康建议。`,
  temperature: 0.5,
  maxTokens: 2000,
  enabled: true,
  analysisRules: [
    {
      field: 'health_indicators',
      type: 'numeric',
      processor: async (indicators: any) => {
        return await analyzeHealthIndicators(indicators);
      }
    }
  ],
  postProcessing: (result: any) => {
    return {
      ...result,
      healthScore: Math.min(100, Math.max(0, result.healthScore || 50))
    };
  }
};

// ===== 实现分析函数 =====

async function analyzeTongueImage(imageData: string): Promise<any> {
  try {
    const response = await callAIModel('vision', {
      image: imageData,
      prompt: '请分析这张舌苔图片，识别舌色、苔质、舌体、苔厚度等特征'
    });
    return response.data;
  } catch (error) {
    console.error('舌苔图片分析失败:', error);
    return { error: '分析失败' };
  }
}

async function matchTonguePatterns(features: string): Promise<any> {
  try {
    const response = await callAIModel('text', {
      prompt: `根据以下舌象特征，匹配中医体质类型：${features}`,
      systemPrompt: '你是中医诊断专家，请匹配舌象对应的体质类型'
    });
    return response.data;
  } catch (error) {
    console.error('舌象模式匹配失败:', error);
    return { error: '匹配失败' };
  }
}

async function detectSkinType(imageData: string): Promise<any> {
  try {
    const response = await callAIModel('vision', {
      image: imageData,
      prompt: '请分析这张皮肤图片，诊断肤质类型（干性、油性、混合、敏感）'
    });
    return response.data;
  } catch (error) {
    console.error('肤质检测失败:', error);
    return { skinType: 'unknown' };
  }
}

async function identifySkinProblems(imageData: string): Promise<any> {
  try {
    const response = await callAIModel('vision', {
      image: imageData,
      prompt: '请识别皮肤问题（如痘痘、黑头、细纹、敏感、暗沉等）'
    });
    return response.data;
  } catch (error) {
    console.error('皮肤问题识别失败:', error);
    return { problems: [] };
  }
}

async function analyzeFacialFeatures(imageData: string): Promise<any> {
  try {
    const response = await callAIModel('vision', {
      image: imageData,
      prompt: '请分析面部特征、气色、气质等美学维度'
    });
    return response.data;
  } catch (error) {
    console.error('面部分析失败:', error);
    return { features: {} };
  }
}

async function assessBeautyNeeds(userInput: string): Promise<any> {
  try {
    const response = await callAIModel('text', {
      prompt: `根据用户描述评估美容需求：${userInput}`,
      systemPrompt: '你是美容顾问，请评估用户的美容需求'
    });
    return response.data;
  } catch (error) {
    console.error('美容需求评估失败:', error);
    return { needs: [] };
  }
}

async function analyzeHealthIndicators(indicators: any): Promise<any> {
  try {
    const response = await callAIModel('text', {
      prompt: `请分析以下健康指标：${JSON.stringify(indicators)}`,
      systemPrompt: '你是健康管理专家，请分析这些健康指标'
    });
    return response.data;
  } catch (error) {
    console.error('健康指标分析失败:', error);
    return { analysis: '' };
  }
}

// ===== AI 模型调用函数 =====

async function callAIModel(type: 'vision' | 'text', payload: any): Promise<any> {
  try {
    // 调用 GLM API（需要配置 API 密钥）
    const apiKey = process.env.REACT_APP_GLM_API_KEY || '';
    const endpoint = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    const response = await axios.post(endpoint, {
      model: type === 'vision' ? 'glm-4-vision' : 'glm-4',
      messages: [
        {
          role: 'system',
          content: payload.systemPrompt || ''
        },
        {
          role: 'user',
          content: type === 'vision'
            ? [
                { type: 'text', text: payload.prompt },
                { type: 'image_url', image_url: { url: payload.image } }
              ]
            : payload.prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 2000
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      data: response.data.choices[0].message.content
    };
  } catch (error) {
    console.error('AI 模型调用失败:', error);
    return {
      success: false,
      error: '模型调用失败'
    };
  }
}

// ===== 智能体管理 =====

export const healthAssistantAgents = {
  'tongue-coating': tongueCoatingAgent,
  'skincare-detection': skincareDetectionAgent,
  'beauty-diagnosis': beautyDiagnosisAgent,
  'health-assessment': healthAssessmentAgent
};

export function getAgent(agentId: string): AgentConfig | null {
  return healthAssistantAgents[agentId as keyof typeof healthAssistantAgents] || null;
}

export async function runAgentAnalysis(agentId: string, input: any): Promise<any> {
  const agent = getAgent(agentId);
  if (!agent || !agent.enabled) {
    return { error: '智能体不可用' };
  }

  try {
    // 执行分析规则
    const results: any = {};
    for (const rule of agent.analysisRules) {
      try {
        results[rule.field] = await rule.processor(input);
      } catch (error) {
        console.error(`规则 ${rule.field} 执行失败:`, error);
        results[rule.field] = { error: '执行失败' };
      }
    }

    // 后处理
    const finalResult = agent.postProcessing(results);
    return finalResult;
  } catch (error) {
    console.error(`智能体 ${agentId} 执行失败:`, error);
    return { error: '智能体执行失败' };
  }
}
