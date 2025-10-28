import React, { useState } from 'react';
import { ChevronRight, Award, Target, TrendingUp, Users, CheckCircle, AlertCircle } from 'lucide-react';

interface PromotionLevel {
  id: string;
  title: string;
  description: string;
  hardConditions: string[];
  assessmentMetrics: string[];
  rewards: string[];
  icon: React.ReactNode;
  color: string;
}

interface EmployeeProgress {
  employeeId: string;
  employeeName: string;
  currentLevel: string;
  nextLevel: string;
  progress: number;
  hardConditionsMet: boolean[];
  assessmentMetrics: {
    metric: string;
    target: string;
    current: string;
    status: 'completed' | 'in-progress' | 'not-started';
  }[];
  lastAssessment: string;
  nextAssessmentDate: string;
}

export const PromotionPlan: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLevel, setSelectedLevel] = useState('level1');
  const [employeeList, setEmployeeList] = useState<EmployeeProgress[]>([
    {
      employeeId: 'EMP001',
      employeeName: '李美丽',
      currentLevel: 'level1',
      nextLevel: 'level2',
      progress: 75,
      hardConditionsMet: [true, true],
      assessmentMetrics: [
        { metric: '月销售额', target: '≥1.5万元', current: '1.8万元', status: 'completed' },
        { metric: '客户满意度', target: '≥90%', current: '92%', status: 'completed' }
      ],
      lastAssessment: '2025-10-20',
      nextAssessmentDate: '2025-11-20'
    },
    {
      employeeId: 'EMP002',
      employeeName: '王精英',
      currentLevel: 'level2',
      nextLevel: 'level3',
      progress: 60,
      hardConditionsMet: [true, false],
      assessmentMetrics: [
        { metric: '连续3个月门店销售第一', target: '已完成', current: '进行中（2/3个月）', status: 'in-progress' },
        { metric: '客户满意度', target: '≥92%', current: '91%', status: 'in-progress' }
      ],
      lastAssessment: '2025-09-15',
      nextAssessmentDate: '2025-12-15'
    }
  ]);

  const promotionLevels: PromotionLevel[] = [
    {
      id: 'level1',
      title: '美容师 → 精英美容师',
      description: '第一级晋升：从基础美容师晋升为精英美容师',
      hardConditions: [
        '入职时间满6个月或以上',
        '基础技能认证考试通过'
      ],
      assessmentMetrics: [
        '月销售额达到1.5万元以上',
        '客户满意度达到90%以上'
      ],
      rewards: [
        '底薪增加500元',
        '提成比例增加2%',
        '精英美容师证书'
      ],
      icon: <Award className="w-6 h-6" />,
      color: 'from-blue-400 to-blue-600'
    },
    {
      id: 'level2',
      title: '精英美容师 → 店长',
      description: '第二级晋升：从精英美容师晋升为店长',
      hardConditions: [
        '任职精英美容师满12个月',
        '带教培养过2名及以上新人'
      ],
      assessmentMetrics: [
        '连续3个月门店销售排名第一',
        '客户满意度达到92%以上'
      ],
      rewards: [
        '底薪增加1000元',
        '享受团队销售提成1%',
        '店长聘书'
      ],
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'from-green-400 to-green-600'
    },
    {
      id: 'level3',
      title: '店长 → 区域经理候选',
      description: '第三级晋升：从店长晋升为区域经理',
      hardConditions: [
        '任职店长满18个月',
        '门店利润增长达到20%'
      ],
      assessmentMetrics: [
        '培养并成功晋升1名新店长',
        '区域排名进入前三名'
      ],
      rewards: [
        '股权激励2%',
        '区域经理候选资格',
        '高管薪酬体系'
      ],
      icon: <Users className="w-6 h-6" />,
      color: 'from-purple-400 to-purple-600'
    }
  ];

  const currentLevel = promotionLevels.find(level => level.id === selectedLevel);

  const renderProgressBar = (progress: number) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-green-600 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 标题部分 */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">员工晋升计划</h2>
        <p className="text-indigo-100">完整的四级晋升体系：美容师 → 精英美容师 → 店长 → 区域经理</p>
      </div>

      {/* 标签页切换 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          晋升体系概览
        </button>
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'details'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          晋升详情
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2 font-medium border-b-2 transition-all ${
            activeTab === 'employees'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          员工进度
        </button>
      </div>

      {/* 概览页 */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {promotionLevels.map((level, index) => (
            <button
              key={level.id}
              onClick={() => {
                setSelectedLevel(level.id);
                setActiveTab('details');
              }}
              className="w-full text-left p-4 rounded-lg border-2 border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${level.color} text-white`}>
                  {level.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {level.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">{level.description}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 flex-shrink-0" />
              </div>
            </button>
          ))}

          {/* 晋升流程图 */}
          <div className="mt-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-4">晋升路径总览</h3>
            <div className="flex items-center gap-4 overflow-x-auto pb-4">
              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-blue-900">美容师</span>
                </div>
                <span className="text-xs text-gray-600">入职6个月+</span>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-green-900">精英美容师</span>
                </div>
                <span className="text-xs text-gray-600">任职12个月+</span>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-purple-900">店长</span>
                </div>
                <span className="text-xs text-gray-600">任职18个月+</span>
              </div>

              <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />

              <div className="flex-shrink-0 text-center">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-bold text-indigo-900">区域经理</span>
                </div>
                <span className="text-xs text-gray-600">高管级别</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 详情页 */}
      {activeTab === 'details' && currentLevel && (
        <div className="space-y-6">
          {/* 选择晋升级别 */}
          <div className="flex gap-2">
            {promotionLevels.map(level => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`flex-1 p-3 rounded-lg font-medium transition-all ${
                  selectedLevel === level.id
                    ? `bg-gradient-to-r ${level.color} text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.title.split(' → ')[1]}
              </button>
            ))}
          </div>

          {/* 晋升标题 */}
          <div className={`bg-gradient-to-r ${currentLevel.color} rounded-lg p-6 text-white`}>
            <div className="flex items-center gap-3 mb-2">
              {currentLevel.icon}
              <h3 className="text-2xl font-bold">{currentLevel.title}</h3>
            </div>
            <p className="text-white/90">{currentLevel.description}</p>
          </div>

          {/* 硬性条件 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              硬性条件（必须同时满足）
            </h4>
            <div className="space-y-3">
              {currentLevel.hardConditions.map((condition, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-0.5">{condition}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 考核指标 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              考核指标（同时满足）
            </h4>
            <div className="space-y-3">
              {currentLevel.assessmentMetrics.map((metric, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 pt-0.5">{metric}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 奖励 */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              晋升奖励
            </h4>
            <div className="space-y-2">
              {currentLevel.rewards.map((reward, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <p className="text-gray-700">{reward}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 申请晋升按钮 */}
          <button className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
            立即申请晋升
          </button>
        </div>
      )}

      {/* 员工进度页 */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">员工晋升进度追踪</h3>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              添加员工
            </button>
          </div>

          {employeeList.map(employee => (
            <div key={employee.employeeId} className="bg-white p-6 rounded-lg border border-gray-200">
              {/* 员工基本信息 */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{employee.employeeName}</h4>
                  <p className="text-sm text-gray-600">员工ID：{employee.employeeId}</p>
                </div>
                <div className="text-right">
                  <div className="inline-block px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-sm font-medium">
                    {promotionLevels.find(l => l.id === employee.currentLevel)?.title.split(' → ')[1]}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">目标：{promotionLevels.find(l => l.id === employee.nextLevel)?.title.split(' → ')[1]}</p>
                </div>
              </div>

              {/* 进度条 */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-medium text-gray-700">晋升进度</p>
                  <p className="text-sm font-bold text-gray-900">{employee.progress}%</p>
                </div>
                {renderProgressBar(employee.progress)}
              </div>

              {/* 硬性条件检查 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">硬性条件</p>
                <div className="space-y-2">
                  {employee.hardConditionsMet.map((met, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        met ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {met ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <span className={`text-sm ${met ? 'text-gray-900 font-medium' : 'text-gray-600'}`}>
                        条件 {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 考核指标 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">考核指标</p>
                <div className="space-y-2">
                  {employee.assessmentMetrics.map((metric, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{metric.metric}</p>
                        <p className="text-xs text-gray-600">目标：{metric.target}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{metric.current}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          metric.status === 'completed' ? 'bg-green-100 text-green-800' :
                          metric.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {metric.status === 'completed' ? '已完成' : 
                           metric.status === 'in-progress' ? '进行中' : 
                           '未开始'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 最后评估日期 */}
              <div className="flex justify-between text-xs text-gray-600 pt-4 border-t border-gray-200">
                <span>最后评估：{employee.lastAssessment}</span>
                <span>下次评估：{employee.nextAssessmentDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};






