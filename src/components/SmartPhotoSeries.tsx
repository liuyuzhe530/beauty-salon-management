import React from 'react';
import { Camera, Heart, TrendingUp, Zap, ChevronRight } from 'lucide-react';

interface DetectionService {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  color: string;
  bgColor: string;
}

interface SmartPhotoSeriesProps {
  onSelectService: (serviceId: string) => void;
}

export const SmartPhotoSeries: React.FC<SmartPhotoSeriesProps> = ({ onSelectService }) => {
  const services: DetectionService[] = [
    {
      id: 'skincare-detection',
      title: '皮肤检测',
      description: '智能分析肤质状态，提供专业护肤建议',
      icon: <Camera className="w-12 h-12" />,
      features: ['肤质诊断', '问题识别', '产品推荐'],
      color: 'from-indigo-600 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50'
    },
    {
      id: 'beauty-diagnosis',
      title: '美容诊断',
      description: '多维度美容分析，获得个性化美容方案',
      icon: <Heart className="w-12 h-12" />,
      features: ['美容评分', '疗程方案', '产品推荐'],
      color: 'from-pink-600 to-red-600',
      bgColor: 'from-pink-50 to-red-50'
    },
    {
      id: 'tongue-coating-detection',
      title: '舌苔检测',
      description: '中医舌诊分析，了解体质和健康状况',
      icon: <TrendingUp className="w-12 h-12" />,
      features: ['体质诊断', '中医调理', '食疗方案'],
      color: 'from-amber-600 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* 标题部分 */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Zap className="w-8 h-8" />
          <h1 className="text-3xl font-bold">智能拍照检测系列</h1>
        </div>
        <p className="text-blue-100 text-lg">一键拍照，多维诊断 • 皮肤 • 美容 • 健康</p>
      </div>

      {/* 介绍卡片 */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border-2 border-blue-200 p-6">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">3</div>
            <p className="text-gray-700 font-semibold">智能诊断服务</p>
            <p className="text-sm text-gray-600 mt-1">全面覆盖皮肤、美容、健康</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-cyan-600 mb-2">100%</div>
            <p className="text-gray-700 font-semibold">专业分析</p>
            <p className="text-sm text-gray-600 mt-1">AI智能+中医理论</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">1分钟</div>
            <p className="text-gray-700 font-semibold">快速诊断</p>
            <p className="text-sm text-gray-600 mt-1">获得完整检测报告</p>
          </div>
        </div>
      </div>

      {/* 服务卡片网格 */}
      <div className="grid md:grid-cols-3 gap-6">
        {services.map(service => (
          <div
            key={service.id}
            className="group"
          >
            <button
              onClick={() => onSelectService(service.id)}
              className="w-full h-full"
            >
              <div className={`bg-gradient-to-br ${service.bgColor} rounded-lg border-2 border-gray-200 p-8 hover:shadow-xl transition-all duration-300 group-hover:border-transparent h-full flex flex-col`}>
                {/* 图标 */}
                <div className={`bg-gradient-to-br ${service.color} rounded-lg p-4 text-white w-fit mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>

                {/* 标题 */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>

                {/* 描述 */}
                <p className="text-gray-600 mb-4 flex-1">
                  {service.description}
                </p>

                {/* 特性列表 */}
                <div className="space-y-2 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* 按钮 */}
                <div className={`bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 group-hover:shadow-lg transition-all`}>
                  <Camera className="w-4 h-4" />
                  立即检测
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* 使用步骤 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">使用步骤</h2>
        
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { step: '1', title: '选择检测', desc: '选择需要的诊断服务' },
            { step: '2', title: '拍照上传', desc: '清晰拍摄照片并上传' },
            { step: '3', title: 'AI分析', desc: '智能系统快速分析' },
            { step: '4', title: '获得报告', desc: '获得详细的诊断报告' }
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold flex items-center justify-center mb-3 text-lg">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:block absolute top-6 -right-4 text-gray-300">
                  <ChevronRight className="w-6 h-6" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 功能对比表 */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 overflow-x-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">功能对比</h2>
        
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="text-left py-3 px-4 font-bold text-gray-900">功能</th>
              <th className="text-center py-3 px-4 font-bold text-gray-900">皮肤检测</th>
              <th className="text-center py-3 px-4 font-bold text-gray-900">美容诊断</th>
              <th className="text-center py-3 px-4 font-bold text-gray-900">舌苔检测</th>
            </tr>
          </thead>
          <tbody>
            {[
              { feature: '智能拍照分析', skincare: true, beauty: true, tongue: true },
              { feature: '肤质诊断', skincare: true, beauty: false, tongue: false },
              { feature: '美容评分', skincare: false, beauty: true, tongue: false },
              { feature: '中医诊断', skincare: false, beauty: false, tongue: true },
              { feature: '产品推荐', skincare: true, beauty: true, tongue: true },
              { feature: '调理方案', skincare: true, beauty: true, tongue: true },
              { feature: '历史记录', skincare: true, beauty: true, tongue: true }
            ].map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium text-gray-900">{item.feature}</td>
                <td className="py-3 px-4 text-center">
                  {item.skincare ? (
                    <span className="inline-block w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.beauty ? (
                    <span className="inline-block w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.tongue ? (
                    <span className="inline-block w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">✓</span>
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 常见问题 */}
      <div className="bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">常见问题</h2>
        
        <div className="space-y-4">
          {[
            { q: '如何获得最准确的诊断结果？', a: '在良好光线下，清晰拍摄完整的检测对象。建议使用自然光线，避免过度曝光或昏暗。' },
            { q: '诊断结果多久更新一次？', a: '您可以随时进行诊断。建议每周检测一次以追踪效果变化。' },
            { q: '推荐的产品和方案安全吗？', a: '所有推荐都基于专业理论，但建议咨询专业医生或美容师进行个性化指导。' },
            { q: '三个诊断可以同时进行吗？', a: '可以。您可以分别进行皮肤检测、美容诊断和舌苔检测，获得全面的健康和美容评估。' }
          ].map((item, idx) => (
            <details key={idx} className="group border border-gray-200 rounded-lg p-4 hover:bg-white transition-colors cursor-pointer">
              <summary className="font-semibold text-gray-900 flex items-center justify-between">
                {item.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform">
                  <ChevronRight className="w-5 h-5" />
                </span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};
