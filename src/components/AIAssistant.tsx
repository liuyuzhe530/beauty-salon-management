import React, { useState, useMemo } from 'react';
import { Zap, TrendingUp, Users, ShoppingBag, Clock, CheckCircle, Target, ListTodo, BarChart3, MessageSquare } from 'lucide-react';
import { MarketingAssistant } from './MarketingAssistant';
import { IntelligentProcurementAI } from './IntelligentProcurementAI';

interface AIRecommendation {
  id: string;
  type: 'appointment' | 'service' | 'product' | 'customer';
  title: string;
  description: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

interface Task {
  id: string;
  title: string;
  description: string;
  category: 'marketing' | 'procurement' | 'customer' | 'operations';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
  dueDate?: Date;
}

interface TaskSummary {
  completedTasks: Task[];
  pendingTasks: Task[];
  totalImpact: string;
  keyResults: string[];
}

export const AIAssistant: React.FC = () => {
  const [selectedRecommendation, setSelectedRecommendation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'marketing' | 'procurement' | 'tasks' | 'planning'>('recommendations');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'task-1',
      title: '社交媒体营销活动',
      description: '为新美容套餐创建并启动社交媒体营销活动',
      category: 'marketing',
      priority: 'high',
      status: 'pending',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'task-2',
      title: '采购优质护肤产品',
      description: '从1688、阿里巴巴、拼多多等平台比较价格并谈判最优价格',
      category: 'procurement',
      priority: 'high',
      status: 'in_progress',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  ]);

  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'appointment',
      title: '预约时间优化',
      description: '数据显示周五下午3-5点是预约最高峰期。建议在此时段安排资深美容师。',
      impact: '预计预约确认率提升15%',
      priority: 'high'
    },
    {
      id: '2',
      type: 'customer',
      title: '客户留存计划',
      description: '有2位高风险客户超过30天未预约。建议发送个性化优惠券和服务推荐。',
      impact: '预计客户流失率下降20%',
      priority: 'high'
    },
    {
      id: '3',
      type: 'service',
      title: '交叉销售建议',
      description: '该客户经常预约皮肤管理服务。数据显示对护肤产品兴趣高。建议推荐高级精油套装。',
      impact: '预计客户均价提升12%',
      priority: 'high'
    }
  ];

  const taskSummary: TaskSummary = useMemo(() => {
    const completed = tasks.filter(t => t.status === 'completed');
    const pending = tasks.filter(t => t.status !== 'completed');
    
    return {
      completedTasks: completed,
      pendingTasks: pending,
      totalImpact: '通过整合营销和采购优化，预计实现35%的业务增长',
      keyResults: [
        '采购成本下降15-20%',
        '客户互动提升25%',
        '预约确认率提升18%',
        '团队排班效率提升30%'
      ]
    };
  }, [tasks]);

  const completeTask = (taskId: string) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, status: 'completed' } : t
    ));
  };

  const createNewPlan = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: '新行动计划',
      description: '基于当前分析和已完成任务',
      category: 'operations',
      priority: 'medium',
      status: 'pending',
      createdAt: new Date(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    };
    setTasks([...tasks, newTask]);
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'marketing': return ShoppingBag;
      case 'procurement': return BarChart3;
      case 'customer': return Users;
      case 'operations': return ListTodo;
      default: return Zap;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment': return Clock;
      case 'customer': return Users;
      case 'service': return TrendingUp;
      case 'product': return ShoppingBag;
      default: return Zap;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">AI助手中心</h1>
          <p className="text-green-600 mt-1">整合营销 + 智能采购 + 数据分析</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-lg flex items-center gap-2">
          <Zap className="w-5 h-5 text-green-700" />
          <span className="text-sm font-medium text-green-900">{tasks.length} 任务活跃</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-green-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'recommendations'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          数据分析
        </button>
        <button
          onClick={() => setActiveTab('marketing')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'marketing'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          营销助手
        </button>
        <button
          onClick={() => setActiveTab('procurement')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'procurement'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          智能采购
        </button>
        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'tasks'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          任务管理
        </button>
        <button
          onClick={() => setActiveTab('planning')}
          className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'planning'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          任务总结与规划
        </button>
      </div>

      {/* Content - Analytics Recommendations */}
      {activeTab === 'recommendations' && (
        <div className="space-y-4">
          {recommendations.map(rec => {
            const Icon = getTypeIcon(rec.type);
            const isSelected = selectedRecommendation === rec.id;

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecommendation(isSelected ? null : rec.id)}
                className="bg-white rounded-lg border border-green-200 p-6 hover:border-green-300 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{rec.title}</h3>
                          <span className={`text-xs px-2 py-1 rounded font-medium border ${getPriorityColor(rec.priority)}`}>
                            {rec.priority === 'high' ? '高优先级' : rec.priority === 'medium' ? '中优先级' : '低优先级'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-700 mt-2">{rec.description}</p>

                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <p className="text-sm text-green-900 font-medium">预期影响</p>
                          <p className="text-green-700 text-sm mt-1">{rec.impact}</p>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            接受建议
                          </button>
                          <button className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium">
                            详情
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content - Marketing Assistant */}
      {activeTab === 'marketing' && (
        <MarketingAssistant />
      )}

      {/* Content - Procurement */}
      {activeTab === 'procurement' && (
        <IntelligentProcurementAI />
      )}

      {/* Content - Task Management */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {tasks.map(task => {
            const Icon = getCategoryIcon(task.category);
            return (
              <div key={task.id} className="bg-white rounded-lg border border-green-200 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mt-1">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded font-medium border ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded font-medium ${
                          task.status === 'completed' ? 'bg-green-100 text-green-700' :
                          task.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {task.status === 'completed' ? '已完成' : task.status === 'in_progress' ? '进行中' : '待办'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {task.status !== 'completed' && (
                    <button
                      onClick={() => completeTask(task.id)}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                    >
                      完成
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content - Task Summary & Planning */}
      {activeTab === 'planning' && (
        <div className="space-y-6">
          {/* Task Summary */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">任务总结与结果</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600">已完成任务</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{taskSummary.completedTasks.length}</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <p className="text-sm text-gray-600">待办任务</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{taskSummary.pendingTasks.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200 mb-4">
              <h3 className="font-bold text-gray-900 mb-2">总体影响</h3>
              <p className="text-gray-700">{taskSummary.totalImpact}</p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-3">关键成果</h3>
              <ul className="space-y-2">
                {taskSummary.keyResults.map((result, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Next Steps Planning */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-300 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">下一步与行动计划</h2>
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">1. 加速营销活动</h3>
                <p className="text-sm text-gray-700">为高价值客户启动3个新的社交媒体营销活动。预期ROI：200%+</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">2. 扩展采购网络</h3>
                <p className="text-sm text-gray-700">添加5个新供应商并谈判批量折扣。预期节省：每月20,000 CNY</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">3. 客户留存计划</h3>
                <p className="text-sm text-gray-700">实施忠诚度计划，提供个性化奖励。预期留存率：85%+</p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">4. 团队容量规划</h3>
                <p className="text-sm text-gray-700">招聘2名额外美容师并实施智能排班。预期效率提升：35%</p>
              </div>
            </div>

            <button
              onClick={createNewPlan}
              className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-colors font-bold flex items-center justify-center gap-2"
            >
              <ListTodo className="w-5 h-5" />
              创建新行动计划
            </button>
          </div>

          {/* Start New Chat Session */}
          <div className="bg-white rounded-lg border border-green-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <h3 className="text-xl font-bold text-gray-900">AI对话助手</h3>
            </div>
            <p className="text-gray-700 mb-4">
              💡 提示：使用界面右下角的 <span className="font-bold text-green-600">对话悬浮球</span> 与AI进行实时对话，获取营销、采购、数据分析等方面的智能建议。
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">✨ <span className="font-semibold">悬浮球功能包括：</span></p>
              <ul className="text-sm text-green-700 mt-2 space-y-1 ml-4">
                <li>• 实时智能聊天咨询</li>
                <li>• AI建议和推荐</li>
                <li>• 快速数据分析</li>
                <li>• 可拖拽悬浮窗</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
