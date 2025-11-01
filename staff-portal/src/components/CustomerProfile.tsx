import React, { useState, useEffect } from 'react';
import {
  User, Heart, TrendingUp, Users, ShoppingBag, Target, AlertCircle,
  CheckCircle, Star, Phone, Mail, Calendar, DollarSign, BarChart3, Zap
} from 'lucide-react';
import { Customer, Staff } from '../types/index';
import { customerProfileAnalysisService, CustomerPortrait } from '../services/customerProfileAnalysisService';

interface Props {
  customer: Customer;
  staffList?: Staff[];
  onClose?: () => void;
}

export const CustomerProfile: React.FC<Props> = ({ customer, staffList = [], onClose }) => {
  const [loading, setLoading] = useState(true);
  const [portrait, setPortrait] = useState<CustomerPortrait | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'portrait' | 'matching' | 'insights'>('overview');

  useEffect(() => {
    const analyzeProfile = async () => {
      setLoading(true);
      try {
        const analysis = customerProfileAnalysisService.analyzeCustomerProfile(customer, staffList);
        setPortrait(analysis);
      } catch (error) {
        console.error('分析客户画像失败:', error);
      } finally {
        setLoading(false);
      }
    };

    analyzeProfile();
  }, [customer, staffList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">分析客户画像中...</p>
        </div>
      </div>
    );
  }

  if (!portrait) {
    return <div className="text-center text-gray-600 py-8">无法分析客户数据</div>;
  }

  return (
    <div className="space-y-6">
      {/* 客户基本信息 */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{customer.name}</h2>
              <p className="text-gray-600">客户ID: {customer.id}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-block px-3 py-1 rounded-full font-semibold ${
              customer.status === 'vip' ? 'bg-purple-100 text-purple-800' :
              customer.status === 'active' ? 'bg-green-100 text-green-800' :
              customer.status === 'atrisk' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {customer.status === 'vip' ? 'VIP客户' : 
               customer.status === 'active' ? '活跃' : 
               customer.status === 'atrisk' ? '风险' : '不活跃'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600">总消费</p>
            <p className="text-xl font-bold text-gray-900">¥{customer.totalSpending}</p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600">访问次数</p>
            <p className="text-xl font-bold text-gray-900">{customer.visitCount}</p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600">预约次数</p>
            <p className="text-xl font-bold text-gray-900">{customer.appointmentCount}</p>
          </div>
          <div className="bg-white rounded p-3">
            <p className="text-xs text-gray-600">人均消费</p>
            <p className="text-xl font-bold text-gray-900">¥{Math.round(customer.totalSpending / Math.max(customer.visitCount, 1))}</p>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors ${
            activeTab === 'overview'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          基本信息
        </button>
        <button
          onClick={() => setActiveTab('portrait')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'portrait'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Target className="w-4 h-4" />
          客户画像
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'matching'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Heart className="w-4 h-4" />
          美容师匹配
        </button>
        <button
          onClick={() => setActiveTab('insights')}
          className={`px-4 py-2 font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeTab === 'insights'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-600'
          }`}
        >
          <Zap className="w-4 h-4" />
          AI洞察
        </button>
      </div>

      {/* 基本信息 */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* 客户特征 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              客户特征
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">肤质类型</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.characteristics.skinType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">消费预算</p>
                <p className="text-lg font-semibold text-gray-900">
                  {portrait.characteristics.preferredBudget === 'luxury' ? '豪华' :
                   portrait.characteristics.preferredBudget === 'premium' ? '高端' :
                   portrait.characteristics.preferredBudget === 'standard' ? '标准' : '经济'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">访问频率</p>
                <p className="text-lg font-semibold text-gray-900">
                  {portrait.characteristics.visitFrequency === 'weekly' ? '每周' :
                   portrait.characteristics.visitFrequency === 'biweekly' ? '隔周' :
                   portrait.characteristics.visitFrequency === 'monthly' ? '每月' : '不规律'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">主要关注</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.characteristics.primaryConcerns[0]}</p>
              </div>
            </div>
          </div>

          {/* 家庭背景 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              家庭背景
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">婚姻状态</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.familyBackground.maritalStatus}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">家庭成员</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.familyBackground.familySize} 人</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">生活阶段</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.familyBackground.lifeStage}</p>
              </div>
            </div>
          </div>

          {/* 消费行为 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              消费行为分析
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">平均每次消费</p>
                <p className="text-2xl font-bold text-purple-600">¥{Math.round(portrait.consumptionBehavior.averageSpending)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">访问模式</p>
                <p className="text-lg font-semibold text-gray-900">{portrait.consumptionBehavior.visitPattern}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">服务偏好</p>
                <div className="flex flex-wrap gap-2">
                  {portrait.consumptionBehavior.servicePreferences.map((pref, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">产品偏好</p>
                <div className="flex flex-wrap gap-2">
                  {portrait.consumptionBehavior.productAffinities.map((aff, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {aff}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 客户细分 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-600" />
              客户细分标签
            </h3>
            <div className="flex flex-wrap gap-2">
              {portrait.segments.map((segment, idx) => (
                <span key={idx} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                  {segment}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 客户画像 */}
      {activeTab === 'portrait' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">客户性格</h3>
            <p className="text-gray-700 leading-relaxed">{portrait.aiInsights.personality}</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              客户需求分析
            </h3>
            <ul className="space-y-2">
              {portrait.aiInsights.needsAnalysis.map((need, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{need}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              推荐服务
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {portrait.aiInsights.recommendedServices.map((service, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-900 font-medium">{service}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">购买动机</h3>
            <p className="text-gray-700 leading-relaxed">{portrait.aiInsights.purchaseMotivation}</p>
          </div>
        </div>
      )}

      {/* 美容师匹配 */}
      {activeTab === 'matching' && (
        <div className="space-y-4">
          {portrait.staffMatchings.length > 0 ? (
            portrait.staffMatchings.map((matching, idx) => (
              <div key={idx} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{matching.staffName}</h3>
                    <p className="text-sm text-gray-600">匹配度</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{matching.matchScore}</div>
                    <p className="text-xs text-gray-600">/100</p>
                  </div>
                </div>

                {/* 匹配分数条 */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      matching.matchScore >= 80 ? 'bg-green-600' :
                      matching.matchScore >= 60 ? 'bg-blue-600' :
                      matching.matchScore >= 40 ? 'bg-yellow-600' :
                      'bg-red-600'
                    }`}
                    style={{ width: `${matching.matchScore}%` }}
                  />
                </div>

                {/* 匹配原因 */}
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">匹配原因：</p>
                  <ul className="space-y-1">
                    {matching.matchReasons.map((reason, ridx) => (
                      <li key={ridx} className="flex items-center gap-2 text-sm text-gray-700">
                        <Star className="w-4 h-4 text-yellow-500" />
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 互补技能 */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-2">互补技能：</p>
                  <div className="flex flex-wrap gap-2">
                    {matching.complementarySkills.map((skill, sidx) => (
                      <span key={sidx} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-600 py-8">暂无美容师数据</div>
          )}
        </div>
      )}

      {/* AI洞察 */}
      {activeTab === 'insights' && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-300 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              客户留存策略
            </h3>
            <ul className="space-y-3">
              {portrait.aiInsights.retentionStrategies.map((strategy, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-white bg-opacity-50 p-3 rounded">
                  <div className="w-6 h-6 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {idx + 1}
                  </div>
                  <span className="text-gray-700">{strategy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
