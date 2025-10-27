import React, { useState } from 'react';
import { Sparkles, Image, FileText, User, Target, X, Plus, Copy, Download } from 'lucide-react';

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
  const [posterType, setPosterType] = useState('promotion');
  const [style, setStyle] = useState('modern');
  const [content, setContent] = useState('');
  const [generatedPoster, setGeneratedPoster] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const posterTemplates = [
    { id: 'promotion', name: '促销活动' },
    { id: 'product', name: '产品推荐' },
    { id: 'event', name: '特别活动' },
    { id: 'seasonal', name: '季节营销' }
  ];

  const styles = [
    { id: 'modern', name: '现代风格' },
    { id: 'elegant', name: '优雅风格' },
    { id: 'playful', name: '活泼风格' },
    { id: 'minimalist', name: '极简风格' }
  ];

  // 生成海报预览（使用 Canvas）
  const generatePosterPreview = () => {
    if (!content.trim()) {
      alert('请输入海报主题！');
      return;
    }

    setIsLoading(true);

    // 延迟处理以显示加载动画
    setTimeout(() => {
      const colors: { [key: string]: { backgroundColor: string; textColor: string; accentColor: string } } = {
        modern: { backgroundColor: '#f0f4f8', textColor: '#1a202c', accentColor: '#3182ce' },
        elegant: { backgroundColor: '#fef5e7', textColor: '#2c1810', accentColor: '#8b4513' },
        playful: { backgroundColor: '#fff5e1', textColor: '#ff6b6b', accentColor: '#ff8787' },
        minimalist: { backgroundColor: '#ffffff', textColor: '#000000', accentColor: '#666666' }
      };

      const titles: { [key: string]: string } = {
        promotion: '💰 特价优惠',
        product: '✨ 产品推荐',
        event: '🎉 活动预告',
        seasonal: '🌸 季节营销'
      };

      const colorScheme = colors[style];
      const title = titles[posterType];

      // 模拟海报数据
      const poster = {
        type: posterType,
        style: style,
        title: title,
        content: content,
        colors: colorScheme,
        timestamp: new Date().toISOString()
      };

      setGeneratedPoster(poster);
      setIsLoading(false);
    }, 1500);
  };

  // 下载海报（生成图片）
  const downloadPoster = () => {
    if (!generatedPoster) return;

    // 创建 Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1440;
    const canvasContext = canvas.getContext('2d');

    if (!canvasContext) return;

    // 填充背景
    canvasContext.fillStyle = generatedPoster.colors.backgroundColor;
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制装饰元素
    canvasContext.fillStyle = generatedPoster.colors.accentColor;
    canvasContext.fillRect(0, 0, canvas.width, 200);

    // 绘制标题
    canvasContext.fillStyle = '#ffffff';
    canvasContext.font = 'bold 60px Arial';
    canvasContext.textAlign = 'center';
    canvasContext.fillText(generatedPoster.title, canvas.width / 2, 120);

    // 绘制主要内容
    canvasContext.fillStyle = generatedPoster.colors.textColor;
    canvasContext.font = '40px Arial';
    canvasContext.textAlign = 'center';

    const lines = generatedPoster.content.split('\n');
    let yPosition = 400;
    lines.forEach((line: string) => {
      canvasContext.fillText(line, canvas.width / 2, yPosition);
      yPosition += 80;
    });

    // 绘制底部信息
    canvasContext.fillStyle = generatedPoster.colors.accentColor;
    canvasContext.fillRect(0, canvas.height - 150, canvas.width, 150);

    canvasContext.fillStyle = '#ffffff';
    canvasContext.font = '30px Arial';
    canvasContext.textAlign = 'center';
    canvasContext.fillText('立即咨询', canvas.width / 2, canvas.height - 50);

    // 下载
    canvas.toBlob((blobData) => {
      if (blobData) {
        const url = URL.createObjectURL(blobData);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `海报-${Date.now()}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="space-y-4">
      {/* 海报配置 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">海报类型</label>
          <select
            value={posterType}
            onChange={(event) => setPosterType(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {posterTemplates.map(templateItem => (
              <option key={templateItem.id} value={templateItem.id}>{templateItem.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">设计风格</label>
          <select
            value={style}
            onChange={(event) => setStyle(event.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {styles.map(styleItem => (
              <option key={styleItem.id} value={styleItem.id}>{styleItem.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 海报主题输入 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">海报主题</label>
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="输入您的海报主题或描述...&#10;例如：&#10;春季护肤特价&#10;限时优惠百分之五十&#10;新客户专享"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={4}
        />
      </div>

      {/* 生成按钮 */}
      <button
        onClick={generatePosterPreview}
        disabled={isLoading}
        className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
      >
        {isLoading ? (
          <>
            <div className="animate-spin">⏳</div>
            正在生成海报...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            人工智能生成海报
          </>
        )}
      </button>

      {/* 海报预览 */}
      {generatedPoster && (
        <div className="bg-gradient-to-b from-green-50 to-white p-4 rounded-lg border-2 border-green-200">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-green-600" />
            <p className="font-medium text-sm text-green-900">AI 生成预览</p>
          </div>

          {/* 模拟海报预览 */}
          <div
            className="w-full rounded-lg overflow-hidden shadow-lg border-4 mx-auto"
            style={{
              aspectRatio: '3/4',
              backgroundColor: generatedPoster.colors.backgroundColor,
              maxWidth: '300px',
              border: `4px solid ${generatedPoster.colors.accentColor}`
            }}
          >
            {/* 顶部条纹 */}
            <div
              style={{ backgroundColor: generatedPoster.colors.accentColor }}
              className="p-4 text-center text-white"
            >
              <div className="text-2xl font-bold">{generatedPoster.title}</div>
            </div>

            {/* 主体内容 */}
            <div className="p-6 text-center flex flex-col justify-center items-center h-[calc(100%-120px)]">
              <div
                style={{ color: generatedPoster.colors.textColor }}
                className="text-lg font-semibold whitespace-pre-wrap"
              >
                {generatedPoster.content}
              </div>
            </div>

            {/* 底部 CTA */}
            <div
              style={{ backgroundColor: generatedPoster.colors.accentColor }}
              className="p-3 text-center text-white font-bold"
            >
              立即咨询
            </div>
          </div>

          {/* 海报信息 */}
          <div className="mt-4 p-3 bg-white rounded border border-gray-200 text-sm">
            <div className="grid grid-cols-2 gap-2 text-gray-600">
              <div><span className="font-medium">类型：</span> {posterTemplates.find(templateItem => templateItem.id === posterType)?.name}</div>
              <div><span className="font-medium">风格：</span> {styles.find(styleItem => styleItem.id === style)?.name}</div>
            </div>
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-2">
        {generatedPoster && (
          <>
            <button
              onClick={downloadPoster}
              className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2 font-medium"
            >
              <Download className="w-4 h-4" />
              下载海报
            </button>
            <button
              onClick={() => setGeneratedPoster(null)}
              className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
            >
              重新生成
            </button>
          </>
        )}
      </div>

      {/* 提示信息 */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-xs text-blue-900">
        <p className="font-medium mb-1">💡 使用提示：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>输入简明扼要的海报主题内容</li>
          <li>选择合适的设计风格和类型</li>
          <li>生成后可下载为图片进行使用</li>
          <li>支持在社交媒体、门店等多渠道使用推广</li>
        </ul>
      </div>
    </div>
  );
};

// AI文案生成组件
const CopywritingGenerator: React.FC = () => {
  const [platform, setPlatform] = useState('xiaohongshu');
  const [topic, setTopic] = useState('');
  const [generatedCopy, setGeneratedCopy] = useState('');

  const platforms = [
    { id: 'xiaohongshu', name: '小红书' },
    { id: 'douyin', name: '抖音' },
    { id: 'wechat', name: '微信' },
    { id: 'weibo', name: '微博' }
  ];

  const handleGenerate = () => {
    const samples: { [key: string]: string } = {
      xiaohongshu: '[美容笔记] 这款美容套餐真的绝了！\n\n护肤、修甲、按摩全包含，一次性解决所有美容需求。专业美容师团队，精心打造您的独特魅力。\n\n限时优惠中 - 快来体验吧！',
      douyin: '您还在为皮肤问题烦恼吗？\n\n我们的专业美容师会帮助您！\n\n深层护肤 × 皮肤管理 × 专业建议\n\n让您的皮肤焕然一新！\n\n现在预约享受优惠折扣',
      wechat: '尊敬的客户朋友们，\n\n感谢您一直以来的信任与支持！\n\n本周特惠：美容套餐优惠力度高达百分之十\n\n更多惊喜等待您！\n\n欢迎咨询和预约我们的服务',
      weibo: '[每周美容贴士]\n\n秋季护肤应该这样做\n\n一、深层清洁很重要\n二、补水保湿必不可少\n三、专业护理很必要\n\n来体验我们的专业护理服务吧！#美容 #护肤'
    };
    setGeneratedCopy(samples[platform] || '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择平台</label>
        <select
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {platforms.map(platformItem => (
            <option key={platformItem.id} value={platformItem.id}>{platformItem.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">文案主题</label>
        <textarea
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
          placeholder="输入您要推广的产品或服务..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />
      </div>

      {generatedCopy && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">生成的文案内容：</p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{generatedCopy}</p>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleGenerate}
          className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          生成文案
        </button>
        {generatedCopy && (
          <button className="flex-1 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" />
            复制文案
          </button>
        )}
      </div>

      {/* 使用提示 */}
      <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-xs text-green-900">
        <p className="font-medium mb-1">💡 使用提示：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>选择对应的社交平台以获得最佳效果</li>
          <li>输入您要推广的产品或服务主题</li>
          <li>点击生成文案获取专业的营销文案</li>
          <li>复制文案后可直接在平台上使用</li>
        </ul>
      </div>
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
  const [campaignType, setCampaignType] = useState('acquire');
  const [budget, setBudget] = useState('5000');

  const campaignTypes = [
    { id: 'acquire', name: '客户获取', icon: 'A', description: '吸引新客户的方法' },
    { id: 'retain', name: '客户锁定', icon: 'L', description: '提高客户忠诚度的方法' },
    { id: 'loyalty', name: '留存计划', icon: 'R', description: '客户留存和重复购买策略' },
    { id: 'seasonal', name: '假期规划', icon: 'H', description: '假期特色活动计划' }
  ];

  const getCampaignPlan = () => {
    const plans: { [key: string]: string } = {
      acquire: '客户获取计划\n\n1. 社交媒体营销\n   - 发布专业内容\n   - 与粉丝互动\n   - KOL合作\n\n2. 优惠活动\n   - 首次体验优惠\n   - 转介绍奖励\n   - 限时优惠\n\n3. 业务拓展\n   - 与健身房合作\n   - 与写字楼合作\n   - 社区推广',
      retain: '客户锁定计划\n\n1. 会员系统\n   - VIP等级制度\n   - 积分奖励\n   - 专属权益\n\n2. 个性化服务\n   - 定制方案\n   - 专业咨询\n   - 定期跟进\n\n3. 情感营销\n   - 生日礼物\n   - 节假日问候\n   - 感谢奖励',
      loyalty: '留存计划\n\n1. 客户关怀\n   - 定期沟通\n   - 满意度调查\n   - 快速问题解决\n\n2. 重复购买激励\n   - 套餐折扣\n   - 季卡推荐\n   - 转介绍奖励\n\n3. 社区建设\n   - 客户活动\n   - 分享交流\n   - 品牌粉丝',
      seasonal: '假期规划\n\n1. 节假日主题活动\n   - 情人节特价\n   - 三八妇女节福利\n   - 圣诞新年活动\n\n2. 限时推广\n   - 节假日优惠券\n   - 套餐搭配\n   - 增值服务\n\n3. 营销宣传\n   - 提前宣传\n   - 社媒造势\n   - 口碑传播'
    };
    return plans[campaignType] || '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择活动类型</label>
        <div className="grid grid-cols-2 gap-2">
          {campaignTypes.map(campaignTypeItem => (
            <button
              key={campaignTypeItem.id}
              onClick={() => setCampaignType(campaignTypeItem.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                campaignType === campaignTypeItem.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{campaignTypeItem.icon}</span>
                <span className="font-semibold text-sm">{campaignTypeItem.name}</span>
              </div>
              <p className="text-xs text-gray-600">{campaignTypeItem.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">预算（元）</label>
        <input
          type="text"
          value={budget}
          onChange={(event) => setBudget(event.target.value)}
          placeholder="请输入预算金额（例如：五千）"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-900 mb-2">策划方案内容：</p>
        <div className="bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-700 whitespace-pre-wrap">
          {getCampaignPlan()}
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600">
          保存策划
        </button>
        <button className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          重新生成
        </button>
      </div>

      {/* 使用提示 */}
      <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 text-xs text-yellow-900">
        <p className="font-medium mb-1">💡 使用提示：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>选择适合您的活动类型和策略方向</li>
          <li>输入您的营销预算以获取针对性方案</li>
          <li>系统会根据选择生成专业策划方案</li>
          <li>保存方案以便后续参考和优化</li>
        </ul>
      </div>
    </div>
  );
};