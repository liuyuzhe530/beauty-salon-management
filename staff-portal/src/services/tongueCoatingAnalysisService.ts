import CryptoJS from 'crypto-js';

export interface TongueAnalysis {
  tongueColor: string;
  coatingType: string;
  healthScore: number;
  diagnosis: string;
  problems: string[];
  recommendations: string[];
  remedies: Remedy[];
  adjustmentPlan: string[];
  imageHash: string;
  confidence: number;
  visualFeatures: VisualFeatures;
}

export interface Remedy {
  id: string;
  name: string;
  category: string;
  description: string;
  dosage: string;
}

export interface VisualFeatures {
  brightness: number;
  saturation: number;
  hueRange: { min: number; max: number };
  textureComplexity: number;
  coatingCoverage: number; // 0-100%
}

// 舌苔特征库 - 基于专业中医诊断
const TONGUE_COAT_PATTERNS = [
  {
    id: 'healthy',
    name: '健康舌象',
    tongueColor: '淡红色',
    coatingType: '薄白苔',
    healthScore: 85,
    diagnosis: '脾胃健康',
    colorRange: { hueMin: 0, hueMax: 15 },
    coatingCoverageRange: { min: 10, max: 30 },
    brightnesRange: { min: 180, max: 220 },
    problems: ['微有湿热', '消化需改善'],
    recommendations: ['加强脾胃功能', '适度运动', '饮食清淡'],
    remedies: [
      { id: '1', name: '健脾祛湿茶', category: '中成药', description: '健脾利湿', dosage: '日一剂' },
      { id: '2', name: '薏米红豆粥', category: '食疗', description: '健脾祛湿', dosage: '周3-4次' },
      { id: '3', name: '山楂麦芽茶', category: '食疗', description: '消食健脾', dosage: '日一杯' }
    ],
    adjustmentPlan: ['第1-2周：加强脾胃保健', '第3-4周：调理消化功能', '第5-8周：巩固效果']
  },
  {
    id: 'damp-heat',
    name: '湿热体质',
    tongueColor: '暗红色',
    coatingType: '厚腻苔',
    healthScore: 55,
    diagnosis: '湿热体质',
    colorRange: { hueMin: 350, hueMax: 15 },
    coatingCoverageRange: { min: 50, max: 80 },
    saturationRange: { min: 60, max: 100 },
    problems: ['湿热困脾', '消化不佳', '容易疲劳'],
    recommendations: ['祛除湿热', '健脾益气', '规律作息'],
    remedies: [
      { id: '1', name: '茵陈蒿汤', category: '中成药', description: '利胆祛湿', dosage: '日一剂' },
      { id: '2', name: '冬瓜薏米汤', category: '食疗', description: '清热祛湿', dosage: '周2-3次' },
      { id: '3', name: '绿豆粥', category: '食疗', description: '清热祛湿', dosage: '周2次' }
    ],
    adjustmentPlan: ['第1-2周：快速祛湿', '第3-4周：健脾调理', '第5-12周：体质调理']
  },
  {
    id: 'pale',
    name: '阳虚质',
    tongueColor: '淡白色',
    coatingType: '薄白苔',
    healthScore: 50,
    diagnosis: '脾阳虚',
    colorRange: { hueMin: 30, hueMax: 50 },
    brightnesRange: { min: 200, max: 240 },
    coatingCoverageRange: { min: 20, max: 40 },
    problems: ['体质虚弱', '手脚冰冷', '消化不良'],
    recommendations: ['温阳健脾', '加强营养', '适度保暖'],
    remedies: [
      { id: '1', name: '四君子汤', category: '中成药', description: '健脾益气', dosage: '日一剂' },
      { id: '2', name: '红参鸡汤', category: '食疗', description: '温阳补气', dosage: '周2次' },
      { id: '3', name: '生姜红茶', category: '食疗', description: '温阳祛湿', dosage: '日一杯' }
    ],
    adjustmentPlan: ['第1-4周：温阳健脾', '第5-8周：增强体质', '第9-12周：体质改善']
  },
  {
    id: 'yin-deficiency',
    name: '阴虚质',
    tongueColor: '红色',
    coatingType: '少苔或无苔',
    healthScore: 45,
    diagnosis: '阴液不足',
    colorRange: { hueMin: 350, hueMax: 10 },
    brightnesRange: { min: 140, max: 180 },
    coatingCoverageRange: { min: 0, max: 15 },
    problems: ['容易上火', '皮肤干燥', '口干',  '便秘'],
    recommendations: ['滋阴养血', '清热润肺', '多饮水'],
    remedies: [
      { id: '1', name: '六味地黄丸', category: '中成药', description: '滋阴补肾', dosage: '日一次' },
      { id: '2', name: '银耳雪梨汤', category: '食疗', description: '滋阴润肺', dosage: '周2次' },
      { id: '3', name: '百合粥', category: '食疗', description: '安神滋阴', dosage: '周3次' }
    ],
    adjustmentPlan: ['第1-4周：快速滋阴', '第5-8周：调理阴液', '第9-12周：体质平衡']
  },
  {
    id: 'damp-heat-severe',
    name: '湿热蕴结',
    tongueColor: '黄腻色',
    coatingType: '厚腻黄苔',
    healthScore: 30,
    diagnosis: '湿热蕴结',
    colorRange: { hueMin: 45, hueMax: 65 },
    coatingCoverageRange: { min: 75, max: 100 },
    saturationRange: { min: 70, max: 100 },
    problems: ['湿热严重', '消化阻滞', '代谢缓慢'],
    recommendations: ['清热利湿', '活血化瘀', '调理脾胃'],
    remedies: [
      { id: '1', name: '黄芩汤', category: '中成药', description: '清热利湿', dosage: '日一剂' },
      { id: '2', name: '赤小豆薏米粥', category: '食疗', description: '强力祛湿', dosage: '周3-4次' },
      { id: '3', name: '冬瓜粳米粥', category: '食疗', description: '清热祛湿', dosage: '周2次' }
    ],
    adjustmentPlan: ['第1-2周：强力祛湿', '第3-6周：调理脾胃', '第7-12周：巩固效果']
  }
];

