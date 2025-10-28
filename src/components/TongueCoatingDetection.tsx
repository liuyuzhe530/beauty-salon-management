import React, { useState } from 'react';
import { Camera, Upload, Heart, AlertCircle, ChevronRight, TrendingUp, Award } from 'lucide-react';

interface TongueAnalysis {
  tongueColor: string;
  coatingType: string;
  healthScore: number;
  diagnosis: string;
  problems: string[];
  recommendations: string[];
  remedies: Remedy[];
  adjustmentPlan: string[];
}

interface Remedy {
  id: string;
  name: string;
  category: string;
  description: string;
  dosage: string;
}

export const TongueCoatingDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<TongueAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'detection' | 'results'>('detection');

  // 中医舌苔诊断数据库
  const analysisDatabase: TongueAnalysis[] = [
    {
      tongueColor: '淡红色',
      coatingType: '薄白苔',
      healthScore: 85,
      diagnosis: '脾胃健康',
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
      tongueColor: '暗红色',
      coatingType: '厚腻苔',
      healthScore: 55,
      diagnosis: '湿热体质',
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
      tongueColor: '淡白色',
      coatingType: '薄腻苔',
      healthScore: 45,
      diagnosis: '气虚体质',
      problems: ['气虚乏力', '消化功能弱', '易感冒'],
      recommendations: ['健脾益气', '增强体质', '适度进补'],
      remedies: [
        { id: '1', name: '四君子汤', category: '中成药', description: '健脾益气', dosage: '日一剂' },
        { id: '2', name: '黄芪红枣粥', category: '食疗', description: '益气补血', dosage: '周3-4次' },
        { id: '3', name: '参芪粥', category: '食疗', description: '补气健脾', dosage: '周2次' }
      ],
      adjustmentPlan: ['第1-4周：温和调理', '第5-8周：逐步增强', '第9-12周：巩固体质']
    },
    {
      tongueColor: '红色',
      coatingType: '少苔',
      healthScore: 35,
      diagnosis: '阴虚体质',
      problems: ['阴液不足', '容易上火', '口干便干'],
      recommendations: ['滋阴润燥', '清心安神', '调整作息'],
      remedies: [
        { id: '1', name: '麦冬石斛茶', category: '食疗', description: '滋阴润肺', dosage: '日一杯' },
        { id: '2', name: '银耳莲子粥', category: '食疗', description: '滋阴润肺', dosage: '周2-3次' },
        { id: '3', name: '百合粥', category: '食疗', description: '滋阴安神', dosage: '周2次' }
      ],
      adjustmentPlan: ['第1-4周：滋阴调理', '第5-8周：安神助眠', '第9-12周：体质改善']
    },
    {
      tongueColor: '黄腻色',
      coatingType: '厚腻黄苔',
      healthScore: 30,
      diagnosis: '湿热蕴结',
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
      const randomAnalysis = analysisDatabase[Math.floor(Math.random() * analysisDatabase.length)];
      setResult(randomAnalysis);
      setLoading(false);
      setActiveTab('results');
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8" />
          <h2 className="text-3xl font-bold">中医舌苔检测</h2>
        </div>
        <p className="text-amber-100">拍照分析 • 智能诊断 • 中医调理 • 个性化方案</p>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('detection')}
          className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'detection'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          舌苔检测
        </button>
        {result && (
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'results'
                ? 'border-amber-600 text-amber-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4" />
            诊断结果
          </button>
        )}
      </div>

      {/* 检测页面 */}
      {activeTab === 'detection' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            {/* 图片上传 */}
            <div className="mb-8">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Tongue preview"
                    className="w-full h-80 object-cover rounded-lg shadow-lg border-4 border-amber-300"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div className="border-4 border-dashed border-amber-300 rounded-lg p-16 text-center bg-amber-50">
                  <div className="text-6xl mb-4">Camera</div>
                  <p className="text-gray-700 font-bold text-xl mb-2">拍摄舌苔照片</p>
                  <p className="text-sm text-gray-600 mb-8">请确保光线充足，清晰显示舌头全貌</p>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 inline-flex font-bold text-lg">
                      <Upload className="w-5 h-5" />
                      上传照片
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* 检测按钮 */}
            {selectedImage && (
              <button
                onClick={analyzeImage}
                disabled={loading}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    AI分析中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    开始中医诊断
                  </span>
                )}
              </button>
            )}

            {/* 提示信息 */}
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-5 flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-2">中医诊断说明</p>
                <ul className="space-y-1 text-xs">
                  <li>需要清晰的舌头照片</li>
                  <li>自然光线下效果更好</li>
                  <li>结果基于中医理论分析</li>
                  <li>建议咨询专业医生</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'results' && result && (
        <div className="space-y-6">
          {/* 健康评分卡 */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-gray-900">健康评分</h3>
              <div className="text-center">
                <div className="text-5xl font-bold text-amber-600">{result.healthScore}</div>
                <p className="text-sm text-gray-600">/ 100</p>
              </div>
            </div>
            <div className="w-full bg-gray-300 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-600 to-orange-600 h-full transition-all duration-1000"
                style={{ width: `${result.healthScore}%` }}
              />
            </div>
          </div>

          {/* 舌苔诊断 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">舌苔诊断</h3>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-2">舌质颜色</h5>
                <p className="text-2xl font-bold text-amber-600">{result.tongueColor}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg">
                <h5 className="font-bold text-gray-900 mb-2">苔质类型</h5>
                <p className="text-2xl font-bold text-orange-600">{result.coatingType}</p>
              </div>
            </div>

            {/* 中医诊断 */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h5 className="font-bold text-gray-900 mb-2">中医诊断</h5>
              <p className="text-lg text-blue-900 font-semibold">{result.diagnosis}</p>
            </div>

            {/* 问题列表 */}
            <div className="mb-6">
              <h5 className="font-bold text-gray-900 mb-3 text-red-600">主要问题</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {result.problems.map((problem, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
                    <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{problem}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 调理建议 */}
            <div>
              <h5 className="font-bold text-gray-900 mb-3 text-green-600">调理建议</h5>
              <div className="grid md:grid-cols-2 gap-3">
                {result.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                    <span className="text-sm text-gray-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 调理方案 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">中医调理方案</h3>
            <div className="space-y-3">
              {result.adjustmentPlan.map((plan, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-200">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 flex items-center justify-center text-white font-bold">
                    {idx + 1}
                  </div>
                  <span className="font-medium text-gray-900">{plan}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 推荐药物和食疗 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">推荐中医调理</h3>

            <div className="grid md:grid-cols-3 gap-4">
              {result.remedies.map(remedy => (
                <div key={remedy.id} className="border-2 border-amber-200 rounded-lg p-4 hover:shadow-lg transition-all bg-gradient-to-br from-white to-amber-50">
                  <div className="mb-3">
                    <h5 className="font-bold text-gray-900 mb-1">{remedy.name}</h5>
                    <p className="text-xs text-gray-600">{remedy.category}</p>
                  </div>

                  <p className="text-sm text-gray-700 mb-3">{remedy.description}</p>

                  <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                    <p className="text-xs text-gray-600">用法用量</p>
                    <p className="text-sm font-semibold text-gray-900">{remedy.dosage}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步建议 */}
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg border-2 border-green-300 p-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">后续调理建议</h4>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>按照调理方案循序渐进</li>
              <li>定期复查舌苔变化</li>
              <li>咨询专业中医师制定个性化方案</li>
              <li>配合作息调整和运动锻炼</li>
            </ul>
          </div>

          {/* 操作按钮 */}
          <button
            onClick={() => {
              setActiveTab('detection');
              setSelectedImage(null);
              setResult(null);
            }}
            className="w-full bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors"
          >
            重新检测
          </button>
        </div>
      )}
    </div>
  );
};
