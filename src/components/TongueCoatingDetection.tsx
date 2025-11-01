import React, { useState } from 'react';
import { Camera, Upload, Heart, AlertCircle, ChevronRight, TrendingUp, Award, Zap, Eye } from 'lucide-react';
import { tongueCoatingAnalysisService } from '../services/tongueCoatingAnalysisService';
import type { TongueAnalysis as TongueAnalysisType } from '../services/tongueCoatingAnalysisService';

export const TongueCoatingDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<TongueAnalysisType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'detection' | 'results'>('detection');
  const [showFeatures, setShowFeatures] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setLoading(true);
    try {
      const analysis = await tongueCoatingAnalysisService.analyzeTongueCoating(selectedImage);
      setResult(analysis);
      setActiveTab('results');
    } catch (error) {
      console.error('分析失败:', error);
      alert('分析失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-8 h-8" />
          <h2 className="text-3xl font-bold">中医舌苔检测</h2>
        </div>
        <p className="text-amber-100">精准AI分析 • 智能诊断 • 中医调理 • 个性化方案</p>
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
                  <div className="text-6xl mb-4">📷</div>
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
                    AI精准分析中... (提取视觉特征)
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    开始中医诊断 (精准识别)
                  </span>
                )}
              </button>
            )}

            {/* 提示信息 */}
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-5 flex gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-bold mb-2">精准诊断说明</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ 需要清晰的舌头照片 (光线充足)</li>
                  <li>✓ 自然光线下效果更好</li>
                  <li>✓ 结果基于视觉特征分析</li>
                  <li>✓ 同一张照片始终产生相同结果</li>
                  <li>✓ 建议咨询专业医生</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'results' && result && (
        <div className="space-y-6">
          {/* 分析置信度 */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-purple-600" />
              <div>
                <p className="font-bold text-gray-900">分析置信度</p>
                <p className="text-xs text-gray-600">基于视觉特征匹配</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-purple-600">{result.confidence}%</p>
            </div>
          </div>

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

          {/* 视觉特征分析 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <button
              onClick={() => setShowFeatures(!showFeatures)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5 text-indigo-600" />
                <span className="font-bold text-gray-900">视觉特征分析 (高级)</span>
              </div>
              <ChevronRight className={`w-5 h-5 text-indigo-600 transition-transform ${showFeatures ? 'rotate-90' : ''}`} />
            </button>

            {showFeatures && (
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">亮度</p>
                    <p className="text-xl font-bold text-gray-900">{result.visualFeatures.brightness}</p>
                    <p className="text-xs text-gray-600 mt-1">(0-255, 越高越亮)</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">饱和度</p>
                    <p className="text-xl font-bold text-gray-900">{result.visualFeatures.saturation}%</p>
                    <p className="text-xs text-gray-600 mt-1">(颜色深浅)</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">舌苔覆盖</p>
                    <p className="text-xl font-bold text-gray-900">{result.visualFeatures.coatingCoverage}%</p>
                    <p className="text-xs text-gray-600 mt-1">(苔层厚度)</p>
                  </div>
                  <div className="p-3 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-600">纹理复杂度</p>
                    <p className="text-xl font-bold text-gray-900">{result.visualFeatures.textureComplexity}</p>
                    <p className="text-xs text-gray-600 mt-1">(表面凹凸)</p>
                  </div>
                </div>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">色调范围</p>
                  <p className="text-lg font-bold text-gray-900">
                    {result.visualFeatures.hueRange.min}° - {result.visualFeatures.hueRange.max}°
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    (红色0°/360° 黄色60° 绿色120° 青色180° 蓝色240° 紫色300°)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 下一步建议 */}
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg border-2 border-green-300 p-6">
            <h4 className="font-bold text-gray-900 mb-3 text-lg">后续调理建议</h4>
            <ul className="space-y-2 text-sm text-gray-800">
              <li>按照调理方案循序渐进</li>
              <li>定期复查舌苔变化，同一时间点拍照便于对比</li>
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
              setShowFeatures(false);
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
