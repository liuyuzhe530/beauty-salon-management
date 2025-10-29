import React, { useState } from 'react';
import { Sparkles, Image, FileText, User, Target, X, Plus, Copy, Download } from 'lucide-react';
import posterGenerationAPIService from '../services/posterGenerationAPIService';

interface MarketingFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const MarketingAssistant: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const marketingFeatures: MarketingFeature[] = [
    {
      id: 'poster',
      title: 'AI海报制作',
      description: '一键生成专业美容院海报',
      icon: <Image className="w-6 h-6" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'copywriting',
      title: 'AI文案生成',
      description: '小红书、抖音爆款文案',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-pink-50 border-pink-200'
    },
    {
      id: 'avatar',
      title: '数字分身',
      description: '创建品牌虚拟形象',
      icon: <User className="w-6 h-6" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'campaign',
      title: '活动策划',
      description: '拓客、锁客、留客方案',
      icon: <Target className="w-6 h-6" />,
      color: 'bg-green-50 border-green-200'
    }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'poster':
        return <PosterMaker />;
      case 'copywriting':
        return <CopywritingGenerator />;
      case 'avatar':
        return <DigitalAvatar />;
      case 'campaign':
        return <CampaignPlanner />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* 功能卡片网格 */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {marketingFeatures.map((feature) => (
          <button
            key={feature.id}
            onClick={() => {
              setActiveFeature(feature.id);
              setIsModalOpen(true);
            }}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${feature.color}`}
          >
            <div className="flex items-center gap-2 mb-2 text-green-600">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-sm text-gray-900">{feature.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
          </button>
        ))}
      </div>

      {/* 功能模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {marketingFeatures.find(f => f.id === activeFeature)?.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderFeatureContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// AI海报制作组件
const PosterMaker: React.FC = () => {
  const [content, setContent] = useState('');
  const [generatedPoster, setGeneratedPoster] = useState<any>(null);
  const [generatedScheme, setGeneratedScheme] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [posterFormat, setPosterFormat] = useState('vertical'); // vertical or horizontal
  const [apiStatus, setApiStatus] = useState<{available: boolean; source?: string}>({available: false});
  const [processingTime, setProcessingTime] = useState(0);

  // 根据文字内容分析生成海报配置
  const analyzePosterContent = (text: string) => {
    const textLower = text.toLowerCase();
    
    // 分析关键词确定风格和配色
    let style = 'modern';
    let colorScheme: any;
    let posterType = 'general';

    if (textLower.includes('特价') || textLower.includes('优惠') || textLower.includes('折扣')) {
      posterType = 'promotion';
      style = 'modern';
      colorScheme = {
        backgroundColor: '#FF6B6B',
        accentColor: '#FFE66D',
        textColor: '#ffffff',
        secondaryText: '#2d3436'
      };
    } else if (textLower.includes('新品') || textLower.includes('产品')) {
      posterType = 'product';
      style = 'elegant';
      colorScheme = {
        backgroundColor: '#E8D5F2',
        accentColor: '#9B59B6',
        textColor: '#2C1640',
        secondaryText: '#ffffff'
      };
    } else if (textLower.includes('美肤') || textLower.includes('护肤') || textLower.includes('皮肤')) {
      posterType = 'skincare';
      style = 'elegant';
      colorScheme = {
        backgroundColor: '#FFF0F5',
        accentColor: '#FF69B4',
        textColor: '#881391',
        secondaryText: '#ffffff'
      };
    } else if (textLower.includes('活动') || textLower.includes('开业') || textLower.includes('周年')) {
      posterType = 'event';
      style = 'playful';
      colorScheme = {
        backgroundColor: '#FFE5B4',
        accentColor: '#FF8C00',
        textColor: '#8B4513',
        secondaryText: '#ffffff'
      };
    } else {
      style = 'minimalist';
      colorScheme = {
        backgroundColor: '#F5F5F5',
        accentColor: '#333333',
        textColor: '#1a1a1a',
        secondaryText: '#666666'
      };
    }

    return { style, colorScheme, posterType };
  };

  // 生成营销方案
  const generateMarketingScheme = (text: string, posterConfig: any) => {
    return {
      title: '营销推广方案',
      channels: [
        {
          name: '微信朋友圈',
          description: '高价值客户触达',
          frequency: '每天 2-3 次',
          bestTime: '上午 10-11 点，晚上 20-21 点'
        },
        {
          name: '小程序',
          description: '转化率最高渠道',
          frequency: '常驻展示',
          bestTime: '全天推送'
        },
        {
          name: '微信群',
          description: '社群激活',
          frequency: '每周 2-3 次',
          bestTime: '工作日中午 12-13 点'
        },
        {
          name: '短信通知',
          description: '老客户维护',
          frequency: '每周 1-2 次',
          bestTime: '周五下午 14-15 点'
        }
      ],
      expectedResults: {
        reach: '预计 2000-5000 人次',
        conversion: '预计转化率 8-12%',
        revenue: '预计增收 3000-8000 元'
      },
      actionItems: [
        '制作海报高清版本',
        '准备文案话术',
        '建立投放日程表',
        '跟踪数据效果'
      ]
    };
  };

  // 增强的海报生成函数 - 集成 RunningHub API
  const generatePoster = async () => {
    if (!content.trim()) {
      alert('请输入海报内容！');
      return;
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      // 分析海报内容
      const posterConfig = analyzePosterContent(content);

      // 调用 API 服务生成海报
      const apiResponse = await posterGenerationAPIService.generatePoster({
        content: content,
        style: posterConfig.style,
        format: posterFormat === 'vertical' ? 'vertical' : 'horizontal',
        type: posterConfig.posterType,
        includeQRCode: true
      });

      const duration = Date.now() - startTime;
      setProcessingTime(duration);

      if (apiResponse.success && apiResponse.data) {
        // API 成功生成
        setApiStatus({
          available: true,
          source: apiResponse.meta?.source || 'api'
        });

        const scheme = generateMarketingScheme(content, posterConfig);
        
        // 使用 API 返回的海报数据
        const poster = {
          type: posterConfig.posterType,
          style: posterConfig.style,
          colors: apiResponse.data.design?.colorScheme || posterConfig.colorScheme,
          content: content,
          format: posterFormat,
          timestamp: new Date().toISOString(),
          posterUrl: apiResponse.data.posterUrl,
          source: apiResponse.meta?.source || 'api'
        };

        setGeneratedPoster(poster);
        setGeneratedScheme(scheme);
      } else {
        // API 失败或返回错误，使用本地生成
        setApiStatus({
          available: false,
          source: 'fallback'
        });

        const scheme = generateMarketingScheme(content, posterConfig);
        const poster = {
          type: posterConfig.posterType,
          style: posterConfig.style,
          colors: posterConfig.colorScheme,
          content: content,
          format: posterFormat,
          timestamp: new Date().toISOString(),
          source: 'local-fallback'
        };

        setGeneratedPoster(poster);
        setGeneratedScheme(scheme);
      }
    } catch (error: any) {
      console.error('海报生成失败:', error);
      
      // 异常情况下使用本地生成
      setApiStatus({
        available: false,
        source: 'fallback'
      });

      const posterConfig = analyzePosterContent(content);
      const scheme = generateMarketingScheme(content, posterConfig);
      const poster = {
        type: posterConfig.posterType,
        style: posterConfig.style,
        colors: posterConfig.colorScheme,
        content: content,
        format: posterFormat,
        timestamp: new Date().toISOString(),
        source: 'error-fallback'
      };

      setGeneratedPoster(poster);
      setGeneratedScheme(scheme);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成 Canvas 图片
  const generateCanvasImage = (poster: any): HTMLCanvasElement => {
    const isVertical = poster.format === 'vertical';
    const canvas = document.createElement('canvas');
    
    if (isVertical) {
    canvas.width = 1080;
    canvas.height = 1440;
    } else {
      canvas.width = 1920;
      canvas.height = 1080;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const { backgroundColor, accentColor, textColor, secondaryText } = poster.colors;

    // 背景
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 装饰条
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, 0, canvas.width, isVertical ? 240 : 180);

    // 标题
    ctx.fillStyle = secondaryText;
    ctx.font = `bold ${isVertical ? 80 : 60}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('美容院特别推荐', canvas.width / 2, isVertical ? 160 : 120);

    // 主要内容
    ctx.fillStyle = textColor;
    ctx.font = `${isVertical ? 50 : 40}px Arial`;
    
    const lines = poster.content.split('\n').filter((l: string) => l.trim());
    let yPosition = isVertical ? 450 : 350;
    const lineHeight = isVertical ? 100 : 80;

    lines.slice(0, 3).forEach((line: string) => {
      ctx.fillText(line, canvas.width / 2, yPosition);
      yPosition += lineHeight;
    });

    // 底部 CTA
    ctx.fillStyle = accentColor;
    ctx.fillRect(0, isVertical ? canvas.height - 180 : canvas.height - 150, canvas.width, isVertical ? 180 : 150);
    
    ctx.fillStyle = secondaryText;
    ctx.font = `bold ${isVertical ? 60 : 48}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('立即预约咨询', canvas.width / 2, isVertical ? canvas.height - 70 : canvas.height - 55);

    return canvas;
  };

  // 下载海报
  const downloadPoster = () => {
    if (!generatedPoster) return;

    const canvas = generateCanvasImage(generatedPoster);
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `海报-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* API 状态指示 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${apiStatus.available ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-sm font-medium text-gray-700">
              {apiStatus.available ? '🟢 API 在线' : '🟡 使用本地生成'}
            </span>
          </div>
          {processingTime > 0 && (
            <span className="text-xs text-gray-500">耗时: {processingTime}ms</span>
          )}
        </div>
      </div>

      {/* 输入区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">海报内容</h3>
        
        <div className="space-y-4">
          {/* 内容输入 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">输入您的海报文字内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="例如：春季护肤特价&#10;全场五折优惠&#10;新客户专享"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={5}
            />
          </div>

          {/* 格式选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">海报格式</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="vertical"
                  checked={posterFormat === 'vertical'}
                  onChange={(e) => setPosterFormat(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">竖版 (1080x1440)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="horizontal"
                  checked={posterFormat === 'horizontal'}
                  onChange={(e) => setPosterFormat(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">横版 (1920x1080)</span>
              </label>
            </div>
          </div>

          {/* 生成按钮 */}
          <button
            onClick={generatePoster}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-medium transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                正在生成海报...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                AI 智能生成海报和营销方案
              </>
            )}
          </button>
        </div>
      </div>

      {/* 结果展示 */}
      {generatedPoster && (
        <>
          {/* 生成来源提示 */}
          <div className={`rounded-lg border-l-4 p-4 ${
            generatedPoster.source === 'api' 
              ? 'bg-green-50 border-green-500' 
              : 'bg-blue-50 border-blue-500'
          }`}>
            <p className="text-sm font-medium text-gray-900">
              {generatedPoster.source === 'api' 
                ? '✨ 使用 RunningHub AI 生成的高质量海报'
                : '⚡ 使用本地生成的海报（API 暂不可用）'}
            </p>
          </div>

          {/* 海报预览 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">海报预览</h3>
            
            <div className="flex justify-center mb-4">
              <div
                className="rounded-lg overflow-hidden shadow-xl border-4"
                style={{
                  aspectRatio: posterFormat === 'vertical' ? '3/4' : '16/9',
                  maxWidth: posterFormat === 'vertical' ? '300px' : '600px',
                  backgroundColor: generatedPoster.colors.backgroundColor,
                  borderColor: generatedPoster.colors.accentColor
                }}
              >
                {/* 顶部 */}
                <div
                  style={{ backgroundColor: generatedPoster.colors.accentColor }}
                  className="px-4 py-6 text-center text-white"
                >
                  <div className="text-2xl font-bold">美容院特别推荐</div>
                </div>

                {/* 内容 */}
                <div className="p-6 flex flex-col justify-center items-center flex-1 text-center">
                  <div
                    style={{ color: generatedPoster.colors.textColor }}
                    className="text-lg font-semibold whitespace-pre-wrap"
                  >
                    {generatedPoster.content}
                  </div>
                </div>

                {/* 底部 */}
                <div
                  style={{ backgroundColor: generatedPoster.colors.accentColor }}
                  className="px-4 py-4 text-center text-white font-bold text-lg"
                >
                  立即预约咨询
                </div>
              </div>
            </div>

            {/* 下载按钮 */}
            <button
              onClick={downloadPoster}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
            >
              下载高清海报
            </button>
          </div>

          {/* 营销方案 */}
          {generatedScheme && (
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-green-300 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">智能营销推广方案</h3>

              {/* 投放渠道 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">推荐投放渠道</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {generatedScheme.channels.map((channel: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-4 border border-green-200">
                      <div className="font-semibold text-gray-900">{channel.name}</div>
                      <p className="text-sm text-gray-600 mt-1">{channel.description}</p>
                      <div className="text-xs text-gray-500 mt-2">
                        <div>频率: {channel.frequency}</div>
                        <div>最佳时间: {channel.bestTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 预期效果 */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">预期效果</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                    <div className="text-xs text-gray-600">触达人数</div>
                    <div className="text-lg font-bold text-green-600">{generatedScheme.expectedResults.reach}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                    <div className="text-xs text-gray-600">转化率</div>
                    <div className="text-lg font-bold text-green-600">{generatedScheme.expectedResults.conversion}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 border border-green-200 text-center">
                    <div className="text-xs text-gray-600">预计增收</div>
                    <div className="text-lg font-bold text-green-600">{generatedScheme.expectedResults.revenue}</div>
                  </div>
                </div>
              </div>

              {/* 行动清单 */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">行动清单</h4>
                <ul className="space-y-2">
                  {generatedScheme.actionItems.map((item: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-700">
                      <input type="checkbox" className="w-4 h-4 rounded" />
                      <span>{item}</span>
                    </li>
                  ))}
        </ul>
      </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// AI文案生成组件
const CopywritingGenerator: React.FC = () => {
  const [productInfo, setProductInfo] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['xiaohongshu', 'douyin']);
  const [generatedCopies, setGeneratedCopies] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const platforms = [
    { id: 'xiaohongshu', name: '小红书', desc: '适合女性用户，重视笔记和分享' },
    { id: 'douyin', name: '抖音', desc: '短视频为主，吸引年轻用户' },
    { id: 'wechat', name: '微信', desc: '公众号和朋友圈，重视信任度' },
    { id: 'weibo', name: '微博', desc: '适合热点和话题讨论' },
    { id: 'sms', name: '短信', desc: '直达客户，高转化' }
  ];

  // 根据产品信息生成针对不同平台的文案
  const generateCopyForPlatform = (product: string, platformId: string): string => {
    const productLower = product.toLowerCase();
    
    // 分析产品类型和特点
    const isPromotion = productLower.includes('优惠') || productLower.includes('特价') || productLower.includes('折扣');
    const isNew = productLower.includes('新') || productLower.includes('新品');
    const isSkincare = productLower.includes('皮肤') || productLower.includes('护肤') || productLower.includes('美肤');
    const isNailService = productLower.includes('美甲') || productLower.includes('甲');
    const isBodyCare = productLower.includes('身体') || productLower.includes('按摩') || productLower.includes('SPA');
    const isBundle = productLower.includes('套餐') || productLower.includes('组合');

    switch (platformId) {
      case 'xiaohongshu':
        return generateXiaohongshu(product, { isPromotion, isNew, isSkincare, isNailService, isBodyCare, isBundle });
      
      case 'douyin':
        return generateDouyin(product, { isPromotion, isNew, isSkincare, isNailService, isBodyCare, isBundle });
      
      case 'wechat':
        return generateWeChat(product, { isPromotion, isNew, isSkincare, isNailService, isBodyCare, isBundle });
      
      case 'weibo':
        return generateWeibo(product, { isPromotion, isNew, isSkincare, isNailService, isBodyCare, isBundle });
      
      case 'sms':
        return generateSMS(product, { isPromotion, isNew, isSkincare, isNailService, isBodyCare, isBundle });
      
      default:
        return '';
    }
  };

  // 小红书文案 - 笔记风格，重视体验分享
  const generateXiaohongshu = (product: string, tags: any): string => {
    const titles = [
      '这个美容体验绝了，必须分享',
      '美容师的手法真的绝，我爱了',
      '终于找到靠谱的美容院了',
      '美容效果显著，强烈推荐',
      '专业美容师团队，值得信赖'
    ];

    const descriptions = [
      `听我的，一定要试试我们的${product}服务！`,
      `我的皮肤变化让朋友都想来体验`,
      `专业的美容师让我省了好多护肤费用`,
      `${product}效果真的超出我的预期`,
      `来过一次就想回头客的美容院`
    ];

    const details = [
      '• 专业美容师团队\n• 高端进口产品\n• 一对一贴心服务\n• 效果看得见',
      '• 全套皮肤检测\n• 定制护肤方案\n• 专业技术团队\n• 放心有保障',
      '• 舒适的环境\n• 专业的设备\n• 优质的服务\n• 显著的效果',
      '• 质量有保证\n• 效果真实有\n• 服务超贴心\n• 口碑很不错'
    ];

    const calls = [
      '快来预约，名额有限',
      '现在咨询享受优惠价格',
      '新客户首次优惠百分之三十',
      '限时特惠，不要错过'
    ];

    return `【${titles[Math.floor(Math.random() * titles.length)]}】

${descriptions[Math.floor(Math.random() * descriptions.length)]}

${details[Math.floor(Math.random() * details.length)]}

${calls[Math.floor(Math.random() * calls.length)]}`;
  };

  // 抖音文案 - 短视频风格，节奏快
  const generateDouyin = (product: string, tags: any): string => {
    const openings = [
      '你还在为皮肤问题烦恼吗？',
      '美女们，这个必须看',
      '告诉你一个绝妙的秘密',
      '我要分享一个救星级的服务',
      '这个发现改变了我的美貌计划'
    ];

    const mainPoints = [
      `我们的${product}效果真的绝`,
      `专业的${product}让你焕然一新`,
      `${product}让我的气质直线上升`,
      `体验过${product}的人都回头了`,
      `${product}成为我的护肤必备`
    ];

    const benefits = [
      '立竿见影的效果\n专业的技术团队\n舒适的服务体验\n超值的价格',
      '皮肤状态改善明显\n整个人气质提升\n朋友都问我在哪做的\n回头率百分百',
      '效果看得见\n服务很贴心\n环境超舒适\n价格也合理',
      '能看到明显变化\n不是忽悠人的\n真的很值得\n强烈推荐'
    ];

    const cta = [
      '限时特价，赶快预约',
      '新客户优惠中',
      '现在咨询享折扣',
      '抖音粉丝专享优惠'
    ];

    return `${openings[Math.floor(Math.random() * openings.length)]}

${mainPoints[Math.floor(Math.random() * mainPoints.length)]}

${benefits[Math.floor(Math.random() * benefits.length)]}

${cta[Math.floor(Math.random() * cta.length)]}

点击链接预约吧`;
  };

  // 微信文案 - 信任感强，重视服务
  const generateWeChat = (product: string, tags: any): string => {
    return `亲爱的客户朋友们，

感谢您的信任与支持！

我们为您推荐：${product}

这是我们精心打造的特色服务，具有以下优势：

• 专业的美容师团队，经验丰富
• 采用高端进口产品，品质保证
• 一对一贴心咨询，定制方案
• 舒适的服务环境，让您放心

客户反馈：
"效果真的很满意，还会继续来！"
"服务态度特别好，感觉被重视了"
"价格公道，效果显著，推荐给朋友"

现在预约享受特别优惠：
• 新客户首次优惠百分之二十
• 介绍朋友送护肤产品
• 会员卡积分双倍

欢迎您的咨询和预约！

联系我们获取更多详情。`;
  };

  // 微博文案 - 话题风格，互动性强
  const generateWeibo = (product: string, tags: any): string => {
    const hashtags = ['#美容秘诀', '#护肤达人', '#美业干货', '#美容院推荐', '#护肤小技巧'];
    
    return `【${product}小课堂】

你知道吗？定期${product}对皮肤有这些好处：

1. 深层清洁 - 清除污垢，恢复肌肤光泽
2. 改善肤质 - 细致毛孔，提亮肤色
3. 增强弹性 - 补水保湿，重现年轻活力
4. 预防衰老 - 强化皮肤屏障，抗氧化

我们的专业建议：
每个月定期做${product}，效果加倍好

来我们美容院体验：
• 专业皮肤检测
• 定制护理方案
• 先进护理设备
• 优质护肤产品

限时优惠中，快来预约吧

${hashtags[Math.floor(Math.random() * hashtags.length)]} ${hashtags[Math.floor(Math.random() * hashtags.length)]} ${hashtags[Math.floor(Math.random() * hashtags.length)]}`;
  };

  // 短信文案 - 简洁有力，直达转化
  const generateSMS = (product: string, tags: any): string => {
    const messages = [
      `尊敬的客户，${product}限时特价，新客户首次享优惠，现在咨询预约立减百分之二十，详询客服。`,
      `美容院推送：${product}专业服务火爆预约中，前50名新客户享特别优惠，立即拨打预约！`,
      `客户朋友，我们的${product}效果显著，已有众多客户好评，现推出新客优惠，速来体验！`,
      `提醒：${product}护理效果更佳，本周限时优惠，名额有限，马上预约享受特价吧！`,
      `亲爱的客户，${product}现已上线，采用进口产品，专业团队护理，新客优惠中，快速预约！`
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  };

  // 生成所有平台的文案
  const handleGenerate = async () => {
    if (!productInfo.trim()) {
      alert('请输入产品或服务信息！');
      return;
    }

    setIsLoading(true);

    // 模拟 AI 处理
    setTimeout(() => {
      const copies: { [key: string]: string } = {};
      
      selectedPlatforms.forEach(platformId => {
        copies[platformId] = generateCopyForPlatform(productInfo, platformId);
      });

      setGeneratedCopies(copies);
      setIsLoading(false);
    }, 1500);
  };

  // 复制文案
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('文案已复制到剪贴板！');
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">产品/服务信息</h3>
        
    <div className="space-y-4">
          {/* 产品信息输入 */}
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">输入您的产品/服务信息</label>
            <textarea
              value={productInfo}
              onChange={(e) => setProductInfo(e.target.value)}
              placeholder="例如：春季护肤套餐、美甲服务、深层护肤、SPA按摩等...&#10;可包含价格、优惠、特色等信息"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            />
      </div>

          {/* 平台选择 */}
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">选择投放平台</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {platforms.map(platform => (
                <label key={platform.id} className="flex items-start gap-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.id]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(id => id !== platform.id));
                      }
                    }}
                    className="w-4 h-4 mt-0.5"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{platform.name}</div>
                    <div className="text-xs text-gray-500">{platform.desc}</div>
      </div>
                </label>
              ))}
        </div>
          </div>

          {/* 生成按钮 */}
        <button
          onClick={handleGenerate}
            disabled={isLoading || selectedPlatforms.length === 0}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-medium transition-all"
        >
            {isLoading ? '正在生成文案...' : `生成文案 (${selectedPlatforms.length} 个平台)`}
        </button>
        </div>
      </div>

      {/* 文案展示 */}
      {Object.keys(generatedCopies).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">生成的文案</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(generatedCopies).map(([platformId, copy]) => {
              const platform = platforms.find(p => p.id === platformId);
              return (
                <div key={platformId} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-900">{platform?.name}</h4>
                    <button
                      onClick={() => handleCopy(copy)}
                      className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      复制
          </button>
      </div>

                  <div className="bg-white rounded-lg p-3 text-sm text-gray-700 max-h-96 overflow-y-auto whitespace-pre-wrap">
                    {copy}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => handleGenerate()}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 font-medium"
            >
              重新生成
            </button>
            <button
              onClick={() => {
                const allCopies = Object.values(generatedCopies).join('\n\n---\n\n');
                handleCopy(allCopies);
              }}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium"
            >
              全部复制
            </button>
          </div>

          {/* 使用建议 */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
            <h4 className="font-semibold text-yellow-900 mb-2">使用建议</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• 小红书：适合详细笔记，强调体验和效果</li>
              <li>• 抖音：节奏快，适合短视频配文</li>
              <li>• 微信：重视信任，适合公众号和群发</li>
              <li>• 微博：话题性强，适合互动和讨论</li>
              <li>• 短信：简洁有力，直达转化</li>
        </ul>
      </div>
        </div>
      )}
    </div>
  );
};

// 数字分身组件
const DigitalAvatar: React.FC = () => {
  const [avatarName, setAvatarName] = useState('');
  const [avatarStyle, setAvatarStyle] = useState('professional');
  const [avatarTrait, setAvatarTrait] = useState('friendly');

  const styles = [
    { id: 'professional', name: '专业型' },
    { id: 'friendly', name: '亲和型' },
    { id: 'trendy', name: '潮流型' },
    { id: 'elegant', name: '优雅型' }
  ];

  const traits = [
    { id: 'friendly', name: '友好热情' },
    { id: 'professional', name: '专业可靠' },
    { id: 'creative', name: '创意十足' },
    { id: 'knowledgeable', name: '知识渊博' }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分身名称</label>
        <input
          type="text"
          value={avatarName}
          onChange={(event) => setAvatarName(event.target.value)}
          placeholder="给您的数字分身取个名字..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分身风格</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(styleItem => (
            <button
              key={styleItem.id}
              onClick={() => setAvatarStyle(styleItem.id)}
              className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                avatarStyle === styleItem.id
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {styleItem.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分身特点</label>
        <div className="grid grid-cols-2 gap-2">
          {traits.map(traitItem => (
            <button
              key={traitItem.id}
              onClick={() => setAvatarTrait(traitItem.id)}
              className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                avatarTrait === traitItem.id
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {traitItem.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-900">您的数字分身已生成完成！</p>
        <p className="text-xs text-gray-600 mt-2">
          该分身将用于自动回复客户消息、提供专业建议和品牌推广。
        </p>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          保存分身
        </button>
        <button className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          预览效果
        </button>
      </div>
    </div>
  );
};

// 活动策划组件
const CampaignPlanner: React.FC = () => {
  const [campaignType, setCampaignType] = useState('拓客');
  const [budget, setBudget] = useState('10000');
  const [campaignName, setCampaignName] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const campaignTypes = [
    { id: '拓客', name: '客户获取', desc: '吸引新客户的拓客活动' },
    { id: '锁客', name: '客户锁定', desc: '提高客户忠诚度的留客活动' },
    { id: '留存', name: '客户留存', desc: '客户留存和重复购买策略' },
    { id: '假期', name: '假期活动', desc: '假期特色营销活动计划' }
  ];

  // 生成完整活动方案
  const generateCampaignPlan = () => {
    if (!campaignName.trim()) {
      alert('请输入活动名称！');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const budgetNum = parseInt(budget) || 10000;

      // 根据活动类型生成不同方案
      let plan = generatePlanByType(campaignType, campaignName, budgetNum);
      setGeneratedPlan(plan);
      setIsLoading(false);
    }, 1500);
  };

  // 根据类型生成方案
  const generatePlanByType = (type: string, name: string, budget: number): any => {
    const baseStructure = {
      name,
      type,
      budget,
      duration: '30天',
      startDate: new Date().toLocaleDateString('zh-CN'),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('zh-CN')
    };

    switch (type) {
      case '拓客':
        return generateAcquirePlan(baseStructure);
      case '锁客':
        return generateRetainPlan(baseStructure);
      case '留存':
        return generateLoyaltyPlan(baseStructure);
      case '假期':
        return generateSeasonalPlan(baseStructure);
      default:
        return baseStructure;
    }
  };

  // 客户获取方案
  const generateAcquirePlan = (base: any) => ({
    ...base,
    objective: '通过多渠道营销，吸引高价值新客户，提升品牌知名度',
    targetAudience: '18-45岁女性，关注美容护肤，消费能力中等以上',
    keyMetrics: {
      reach: '10000+',
      conversion: '8-12%',
      newCustomers: '800-1200',
      costPerCustomer: Math.floor(base.budget / 900)
    },
    channels: [
      {
        name: '小红书投放',
        budget: Math.floor(base.budget * 0.25),
        desc: '笔记内容+品牌号推广',
        tactics: ['发布5-10篇专业笔记', '邀请2-3位KOL合作', '投放1-2场信息流广告'],
        duration: '持续投放',
        expectedResult: '200-300新客户'
      },
      {
        name: '抖音短视频',
        budget: Math.floor(base.budget * 0.25),
        desc: '短视频种草+达人合作',
        tactics: ['发布10-15条短视频', '投放视频广告', '邀请3-5位达人'],
        duration: '持续投放',
        expectedResult: '300-400新客户'
      },
      {
        name: '微信朋友圈',
        budget: Math.floor(base.budget * 0.15),
        desc: '广告投放+老客户转介',
        tactics: ['朋友圈广告3-5条', '培训老客户转介', '设置转介奖励'],
        duration: '全月投放',
        expectedResult: '150-200新客户'
      },
      {
        name: '线下推广',
        budget: Math.floor(base.budget * 0.20),
        desc: '门店活动+社区推广',
        tactics: ['门店开放日体验', '社区推广活动', '合作单位推广'],
        duration: '每周1-2次',
        expectedResult: '100-150新客户'
      },
      {
        name: '其他渠道',
        budget: Math.floor(base.budget * 0.15),
        desc: '微博、小程序、SEO等',
        tactics: ['微博话题营销', '小程序优化', '搜索引擎优化'],
        duration: '持续优化',
        expectedResult: '50-150新客户'
      }
    ],
    weeklyPlan: [
      {
        week: '第一周',
        focus: '前期预热与内容投放',
        actions: ['准备营销素材', '发布小红书笔记', '启动朋友圈广告', '制作抖音视频']
      },
      {
        week: '第二周',
        focus: '加强投放与互动',
        actions: ['增加广告投放', '邀请达人合作', '回复客户咨询', '优化转化页面']
      },
      {
        week: '第三周',
        focus: '数据分析与调整',
        actions: ['分析投放效果', '调整广告策略', '追加优质渠道', '启动转介绍']
      },
      {
        week: '第四周',
        focus: '冲刺与收尾',
        actions: ['加大投放力度', '最后冲刺活动', '总结数据', '制定下期计划']
      }
    ],
    staffTasks: {
      销售团队: ['回复客户咨询', '安排试听试用', '跟进转化', '建立客户档案'],
      美容师: ['参与门店活动', '提供专业咨询', '拍摄内容素材', '分享客户案例'],
      社群运营: ['维护社群活跃度', '定期发送优惠信息', '组织线上互动', '收集客户反馈'],
      管理层: ['监控投放数据', '分析转化率', '评估ROI', '调整策略']
    },
    executionSteps: [
      '第1天：确认方案，准备素材',
      '第2-3天：制作营销内容',
      '第4-5天：启动全渠道投放',
      '第6-30天：持续优化，数据监控',
      '第30天：总结评估'
    ],
    riskControl: [
      '预留应急预算10-15%',
      '每周检查投放效果',
      '及时调整低效渠道',
      '防止过度投放单渠道',
      '做好售后服务'
    ],
    successCriteria: {
      '新增客户': '800人以上',
      '转化率': '8%以上',
      '客户满意度': '85%以上',
      'ROI': '至少2倍'
    }
  });

  // 客户锁定方案
  const generateRetainPlan = (base: any) => ({
    ...base,
    objective: '提高客户粘性，增加客户终生价值，建立稳定客户基础',
    targetAudience: '已购买过服务的客户，特别是高价值客户',
    keyMetrics: {
      retention: '70-80%',
      repeatRate: '40-50%',
      averageValue: '+30-50%',
      lifetime: 'x2-3倍增长'
    },
    channels: [
      {
        name: '会员系统升级',
        budget: Math.floor(base.budget * 0.20),
        desc: '创建VIP等级体系',
        tactics: ['设计3-5个会员等级', '配置不同权益', '制作会员手册'],
        duration: '第一周完成',
        expectedResult: '50%客户升级为会员'
      },
      {
        name: '个性化服务',
        budget: Math.floor(base.budget * 0.25),
        desc: '定制护理方案+专属顾问',
        tactics: ['建立客户档案库', '开发定制方案功能', '分配专属顾问'],
        duration: '持续进行',
        expectedResult: '客户满意度+25%'
      },
      {
        name: '客户关怀计划',
        budget: Math.floor(base.budget * 0.20),
        desc: '生日礼物、节日问候、定期关怀',
        tactics: ['建立客户生日库', '定期发送优惠券', '组织客户活动'],
        duration: '全月进行',
        expectedResult: '客户复购率+15%'
      },
      {
        name: '积分奖励系统',
        budget: Math.floor(base.budget * 0.15),
        desc: '积分兑换、等级提升',
        tactics: ['开发积分系统', '制定兑换规则', '宣传推广'],
        duration: '第二周上线',
        expectedResult: '平均客单价+20%'
      },
      {
        name: '社群建设',
        budget: Math.floor(base.budget * 0.20),
        desc: '美容讨论、分享、互动',
        tactics: ['创建微信群', '定期分享知识', '组织线下聚会'],
        duration: '持续运营',
        expectedResult: '建立5-10个活跃群'
      }
    ],
    weeklyPlan: [
      {
        week: '第一周',
        focus: '系统建设',
        actions: ['完成会员系统设计', '建立客户档案库', '制定奖励规则']
      },
      {
        week: '第二周',
        focus: '上线与宣传',
        actions: ['正式上线系统', '发送邀请函', '组织说明会', '启动推广']
      },
      {
        week: '第三周',
        focus: '关怀与维护',
        actions: ['开始关怀计划', '组织客户活动', '收集反馈意见']
      },
      {
        week: '第四周',
        focus: '优化与提升',
        actions: ['优化系统功能', '加大奖励力度', '策划下月活动']
      }
    ],
    staffTasks: {
      顾问团队: ['关怀客户', '推荐新服务', '组织活动', '收集反馈'],
      美容师: ['提供优质服务', '记录客户需求', '参与活动'],
      运营: ['维护系统', '发放奖励', '管理群组', '数据分析'],
      管理层: ['监控指标', '评估效果', '优化策略']
    },
    executionSteps: [
      '第1-3天：完成系统设计和建设',
      '第4-7天：内部培训和测试',
      '第8-14天：正式推出和宣传',
      '第15-27天：运营维护和优化',
      '第28-30天：总结评估'
    ],
    riskControl: [
      '充分沟通，确保客户理解',
      '提供充足支持，解答问题',
      '定期检查数据，及时调整',
      '保证服务质量不降低',
      '维护客户隐私和数据安全'
    ],
    successCriteria: {
      '客户留存率': '70%以上',
      '复购率': '40%以上',
      '客户满意度': '90%以上',
      '平均客单价增长': '20%以上'
    }
  });

  // 客户留存方案
  const generateLoyaltyPlan = (base: any) => ({
    ...base,
    objective: '实现客户复购、建立口碑传播、提升客户生命周期价值',
    targetAudience: '重复购买客户，特别是高频客户和高消费客户',
    keyMetrics: {
      retentionRate: '80-90%',
      repurchaseFrequency: '每月1-2次',
      referralRate: '20-30%',
      profitMargin: '+40-50%'
    },
    channels: [
      {
        name: '定期维护沟通',
        budget: Math.floor(base.budget * 0.15),
        desc: '电话、短信、微信定期跟进',
        tactics: ['月度问候电话', '护肤知识推送', '邀请复购'],
        duration: '持续进行',
        expectedResult: '30%客户主动复购'
      },
      {
        name: '转介绍激励',
        budget: Math.floor(base.budget * 0.25),
        desc: '客户推荐新客户的奖励',
        tactics: ['设计奖励方案', '制作推荐物料', '追踪反馈'],
        duration: '全月进行',
        expectedResult: '20%的新客户来自转介'
      },
      {
        name: '深度服务拓展',
        budget: Math.floor(base.budget * 0.20),
        desc: '增加服务项目，提升客单价',
        tactics: ['设计新套餐', '产品捆绑销售', '升级服务体验'],
        duration: '持续进行',
        expectedResult: '客单价+30%'
      },
      {
        name: '口碑建设',
        budget: Math.floor(base.budget * 0.20),
        desc: '客户评价、案例分享、美誉度提升',
        tactics: ['收集客户案例', '鼓励线上评价', '制作推荐视频'],
        duration: '全月进行',
        expectedResult: '累积200+好评'
      },
      {
        name: '客户裂变计划',
        budget: Math.floor(base.budget * 0.20),
        desc: '通过活动实现客户倍增',
        tactics: ['组织线下活动', '线上答题送礼', '团购优惠'],
        duration: '每周举办',
        expectedResult: '带动500-1000新客'
      }
    ],
    executionSteps: [
      '第1-5天：制定详细计划，准备物料',
      '第6-15天：启动维护和转介绍计划',
      '第16-25天：实施口碑建设和裂变活动',
      '第26-30天：总结数据，规划下期'
    ],
    staffTasks: {
      顾问团队: ['定期回访客户', '推荐新服务', '鼓励转介绍'],
      美容师: ['提供卓越服务', '分享案例', '获取好评'],
      市场部: ['制作物料', '组织活动', '收集案例'],
      管理: ['监控指标', '评估效果', '优化策略']
    },
    successCriteria: {
      '客户留存率': '85%以上',
      '转介绍转化': '20%以上',
      '口碑评价': '4.8星以上',
      '新增客户': '500+人'
    }
  });

  // 假期活动方案
  const generateSeasonalPlan = (base: any) => ({
    ...base,
    objective: '抓住节假日消费高峰，创造销售增长点，提升品牌热度',
    season: new Date().getMonth() < 6 ? '春季/女性节日' : '秋冬/年末',
    keyMetrics: {
      salesGrowth: '+50-100%',
      participation: '60-80%',
      avgValue: '+40-60%',
      repeatedPurchase: '35-45%'
    },
    holidays: [
      {
        name: '妇女节(3月8日)',
        campaignName: '女神节特惠',
        duration: '3月1-15日',
        budget: Math.floor(base.budget * 0.25),
        tactics: [
          '推出女性专属套餐',
          '首次客户8折优惠',
          '老客户送精美礼物',
          '转介绍额外返利'
        ],
        expectedResult: '增收8000-12000元'
      },
      {
        name: '母亲节(5月第2个周日)',
        campaignName: '感恩母亲节',
        duration: '5月1-20日',
        budget: Math.floor(base.budget * 0.25),
        tactics: [
          '亲子护肤体验',
          '母女套餐特价',
          '礼物卡赠送',
          '母亲节感恩活动'
        ],
        expectedResult: '增收8000-12000元'
      },
      {
        name: '双十一(11月11日)',
        campaignName: '双十一狂欢节',
        duration: '11月1-15日',
        budget: Math.floor(base.budget * 0.30),
        tactics: [
          '限时秒杀套餐',
          '满赠优惠券',
          '积分兑换',
          '分享享优惠'
        ],
        expectedResult: '增收12000-18000元'
      },
      {
        name: '年末大促(12月)',
        campaignName: '年末感恩回馈',
        duration: '12月1-31日',
        budget: Math.floor(base.budget * 0.20),
        tactics: [
          '年卡优惠销售',
          '感谢小礼物',
          '新年福袋活动',
          '跨年特价'
        ],
        expectedResult: '增收10000-15000元'
      }
    ],
    marketingChannels: [
      '微信朋友圈：节日主题广告',
      '小红书：假期攻略笔记',
      '抖音：短视频种草',
      '微信群：VIP客户专享',
      '门店海报：氛围营造'
    ],
    executionSteps: [
      '提前15天：策划方案，准备物料',
      '提前10天：制作广告内容',
      '提前5天：启动预热宣传',
      '活动期间：全力投放，监控效果',
      '活动后：总结数据，制定后续'
    ],
    successCriteria: {
      '销售增长': '50%以上',
      '客户参与': '65%以上',
      '客户满意': '85%以上',
      '口碑传播': '大幅提升'
    }
  });

  // 复制方案
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('已复制到剪贴板！');
  };

  // 格式化输出
  const formatPlanOutput = (plan: any): string => {
    let output = `活动名称: ${plan.name}\n`;
    output += `活动类型: ${campaignTypes.find(t => t.id === plan.type)?.name}\n`;
    output += `预算: ${plan.budget}元\n`;
    output += `周期: ${plan.duration}\n`;
    output += `时间: ${plan.startDate} 至 ${plan.endDate}\n\n`;
    output += `目标: ${plan.objective}\n\n`;
    output += `关键指标:\n`;
    Object.entries(plan.keyMetrics).forEach(([key, value]) => {
      output += `  - ${key}: ${value}\n`;
    });
    return output;
  };

  return (
    <div className="space-y-6">
      {/* 输入区域 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">活动信息</h3>
        
    <div className="space-y-4">
          {/* 活动名称 */}
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活动名称</label>
            <input
              type="text"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              placeholder="例如：春季护肤节、美女节特惠等"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* 活动类型 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活动类型</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {campaignTypes.map(type => (
            <button
                  key={type.id}
                  onClick={() => setCampaignType(type.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left text-sm ${
                    campaignType === type.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
                  <div className="font-semibold text-gray-900">{type.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{type.desc}</div>
            </button>
          ))}
        </div>
      </div>

          {/* 预算 */}
      <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">活动预算（元）</label>
        <input
              type="number"
          value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="输入预算金额"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

          {/* 生成按钮 */}
          <button
            onClick={generateCampaignPlan}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-medium transition-all"
          >
            {isLoading ? '正在生成完整活动方案...' : '生成完整活动方案'}
          </button>
        </div>
      </div>

      {/* 方案展示 */}
      {generatedPlan && (
        <div className="space-y-6">
          {/* 基本信息 */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">活动概览</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600">活动名称</div>
                <div className="text-sm font-bold text-gray-900 mt-1">{generatedPlan.name}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600">活动类型</div>
                <div className="text-sm font-bold text-gray-900 mt-1">{campaignTypes.find(t => t.id === generatedPlan.type)?.name}</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600">总预算</div>
                <div className="text-sm font-bold text-green-600 mt-1">{generatedPlan.budget}元</div>
              </div>
              <div className="bg-white rounded-lg p-3">
                <div className="text-xs text-gray-600">活动周期</div>
                <div className="text-sm font-bold text-gray-900 mt-1">{generatedPlan.duration}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-700">{generatedPlan.objective}</p>
            </div>
          </div>

          {/* 关键指标 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">关键指标</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(generatedPlan.keyMetrics).map(([key, value], idx) => (
                <div key={idx} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-xs text-gray-600 capitalize">{key}</div>
                  <div className="text-lg font-bold text-purple-600 mt-2">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 投放渠道或假期计划 */}
          {generatedPlan.channels && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">投放渠道与预算分配</h3>
              <div className="space-y-3">
                {generatedPlan.channels.map((channel: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{channel.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{channel.desc}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">{channel.budget}元</div>
                        <div className="text-xs text-gray-500">预算占比: {Math.round(channel.budget / generatedPlan.budget * 100)}%</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {channel.tactics.map((tactic: string, i: number) => (
                        <div key={i} className="text-sm text-gray-700">• {tactic}</div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-green-300">
                      <div className="text-xs font-medium text-gray-600">
                        预期: {channel.expectedResult}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generatedPlan.holidays && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">假期活动计划</h3>
              <div className="space-y-3">
                {generatedPlan.holidays.map((holiday: any, idx: number) => (
                  <div key={idx} className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border border-red-200">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{holiday.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">主题: {holiday.campaignName}</p>
                        <p className="text-xs text-gray-500">时间: {holiday.duration}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-red-600">{holiday.budget}元</div>
                        <div className="text-xs text-gray-500">占比: {Math.round(holiday.budget / generatedPlan.budget * 100)}%</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      {holiday.tactics.map((tactic: string, i: number) => (
                        <div key={i} className="text-sm text-gray-700">• {tactic}</div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-red-300">
                      <div className="text-xs font-medium text-gray-600">{holiday.expectedResult}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 周度计划 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">周度执行计划</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedPlan.weeklyPlan.map((week: any, idx: number) => (
                <div key={idx} className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-bold text-gray-900 mb-2">{week.week}</h4>
                  <p className="text-sm text-gray-600 mb-2">重点: {week.focus}</p>
                  <ul className="space-y-1">
                    {week.actions.map((action: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">• {action}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 团队分工 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">团队分工职责</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(generatedPlan.staffTasks).map(([role, tasks]: [string, any], idx) => (
                <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">{role}</h4>
                  <ul className="space-y-1">
                    {tasks.map((task: string, i: number) => (
                      <li key={i} className="text-sm text-gray-700">• {task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* 成功标准 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">成功标准与评估</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(generatedPlan.successCriteria).map(([criterion, value], idx) => (
                <div key={idx} className="bg-white rounded-lg p-3 border border-green-200">
                  <div className="text-xs text-gray-600 font-medium">{criterion}</div>
                  <div className="text-sm font-bold text-green-600 mt-2">{String(value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => handleCopy(formatPlanOutput(generatedPlan))}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium"
            >
              复制方案
        </button>
            <button
              onClick={() => setGeneratedPlan(null)}
              className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 font-medium"
            >
          重新生成
        </button>
      </div>
      </div>
      )}
    </div>
  );
};