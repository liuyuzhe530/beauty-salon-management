import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2, Maximize2, Lightbulb, TrendingUp, AlertCircle, Users, Package, CheckCircle, Sparkles } from 'lucide-react';
import { MarketingAssistant } from './MarketingAssistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  recommendation?: Recommendation;
}

interface Recommendation {
  id: string;
  type: 'appointment' | 'service' | 'product' | 'customer' | 'staff';
  title: string;
  description: string;
  impact: string;
  action: string;
  icon: React.ReactNode;
  color: string;
}

export const FloatingAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '你好！我是美容院AI助手。我可以帮助你分析销售数据、推荐产品、管理预约等。有什么我可以帮助的吗？',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'recommendations' | 'marketing'>('chat');
  const [buttonPos, setButtonPos] = useState({ x: 0, y: 0 });
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [isDraggingButton, setIsDraggingButton] = useState(false);
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const aiRecommendations: Recommendation[] = [
    {
      id: '1',
      type: 'customer',
      title: '风险客户预警',
      description: '有3位客户最近30天无访问记录',
      impact: '可能流失约12,000元年收入',
      action: '立即关怀',
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'bg-red-50 border-red-200'
    },
    {
      id: '2',
      type: 'product',
      title: '库存优化建议',
      description: '精油护肤套装库存仅剩68件',
      impact: '畅销品，建议立即补货',
      action: '查看详情',
      icon: <Package className="w-5 h-5" />,
      color: 'bg-yellow-50 border-yellow-200'
    },
    {
      id: '3',
      type: 'staff',
      title: '美容师评分提升',
      description: '李美娟表现突出，建议提拔为主管',
      impact: '团队士气提升，服务质量保证',
      action: '查看详情',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-blue-50 border-blue-200'
    },
    {
      id: '4',
      type: 'service',
      title: '销售机会',
      description: '美甲、美睫服务同比下降8%',
      impact: '建议推出优惠套餐刺激消费',
      action: '制定方案',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'bg-green-50 border-green-200'
    },
    {
      id: '5',
      type: 'appointment',
      title: '预约优化',
      description: '下午14:00-16:00为高峰期',
      impact: '建议提前2天开放该时段预约',
      action: '优化设置',
      icon: <CheckCircle className="w-5 h-5" />,
      color: 'bg-purple-50 border-purple-200'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const response = generateAIResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
        recommendation: response.rec
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const generateAIResponse = (input: string) => {
    const lower = input.toLowerCase();
    if (lower.includes('销售')) {
      return { text: '根据最近的数据分析，您的销售额环比增长了15%。护肤品类目表现最好，占总销售的42%。建议继续加强该类目的推广。', rec: aiRecommendations[3] };
    } else if (lower.includes('产品')) {
      return { text: '目前库存预警产品有3个。建议尽快补货高销售产品。精油护肤套装库存较低，已是畅销品，建议增加订单量。', rec: aiRecommendations[1] };
    } else if (lower.includes('预约')) {
      return { text: '今天有8个确认预约，2个待确认。峰值时段在下午14:00-16:00。建议在该时段安排经验丰富的美容师。', rec: aiRecommendations[4] };
    } else if (lower.includes('美容师')) {
      return { text: '李美娟是目前评分最高的美容师（4.9分）。建议让她主要负责高价值客户的服务。', rec: aiRecommendations[2] };
    } else if (lower.includes('客户')) {
      return { text: '活跃客户共85人，其中高价值客户18人。最近有3个客户处于风险状态，建议主动联系进行关怀。', rec: aiRecommendations[0] };
    }
    return { text: '感谢您的提问。您可以询问关于销售、产品、预约、美容师或客户的相关信息。' };
  };

  // 按钮拖拽
  const handleButtonMouseDown = (e: React.MouseEvent) => {
    setIsDraggingButton(true);
    setDragStart({ x: e.clientX - buttonPos.x, y: e.clientY - buttonPos.y });
  };

  // 窗口拖拽
  const handleWindowMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    setIsDraggingWindow(true);
    setDragStart({ x: e.clientX - windowPos.x, y: e.clientY - windowPos.y });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingButton) {
        setButtonPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
      if (isDraggingWindow) {
        setWindowPos({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
      }
    };

    const handleMouseUp = () => {
      setIsDraggingButton(false);
      setIsDraggingWindow(false);
    };

    if (isDraggingButton || isDraggingWindow) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDraggingButton, isDraggingWindow, dragStart]);

  return (
    <>
      {!isOpen && (
        <div
          ref={buttonRef}
          style={{ transform: `translate(${buttonPos.x}px, ${buttonPos.y}px)` }}
          className="fixed bottom-8 right-8 z-40"
          onMouseDown={handleButtonMouseDown}
        >
          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center cursor-grab active:cursor-grabbing"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          ref={windowRef}
          style={{ transform: `translate(${windowPos.x}px, ${windowPos.y}px)` }}
          className={`fixed z-50 ${isMinimized ? 'w-80 h-14' : 'w-96 h-[650px]'}`}
        >
          <div className="w-full h-full bg-white rounded-lg shadow-2xl border border-green-200 flex flex-col overflow-hidden">
            <div
              onMouseDown={handleWindowMouseDown}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 flex items-center justify-between flex-shrink-0 cursor-grab active:cursor-grabbing"
            >
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">AI助手</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="hover:bg-green-600 p-1 rounded transition-colors"
                >
                  {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-green-600 p-1 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                <div className="flex gap-1 px-3 py-2 bg-gray-100 border-b border-gray-200 overflow-x-auto">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap ${
                      activeTab === 'chat'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'bg-transparent text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    对话
                  </button>
                  <button
                    onClick={() => setActiveTab('recommendations')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'recommendations'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'bg-transparent text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <Lightbulb className="w-3 h-3" />
                    建议
                  </button>
                  <button
                    onClick={() => setActiveTab('marketing')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                      activeTab === 'marketing'
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'bg-transparent text-gray-700 hover:bg-white/50'
                    }`}
                  >
                    <Sparkles className="w-3 h-3" />
                    营销
                  </button>
                </div>

                {activeTab === 'chat' ? (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messages.map(msg => (
                        <div key={msg.id}>
                          <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${msg.role === 'user' ? 'bg-green-500 text-white' : 'bg-white border border-green-200 text-gray-900'}`}>
                              <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                              <span className="text-xs opacity-70 mt-1 block">{msg.timestamp.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          {msg.recommendation && msg.role === 'assistant' && (
                            <div className={`mt-2 p-3 rounded-lg border ${msg.recommendation.color}`}>
                              <div className="flex items-start gap-2">
                                <div className="text-green-600">{msg.recommendation.icon}</div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900 text-sm">{msg.recommendation.title}</p>
                                  <p className="text-xs text-gray-600 mt-1">{msg.recommendation.description}</p>
                                  <p className="text-xs text-orange-600 mt-1">💡 {msg.recommendation.impact}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-white border border-green-200 px-3 py-2 rounded-lg flex gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                    <div className="border-t border-green-200 p-3 bg-white flex gap-2 flex-shrink-0">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder="输入您的问题..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        disabled={isLoading}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={isLoading || !input.trim()}
                        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                ) : activeTab === 'recommendations' ? (
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                    {aiRecommendations.map(rec => (
                      <div key={rec.id} className={`p-3 rounded-lg border ${rec.color}`}>
                        <div className="flex items-start gap-2">
                          <div className="text-green-600">{rec.icon}</div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{rec.title}</p>
                            <p className="text-xs text-gray-600 mt-1">{rec.description}</p>
                            <p className="text-xs text-orange-600 mt-1">💡 {rec.impact}</p>
                            <button className="mt-2 px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                              {rec.action}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <MarketingAssistant />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
