import React, { useState } from 'react';
import { Sparkles, Image, FileText, User, Target, X, Plus, Copy, Download, Zap, TrendingUp, MessageSquare, Send } from 'lucide-react';
import { SmartPosterMaker } from './SmartPosterMaker';
import posterGenerationAPIService from '../services/posterGenerationAPIService';

interface MarketingFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const MarketingAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'poster' | 'copywriting' | 'analysis'>('poster');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-purple-900">营销助手</h1>
          <p className="text-purple-600 mt-1">智能海报制作 + 文案撰写 + 营销分析</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-purple-200 overflow-x-auto">
      <button
          onClick={() => setActiveTab('poster')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'poster'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          🎨 智能海报制作
            </button>
            <button
          onClick={() => setActiveTab('copywriting')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'copywriting'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          ✍️ 文案撰写
            </button>
            <button
          onClick={() => setActiveTab('analysis')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'analysis'
              ? 'border-b-2 border-purple-500 text-purple-600'
              : 'text-gray-600 hover:text-purple-600'
          }`}
        >
          📊 营销分析
            </button>
      </div>

      {/* 智能海报制作 */}
      {activeTab === 'poster' && (
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <SmartPosterMaker />
            </div>
          )}

      {/* 文案撰写 - 保持现有功能 */}
      {activeTab === 'copywriting' && (
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">✍️ AI 文案撰写</h2>
          <p className="text-gray-600">敬请期待...</p>
            </div>
          )}

      {/* 营销分析 - 保持现有功能 */}
      {activeTab === 'analysis' && (
        <div className="bg-white rounded-lg border border-purple-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">📊 营销分析</h2>
          <p className="text-gray-600">敬请期待...</p>
      </div>
      )}
    </div>
  );
};

export default MarketingAssistant;