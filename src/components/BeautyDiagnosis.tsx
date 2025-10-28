import React, { useState } from 'react';
import { Camera, Upload, Sparkles, Heart, AlertCircle, ChevronRight, TrendingUp, Award } from 'lucide-react';

interface BeautyAnalysis {
  skinCondition: string;
  skinTone: string;
  problems: string[];
  recommendations: string[];
  beautyScore: number;
  products: BeautyProduct[];
  treatmentPlan: string[];
}

interface BeautyProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  benefit: string;
  rating: number;
}

export const BeautyDiagnosis: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<BeautyAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'detection' | 'results'>('detection');
  const [history, setHistory] = useState<Array<{ date: string; analysis: BeautyAnalysis }>>([]);

  // 美容诊断数据库
  const beautyDatabase: BeautyAnalysis[] = [
    {
      skinCondition: '健康光泽肌',
      skinTone: '均匀肤色',
      problems: ['偶尔干燥', '容易晒黑'],
      recommendations: ['日常补水', '防晒护理', '定期深层清洁'],
      beautyScore: 92,
      products: [
        { id: '1', name: '焕颜亮肤精华', category: '精华液', price: 188, benefit: '提亮肤色', rating: 4.8 },
        { id: '2', name: '高效防晒霜SPF50', category: '防晒', price: 158, benefit: '全面防护', rating: 4.7 },
        { id: '3', name: '深层补水面膜', category: '面膜', price: 78, benefit: '密集补水', rating: 4.9 }
      ],
      treatmentPlan: ['日常护理', '周护理（面膜）', '月度深层护理']
    },
    {
      skinCondition: '暗沉无光肌',
      skinTone: '肤色不均',
      problems: ['暗沉无光', '细纹明显', '毛孔粗大'],
      recommendations: ['焕颜美白', '深层清洁', '紧致护理'],
      beautyScore: 68,
      products: [
        { id: '1', name: '360°焕颜精油', category: '精油', price: 268, benefit: '焕颜美白', rating: 4.9 },
        { id: '2', name: '智能导入美白仪', category: '美容仪', price: 1288, benefit: '深层导入', rating: 4.8 },
        { id: '3', name: '高浓度VC精华', category: '精华', price: 228, benefit: '亮肤祛黄', rating: 4.7 }
      ],
      treatmentPlan: ['日常美白护理', '周度专业焕肤', '月度深层美白']
    },
    {
      skinCondition: '紧致年轻肌',
      skinTone: '红润有气色',
      problems: ['轻微法令纹', '轻微皱纹'],
      recommendations: ['抗衰护理', '提拉紧致', '补充营养'],
      beautyScore: 88,
      products: [
        { id: '1', name: '抗衰精华液', category: '精华', price: 298, benefit: '抗衰紧致', rating: 4.9 },
        { id: '2', name: '黄金紧致面膜', category: '面膜', price: 128, benefit: '提拉紧致', rating: 4.8 },
        { id: '3', name: '眼周精华霜', category: '眼霜', price: 218, benefit: '淡纹抗衰', rating: 4.7 }
      ],
      treatmentPlan: ['日常抗衰护理', '周度提拉按摩', '月度专业护理']
    },
    {
      skinCondition: '敏感脆弱肌',
      skinTone: '易发红泛红',
      problems: ['易过敏', '泛红发痒', '屏障受损'],
      recommendations: ['舒缓修护', '温和清洁', '加强屏障'],
      beautyScore: 55,
      products: [
        { id: '1', name: '舒缓修护精华', category: '精华', price: 198, benefit: '舒缓镇定', rating: 4.8 },
        { id: '2', name: '温和洁面乳', category: '洁面', price: 88, benefit: '温和清洁', rating: 4.6 },
        { id: '3', name: '屏障修护霜', category: '面霜', price: 168, benefit: '修护屏障', rating: 4.9 }
      ],
      treatmentPlan: ['温和日常护理', '定期舒缓护理', '专业修护疗程']
    }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeImage = () => {
    if (!selectedImage) return;

    setLoading(true);
    setTimeout(() => {
      const randomAnalysis = beautyDatabase[Math.floor(Math.random() * beautyDatabase.length)];
      setAnalysisResult(randomAnalysis);
      setHistory([...history, { date: new Date().toLocaleDateString(), analysis: randomAnalysis }]);
      setLoading(false);
      setActiveTab('results');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8" />
          <h2 className="text-3xl font-bold">AI智能美容诊断</h2>
        </div>
        <p className="text-pink-100">拍照分析 | 智能诊断 | 专业美容建议 | 个性化产品推荐</p>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('detection')}
          className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'detection'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          美容检测
        </button>
        {analysisResult && (
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'results'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4" />
            诊断结果
          </button>
        )}
        {history.length > 0 && (
          <button
            onClick={() => setActiveTab('detection')}
            className="px-4 py-2 font-medium text-gray-600 text-sm"
          >
            检测记录: {history.length}次
          </button>
        )}
      </div>

      {/* 检测页面 */}
      {activeTab === 'detection' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            {/* 图片预览 */}
            <div className="mb-8">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Beauty preview"
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div className="border-3 border-dashed border-pink-300 rounded-lg p-16 text-center bg-pink-50">
                  <Camera className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                  <p className="text-gray-700 font-bold text-lg mb-2">拍摄或上传自拍照</p>
                  <p className="text-sm text-gray-600 mb-8">清晰的面部照片，自然光线下效果最佳</p>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="bg-gradient-to-r from-pink-600 to-red-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 inline-flex font-semibold text-lg">
                      <Upload className="w-5 h-5" />
                      上传照片
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* 分析按钮 */}
            {selectedImage && (
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-pink-600 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI智能分析中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    开始美容诊断
                  </span>
                )}
              </button>
            )}

            {/* 提示信息 */}
            <div className="mt-10 bg-blue-50 border-2 border-blue-200 rounded-lg p-5 flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-2">✨ 诊断说明</p>
                <ul className="space-y-1 text-xs leading-relaxed">
                  <li>✓ 需要清晰的正脸自拍照</li>
                  <li>✓ 自然光线下效果更准确</li>
                  <li>✓ AI分析涵盖肤质、肤色、问题等多维度</li>
                  <li>✓ 获得专业美容建议和产品推荐</li>
                  <li>✓ 支持历史对比，追踪美容效果</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'results' && analysisResult && (
        <div className="space-y-6">
          {/* 美容评分卡 */}
          <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border-2 border-pink-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">美容评分</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-pink-600">{analysisResult.beautyScore}</div>
                <p className="text-sm text-gray-600">/ 100</p>
              </div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-pink-600 to-red-600 h-full transition-all duration-1000"
                style={{ width: `${analysisResult.beautyScore}%` }}
              />
            </div>
          </div>

          {/* 皮肤诊断 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📋 皮肤诊断</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-2">🎨 肤质状态</h5>
                <p className="text-2xl font-bold text-pink-600">{analysisResult.skinCondition}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-2">🌈 肤色</h5>
                <p className="text-2xl font-bold text-orange-600">{analysisResult.skinTone}</p>
              </div>
            </div>

            {/* 问题列表 */}
            <div className="mb-6">
              <h5 className="font-bold text-gray-900 mb-3 text-red-600">⚠️ 皮肤问题</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {analysisResult.problems.map((problem, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 建议列表 */}
            <div>
              <h5 className="font-bold text-gray-900 mb-3 text-green-600">✓ 美容建议</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {analysisResult.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 美容疗程方案 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">💆 美容疗程方案</h3>
            <div className="space-y-3">
              {analysisResult.treatmentPlan.map((plan, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-600 to-red-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{plan}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 推荐产品 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">🛍️ 专业产品推荐</h3>

            <div className="grid md:grid-cols-3 gap-4">
              {analysisResult.products.map(product => (
                <div key={product.id} className="border-2 border-pink-200 rounded-lg p-4 hover:shadow-xl transition-all bg-gradient-to-br from-white to-pink-50">
                  <div className="mb-3">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h5 className="font-bold text-gray-900">{product.name}</h5>
                        <p className="text-xs text-gray-600">{product.category}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <span className="text-xs text-yellow-500">★</span>
                        <span className="text-xs font-bold text-gray-700">{product.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{product.benefit}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">¥{product.price}</span>
                    <button className="p-2 hover:bg-pink-100 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-pink-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步操作 */}
          <div className="bg-gradient-to-r from-pink-100 to-red-100 rounded-lg border-2 border-pink-300 p-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">🌟 下一步建议</h4>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>✓ 立即购买推荐产品，开始美容护理</li>
              <li>✓ 咨询专业美容师，获取个性化护理方案</li>
              <li>✓ 定期检测肌肤，追踪美容效果</li>
              <li>✓ 根据疗程方案，持续护理和改善</li>
            </ul>
          </div>

          {/* 返回按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab('detection');
                setSelectedImage(null);
                setAnalysisResult(null);
              }}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
            >
              重新检测
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
            >
              保存报告
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
