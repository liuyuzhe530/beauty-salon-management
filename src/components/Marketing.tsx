import React from 'react';
import { MarketingAssistant } from './MarketingAssistant';

export const Marketing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">营销助手</h1>
        <p className="text-gray-600">AI驱动的营销工具，帮助您快速生成专业营销内容和活动方案</p>
      </div>

      <div className="bg-white rounded-lg border border-green-200 p-6 shadow-sm">
        <MarketingAssistant />
      </div>
    </div>
  );
};




