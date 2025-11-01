import React, { useState } from 'react';
import { Calendar, TrendingUp, BookOpen, Award, X, Plus, CheckCircle } from 'lucide-react';

interface SmartManagerFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const SmartManager: React.FC = () => {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features: SmartManagerFeature[] = [
    {
      id: 'scheduling',
      title: '智能排班',
      description: '根据客流、员工技能智能分配班次',
      icon: <Calendar className="w-6 h-6" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: 'promotion',
      title: '晋升管理',
      description: '追踪员工成长，管理晋升流程',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: 'learning',
      title: '学习计划',
      description: '制定个性化培训和学习路径',
      icon: <BookOpen className="w-6 h-6" />,
      color: 'bg-purple-50 border-purple-200'
    },
    {
      id: 'assessment',
      title: '智能考核',
      description: '多维度评估员工表现和能力',
      icon: <Award className="w-6 h-6" />,
      color: 'bg-amber-50 border-amber-200'
    }
  ];

  const renderFeatureContent = () => {
    switch (activeFeature) {
      case 'scheduling':
        return <IntelligentScheduling />;
      case 'promotion':
        return <PromotionManagement />;
      case 'learning':
        return <LearningPlan />;
      case 'assessment':
        return <SmartAssessment />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {/* 功能卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {features.map((feature) => (
          <button
            key={feature.id}
            onClick={() => {
              setActiveFeature(feature.id);
              setIsModalOpen(true);
            }}
            className={`p-6 rounded-lg border-2 transition-all hover:shadow-lg text-left ${feature.color}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-green-600">{feature.icon}</div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* 功能模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-900">
                {features.find(f => f.id === activeFeature)?.title}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {renderFeatureContent()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 智能排班组件
const IntelligentScheduling: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [autoSchedule, setAutoSchedule] = useState(false);

  const scheduleData = {
    1: [
      { day: '周一', morning: ['李美娟', '王雨晴'], afternoon: ['张琳琳', '陈思语'], evening: ['刘心怡'] },
      { day: '周二', morning: ['王雨晴', '张琳琳'], afternoon: ['刘心怡', '李美娟'], evening: ['陈思语'] },
      { day: '周三', morning: ['陈思语', '刘心怡'], afternoon: ['李美娟', '王雨晴'], evening: ['张琳琳'] },
      { day: '周四', morning: ['张琳琳', '陈思语'], afternoon: ['王雨晴', '刘心怡'], evening: ['李美娟'] },
      { day: '周五', morning: ['李美娟', '刘心怡'], afternoon: ['陈思语', '张琳琳'], evening: ['王雨晴'] },
    ]
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择周次</label>
        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value={1}>第1周</option>
          <option value={2}>第2周</option>
          <option value={3}>第3周</option>
          <option value={4}>第4周</option>
        </select>
      </div>

      <div>
        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={autoSchedule}
            onChange={(e) => setAutoSchedule(e.target.checked)}
            className="w-4 h-4 text-green-600"
          />
          <span className="text-sm font-medium text-gray-700">启用智能自动排班</span>
        </label>
        {autoSchedule && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-sm text-green-700">AI will intelligently allocate shifts based on employee skills, customer flow, and fatigue level</p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-4">周班次安排</h3>
        <div className="space-y-3">
          {scheduleData[1 as keyof typeof scheduleData].map((item, idx) => (
            <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
              <p className="font-medium text-gray-900 mb-2">{item.day}</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p className="text-gray-600 text-xs">上午班</p>
                  <p className="text-green-600 font-medium">{item.morning.join('/')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">下午班</p>
                  <p className="text-blue-600 font-medium">{item.afternoon.join('/')}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-xs">晚班</p>
                  <p className="text-purple-600 font-medium">{item.evening.join('/')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4" />
        发布排班表
      </button>
    </div>
  );
};

// 晋升管理组件
const PromotionManagement: React.FC = () => {
  const [selectedPosition, setSelectedPosition] = useState('all');

  const promotionData = [
    {
      name: '李美娟',
      currentPosition: '高级美容师',
      targetPosition: '店长',
      score: 95,
      readiness: '已准备就绪',
      status: 'ready'
    },
    {
      name: '王雨晴',
      currentPosition: '美容师',
      targetPosition: '高级美容师',
      score: 87,
      readiness: '基本完成',
      status: 'ongoing'
    },
    {
      name: '张琳琳',
      currentPosition: '美容师',
      targetPosition: '美甲师',
      score: 78,
      readiness: '继续培养',
      status: 'planning'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">职位分类</label>
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">全部职位</option>
          <option value="manager">店长管理</option>
          <option value="senior">高级美容师</option>
          <option value="beautician">美容师</option>
        </select>
      </div>

      <div className="space-y-3">
        {promotionData.map((item, idx) => (
          <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.currentPosition} → {item.targetPosition}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                {item.readiness}
              </span>
            </div>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">晋升准备度</span>
                <span className="text-xs font-bold text-green-600">{item.score}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>

            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              查看晋升计划
            </button>
          </div>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        新增晋升计划
      </button>
    </div>
  );
};

// 学习计划组件
const LearningPlan: React.FC = () => {
  const [selectedStaff, setSelectedStaff] = useState('all');

  const learningPlanData = [
    {
      name: '李美娟',
      plans: [
        { course: '高级皮肤管理', status: '进行中', progress: 75 },
        { course: '团队管理培训', status: '即将开始', progress: 0 }
      ]
    },
    {
      name: '王雨晴',
      plans: [
        { course: '美甲设计进阶', status: '进行中', progress: 60 },
        { course: '客户服务技巧', status: '已完成', progress: 100 }
      ]
    },
    {
      name: '张琳琳',
      plans: [
        { course: '美睫专业技术', status: '进行中', progress: 45 },
        { course: '产品知识培训', status: '进行中', progress: 50 }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case '已完成': return 'text-green-600 bg-green-50';
      case '进行中': return 'text-blue-600 bg-blue-50';
      case '即将开始': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">选择员工</label>
        <select
          value={selectedStaff}
          onChange={(e) => setSelectedStaff(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="all">所有员工</option>
          <option value="limeijuan">李美娟</option>
          <option value="wangyuqing">王雨晴</option>
          <option value="zhanglinlin">张琳琳</option>
        </select>
      </div>

      <div className="space-y-4">
        {learningPlanData.map((staff, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">{staff.name}</h4>
            <div className="space-y-3">
              {staff.plans.map((plan, pidx) => (
                <div key={pidx} className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{plan.course}</span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${getStatusColor(plan.status)}`}>
                      {plan.status}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${plan.progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{plan.progress}% 完成</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
        <Plus className="w-4 h-4" />
        制定学习计划
      </button>
    </div>
  );
};

// 智能考核组件
const SmartAssessment: React.FC = () => {
  const [assessmentType, setAssessmentType] = useState('comprehensive');

  const assessmentData = [
    {
      name: '李美娟',
      role: '高级美容师',
      dimensions: [
        { name: '技能水平', score: 95 },
        { name: '客户满意度', score: 92 },
        { name: '销售业绩', score: 88 },
        { name: '团队合作', score: 90 },
        { name: '职业发展', score: 85 }
      ],
      overall: 90,
      rating: '优秀'
    },
    {
      name: '王雨晴',
      role: '美容师',
      dimensions: [
        { name: '技能水平', score: 82 },
        { name: '客户满意度', score: 85 },
        { name: '销售业绩', score: 78 },
        { name: '团队合作', score: 80 },
        { name: '职业发展', score: 75 }
      ],
      overall: 80,
      rating: '良好'
    }
  ];

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">考核类型</label>
        <select
          value={assessmentType}
          onChange={(e) => setAssessmentType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="comprehensive">综合评估</option>
          <option value="skill">技能评估</option>
          <option value="performance">业绩评估</option>
          <option value="behavior">行为评估</option>
        </select>
      </div>

      <div className="space-y-4">
        {assessmentData.map((staff, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold text-gray-900">{staff.name}</h4>
                <p className="text-sm text-gray-600">{staff.role}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{staff.overall}</div>
                <div className="text-sm font-medium text-gray-700">{staff.rating}</div>
              </div>
            </div>

            <div className="space-y-2">
              {staff.dimensions.map((dim, didx) => (
                <div key={didx}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-700">{dim.name}</span>
                    <span className="text-sm font-medium text-gray-900">{dim.score}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        dim.score >= 90 ? 'bg-green-500' :
                        dim.score >= 80 ? 'bg-blue-500' :
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
              查看详细报告
            </button>
          </div>
        ))}
      </div>

      <button className="w-full py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2">
        <CheckCircle className="w-4 h-4" />
        生成考核报告
      </button>
    </div>
  );
};
