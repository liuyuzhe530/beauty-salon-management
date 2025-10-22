import React, { useState } from 'react';
import { BookOpen, Play, Users, MessageSquare, Award, TrendingUp, Search, Clock, CheckCircle, BarChart3, Video, FileText, Brain, Heart, Share2, Send, Filter, Star, Download, Bookmark } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  image: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  students: number;
  rating: number;
  progress?: number;
  lessons?: number;
}

interface LiveClass {
  id: string;
  title: string;
  instructor: string;
  startTime: string;
  duration: string;
  students: number;
  status: 'upcoming' | 'live' | 'ended';
  topic: string;
  image: string;
  description?: string;
  capacity?: number;
  tags?: string[];
  avgRating?: number;
  reviews?: number;
}

interface AITutor {
  id: string;
  name: string;
  specialty: string;
  availability: string;
  rating: number;
  responseTime: string;
  avatar: string;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  progress: number;
  completed: number;
  difficulty: string;
}

interface LiveComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  avatar: string;
}

export const TrainingEducation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learning' | 'live' | 'tutor' | 'progress' | 'resources'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLiveClass, setSelectedLiveClass] = useState<LiveClass | null>(null);
  const [liveViewMode, setLiveViewMode] = useState<'detail' | 'list'>('list');
  const [filterStatus, setFilterStatus] = useState<'all' | 'live' | 'upcoming' | 'ended'>('all');
  const [commentText, setCommentText] = useState('');
  const [showPlayback, setShowPlayback] = useState(false);

  const courses: Course[] = [
    {
      id: 'c1',
      title: '美容师专业培训初级班',
      description: '学习基础美容知识、操作技能和客户服务',
      category: '基础培训',
      instructor: '王美容师',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      level: 'beginner',
      duration: '4周',
      students: 328,
      rating: 4.8,
      progress: 65,
      lessons: 24
    },
    {
      id: 'c2',
      title: '高级护肤技术精修班',
      description: '深入学习各类护肤品使用、皮肤诊断和定制方案',
      category: '专业技能',
      instructor: '李专家',
      image: 'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=300&h=200&fit=crop',
      level: 'advanced',
      duration: '8周',
      students: 156,
      rating: 4.9,
      progress: 30,
      lessons: 40
    },
    {
      id: 'c3',
      title: '客户服务与销售技巧',
      description: '掌握沟通技巧、客户心理学和销售方法',
      category: '管理培训',
      instructor: '张讲师',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=300&h=200&fit=crop',
      level: 'intermediate',
      duration: '3周',
      students: 412,
      rating: 4.7,
      progress: 45,
      lessons: 18
    },
    {
      id: 'c4',
      title: '美容院经营管理实战',
      description: '团队管理、成本控制、营销策略等综合管理',
      category: '经营管理',
      instructor: '陈经理',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop',
      level: 'advanced',
      duration: '6周',
      students: 89,
      rating: 4.6,
      progress: 0,
      lessons: 32
    },
    {
      id: 'c5',
      title: '化妆品知识与产品推荐',
      description: '了解产品成分、功效，学会推荐合适产品',
      category: '产品知识',
      instructor: '刘讲师',
      image: 'https://images.unsplash.com/photo-1607346256330-dee4af15f7cb?w=300&h=200&fit=crop',
      level: 'beginner',
      duration: '2周',
      students: 567,
      rating: 4.8,
      progress: 80,
      lessons: 14
    },
    {
      id: 'c6',
      title: '新型美容仪器操作指南',
      description: '学习最新仪器设备的原理、操作和维护',
      category: '技术装备',
      instructor: '王工程师',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=300&h=200&fit=crop',
      level: 'intermediate',
      duration: '3周',
      students: 234,
      rating: 4.7,
      progress: 50,
      lessons: 16
    }
  ];

  const liveClasses: LiveClass[] = [
    {
      id: 'live1',
      title: '今日直播：秋季护肤方案设计',
      instructor: '王美容师',
      startTime: '2025-10-22 19:00',
      duration: '1.5小时',
      students: 245,
      status: 'live',
      topic: '季节护肤',
      image: 'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=400&h=300&fit=crop',
      description: '针对秋季皮肤特点，设计个性化护肤方案。讲师将分享最新的护肤理念和技巧。',
      capacity: 500,
      tags: ['护肤', '季节护理', '实战技巧'],
      avgRating: 4.8,
      reviews: 28
    },
    {
      id: 'live2',
      title: '明日直播：如何提升客户满意度',
      instructor: '张讲师',
      startTime: '2025-10-23 14:00',
      duration: '1小时',
      students: 156,
      status: 'upcoming',
      topic: '客户服务',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=400&h=300&fit=crop',
      description: '通过实际案例分析，教你如何有效提升客户满意度和复购率。',
      capacity: 300,
      tags: ['客户服务', '满意度', '销售技巧'],
      avgRating: 4.6,
      reviews: 15
    },
    {
      id: 'live3',
      title: '本周回放：美容仪器使用技巧',
      instructor: '王工程师',
      startTime: '2025-10-21 18:00',
      duration: '1.5小时',
      students: 89,
      status: 'ended',
      topic: '仪器培训',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop',
      description: '详细讲解新型美容仪器的操作方法、维护技巧和故障排除。',
      capacity: 400,
      tags: ['仪器操作', '技术培训', '维护'],
      avgRating: 4.7,
      reviews: 32
    },
    {
      id: 'live4',
      title: '化妆品成分解读专场',
      instructor: '刘讲师',
      startTime: '2025-10-24 15:00',
      duration: '1小时',
      students: 178,
      status: 'upcoming',
      topic: '产品知识',
      image: 'https://images.unsplash.com/photo-1607346256330-dee4af15f7cb?w=400&h=300&fit=crop',
      description: '深入解读化妆品成分，帮助你更好地推荐产品给客户。',
      capacity: 350,
      tags: ['产品知识', '成分分析', '推荐技巧'],
      avgRating: 4.9,
      reviews: 24
    }
  ];

  const aiTutors: AITutor[] = [
    {
      id: 'tutor1',
      name: '美容知识AI导师',
      specialty: '皮肤护理、产品知识',
      availability: '24/7全天在线',
      rating: 4.9,
      responseTime: '即时',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
    },
    {
      id: 'tutor2',
      name: '销售技巧AI导师',
      specialty: '客户沟通、销售方法',
      availability: '工作时间9:00-18:00',
      rating: 4.7,
      responseTime: '5分钟内',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop'
    },
    {
      id: 'tutor3',
      name: '经营管理AI导师',
      specialty: '成本控制、团队管理',
      availability: '工作时间',
      rating: 4.8,
      responseTime: '10分钟内',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop'
    }
  ];

  const learningPaths: LearningPath[] = [
    {
      id: 'path1',
      name: '美容师成长路径',
      description: '从初级美容师到高级讲师的完整学习计划',
      courses: ['c1', 'c3', 'c5', 'c2'],
      progress: 65,
      completed: 2,
      difficulty: '中等'
    },
    {
      id: 'path2',
      name: '店铺经营者路径',
      description: '学习经营管理和营销策略',
      courses: ['c4', 'c3'],
      progress: 30,
      completed: 0,
      difficulty: '高'
    }
  ];

  const liveComments: LiveComment[] = [
    {
      id: 'c1',
      author: '小美',
      content: '讲得太好了！学到了很多护肤知识',
      timestamp: '2分钟前',
      likes: 12,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop'
    },
    {
      id: 'c2',
      author: '张老师',
      content: '感谢分享，这个方法我会尝试',
      timestamp: '5分钟前',
      likes: 8,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop'
    },
    {
      id: 'c3',
      author: '李美',
      content: '有没有专门针对油性皮肤的方案？',
      timestamp: '10分钟前',
      likes: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop'
    }
  ];

  const filteredCourses = courses.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLiveClasses = liveClasses.filter(lc => {
    if (filterStatus === 'all') return true;
    return lc.status === filterStatus;
  });

  // 学习管理页面
  if (activeTab === 'learning') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
          <h2 className="text-2xl font-bold text-blue-900">在线课程学习</h2>
          <p className="text-gray-600 mt-1">选择课程开始学习，提升专业技能</p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex gap-3 items-center">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索课程..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {['全部', '基础培训', '专业技能', '管理培训', '产品知识'].map(cat => (
              <button
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  cat === '全部'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 课程卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map(course => (
            <div key={course.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <img src={course.image} alt={course.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900 line-clamp-2 flex-1">{course.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${
                    course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                    course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {course.level === 'beginner' ? '入门' : course.level === 'intermediate' ? '进阶' : '高级'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-2">{course.description}</p>

                <div className="space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>讲师：{course.instructor}</span>
                    <span>{course.duration}</span>
                  </div>
                  {course.progress !== undefined && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">{course.students} 人学习</span>
                    <span className="text-yellow-500">⭐ {course.rating}</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedCourse(course)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  {course.progress === 0 ? '开始学习' : '继续学习'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 课程详情模态框 */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <button onClick={() => setSelectedCourse(null)} className="text-gray-600 hover:text-gray-900">✕</button>
              </div>

              <div className="space-y-4">
                <img src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-48 object-cover rounded-lg" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedCourse.lessons}</p>
                    <p className="text-sm text-gray-600">课程数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedCourse.duration}</p>
                    <p className="text-sm text-gray-600">学习周期</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{selectedCourse.students}</p>
                    <p className="text-sm text-gray-600">学员数</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-500">⭐{selectedCourse.rating}</p>
                    <p className="text-sm text-gray-600">评分</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-2">课程描述</h3>
                  <p className="text-gray-700">{selectedCourse.description}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    <Play className="w-4 h-4 inline mr-2" />
                    开始学习
                  </button>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 直播课程详情页面
  if (activeTab === 'live' && selectedLiveClass && liveViewMode === 'detail') {
    return (
      <div className="space-y-6">
        <button
          onClick={() => {
            setLiveViewMode('list');
            setSelectedLiveClass(null);
          }}
          className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
        >
          ← 返回直播列表
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 主视频区 */}
          <div className="lg:col-span-2 space-y-4">
            {/* 视频播放器 */}
            <div className="bg-black rounded-lg overflow-hidden aspect-video flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
                <Video className="w-16 h-16 text-gray-600" />
              </div>
              {selectedLiveClass.status === 'live' && (
                <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  直播中
                </div>
              )}
              {selectedLiveClass.status === 'ended' && (
                <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  已结束 - 回放
                </div>
              )}
            </div>

            {/* 课程信息 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedLiveClass.title}</h1>
                  <p className="text-gray-600 mb-4">{selectedLiveClass.description}</p>
                </div>
                <button className="text-gray-400 hover:text-red-600">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">讲师</p>
                  <p className="font-bold text-gray-900">{selectedLiveClass.instructor}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">参加人数</p>
                  <p className="font-bold text-gray-900">{selectedLiveClass.students}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">容量</p>
                  <p className="font-bold text-gray-900">{selectedLiveClass.capacity}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">时长</p>
                  <p className="font-bold text-gray-900">{selectedLiveClass.duration}</p>
                </div>
              </div>

              {/* 标签 */}
              {selectedLiveClass.tags && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">课程标签</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLiveClass.tags.map(tag => (
                      <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 操作按钮 */}
              <div className="flex gap-2 flex-wrap">
                <button className={`px-6 py-2 rounded-lg font-medium flex items-center gap-2 ${
                  selectedLiveClass.status === 'live'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}>
                  <Video className="w-4 h-4" />
                  {selectedLiveClass.status === 'live' ? '进入直播间' : selectedLiveClass.status === 'upcoming' ? '预约提醒' : '查看回放'}
                </button>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2">
                  <Share2 className="w-4 h-4" />
                  分享
                </button>
                <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center gap-2">
                  <Bookmark className="w-4 h-4" />
                  收藏
                </button>
              </div>
            </div>

            {/* 课程评价 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 text-lg">课程评价</h3>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-bold text-gray-900">{selectedLiveClass.avgRating}</span>
                  <span className="text-sm text-gray-600">({selectedLiveClass.reviews} 条评价)</span>
                </div>
              </div>

              {/* 评价列表示例 */}
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="pb-4 border-b border-gray-200 last:border-b-0">
                    <div className="flex items-start gap-3 mb-2">
                      <img src={`https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop`} alt="用户" className="w-8 h-8 rounded-full" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">用户{i}</p>
                        <div className="flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map(j => (
                            <Star key={j} className="w-3 h-3 text-yellow-500 fill-current" />
                          ))}
                          <span className="text-xs text-gray-600">{i} 天前</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">非常专业的讲解，学到了很多实用的知识！</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧互动区 */}
          <div className="space-y-4">
            {/* 直播间互动（如果直播中） */}
            {selectedLiveClass.status === 'live' && (
              <>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    直播评论 ({liveComments.length})
                  </h3>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                    {liveComments.map(comment => (
                      <div key={comment.id} className="flex gap-2">
                        <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm text-gray-900">{comment.author}</p>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                          <button className="text-xs text-gray-500 hover:text-red-600 mt-1 flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {comment.likes}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 评论输入框 */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="说点什么..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 在线人数和互动统计 */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4">
                  <p className="text-sm text-blue-700 mb-3">直播互动数据</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">👁️ 观看人数</span>
                      <span className="font-bold text-gray-900">{selectedLiveClass.students}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">💬 评论数</span>
                      <span className="font-bold text-gray-900">{liveComments.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">❤️ 点赞总数</span>
                      <span className="font-bold text-gray-900">{liveComments.reduce((sum, c) => sum + c.likes, 0)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* 回放信息（如果已结束） */}
            {selectedLiveClass.status === 'ended' && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-bold text-gray-900 mb-3">录播回放</h3>
                <button
                  onClick={() => setShowPlayback(!showPlayback)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2 mb-3"
                >
                  <Play className="w-4 h-4" />
                  观看完整回放
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  下载课程资料
                </button>
              </div>
            )}

            {/* 推荐课程 */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">推荐课程</h3>
              <div className="space-y-2">
                {filteredLiveClasses.filter(lc => lc.id !== selectedLiveClass.id).slice(0, 3).map(liveClass => (
                  <div key={liveClass.id} className="p-2 border border-gray-200 rounded hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{liveClass.title}</p>
                    <p className="text-xs text-gray-600 mt-1">{liveClass.instructor}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 直播课程列表页面
  if (activeTab === 'live') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg border border-red-200 p-6">
          <h2 className="text-2xl font-bold text-red-900">直播课堂</h2>
          <p className="text-gray-600 mt-1">实时互动学习，与讲师在线交流 | 共 {liveClasses.length} 门直播课程</p>
        </div>

        {/* 筛选和搜索 */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex gap-3 items-center">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索直播课程..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <Filter className="w-4 h-4 text-gray-600" />
            {['all', 'live', 'upcoming', 'ended'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status as any)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? '全部' : status === 'live' ? '直播中' : status === 'upcoming' ? '即将开始' : '已结束'}
              </button>
            ))}
          </div>
        </div>

        {/* 直播课程卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLiveClasses.map(liveClass => (
            <div key={liveClass.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={liveClass.image} alt={liveClass.title} className="w-full h-40 object-cover" />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium text-white ${
                  liveClass.status === 'live' ? 'bg-red-600' :
                  liveClass.status === 'upcoming' ? 'bg-blue-600' :
                  'bg-gray-600'
                }`}>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${liveClass.status === 'live' ? 'bg-white animate-pulse' : 'bg-white'}`} />
                    {liveClass.status === 'live' ? '直播中' : liveClass.status === 'upcoming' ? '即将开始' : '已结束'}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{liveClass.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{liveClass.description}</p>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    讲师：{liveClass.instructor}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {liveClass.startTime} | {liveClass.duration}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {liveClass.students} / {liveClass.capacity} 人
                    </div>
                    {liveClass.avgRating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{liveClass.avgRating}</span>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLiveClass(liveClass);
                    setLiveViewMode('detail');
                  }}
                  className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center gap-2 ${
                    liveClass.status === 'live'
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : liveClass.status === 'upcoming'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}>
                  <Video className="w-4 h-4" />
                  {liveClass.status === 'live' ? '进入直播间' : liveClass.status === 'upcoming' ? '预约提醒' : '查看回放'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // AI导师页面
  if (activeTab === 'tutor') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6">
          <h2 className="text-2xl font-bold text-purple-900">AI导师助学</h2>
          <p className="text-gray-600 mt-1">24/7智能答疑，个性化学习指导</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {aiTutors.map(tutor => (
            <div key={tutor.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <img src={tutor.avatar} alt={tutor.name} className="w-16 h-16 rounded-full object-cover" />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{tutor.name}</h3>
                    <p className="text-sm text-gray-600">{tutor.specialty}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">评分</span>
                    <span className="font-medium text-yellow-500">⭐ {tutor.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">可用性</span>
                    <span className="font-medium text-green-600">{tutor.availability}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">响应时间</span>
                    <span className="font-medium text-blue-600">{tutor.responseTime}</span>
                  </div>
                </div>

                <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  开始对话
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 常见问题 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">常见问题速查</h3>
          <div className="space-y-3">
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium text-gray-900">如何选择合适的护肤方案？</p>
              <p className="text-sm text-gray-600 mt-1">根据客户皮肤类型分析...</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium text-gray-900">怎样提高客户复购率？</p>
              <p className="text-sm text-gray-600 mt-1">建立客户档案，制定跟进计划...</p>
            </div>
            <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
              <p className="font-medium text-gray-900">新仪器怎样快速上手？</p>
              <p className="text-sm text-gray-600 mt-1">观看操作视频，参加实训课程...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 学习进度页面
  if (activeTab === 'progress') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 p-6">
          <h2 className="text-2xl font-bold text-green-900">学习进度追踪</h2>
          <p className="text-gray-600 mt-1">查看学习统计和成就徽章</p>
        </div>

        {/* 学习统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">已完成课程</p>
                <p className="text-3xl font-bold text-green-600 mt-1">5</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">学习时间</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">48小时</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">获得徽章</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">12</p>
              </div>
              <Award className="w-8 h-8 text-purple-600 opacity-20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">学习排名</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">#8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* 学习路径进度 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">学习路径进度</h3>
          <div className="space-y-4">
            {learningPaths.map(path => (
              <div key={path.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{path.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{path.description}</p>
                  </div>
                  <span className="text-sm font-medium bg-blue-100 text-blue-700 px-3 py-1 rounded">{path.difficulty}难度</span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">进度：{path.completed} / {path.courses.length} 完成</span>
                    <span className="font-medium text-blue-600">{path.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${path.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 成就徽章 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">成就徽章</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: '初学者', icon: '🎓' },
              { name: '知识精英', icon: '🧠' },
              { name: '连胜7天', icon: '🔥' },
              { name: '课程完成者', icon: '🏆' },
              { name: '答题高手', icon: '⚡' },
              { name: '学霸', icon: '👑' }
            ].map(badge => (
              <div key={badge.name} className="text-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <p className="text-3xl mb-1">{badge.icon}</p>
                <p className="text-xs font-medium text-gray-700">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 学习资源页面
  if (activeTab === 'resources') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border border-yellow-200 p-6">
          <h2 className="text-2xl font-bold text-yellow-900">学习资源库</h2>
          <p className="text-gray-600 mt-1">下载教材、资料和工具</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 电子教材 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="font-bold text-gray-900">电子教材</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">美容基础理论完全手册</span>
                <span className="text-xs text-gray-600">2.5MB</span>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">产品知识速查表</span>
                <span className="text-xs text-gray-600">1.2MB</span>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">销售技巧实战指南</span>
                <span className="text-xs text-gray-600">3.1MB</span>
              </div>
            </div>
          </div>

          {/* 视频教程 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Video className="w-6 h-6 text-red-600" />
              <h3 className="font-bold text-gray-900">视频教程</h3>
            </div>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">基础护肤手法演示</span>
                <span className="text-xs text-gray-600">45分钟</span>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">仪器操作完全指南</span>
                <span className="text-xs text-gray-600">2小时</span>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer flex items-center justify-between">
                <span className="text-sm font-medium">客户沟通技巧分享</span>
                <span className="text-xs text-gray-600">35分钟</span>
              </div>
            </div>
          </div>
        </div>

        {/* 工具模板 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">工具和模板</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-center">
              <p className="text-2xl mb-2">📋</p>
              <p className="font-medium text-sm mb-2">客户档案模板</p>
              <button className="text-xs text-blue-600 hover:text-blue-700">下载</button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-center">
              <p className="text-2xl mb-2">📊</p>
              <p className="font-medium text-sm mb-2">销售报表模板</p>
              <button className="text-xs text-blue-600 hover:text-blue-700">下载</button>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer text-center">
              <p className="text-2xl mb-2">📅</p>
              <p className="font-medium text-sm mb-2">员工培训计划表</p>
              <button className="text-xs text-blue-600 hover:text-blue-700">下载</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 主页面
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
        <h1 className="text-4xl font-bold mb-2">培训教育中心</h1>
        <p className="text-lg opacity-90">专业培训 • 直播互动 • AI导师 • 实时反馈</p>
      </div>

      {/* 导航标签 */}
      <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
        {([
          { key: 'learning', label: '📚 在线课程', icon: BookOpen },
          { key: 'live', label: '🔴 直播课堂', icon: Video },
          { key: 'tutor', label: '🤖 AI导师', icon: Brain },
          { key: 'progress', label: '📊 学习进度', icon: BarChart3 },
          { key: 'resources', label: '📁 学习资源', icon: FileText }
        ] as const).map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-4">
          <p className="text-sm text-blue-700 mb-1">总课程数</p>
          <p className="text-3xl font-bold text-blue-600">18</p>
          <p className="text-xs text-blue-600 mt-2">涵盖6大类别</p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 p-4">
          <p className="text-sm text-red-700 mb-1">直播课程</p>
          <p className="text-3xl font-bold text-red-600">{liveClasses.length}</p>
          <p className="text-xs text-red-600 mt-2">本周开课</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-4">
          <p className="text-sm text-purple-700 mb-1">AI导师</p>
          <p className="text-3xl font-bold text-purple-600">3</p>
          <p className="text-xs text-purple-600 mt-2">24/7在线</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200 p-4">
          <p className="text-sm text-green-700 mb-1">我的进度</p>
          <p className="text-3xl font-bold text-green-600">65%</p>
          <p className="text-xs text-green-600 mt-2">已完成5门课</p>
        </div>
      </div>

      {/* 快速入门 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">🚀 快速入门</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setActiveTab('learning')}
            className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-left"
          >
            <p className="font-bold text-blue-600 mb-1">选择课程开始学习</p>
            <p className="text-sm text-gray-600">浏览18门专业课程，选择适合你的</p>
          </button>
          <button
            onClick={() => setActiveTab('live')}
            className="p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-left"
          >
            <p className="font-bold text-red-600 mb-1">加入直播互动</p>
            <p className="text-sm text-gray-600">实时与讲师交流，解答疑惑</p>
          </button>
          <button
            onClick={() => setActiveTab('tutor')}
            className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-left"
          >
            <p className="font-bold text-purple-600 mb-1">咨询AI导师</p>
            <p className="text-sm text-gray-600">即时答疑，获得个性化建议</p>
          </button>
        </div>
      </div>
    </div>
  );
};
