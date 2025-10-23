import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Loader, Zap } from 'lucide-react';
import aiService from '../services/aiService';
import { enhancedAIService } from '../services/enhancedAIService';
import { dataCollectorService } from '../services/dataCollectorService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '你好！我是美容院AI智能助手。我可以帮助您：\n\n1. 分析业务数据，发现机遇\n2. 优化员工排班和服务流程\n3. 识别高风险客户，制定留存策略\n4. 分析营销活动ROI\n5. 提供收入增长建议\n\n我现在可以访问您的系统数据，提供更智能的建议！',
    },
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [useEnhancedAI, setUseEnhancedAI] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 初始化增强 AI 数据
  useEffect(() => {
    const initializeEnhancedAI = async () => {
      try {
        const systemData = await dataCollectorService.collectAllData();
        enhancedAIService.setSystemData(systemData);
        setUseEnhancedAI(true);
      } catch (error) {
        console.error('初始化增强AI失败:', error);
        setUseEnhancedAI(false);
        // 启用演示模式
        try {
          enhancedAIService.setDemoMode(true);
          aiService.setDemoMode(true);
        } catch (e) {
          console.error('设置演示模式失败:', e);
        }
      }
    };

    if (isOpen) {
      initializeEnhancedAI();
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 优先使用增强 AI（有系统数据）
      let response;
      if (useEnhancedAI) {
        // 刷新系统数据
        const systemData = await dataCollectorService.collectAllData();
        enhancedAIService.setSystemData(systemData);
        response = await enhancedAIService.chat(input);
      } else {
        // 降级到普通 AI
        response = await aiService.chat(input);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `出错了: ${error.message}。\n\n请检查：\n1. 网络连接\n2. GLM API Key 是否正确\n3. 稍后重试`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSmartRecommendations = async () => {
    setIsLoading(true);
    const userMessage: Message = {
      role: 'user',
      content: '请根据当前系统数据，给我一份完整的智能建议报告',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      if (useEnhancedAI) {
        // 刷新系统数据
        const systemData = await dataCollectorService.collectAllData();
        enhancedAIService.setSystemData(systemData);
        const response = await enhancedAIService.getSmartRecommendations();

        const assistantMessage: Message = {
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('增强AI未初始化，使用基础AI');
      }
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `生成建议失败: ${error.message}。\n\n尝试中...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      
      // 降级到基础 AI
      try {
        const response = await aiService.chat('请根据当前系统数据，给我一份完整的智能建议报告');
        const fallbackMessage: Message = {
          role: 'assistant',
          content: response.content,
          timestamp: new Date(),
        };
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = fallbackMessage;
          return newMessages;
        });
      } catch (fallbackError: any) {
        console.error('基础AI也失败:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAction = async (action: string) => {
    setInput('');
    setIsLoading(true);

    let prompt = '';
    switch (action) {
      case 'risk':
        prompt = '请分析我的高风险客户情况，并提出具体的留存策略。';
        break;
      case 'schedule':
        prompt = '根据预约数据，请建议如何优化员工排班以提高效率？';
        break;
      case 'pricing':
        prompt = '根据销售数据，我应该如何调整服务定价来增加收入？';
        break;
      case 'marketing':
        prompt = '分析我的营销活动ROI，请建议下月的营销策略。';
        break;
      case 'smart':
        await handleSmartRecommendations();
        return;
      default:
        prompt = action;
    }

    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      let response;
      if (useEnhancedAI) {
        // 刷新系统数据
        const systemData = await dataCollectorService.collectAllData();
        enhancedAIService.setSystemData(systemData);
        response = await enhancedAIService.chat(prompt);
      } else {
        response = await aiService.chat(prompt);
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `错误: ${error.message}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 浮窗按钮 */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
          title="打开 AI 助手"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* 聊天窗口 */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col h-[600px] z-50">
          {/* 头部 */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 flex justify-between items-center rounded-t-xl">
            <div>
              <h3 className="font-bold text-lg">AI 助手</h3>
              <p className="text-xs opacity-90">
                {useEnhancedAI ? '数据驱动模式' : '标准模式'} (GLM-4.5-Flash)
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* 消息区域 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-lg whitespace-pre-wrap text-sm ${
                    msg.role === 'user'
                      ? 'bg-green-500 text-white rounded-br-none'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-3 rounded-lg border border-gray-200 rounded-bl-none flex items-center gap-2">
                  <Loader size={16} className="animate-spin" />
                  <span>AI 思考中...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 快速操作按钮 */}
          {messages.length <= 2 && (
            <div className="px-3 py-2 border-t bg-white">
              <div className="text-xs text-gray-600 mb-2">快速操作：</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleQuickAction('risk')}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition"
                  disabled={isLoading}
                >
                  流失分析
                </button>
                <button
                  onClick={() => handleQuickAction('schedule')}
                  className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded hover:bg-purple-200 transition"
                  disabled={isLoading}
                >
                  排班优化
                </button>
                <button
                  onClick={() => handleQuickAction('pricing')}
                  className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded hover:bg-amber-200 transition"
                  disabled={isLoading}
                >
                  定价建议
                </button>
                <button
                  onClick={() => handleQuickAction('marketing')}
                  className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded hover:bg-pink-200 transition"
                  disabled={isLoading}
                >
                  营销分析
                </button>
              </div>
              {useEnhancedAI && (
                <button
                  onClick={() => handleQuickAction('smart')}
                  className="w-full mt-2 text-xs bg-gradient-to-r from-green-400 to-emerald-400 text-white px-2 py-2 rounded hover:opacity-90 transition flex items-center justify-center gap-1"
                  disabled={isLoading}
                >
                  <Zap size={14} />
                  智能建议报告
                </button>
              )}
            </div>
          )}

          {/* 输入区域 */}
          <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2 bg-white rounded-b-xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AIChat;
