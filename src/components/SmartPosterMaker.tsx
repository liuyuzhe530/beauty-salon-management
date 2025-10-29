/**
 * 智能海报制作系统
 * 集成 RunningHub API + AI 智能模板推荐 + 商用图片搜索
 * 用户只需选择模板，系统自动生成海报
 */

import React, { useState } from 'react';
import { Wand2, Zap, BarChart3, Sparkles, Download, Share2, Copy, Loader, Image as ImageIcon, Search } from 'lucide-react';
import posterGenerationAPIService from '../services/posterGenerationAPIService';
import commercialImageSearchService, { StockImage, ImageSearchResponse } from '../services/commercialImageSearchService';

// ============= 类型定义 =============

interface PosterTemplate {
  id: string;
  name: string;
  category: 'promotion' | 'product' | 'skincare' | 'event' | 'seasonal';
  description: string;
  icon: string;
  contentTemplate: string;  // 模板内容
  style: 'modern' | 'elegant' | 'playful' | 'minimalist';
  colors: {
    primary: string;
    secondary: string;
  };
  tags: string[];
}

interface GeneratedPoster {
  id: string;
  title: string;
  content: string;
  template: PosterTemplate;
  status: 'pending' | 'generating' | 'success' | 'error';
  taskId?: string;
  posterUrl?: string;
  backgroundImage?: StockImage;
  error?: string;
  generatedAt?: Date;
}

// ============= 预设模板库 =============

const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'promo-seasonal',
    name: '季节促销',
    category: 'promotion',
    description: '适合春夏秋冬季节性推广',
    icon: '',
    contentTemplate: '{season}优惠\n全场{discount}折\n{callToAction}',
    style: 'modern',
    colors: { primary: '#FF6B6B', secondary: '#FFE66D' },
    tags: ['促销', '季节', '优惠']
  },
  {
    id: 'new-product',
    name: '新品上市',
    category: 'product',
    description: '展示新护肤产品上市',
    icon: '',
    contentTemplate: '新品上市\n{productName}\n{description}\n尊享首购价',
    style: 'elegant',
    colors: { primary: '#E8D5F2', secondary: '#9B59B6' },
    tags: ['新品', '产品', '上市']
  },
  {
    id: 'skincare-routine',
    name: '护肤方案',
    category: 'skincare',
    description: '推荐定制化护肤方案',
    icon: '',
    contentTemplate: '护肤方案\n{skinType}肌专属\n专业美容师打造\n立即预约',
    style: 'elegant',
    colors: { primary: '#FFF0F5', secondary: '#FF69B4' },
    tags: ['护肤', '美容', '定制']
  },
  {
    id: 'member-card',
    name: '会员卡权益',
    category: 'event',
    description: '推广会员卡和权益',
    icon: '',
    contentTemplate: '会员升级\n享受专属权益\n{benefit1}\n{benefit2}\n立即开卡',
    style: 'modern',
    colors: { primary: '#FFE5B4', secondary: '#FF8C00' },
    tags: ['会员', '卡', '权益']
  },
  {
    id: 'event-invitation',
    name: '活动邀请',
    category: 'event',
    description: '邀请客户参加活动',
    icon: '',
    contentTemplate: '诚邀参加\n{eventName}\n{date} {time}\n位置：{location}',
    style: 'playful',
    colors: { primary: '#6C63FF', secondary: '#FF006E' },
    tags: ['活动', '邀请', '时间']
  },
  {
    id: 'course-promotion',
    name: '课程推广',
    category: 'event',
    description: '推广美容课程培训',
    icon: '',
    contentTemplate: '美容课程开班\n{courseType}\n名额有限 欢迎报名\n专业讲师授课',
    style: 'modern',
    colors: { primary: '#00A86B', secondary: '#87CEEB' },
    tags: ['课程', '培训', '学习']
  },
  {
    id: 'flash-sale',
    name: '限时秒杀',
    category: 'promotion',
    description: '限时秒杀活动',
    icon: '',
    contentTemplate: '限时秒杀\n{product}\n仅售{price}\n仅限{duration}',
    style: 'playful',
    colors: { primary: '#FF4500', secondary: '#FFD700' },
    tags: ['秒杀', '限时', '抢购']
  },
  {
    id: 'referral-bonus',
    name: '推荐返利',
    category: 'promotion',
    description: '客户推荐返利活动',
    icon: '',
    contentTemplate: '邀请好友\n双倍好礼\n推荐返利{percent}%\n开始分享',
    style: 'playful',
    colors: { primary: '#FF1493', secondary: '#FFB6C1' },
    tags: ['推荐', '返利', '分享']
  }
];

// ============= 智能 Agent - 自动填充内容 =============

