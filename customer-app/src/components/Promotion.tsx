import React, { useState } from 'react';
import { BookOpen, Video, Play, Award, TrendingUp, Calendar, Users } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  level: string;
  duration: string;
  progress: number;
  instructor: string;
  status: 'completed' | 'in-progress' | 'not-started';
}

interface LiveSession {
  id: string;
  title: string;
  instructor: string;
  time: string;
  viewers: number;
  status: 'live' | 'upcoming' | 'ended';
}

interface BeautycianPromotion {
  id: string;
  name: string;
  current: string;
  nextLevel: string;
  completedCourses: number;
  totalRequired: number;
  score: number;
  evaluationDate: string;
  status: 'ready' | 'in-progress' | 'pending';
}

export const Promotion: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'live' | 'promotion'>('courses');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const courses: Course[] = [
    {
      id: '1',
      title: '高端护肤管理体系',
      level: '初级',
      duration: '4周',
      progress: 100,
      instructor: '李国庆',
      status: 'completed'
    },
    {
      id: '2',
      title: '皮肤问题诊断与解决',
      level: '中级',
      duration: '6周',
      progress: 75,
      instructor: '王美艺',
      status: 'in-progress'
    },
    {
      id: '3',
      title: '高端客户管理艺术',
      level: '中级',
      duration: '4周',
      progress: 45,
      instructor: '陈思语',
      status: 'in-progress'
    },
    {
      id: '4',
      title: '美容师晋升成功秘诀',
      level: '高级',
      duration: '8周',
      progress: 0,
      instructor: '张琳琳',
      status: 'not-started'
    },
    {
      id: '5',
      title: 'SPA疗程深度培训',
      level: '高级',
      duration: '6周',
      progress: 0,
      instructor: '刘心怡',
      status: 'not-started'
    }
  ];

  const liveSessions: LiveSession[] = [
    {
      id: '1',
      title: '周末特训：高端客户维护技巧',
      instructor: '李美娟',
      time: '本周六 19:00',
      viewers: 128,
      status: 'upcoming'
    },
    {
      id: '2',
      title: '直播课程：护肤品推荐技巧',
      instructor: '王雨晴',
      time: '今晚 20:00',
      viewers: 245,
      status: 'live'
    },
    {
      id: '3',
      title: '复盘：本月业绩分析与优化',
      instructor: '郑可欣',
      time: '昨天 18:00',
      viewers: 87,
      status: 'ended'
    }
  ];

  const beauticians: BeautycianPromotion[] = [
    {
      id: '1',
      name: '李美娟',
      current: '高级美容师',
      nextLevel: '美容院总监',
      completedCourses: 12,
      totalRequired: 15,
      score: 92,
      evaluationDate: '2025-11-15',
      status: 'in-progress'
    },
    {
      id: '2',
      name: '王雨晴',
      current: '中级美容师',
      nextLevel: '高级美容师',
      completedCourses: 8,
      totalRequired: 10,
      score: 88,
      evaluationDate: '2025-11-20',
      status: 'in-progress'
    },
    {
      id: '3',
      name: '张琳琳',
      current: '初级美容师',
      nextLevel: '中级美容师',
      completedCourses: 5,
      totalRequired: 8,
      score: 85,
      evaluationDate: '2025-12-01',
      status: 'pending'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-900">美容师晋升管理</h1>
          <p className="text-green-600 mt-1">专业发展与培训平台</p>
        </div>
        <div className="px-4 py-2 bg-gradient-to-r from-green-100 to-green-50 border border-green-300 rounded-lg flex items-center gap-2">
          <Award className="w-5 h-5 text-green-700" />
          <span className="text-sm font-medium text-green-900">3位在晋升中</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-green-200">
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          课程培训
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'live'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <Video className="w-4 h-4" />
          直播学习
        </button>
        <button
          onClick={() => setActiveTab('promotion')}
          className={`px-4 py-2 font-medium transition-colors flex items-center gap-2 ${
            activeTab === 'promotion'
              ? 'border-b-2 border-green-500 text-green-600'
              : 'text-gray-600 hover:text-green-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          晋升管理
        </button>
      </div>

      {/* Content */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          {courses.map(course => (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(selectedCourse === course.id ? null : course.id)}
              className="bg-white rounded-lg border border-green-200 p-6 hover:shadow-md transition-all cursor-pointer card-green"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <p className="text-sm text-gray-600">讲师：{course.instructor}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                    course.status === 'completed' ? 'bg-green-100 text-green-700' :
                    course.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {course.status === 'completed' ? '已完成' : course.status === 'in-progress' ? '进行中' : '未开始'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{course.level}</span> • <span>{course.duration}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">学习进度</span>
                  <span className="text-sm font-medium text-green-600">{course.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${course.progress}%` }}
                  />
                </div>
              </div>

              {selectedCourse === course.id && (
                <div className="pt-4 border-t border-green-200">
                  <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2">
                    <Play className="w-4 h-4" />
                    继续学习
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'live' && (
        <div className="space-y-4">
          {liveSessions.map(session => (
            <div key={session.id} className="bg-white rounded-lg border border-green-200 p-6 card-green">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      session.status === 'live' ? 'bg-red-100' :
                      session.status === 'upcoming' ? 'bg-yellow-100' :
                      'bg-gray-100'
                    }`}>
                      <Video className={`w-6 h-6 ${
                        session.status === 'live' ? 'text-red-600' :
                        session.status === 'upcoming' ? 'text-yellow-600' :
                        'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">讲师：{session.instructor}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {session.status === 'live' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full animate-pulse">
                      <span className="w-2 h-2 bg-red-700 rounded-full"></span>
                      直播中
                    </span>
                  )}
                  {session.status === 'upcoming' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                      <Calendar className="w-3 h-3" />
                      即将开始
                    </span>
                  )}
                  {session.status === 'ended' && (
                    <span className="text-xs text-gray-600 font-medium">已结束</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">{session.time}</div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>{session.viewers} 人观看</span>
                </div>
              </div>

              {session.status === 'live' && (
                <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center gap-2">
                  <Play className="w-4 h-4" />
                  进入直播间
                </button>
              )}

              {session.status === 'upcoming' && (
                <button className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  提前预约
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'promotion' && (
        <div className="space-y-4">
          {beauticians.map(beautician => (
            <div key={beautician.id} className="bg-white rounded-lg border border-green-200 p-6 card-green">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{beautician.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {beautician.current} → {beautician.nextLevel}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{beautician.score}</div>
                  <div className="text-xs text-gray-500">评估成绩</div>
                </div>
              </div>

              {/* Course Progress */}
              <div className="mb-4 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900">课程完成进度</span>
                  <span className="text-sm font-medium text-green-600">{beautician.completedCourses}/{beautician.totalRequired}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${(beautician.completedCourses / beautician.totalRequired) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <span>评估日期：</span>
                  <span className="font-medium">{beautician.evaluationDate}</span>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                  beautician.status === 'ready' ? 'bg-green-100 text-green-700' :
                  beautician.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {beautician.status === 'ready' ? '准备评估' : beautician.status === 'in-progress' ? '晋升中' : '待开始'}
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="flex-1 px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-sm font-medium transition-colors">
                  查看计划
                </button>
                <button className="flex-1 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                  下次评估
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