class TongueCoatingAnalysisService {
  // 图像分析缓存
  private analysisCache: Map<string, TongueAnalysis> = new Map();

  /**
   * 生成图像哈希 - 确保同一张图片产生相同的分析结果
   * 使用简单的字符串哈希算法
   */
  private generateImageHash(imageData: string): string {
    return CryptoJS.SHA256(imageData).toString(CryptoJS.enc.Hex);
  }

  /**
   * 从图像中提取视觉特征
   */
  private async extractVisualFeatures(imageData: string): Promise<VisualFeatures> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);

        // 获取图像数据
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let brightness = 0;
        let saturation = 0;
        let hueValues: number[] = [];
        let textureVariance = 0;
        let coatingPixels = 0;

        // 分析像素数据
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // 计算亮度
          brightness += (r + g + b) / 3;

          // 转换为 HSV
          const max = Math.max(r, g, b);
          const min = Math.min(r, g, b);
          const l = (max + min) / 2;

          // 计算饱和度
          let s = 0;
          if (l > 0.5) {
            s = (max - min) / (2 - max - min);
          } else {
            s = (max - min) / (max + min);
          }
          saturation += s * 100;

          // 计算色调
          let h = 0;
          if (max !== min) {
            if (max === r) {
              h = ((g - b) / (max - min) + (g < b ? 6 : 0)) / 6;
            } else if (max === g) {
              h = ((b - r) / (max - min) + 2) / 6;
            } else {
              h = ((r - g) / (max - min) + 4) / 6;
            }
          }
          hueValues.push(h * 360);

          // 舌苔覆盖判断（偏白/黄的像素）
          if ((r > 150 && g > 120 && b < 100) || (r > 180 && g > 150 && b < 120)) {
            coatingPixels++;
          }
        }

        const pixelCount = data.length / 4;
        brightness = brightness / pixelCount;
        saturation = saturation / pixelCount;

        // 计算纹理复杂度（像素差异）
        let diff = 0;
        for (let i = 4; i < data.length; i += 4) {
          diff += Math.abs(data[i] - data[i - 4]) + Math.abs(data[i + 1] - data[i - 3]) + Math.abs(data[i + 2] - data[i - 2]);
        }
        textureVariance = (diff / data.length) * 100;

        const coatingCoverage = (coatingPixels / pixelCount) * 100;

        // 计算色调范围
        const minHue = hueValues.length > 0 ? Math.min(...hueValues) : 0;
        const maxHue = hueValues.length > 0 ? Math.max(...hueValues) : 0;

        resolve({
          brightness: Math.round(brightness),
          saturation: Math.round(saturation),
          hueRange: { min: Math.round(minHue), max: Math.round(maxHue) },
          textureComplexity: Math.round(textureVariance),
          coatingCoverage: Math.round(coatingCoverage)
        });
      };
      img.onerror = (e) => {
        console.error('Failed to load image for visual feature extraction:', e);
        resolve({
          brightness: 0,
          saturation: 0,
          hueRange: { min: 0, max: 0 },
          textureComplexity: 0,
          coatingCoverage: 0
        });
      };
      img.src = imageData;
    });
  }

  /**
   * 根据视觉特征匹配舌苔模式
   */
  private matchPatternByFeatures(features: VisualFeatures): { pattern: typeof TONGUE_COAT_PATTERNS[0]; confidence: number } {
    let bestMatch = TONGUE_COAT_PATTERNS[0];
    let bestConfidence = 0;

    for (const pattern of TONGUE_COAT_PATTERNS) {
      let confidence = 0;
      let matchCount = 0;

      // 检查色调范围
      if (pattern.colorRange) {
        const hueInRange = (features.hueRange.min <= pattern.colorRange.hueMax && features.hueRange.max >= pattern.colorRange.hueMin);
        confidence += hueInRange ? 25 : 0;
        matchCount += 25;
      }

      // 检查舌苔覆盖范围
      if (pattern.coatingCoverageRange) {
        const coverageInRange = (features.coatingCoverage >= pattern.coatingCoverageRange.min && features.coatingCoverage <= pattern.coatingCoverageRange.max);
        confidence += coverageInRange ? 25 : 0;
        matchCount += 25;
      }

      // 检查亮度范围
      if (pattern.brightnesRange) {
        const brightnessInRange = (features.brightness >= pattern.brightnesRange.min && features.brightness <= pattern.brightnesRange.max);
        confidence += brightnessInRange ? 25 : 0;
        matchCount += 25;
      }

      // 检查饱和度范围
      if (pattern.saturationRange) {
        const saturationInRange = (features.saturation >= pattern.saturationRange.min && features.saturation <= pattern.saturationRange.max);
        confidence += saturationInRange ? 25 : 0;
        matchCount += 25;
      }

      const normalizedConfidence = matchCount > 0 ? (confidence / matchCount) * 100 : 0;

      if (normalizedConfidence > bestConfidence) {
        bestConfidence = normalizedConfidence;
        bestMatch = pattern;
      }
    }

    return { pattern: bestMatch, confidence: Math.round(bestConfidence) };
  }

  /**
   * 分析舌苔图像 - 主方法
   */
  async analyzeTongueCoating(imageData: string): Promise<TongueAnalysis> {
    try {
      // 生成图像哈希
      const imageHash = this.generateImageHash(imageData);

      // 检查缓存 - 确保同一张图片返回相同结果
      if (this.analysisCache.has(imageHash)) {
        return this.analysisCache.get(imageHash)!;
      }

      // 提取视觉特征
      const visualFeatures = await this.extractVisualFeatures(imageData);

      // 根据特征匹配舌苔模式
      const { pattern, confidence } = this.matchPatternByFeatures(visualFeatures);

      // 构建分析结果
      const analysis: TongueAnalysis = {
        tongueColor: pattern.tongueColor,
        coatingType: pattern.coatingType,
        healthScore: pattern.healthScore,
        diagnosis: pattern.diagnosis,
        problems: pattern.problems,
        recommendations: pattern.recommendations,
        remedies: pattern.remedies,
        adjustmentPlan: pattern.adjustmentPlan,
        imageHash,
        confidence,
        visualFeatures
      };

      // 缓存结果
      this.analysisCache.set(imageHash, analysis);

      return analysis;
    } catch (error) {
      console.error('舌苔分析错误:', error);
      throw error;
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.analysisCache.clear();
  }

  /**
   * 获取缓存统计
   */
  getCacheStats(): { size: number; entries: string[] } {
    return {
      size: this.analysisCache.size,
      entries: Array.from(this.analysisCache.keys())
    };
  }

  /**
   * 获取视觉特征说明
   */
  getFeatureExplanation(features: VisualFeatures): string {
    return `
亮度: ${features.brightness} (0-255)
- 亮度越高表示舌苔越白，可能表示脾阳虚
- 亮度较低表示舌质较红，可能表示热或阴虚

饱和度: ${features.saturation}% (0-100)
- 饱和度高表示颜色深，可能表示体内热象
- 饱和度低表示颜色淡，可能表示体质虚弱

舌苔覆盖: ${features.coatingCoverage}% (0-100)
- 0-30%: 薄苔（正常）
- 30-70%: 厚腻苔（湿热）
- 70%+: 厚腻苔（严重湿热）

色调范围: ${features.hueRange.min}° - ${features.hueRange.max}°
- 红色(0-15°或330-360°): 热象
- 淡色(30-50°): 阳虚
- 黄色(45-65°): 湿热

纹理复杂度: ${features.textureComplexity}/100
- 表示舌苔表面的凹凸程度
`;
  }
}

export const tongueCoatingAnalysisService = new TongueCoatingAnalysisService();
export default tongueCoatingAnalysisService;