const SMART_CONTENT_SUGGESTIONS: { [key: string]: { [key: string]: string[] } } = {
  'promo-seasonal': {
    season: ['春季', '夏季', '秋季', '冬季'],
    discount: ['五折', '六折', '七折', '八折'],
    callToAction: ['限时优惠', '快来参加', '抓紧时间', '错过遗憾']
  },
  'new-product': {
    productName: ['护肤精油', '面膜套装', '眼霜', '精华液'],
    description: ['温和有效', '专业配方', '明星产品', '销量冠军']
  },
  'skincare-routine': {
    skinType: ['干性', '油性', '混合', '敏感']
  },
  'member-card': {
    benefit1: ['消费满额返利', '生日月享优惠', '专属客服'],
    benefit2: ['优先预约', '免费咨询', '会员专享']
  },
  'flash-sale': {
    product: ['热销面膜', '明星精油', '套装产品'],
    price: ['99元', '149元', '199元'],
    duration: ['2小时', '3小时', '今天']
  }
};

// ============= 主组件 =============

export const SmartPosterMaker: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<PosterTemplate | null>(null);
  const [customContent, setCustomContent] = useState<{ [key: string]: string }>({});
  const [generatedPosters, setGeneratedPosters] = useState<GeneratedPoster[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // 图片搜索相关状态
  const [showImageSearch, setShowImageSearch] = useState(false);
  const [searchImages, setSearchImages] = useState<StockImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<StockImage | null>(null);
  const [isSearchingImages, setIsSearchingImages] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // ============= 智能内容推荐 =============

  const getSmartSuggestions = (templateId: string) => {
    const suggestions: { [key: string]: string } = {};
    const templateSuggestions = SMART_CONTENT_SUGGESTIONS[templateId];

    if (templateSuggestions) {
      Object.keys(templateSuggestions).forEach(key => {
        const options = templateSuggestions[key];
        suggestions[key] = options[Math.floor(Math.random() * options.length)];
      });
    }

    return suggestions;
  };

  // ============= 填充模板内容 =============

  const fillTemplateContent = (template: PosterTemplate, suggestions: { [key: string]: string }): string => {
    let content = template.contentTemplate;

    Object.keys(suggestions).forEach(key => {
      content = content.replace(`{${key}}`, suggestions[key]);
    });

    return content;
  };

  // ============= 图片搜索 =============

  const handleSearchImages = async (template: PosterTemplate) => {
    setIsSearchingImages(true);
    setSearchError(null);
    
    try {
      // 根据模板类别搜索相关图片
      const themeMappings: { [key: string]: string } = {
        'promotion': 'seasonal-promotion',
        'product': 'new-product',
        'skincare': 'skincare-routine',
        'event': 'event-invitation',
        'seasonal': 'seasonal-promotion'
      };
      
      const theme = themeMappings[template.category] || 'seasonal-promotion';
      const response = await commercialImageSearchService.searchByTheme({
        theme,
        category: template.category,
        style: template.style,
        perPage: 12
      });
      
      if (response.success) {
        setSearchImages(response.images);
        setShowImageSearch(true);
      } else {
        setSearchError(response.error || '搜索失败，请重试');
      }
    } catch (error) {
      console.error('搜索图片失败:', error);
      setSearchError('搜索失败，请检查网络连接');
    } finally {
      setIsSearchingImages(false);
    }
  };

  const handleSelectImage = (image: StockImage) => {
    setSelectedImage(image);
  };

  // ============= 生成海报 =============

  const handleGeneratePoster = async (template: PosterTemplate) => {
    setIsGenerating(true);
    const smartSuggestions = getSmartSuggestions(template.id);
    const finalContent = fillTemplateContent(template, smartSuggestions);

    const poster: GeneratedPoster = {
      id: `poster-${Date.now()}`,
      title: template.name,
      content: finalContent,
      template: template,
      status: 'generating',
      generatedAt: new Date()
    };

    setGeneratedPosters(prev => [poster, ...prev]);

    try {
      // 调用 RunningHub API
      const response = await posterGenerationAPIService.generatePoster({
        content: finalContent,
        style: template.style,
        type: template.category,
        format: 'vertical'
      });

      if (response.success) {
        setGeneratedPosters(prev =>
          prev.map(p =>
            p.id === poster.id
              ? {
                ...p,
                status: 'success',
                taskId: response.data?.taskId,
                posterUrl: response.data?.posterUrl
              }
              : p
          )
        );
      } else {
        setGeneratedPosters(prev =>
          prev.map(p =>
            p.id === poster.id
              ? {
                ...p,
                status: 'error',
                error: response.error?.message || '生成失败'
              }
              : p
          )
        );
      }
    } catch (error: any) {
      setGeneratedPosters(prev =>
        prev.map(p =>
          p.id === poster.id
            ? {
              ...p,
              status: 'error',
              error: error.message
            }
            : p
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // ============= 过滤模板 =============

  const filteredTemplates = selectedCategory === 'all'
    ? POSTER_TEMPLATES
    : POSTER_TEMPLATES.filter(t => t.category === selectedCategory);

  // ============= 渲染 =============

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-purple-600" />
            智能海报制作
          </h2>
          <p className="text-gray-600 mt-1">选择模板，一键生成专业海报</p>
        </div>
      </div>

      {/* 标签页 */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'templates'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          模板库
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'history'
              ? 'border-b-2 border-purple-600 text-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          生成历史 ({generatedPosters.length})
        </button>
      </div>

      {/* 模板标签页 */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          {/* 分类过滤 */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部
            </button>
            {['promotion', 'product', 'skincare', 'event', 'seasonal'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat === 'promotion' && '促销'}
                {cat === 'product' && '产品'}
                {cat === 'skincare' && '护肤'}
                {cat === 'event' && '活动'}
                {cat === 'seasonal' && '季节'}
              </button>
            ))}
          </div>

          {/* 模板网格 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map(template => (
              <div
                key={template.id}
                className="bg-white rounded-lg border-2 border-gray-200 hover:border-purple-600 transition-all cursor-pointer overflow-hidden group"
                onClick={() => handleGeneratePoster(template)}
              >
                {/* 预览卡片 */}
                <div
                  className="h-40 bg-gradient-to-br flex items-center justify-center text-5xl group-hover:scale-110 transition-transform"
                  style={{
                    backgroundImage: `linear-gradient(135deg, ${template.colors.primary} 0%, ${template.colors.secondary} 100%)`
                  }}
                >
                  {template.icon}
                </div>

                {/* 信息 */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900">{template.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>

                  {/* 标签 */}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {template.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* 按钮 */}
                  <div className="flex gap-2 mt-4">
                    <button
                      className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      disabled={isSearchingImages}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSearchImages(template);
                      }}
                    >
                      {isSearchingImages ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          搜索中...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          搜索图片
                        </>
                      )}
                    </button>
                    <button
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg disabled:opacity-50"
                      disabled={isGenerating}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeneratePoster(template);
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          一键生成
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 历史标签页 */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {generatedPosters.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>还没有生成过海报，选择模板一键生成吧！</p>
            </div>
          ) : (
            generatedPosters.map(poster => (
              <div
                key={poster.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">{poster.title}</h3>
                      {poster.status === 'success' && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                           已生成
                        </span>
                      )}
                      {poster.status === 'generating' && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded flex items-center gap-1">
                          <Loader className="w-3 h-3 animate-spin" />
                          生成中
                        </span>
                      )}
                      {poster.status === 'error' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                           失败
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2 whitespace-pre-wrap max-h-24 overflow-hidden">
                      {poster.content}
                    </p>
                    {poster.error && (
                      <p className="text-sm text-red-600 mt-2">{poster.error}</p>
                    )}
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex gap-2 ml-4">
                    {poster.posterUrl && (
                      <>
                        <a
                          href={poster.posterUrl}
                          download
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="下载"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => {
                            if (poster.posterUrl) {
                              navigator.clipboard.writeText(poster.posterUrl);
                              alert('已复制链接！');
                            }
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="复制链接"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 图片搜索结果模态 */}
      {showImageSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* 标题 */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-blue-600" />
                  选择背景图片
                </h3>
                <p className="text-sm text-gray-600 mt-1">为您的海报选择一张商用图片</p>
              </div>
              <button
                onClick={() => setShowImageSearch(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                x
              </button>
            </div>

            {/* 错误提示 */}
            {searchError && (
              <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {searchError}
              </div>
            )}

            {/* 图片网格 */}
            <div className="p-6">
              {searchImages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>未找到相关图片</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {searchImages.map(image => (
                    <div
                      key={image.id}
                      onClick={() => handleSelectImage(image)}
                      className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage?.id === image.id
                          ? 'border-purple-600 shadow-lg'
                          : 'border-gray-200 hover:border-purple-400'
                      }`}
                    >
                      <div className="relative pb-[100%]">
                        <img
                          src={image.thumbnailUrl}
                          alt={image.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        {selectedImage?.id === image.id && (
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                            <div className="text-white text-2xl">已选择</div>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-gray-50">
                        <p className="text-xs font-medium text-gray-900 truncate">{image.source}</p>
                        <p className="text-xs text-gray-600">{image.width}x{image.height}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 页脚 */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 flex gap-3 justify-end">
              <button
                onClick={() => setShowImageSearch(false)}
                className="px-4 py-2 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (selectedImage) {
                    setShowImageSearch(false);
                    // 可以在这里保存选中的图片
                  }
                }}
                disabled={!selectedImage}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                确认选择
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartPosterMaker;
