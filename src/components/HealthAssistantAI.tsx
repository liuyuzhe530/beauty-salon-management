import React, { useState } from 'react';
import { Brain, Send, Copy, RefreshCw, User, Activity, Apple, Target } from 'lucide-react';
import healthAssistantAIService, { UserHealthProfile, AIResponse } from '../services/healthAssistantAIService';

export const HealthAssistantAI: React.FC = () => {
  const [userProfile, setUserProfile] = useState<UserHealthProfile>({});
  const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleInputChange = (field: keyof UserHealthProfile, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGoalToggle = (goal: string) => {
    setUserProfile(prev => {
      const goals = prev.goals || [];
      if (goals.includes(goal)) {
        return { ...prev, goals: goals.filter(g => g !== goal) };
      } else {
        return { ...prev, goals: [...goals, goal] };
      }
    });
  };

  const handleGenerateAdvice = async () => {
    const validation = healthAssistantAIService.validateProfile(userProfile);
    if (!validation.valid) {
      alert(validation.message);
      return;
    }

    setIsLoading(true);
    try {
      // 在实际应用中，这里会调用真实的 API
      // 这里先模拟生成建议
      const prompts = healthAssistantAIService.generatePrompts(userProfile);
      
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 这里应该调用实际的 AI API（如 OpenAI, 讯飞等）
      // 现在使用示例输出
      const mockResponse = healthAssistantAIService.getExampleOutput();
      const parsedResponse = healthAssistantAIService.parseAIResponse(mockResponse);
      setAiResponse(parsedResponse);
    } catch (error) {
      console.error('生成建议失败:', error);
      setAiResponse({
        success: false,
        error: '生成建议失败，请重试'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowExample = () => {
    const exampleProfile = healthAssistantAIService.getExampleProfile();
    setUserProfile(exampleProfile);
    const exampleOutput = healthAssistantAIService.getExampleOutput();
    const parsedResponse = healthAssistantAIService.parseAIResponse(exampleOutput);
    setAiResponse(parsedResponse);
    setShowExample(true);
  };

  const handleCopyAdvice = () => {
    if (aiResponse?.advice) {
      navigator.clipboard.writeText(aiResponse.advice);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setUserProfile({});
    setAiResponse(null);
    setShowExample(false);
  };

  const skinTypeOptions = [
    { value: 'dry', label: '干性' },
    { value: 'oily', label: '油性' },
    { value: 'combination', label: '混合性' },
    { value: 'sensitive', label: '敏感性' }
  ];

  const sleepOptions = [
    { value: 'good', label: '睡眠充足' },
    { value: 'fair', label: '睡眠一般' },
    { value: 'poor', label: '睡眠不足' }
  ];

  const goalOptions = ['美白', '抗老', '补水', '祛痘', '瘦身', '控油', '舒缓', '紧致'];

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-lg p-8 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-8 h-8" />
          <h1 className="text-3xl font-bold">AI 健康助手</h1>
        </div>
        <p className="text-violet-100 text-lg">智能分析您的健康状态，提供个性化护肤、饮食和生活建议</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧：用户信息输入 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              用户信息
            </h2>

            {/* 年龄 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">年龄</label>
              <input
                type="number"
                min="18"
                max="100"
                value={userProfile.age || ''}
                onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="请输入年龄"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              />
            </div>

            {/* 性别 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">性别</label>
              <select
                value={userProfile.gender || ''}
                onChange={(e) => handleInputChange('gender', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              >
                <option value="">请选择性别</option>
                <option value="female">女性</option>
                <option value="male">男性</option>
                <option value="other">其他</option>
              </select>
            </div>

            {/* 肤质 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">肤质</label>
              <select
                value={userProfile.skinType || ''}
                onChange={(e) => handleInputChange('skinType', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              >
                <option value="">请选择肤质</option>
                {skinTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* 睡眠情况 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                睡眠情况
              </label>
              <select
                value={userProfile.sleepQuality || ''}
                onChange={(e) => handleInputChange('sleepQuality', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              >
                <option value="">请选择睡眠情况</option>
                {sleepOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* 是否熬夜 */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="stayUpLate"
                checked={userProfile.stayUpLate || false}
                onChange={(e) => handleInputChange('stayUpLate', e.target.checked)}
                className="rounded border-gray-300 text-violet-600 focus:ring-violet-600"
              />
              <label htmlFor="stayUpLate" className="text-sm font-medium text-gray-700">
                经常熬夜
              </label>
            </div>

            {/* 饮食偏好 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Apple className="w-4 h-4" />
                饮食偏好
              </label>
              <input
                type="text"
                value={userProfile.dietPreference || ''}
                onChange={(e) => handleInputChange('dietPreference', e.target.value)}
                placeholder="例如：喜欢吃辣，素食者"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent"
              />
            </div>

            {/* 目标 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                目标（可多选）
              </label>
              <div className="grid grid-cols-2 gap-2">
                {goalOptions.map(goal => (
                  <button
                    key={goal}
                    onClick={() => handleGoalToggle(goal)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      userProfile.goals?.includes(goal)
                        ? 'bg-violet-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            {/* 按钮 */}
            <div className="space-y-3 pt-4 border-t">
              <button
                onClick={handleGenerateAdvice}
                disabled={isLoading}
                className="w-full bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {isLoading ? '生成中...' : '生成建议'}
              </button>
              <button
                onClick={handleShowExample}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 rounded-lg transition-colors text-sm"
              >
                查看示例
              </button>
              <button
                onClick={handleReset}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                清空
              </button>
            </div>
          </div>
        </div>

        {/* 右侧：AI 建议展示 */}
        <div className="lg:col-span-2">
          {aiResponse ? (
            <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
              {aiResponse.success ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900">您的个性化建议</h2>

                  {/* 综合建议 */}
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-6 border border-violet-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">综合建议</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {aiResponse.advice}
                    </p>
                  </div>

                  {/* 分类建议 */}
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* 护肤 */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                      <h4 className="font-bold text-blue-900 mb-2">💆 护肤建议</h4>
                      <p className="text-sm text-blue-800">
                        {aiResponse.skinCare}
                      </p>
                    </div>

                    {/* 饮食 */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                      <h4 className="font-bold text-green-900 mb-2">🥗 饮食建议</h4>
                      <p className="text-sm text-green-800">
                        {aiResponse.diet}
                      </p>
                    </div>

                    {/* 生活习惯 */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                      <h4 className="font-bold text-orange-900 mb-2">⏰ 生活习惯</h4>
                      <p className="text-sm text-orange-800">
                        {aiResponse.lifestyle}
                      </p>
                    </div>
                  </div>

                  {/* 复制按钮 */}
                  <button
                    onClick={handleCopyAdvice}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? '已复制' : '复制建议'}
                  </button>
                </>
              ) : (
                <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                  <p className="text-red-700 font-semibold">❌ {aiResponse.error}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
              <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">填写左侧信息后，点击"生成建议"获取个性化的护肤和健康方案</p>
            </div>
          )}
        </div>
      </div>

      {/* 信息说明 */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h3 className="font-bold text-blue-900 mb-3">ℹ️ 使用说明</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• 系统是美容院专属健康助手，提供护肤、健康、饮食建议</li>
          <li>• 建议简洁、专业、亲切，避免医学诊断</li>
          <li>• 至少填写一项信息才能生成建议</li>
          <li>• 可选字段留空不填，系统会基于已有信息生成建议</li>
          <li>• 所有建议仅供参考，请咨询专业人士获得医学诊断</li>
        </ul>
      </div>
    </div>
  );
};
