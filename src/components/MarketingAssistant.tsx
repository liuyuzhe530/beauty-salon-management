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
    { id: 'acquire', name: 'Customer Acquisition', icon: 'A', description: 'Methods to attract new customers' },
    { id: 'retain', name: 'Customer Lock-in', icon: 'L', description: 'Methods to improve customer loyalty' },
    { id: 'loyalty', name: 'Retention Plan', icon: 'R', description: 'Customer retention and repeat purchase strategy' },
    { id: 'seasonal', name: 'Holiday Planning', icon: 'H', description: 'Holiday special event plans' }
  ];

  const getCampaignPlan = () => {
    const plans: { [key: string]: string } = {
      acquire: 'Customer Acquisition Plan\n\n1. Social Media Marketing\n   - Publish professional content\n   - Interact with followers\n   - KOL collaboration\n\n2. Discount Activities\n   - First-time experience discount\n   - Referral reward program\n   - Limited-time offer\n\n3. Business Expansion\n   - Cooperation with fitness centers\n   - Cooperation with office buildings\n   - Community promotion',
      retain: 'Customer Lock-in Plan\n\n1. Membership System\n   - VIP level system\n   - Points rewards\n   - Exclusive benefits\n\n2. Personalized Service\n   - Custom plans\n   - Professional consultation\n   - Regular follow-up\n\n3. Emotional Marketing\n   - Birthday gifts\n   - Holiday greetings\n   - Gratitude rewards',
      loyalty: 'Retention Plan\n\n1. Customer Care\n   - Regular communication\n   - Satisfaction survey\n   - Quick problem resolution\n\n2. Repeat Purchase Incentives\n   - Package discounts\n   - Season card recommendations\n   - Referral rewards\n\n3. Community Building\n   - Customer events\n   - Share and exchange\n   - Brand fans',
      seasonal: 'Holiday Planning\n\n1. Chinese New Year Activities\n   - New Year special offers\n   - Group purchase plans\n   - Year greetings gifts\n\n2. Summer Activities\n   - Sunscreen care\n   - Cool theme\n   - Summer packages\n\n3. Double Eleven/Double Twelve\n   - Early warming up\n   - Limited products\n   - Flash sales'
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