import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, LineChart, BarChart3, PieChart, Zap, RefreshCw, Download, MessageSquare } from 'lucide-react';
import { enhancedAIService, SystemData } from '../services/enhancedAIService';
import { trendAnalysisService, Trend } from '../services/trendAnalysisService';
import { predictiveAnalysisService, Prediction, ChurnPrediction } from '../services/predictiveAnalysisService';

interface AnalysisTab {
  id: 'trends' | 'predictions' | 'insights' | 'ai-chat';
  label: string;
  icon: React.ReactNode;
}

export const DataAnalyticsDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trends' | 'predictions' | 'insights' | 'ai-chat'>('trends');
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [aiInsights, setAiInsights] = useState<string>('');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([]);

  // Mock system data - 在实际应用中应该从后端获取
  const systemData: SystemData = {
    customers: {
      total: 128,
      newThisMonth: 12,
      churnRate: 8.5,
      activeCustomers: 98,
      vipCustomers: 15,
      highRiskCustomers: [
        { id: '1', name: '王女士', daysSinceLastAppointment: 45, totalSpent: 3200 },
        { id: '2', name: '李女士', daysSinceLastAppointment: 38, totalSpent: 2100 },
        { id: '3', name: '张女士', daysSinceLastAppointment: 32, totalSpent: 1800 },
      ]
    },
    appointments: {
      totalThisMonth: 87,
      confirmationRate: 92,
      peakHours: ['10:00-12:00', '14:00-16:00'],
      averageDuration: 60,
      noShowRate: 2.5
    },
    staff: {
      total: 5,
      activeStaff: 5,
      performanceRanking: [
        { name: '李美容师', appointmentsCompleted: 24, confirmationRate: 95, customerSatisfaction: 4.8 },
        { name: '王美容师', appointmentsCompleted: 22, confirmationRate: 92, customerSatisfaction: 4.7 },
        { name: '张美容师', appointmentsCompleted: 19, confirmationRate: 88, customerSatisfaction: 4.5 },
      ]
    },
    sales: {
      totalRevenue: 156800,
      revenueThisMonth: 28500,
      topProducts: [
        { name: '面部护理套装', sales: 34, revenue: 8160 },
        { name: '深层清洁套餐', sales: 28, revenue: 5600 },
        { name: '美白精华液', sales: 22, revenue: 3960 },
      ],
      growth: 15
    },
    marketing: {
      activeActivities: [
        { name: '社交媒体推广', cost: 2000, roi: 250, conversions: 15 },
        { name: '新客体验优惠', cost: 3000, roi: 180, conversions: 22 },
        { name: '会员转介绍计划', cost: 1500, roi: 120, conversions: 8 },
      ]
    }
  };

  // 加载分析数据
  const loadAnalysisData = async () => {
    setLoading(true);
    try {
      // 设置系统数据到 AI 服务
      enhancedAIService.setSystemData(systemData);

      // 加载趋势分析
      const customerTrend = await trendAnalysisService.analyzeCustomerTrend(systemData);
      const revenueTrend = await trendAnalysisService.analyzeRevenueTrend(systemData);
      const efficiencyTrend = await trendAnalysisService.analyzeEfficiencyTrend(systemData);
      setTrends([customerTrend, revenueTrend, efficiencyTrend]);

      // 加载预测分析
      const churnPrediction = await predictiveAnalysisService.predictCustomerChurn(systemData);
      const revenuePrediction = await predictiveAnalysisService.predictRevenue(systemData);
      const peakPredictions = await predictiveAnalysisService.predictPeakHours(systemData);
      setPredictions([churnPrediction, revenuePrediction, peakPredictions]);

      // 获取 AI 智能建议
      const insights = await enhancedAIService.getSmartRecommendations();
      setAiInsights(insights.content);
    } catch (error) {
      console.error('加载分析数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalysisData();
  }, []);

  // 处理 AI 对话
  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await enhancedAIService.chat(userMessage);
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.content }]);
    } catch (error) {
      console.error('AI 对话出错:', error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: '抱歉，处理您的请求时出错' }]);
    }
  };

  const getTrendIcon = (direction: string) => {
    return direction === 'up' ? 
      <TrendingUp className="w-5 h-5 text-green-600" /> :
      direction === 'down' ? 
      <TrendingDown className="w-5 h-5 text-red-600" /> :
      <BarChart3 className="w-5 h-5 text-gray-600" />;
  };

  const getTrendColor = (direction: string) => {
    return direction === 'up' ? 'bg-green-50 border-green-200' :
           direction === 'down' ? 'bg-red-50 border-red-200' :
           'bg-gray-50 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-900">数据分析中心</h1>
          <p className="text-blue-600 mt-1">AI 驱动的业务数据分析和决策支持</p>
        </div>
        <button
          onClick={loadAnalysisData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新数据
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-blue-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('trends')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'trends'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <LineChart className="w-4 h-4" />
          趋势分析
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'predictions'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          预测分析
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Zap className="w-4 h-4" />
          AI 洞察
        </button>
        <button
          onClick={() => setActiveTab('ai-chat')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'ai-chat'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          AI 对话
        </button>
      </div>

      {/* Content - Trends Analysis */}
      {activeTab === 'trends' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600">加载趋势分析数据中...</p>
            </div>
          ) : (
            trends.map((trend, idx) => (
              <div key={idx} className={`rounded-lg border-2 p-6 ${getTrendColor(trend.direction)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getTrendIcon(trend.direction)}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{trend.name}</h3>
                      <p className="text-sm text-gray-600">
                        {trend.direction === 'up' ? '↑ 上升趋势' : trend.direction === 'down' ? '↓ 下降趋势' : '→ 稳定'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {trend.changePercent?.toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-600 mt-1">变化幅度</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">趋势强度</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          trend.direction === 'up' ? 'bg-green-600' : trend.direction === 'down' ? 'bg-red-600' : 'bg-gray-600'
                        }`}
                        style={{ width: `${(trend.strength / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{trend.strength}/10</p>
                  </div>

                  <div className="bg-white bg-opacity-60 rounded p-3 border border-gray-300">
                    <p className="text-sm text-gray-700"><span className="font-semibold">洞察：</span> {trend.insight}</p>
                  </div>

                  <div className="bg-blue-100 bg-opacity-60 rounded p-3 border border-blue-300">
                    <p className="text-sm text-blue-900"><span className="font-semibold">建议：</span> {trend.action}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Content - Predictions */}
      {activeTab === 'predictions' && (
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600">加载预测分析数据中...</p>
            </div>
          ) : predictions.length > 0 ? (
            <>
              {/* Churn Prediction */}
              {predictions[0] && (
                <div className="bg-white rounded-lg border-2 border-red-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-red-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{predictions[0].metric}</h3>
                        <p className="text-sm text-gray-600">下月预测</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">
                        {predictions[0].predictedValue?.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 mt-1">预测值</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-600">当前流失率</p>
                      <p className="text-xl font-bold text-gray-900">{predictions[0].currentValue?.toFixed(1)}%</p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-600">紧急程度</p>
                      <p className="text-lg font-bold text-red-600">{
                        predictions[0].urgency === 'critical' ? '严重' :
                        predictions[0].urgency === 'high' ? '高' :
                        predictions[0].urgency === 'medium' ? '中' : '低'
                      }</p>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded p-3 border border-red-200 mb-4">
                    <p className="text-sm text-red-900">{predictions[0].recommendation}</p>
                  </div>

                  {predictions[0].customersAtRisk && predictions[0].customersAtRisk.length > 0 && (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-2">高风险客户（前3位）</p>
                      <div className="space-y-2">
                        {predictions[0].customersAtRisk.slice(0, 3).map((customer: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 rounded p-2 flex items-center justify-between">
                            <span className="text-sm text-gray-700">{customer.name}</span>
                            <span className="text-xs font-semibold text-red-600">风险分数: {customer.riskScore}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Revenue Prediction */}
              {predictions[1] && (
                <div className="bg-white rounded-lg border-2 border-green-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{predictions[1].metric}</h3>
                        <p className="text-sm text-gray-600">下月预测</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        ¥{predictions[1].predictedValue?.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">预测值</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-600">本月收入</p>
                      <p className="text-lg font-bold text-gray-900">¥{predictions[1].currentValue?.toFixed(0)}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-xs text-gray-600">预期增长</p>
                      <p className="text-lg font-bold text-green-600">
                        {((predictions[1].predictedValue / predictions[1].currentValue - 1) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded p-3 border border-green-200">
                    <p className="text-sm text-green-900">{predictions[1].recommendation}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-600">无预测数据</p>
          )}
        </div>
      )}

      {/* Content - AI Insights */}
      {activeTab === 'insights' && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-300 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">AI 智能洞察</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-2" />
              <p className="text-gray-600">生成 AI 洞察中...</p>
            </div>
          ) : (
            <div className="bg-white rounded p-4 border border-blue-200 text-gray-700 whitespace-pre-wrap text-sm leading-relaxed max-h-96 overflow-y-auto">
              {aiInsights || '暂无 AI 洞察数据'}
            </div>
          )}
        </div>
      )}

      {/* Content - AI Chat */}
      {activeTab === 'ai-chat' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border-2 border-blue-200 p-4 h-96 overflow-y-auto space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>开始与 AI 对话，获取数据分析建议</p>
              </div>
            ) : (
              chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="输入你的问题..."
              className="flex-1 px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
