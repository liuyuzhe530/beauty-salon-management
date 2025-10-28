import React, { useState } from 'react';
import { Camera, Upload, Zap, Heart, AlertCircle, ChevronRight } from 'lucide-react';

interface SkinType {
  type: string;
  condition: string;
  problems: string[];
  solutions: string[];
  recommendedProducts: Product[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  benefit: string;
}

export const SkincareDetection: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<SkinType | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'detection' | 'results'>('detection');

  // 模拟皮肤类型数据
  const skinTypeDatabase: Record<string, SkinType> = {
    oily: {
      type: '油性肌肤',
      condition: '肌肤油脂分泌旺盛，容易长痘',
      problems: ['容易长痘', '毛孔粗大', '油光满面', '容易脱妆'],
      solutions: ['控油护理', '深层清洁', '定期去角质', '补充水分'],
      recommendedProducts: [
        {
          id: '1',
          name: '深层控油洁面乳',
          price: 89,
          description: '温和深层清洁，有效控油',
          benefit: '深层清洁 • 控油 • 温和'
        },
        {
          id: '2',
          name: '清爽补水爽肤水',
          price: 79,
          description: '快速补水，不油腻',
          benefit: '补水 • 清爽 • 快速吸收'
        },
        {
          id: '3',
          name: '舒缓控油乳液',
          price: 99,
          description: '平衡油脂，舒缓肌肤',
          benefit: '控油 • 舒缓 • 平衡'
        }
      ]
    },
    dry: {
      type: '干性肌肤',
      condition: '肌肤缺水干燥，容易起皮',
      problems: ['容易起皮', '紧绷感强', '细纹多', '敏感脆弱'],
      solutions: ['深层补水', '保湿锁水', '温和护理', '定期面膜'],
      recommendedProducts: [
        {
          id: '1',
          name: '高效补水洁面乳',
          price: 99,
          description: '温和补水，不紧绷',
          benefit: '补水 • 温和 • 舒适'
        },
        {
          id: '2',
          name: '深层滋润爽肤水',
          price: 89,
          description: '快速补水保湿',
          benefit: '保湿 • 滋润 • 深层'
        },
        {
          id: '3',
          name: '精油护肤霜',
          price: 129,
          description: '24小时保湿滋养',
          benefit: '滋养 • 保湿 • 修护'
        }
      ]
    },
    combination: {
      type: '混合肌肤',
      condition: 'T区油，两颊干，需平衡护理',
      problems: ['T区出油', '两颊干燥', '护理难度大', '季节易变'],
      solutions: ['分区护理', '平衡补水', '控油保湿兼顾', '定期深层清洁'],
      recommendedProducts: [
        {
          id: '1',
          name: '平衡型洁面乳',
          price: 85,
          description: '温和洁净，不伤肌肤',
          benefit: '温和 • 平衡 • 清洁'
        },
        {
          id: '2',
          name: '平衡补水爽肤水',
          price: 79,
          description: '快速补水平衡',
          benefit: '平衡 • 补水 • 清爽'
        },
        {
          id: '3',
          name: '轻薄精华液',
          price: 119,
          description: '吸收快，不油腻',
          benefit: '吸收快 • 不油腻 • 保湿'
        }
      ]
    },
    sensitive: {
      type: '敏感肌肤',
      condition: '肌肤敏感易泛红，需温和护理',
      problems: ['容易过敏', '泛红发痒', '容易长痘', '脆弱敏感'],
      solutions: ['舒缓修护', '温和清洁', '避免刺激', '加强屏障'],
      recommendedProducts: [
        {
          id: '1',
          name: '敏感肌洁面乳',
          price: 99,
          description: '超温和配方，不含刺激成分',
          benefit: '温和 • 舒缓 • 无刺激'
        },
        {
          id: '2',
          name: '敏感肌爽肤水',
          price: 89,
          description: '舒缓镇定敏感肌',
          benefit: '舒缓 • 镇定 • 修护'
        },
        {
          id: '3',
          name: '修护面霜',
          price: 139,
          description: '修护屏障，强效护理',
          benefit: '修护 • 强效 • 屏障'
        }
      ]
    }
  };

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
    // 模拟分析过程
    setTimeout(() => {
      // 随机选择一种肤质
      const skinTypes = Object.keys(skinTypeDatabase);
      const randomType = skinTypes[Math.floor(Math.random() * skinTypes.length)];
      setAnalysisResult(skinTypeDatabase[randomType]);
      setLoading(false);
      setActiveTab('results');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Camera className="w-6 h-6" />
          <h2 className="text-2xl font-bold">AI皮肤检测</h2>
        </div>
        <p className="text-indigo-100">拍照上传，智能分析肤质，获得专业护肤推荐</p>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('detection')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'detection'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4 inline mr-2" />
          检测皮肤
        </button>
        {analysisResult && (
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium border-b-2 transition-all ${
              activeTab === 'results'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap className="w-4 h-4 inline mr-2" />
            分析结果
          </button>
        )}
      </div>

      {/* 检测页面 */}
      {activeTab === 'detection' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-2xl mx-auto">
            {/* 图片预览 */}
            <div className="mb-8">
              {selectedImage ? (
                <div className="relative">
                  <img 
                    src={selectedImage} 
                    alt="Skin preview" 
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-4">请上传或拍摄脸部照片</p>
                  <p className="text-sm text-gray-500 mb-6">为获得最佳效果，请确保照片清晰、光线充足</p>
                  
                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer flex items-center gap-2 inline-flex">
                      <Upload className="w-4 h-4" />
                      选择图片
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
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all disabled:opacity-50"
              >
                {loading ? '分析中...' : 'AI智能分析'}
              </button>
            )}

            {/* 提示信息 */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">检测说明</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ 需要清晰的面部照片</li>
                  <li>✓ 自然光线条件下效果更好</li>
                  <li>✓ AI分析结果仅供参考</li>
                  <li>✓ 建议咨询专业美容师</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'results' && analysisResult && (
        <div className="space-y-6">
          {/* 肤质诊断 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">诊断结果</h3>
            
            <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Heart className="w-6 h-6 text-red-500" />
                <h4 className="text-lg font-semibold text-gray-900">{analysisResult.type}</h4>
              </div>
              <p className="text-gray-700">{analysisResult.condition}</p>
            </div>

            {/* 问题列表 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="font-medium text-gray-900 mb-3 text-red-600">⚠️ 主要问题</h5>
                <ul className="space-y-2">
                  {analysisResult.problems.map((problem, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      {problem}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="font-medium text-gray-900 mb-3 text-green-600">✓ 护理建议</h5>
                <ul className="space-y-2">
                  {analysisResult.solutions.map((solution, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* 推荐产品 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">推荐产品</h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              {analysisResult.recommendedProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                  <div className="mb-3">
                    <h5 className="font-semibold text-gray-900 mb-1">{product.name}</h5>
                    <p className="text-sm text-gray-600">{product.description}</p>
                  </div>

                  <div className="mb-3 flex items-center gap-1 text-xs">
                    {product.benefit.split(' • ').map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600">¥{product.price}</span>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 下一步操作 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-3">建议下一步</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ 根据推荐产品制定护肤方案</li>
              <li>✓ 咨询专业美容师获取个性化建议</li>
              <li>✓ 定期复检监测肤质变化</li>
              <li>✓ 购买推荐产品开始护理</li>
            </ul>
          </div>

          {/* 返回按钮 */}
          <button
            onClick={() => {
              setActiveTab('detection');
              setSelectedImage(null);
              setAnalysisResult(null);
            }}
            className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            返回重新检测
          </button>
        </div>
      )}
    </div>
  );
};
