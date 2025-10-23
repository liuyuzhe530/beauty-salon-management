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

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">海报类型</label>
        <select
          value={posterType}
          onChange={(e) => setPosterType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {posterTemplates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">设计风格</label>
        <select
          value={style}
          onChange={(e) => setStyle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {styles.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">海报主题</label>
        <textarea
          placeholder="输入您的海报主题或描述..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />
      </div>

      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-green-600" />
          <p className="font-medium text-sm text-green-900">AI预览</p>
        </div>
        <div className="bg-white p-6 rounded border border-gray-200 text-center text-gray-500 h-48 flex items-center justify-center">
          海报预览将在此显示...
        </div>
      </div>

      <div className="flex gap-2">
        <button className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
          <Download className="w-4 h-4" />
          下载海报
        </button>
        <button className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          重新生成
        </button>
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
      xiaohongshu: '[Beauty Notes] This beauty package is amazing!\n\nSkincare, manicure, massage all included, solve all beauty needs in one go. Professional beautician team, carefully create your unique charm.\n\nLimited time offer - come experience it now!',
      douyin: 'Are you still troubled by skin problems?\n\nOur professional beauticians will help you!\n\nDeep skincare x Skin management x Professional advice\n\nLet your skin be renewed!\n\nBook now and enjoy discounts',
      wechat: 'Dear valued customers,\n\nThank you for your continued trust and support!\n\nThis week special: Beauty package 10% off\n\nMore surprises await you!\n\nWelcome to consult and book appointments',
      weibo: '[Weekly Beauty Tips]\n\nHow to do autumn skincare\n\n1. Deep cleansing is important\n2. Moisturizing is essential\n3. Professional care is necessary\n\nCome experience our professional care! #Beauty #Skincare'
    };
    setGeneratedCopy(samples[platform] || '');
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择平台</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {platforms.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">文案主题</label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="输入您要推广的产品或服务..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          rows={3}
        />
      </div>

      {generatedCopy && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">生成的文案：</p>
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
            复制
          </button>
        )}
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
          onChange={(e) => setAvatarName(e.target.value)}
          placeholder="给您的数字分身取个名字..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分身风格</label>
        <div className="grid grid-cols-2 gap-2">
          {styles.map(s => (
            <button
              key={s.id}
              onClick={() => setAvatarStyle(s.id)}
              className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                avatarStyle === s.id
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">分身特点</label>
        <div className="grid grid-cols-2 gap-2">
          {traits.map(t => (
            <button
              key={t.id}
              onClick={() => setAvatarTrait(t.id)}
              className={`py-2 px-3 rounded-lg border-2 transition-all text-sm ${
                avatarTrait === t.id
                  ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                  : 'border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <p className="text-sm text-purple-900">Your digital avatar has been generated!</p>
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
          {campaignTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setCampaignType(type.id)}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                campaignType === type.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{type.icon}</span>
                <span className="font-semibold text-sm">{type.name}</span>
              </div>
              <p className="text-xs text-gray-600">{type.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">预算</label>
        <input
          type="text"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="请输入预算 (例如: 5000)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm font-medium text-blue-900 mb-2">策划方案：</p>
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
    </div>
  );
};