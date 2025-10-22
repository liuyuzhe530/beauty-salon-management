import React, { useState } from 'react';
import { Layout, Settings, Eye as EyeIcon, Zap, Plus, Trash2, Copy, Save, Phone, Monitor, Grid3x3, Type, Image as ImageIcon, Tag, DollarSign } from 'lucide-react';
import { useToast } from './Toast';

interface DecorationComponent {
  id: string;
  type: 'banner' | 'category' | 'product' | 'coupon' | 'notice' | 'divider' | 'text' | 'button';
  name: string;
  config: any;
  enabled: boolean;
}

interface StoreDecoration {
  id: string;
  name: string;
  description: string;
  components: DecorationComponent[];
  createdAt: string;
  isPublished: boolean;
  preview?: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  components: DecorationComponent[];
}

export const MallPage: React.FC = () => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'editor' | 'preview' | 'template' | 'manage'>('editor');
  const [decorations, setDecorations] = useState<StoreDecoration[]>([
    {
      id: '1',
      name: '默认小程序装修',
      description: '专业美容院小程序页面',
      isPublished: true,
      createdAt: new Date().toISOString(),
      components: [
        {
          id: 'banner-1',
          type: 'banner',
          name: '轮播图',
          enabled: true,
          config: {
            images: [
              'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=800&h=300&fit=crop',
              'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=300&fit=crop'
            ],
            height: '200px',
            autoPlay: true
          }
        },
        {
          id: 'notice-1',
          type: 'notice',
          name: '公告栏',
          enabled: true,
          config: {
            content: '欢迎来到我们的美容院小程序！',
            bgColor: '#FFF3CD',
            textColor: '#856404'
          }
        },
        {
          id: 'category-1',
          type: 'category',
          name: '分类导航',
          enabled: true,
          config: {
            categories: ['护肤', '美甲', '美睫', '医美', '养生', '产品'],
            columns: 3,
            style: 'grid'
          }
        },
        {
          id: 'product-1',
          type: 'product',
          name: '热卖服务',
          enabled: true,
          config: {
            title: '热卖项目',
            showCount: 4,
            columns: 2,
            sortBy: 'popular'
          }
        }
      ]
    }
  ]);
  const [selectedDecoration, setSelectedDecoration] = useState<StoreDecoration>(decorations[0]);
  const [editingComponent, setEditingComponent] = useState<DecorationComponent | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  const templates: Template[] = [
    {
      id: 'template-1',
      name: '简洁风格',
      description: '适合所有类型美容院',
      preview: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=200&h=300&fit=crop',
      components: [
        {
          id: 'banner',
          type: 'banner',
          name: '轮播图',
          enabled: true,
          config: { images: [], height: '200px' }
        }
      ]
    },
    {
      id: 'template-2',
      name: '奢华风格',
      description: '高端美妆品牌推荐',
      preview: 'https://images.unsplash.com/photo-1596462502278-af242a95b928?w=200&h=300&fit=crop',
      components: []
    },
    {
      id: 'template-3',
      name: '完整功能',
      description: '包含所有功能组件',
      preview: 'https://images.unsplash.com/photo-1607346256330-dee4af15f7cb?w=200&h=300&fit=crop',
      components: []
    }
  ];

  const availableComponents = [
    { type: 'banner', name: '轮播图', icon: ImageIcon, description: '展示精美图片轮播' },
    { type: 'notice', name: '公告栏', icon: Tag, description: '发布重要通知' },
    { type: 'category', name: '分类导航', icon: Grid3x3, description: '服务分类导航' },
    { type: 'product', name: '产品展示', icon: DollarSign, description: '展示产品和服务' },
    { type: 'coupon', name: '优惠券', icon: Copy, description: '发布优惠信息' },
    { type: 'text', name: '文本块', icon: Type, description: '自定义文本内容' },
    { type: 'button', name: '按钮', icon: Plus, description: '可点击按钮' }
  ];

  // 编辑模式
  if (mode === 'editor') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h1 className="text-4xl font-bold mb-2">小程序店铺装修</h1>
          <p className="text-lg opacity-90">专业的微信小程序门店展示页面编辑器</p>
        </div>

        <div className="flex gap-2 justify-end mb-4">
          <button
            onClick={() => setMode('preview')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <EyeIcon className="w-4 h-4" />
            预览页面
          </button>
          <button
            onClick={() => setMode('template')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            选择模板
          </button>
          <button
            onClick={() => setMode('manage')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            管理装修
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 左侧：组件库 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-4">
              <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                组件库
              </h2>

              <div className="space-y-2">
                {availableComponents.map(comp => {
                  const Icon = comp.icon;
                  return (
                    <button
                      key={comp.type}
                      onClick={() => {
                        const newComponent: DecorationComponent = {
                          id: `${comp.type}-${Date.now()}`,
                          type: comp.type as any,
                          name: comp.name,
                          enabled: true,
                          config: {}
                        };
                        setSelectedDecoration({
                          ...selectedDecoration,
                          components: [...selectedDecoration.components, newComponent]
                        });
                        showToast('success', `已添加 ${comp.name}`, 2000);
                      }}
                      className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-600 text-sm">{comp.name}</p>
                          <p className="text-xs text-gray-600">{comp.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 中间/右侧：编辑区 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="font-bold text-gray-900 mb-4">装修内容：{selectedDecoration.name}</h2>

              <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                {selectedDecoration.components.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>从左侧组件库中拖拽或点击添加组件</p>
                  </div>
                ) : (
                  selectedDecoration.components.map(component => (
                    <div
                      key={component.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        editingComponent?.id === component.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setEditingComponent(component)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <input
                            type="checkbox"
                            checked={component.enabled}
                            onChange={(e) => {
                              setSelectedDecoration({
                                ...selectedDecoration,
                                components: selectedDecoration.components.map(c =>
                                  c.id === component.id ? { ...c, enabled: e.target.checked } : c
                                )
                              });
                            }}
                            className="w-4 h-4"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{component.name}</p>
                            <p className="text-xs text-gray-500">{component.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDecoration({
                              ...selectedDecoration,
                              components: selectedDecoration.components.filter(c => c.id !== component.id)
                            });
                            showToast('success', '已删除组件', 2000);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* 编辑面板 */}
              {editingComponent && (
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">编辑 {editingComponent.name}</h3>

                  {editingComponent.type === 'banner' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">轮播高度</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>200px - 小</option>
                          <option>300px - 中</option>
                          <option>400px - 大</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">自动播放</label>
                        <input type="checkbox" defaultChecked className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  {editingComponent.type === 'notice' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">公告内容</label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          rows={3}
                          defaultValue={editingComponent.config.content}
                        />
                      </div>
                    </div>
                  )}

                  {editingComponent.type === 'category' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">列数</label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option>2</option>
                          <option selected>3</option>
                          <option>4</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex gap-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      保存
                    </button>
                    <button
                      onClick={() => setEditingComponent(null)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => {
              showToast('success', '装修已保存！', 2000);
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            保存装修
          </button>
        </div>
      </div>
    );
  }

  // 预览模式
  if (mode === 'preview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">预览页面</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewDevice('mobile')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                previewDevice === 'mobile' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Phone className="w-4 h-4" />
              手机
            </button>
            <button
              onClick={() => setPreviewDevice('desktop')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                previewDevice === 'desktop' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              <Monitor className="w-4 h-4" />
              桌面
            </button>
            <button
              onClick={() => setMode('editor')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              返回编辑
            </button>
          </div>
        </div>

        <div className={`mx-auto bg-white rounded-lg shadow-lg overflow-hidden ${
          previewDevice === 'mobile' ? 'max-w-sm' : 'max-w-4xl'
        }`}>
          <div className="p-4 space-y-4">
            {selectedDecoration.components.filter(c => c.enabled).map(component => (
              <div key={component.id}>
                {component.type === 'banner' && (
                  <img src="https://images.unsplash.com/photo-1596462502278-af242a95b928?w=400&h=200&fit=crop" alt="banner" className="w-full h-40 rounded-lg object-cover" />
                )}
                {component.type === 'notice' && (
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm font-medium text-yellow-900">{component.config.content}</p>
                  </div>
                )}
                {component.type === 'category' && (
                  <div className="grid grid-cols-3 gap-2">
                    {['护肤', '美甲', '美睫'].map(cat => (
                      <button key={cat} className="p-2 bg-gray-100 rounded-lg text-sm font-medium">
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 模板选择
  if (mode === 'template') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">选择装修模板</h1>
          <button onClick={() => setMode('editor')} className="px-4 py-2 bg-gray-600 text-white rounded-lg">
            返回
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {templates.map(template => (
            <div key={template.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
              <img src={template.preview} alt={template.name} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
                  使用此模板
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 管理装修
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">管理装修方案</h1>
        <button onClick={() => setMode('editor')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
          新建装修
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {decorations.map(deco => (
          <div key={deco.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-gray-900">{deco.name}</h3>
                <p className="text-sm text-gray-600">{deco.description}</p>
              </div>
              {deco.isPublished && (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">已发布</span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedDecoration(deco);
                  setMode('editor');
                }}
                className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 text-sm font-medium"
              >
                编辑
              </button>
              <button className="flex-1 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm font-medium">
                预览
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
