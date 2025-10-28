import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, Heart, Zap, Smile, Settings, RotateCcw, Share2 } from 'lucide-react';

interface StickerEffect {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

interface MakeupEffect {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
}

interface FunResult {
  skinScore: number;
  mood: string;
  makeupRecommendation: string;
  stickerEffect: StickerEffect;
  funMessage: string;
}

export const FunSkinTest: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [result, setResult] = useState<FunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'detection' | 'results'>('detection');
  const [selectedSticker, setSelectedSticker] = useState<StickerEffect | null>(null);
  const [selectedMakeup, setSelectedMakeup] = useState<MakeupEffect | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 虚拟贴纸数据库
  const stickers: StickerEffect[] = [
    { id: '1', name: '💕 爱心', emoji: '💕', description: '闪闪发光的爱心' },
    { id: '2', name: '⭐ 星星', emoji: '⭐', description: '梦幻星空' },
    { id: '3', name: '🌸 樱花', emoji: '🌸', description: '樱花飘落' },
    { id: '4', name: '✨ 闪耀', emoji: '✨', description: '魔法闪耀' },
    { id: '5', name: '🎀 蝴蝶结', emoji: '🎀', description: '可爱蝴蝶结' },
    { id: '6', name: '🦋 蝴蝶', emoji: '🦋', description: '翩翩飞舞的蝴蝶' },
    { id: '7', name: '🌈 彩虹', emoji: '🌈', description: '彩虹光晕' },
    { id: '8', name: '💎 钻石', emoji: '💎', description: '闪耀钻石' }
  ];

  // 虚拟妆容数据库
  const makeups: MakeupEffect[] = [
    { id: '1', name: '✨ 闪耀妆', emoji: '✨', description: '发光美妆', color: 'from-yellow-400 to-pink-400' },
    { id: '2', name: '❤️ 桃花妆', emoji: '❤️', description: '甜美桃花妆', color: 'from-pink-300 to-red-300' },
    { id: '3', name: '💜 紫气妆', emoji: '💜', description: '神秘紫气', color: 'from-purple-400 to-pink-400' },
    { id: '4', name: '💚 清爽妆', emoji: '💚', description: '清爽绿茶妆', color: 'from-green-400 to-cyan-400' },
    { id: '5', name: '🌟 星辰妆', emoji: '🌟', description: '星辰闪耀', color: 'from-blue-400 to-purple-400' },
    { id: '6', name: '🔥 火焰妆', emoji: '🔥', description: '热情火焰', color: 'from-red-400 to-orange-400' }
  ];

  // 趣味文案库
  const funMessages = [
    '你的肌肤闪闪发光，像个美少女战士！✨',
    '这皮肤，赶上明星了！可以出道了！🌟',
    '哇！你是不是偷偷去做过美容护理？😍',
    '发现新大陆！这肌肤状态绝了！💎',
    '你的皮肤比P图都还要完美！👑',
    '小姐姐/小哥哥，你是天使吗？😇',
    '这肤质，我要学你的护肤秘诀！🧴',
    '简直就是行走的美颜相机！📸',
    '你的肌肤会唱歌！✨🎵',
    '美到我想给你五颗星！⭐⭐⭐⭐⭐'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const testSkin = () => {
    if (!selectedImage) return;

    setLoading(true);
    setTimeout(() => {
      const moods = ['😍 完美肌肤', '🌟 超级靓仔', '✨ 发光少女', '👑 皮肤女王', '💫 绝世美颜'];
      const recommendations = ['继续保持，你是皮肤榜样！', '建议多敷面膜，会更好哦', '防晒要做好，美白会翻倍！', '护肤坚持就是美的力量！'];
      
      const newResult: FunResult = {
        skinScore: Math.floor(Math.random() * 40) + 60,
        mood: moods[Math.floor(Math.random() * moods.length)],
        makeupRecommendation: recommendations[Math.floor(Math.random() * recommendations.length)],
        stickerEffect: stickers[Math.floor(Math.random() * stickers.length)],
        funMessage: funMessages[Math.floor(Math.random() * funMessages.length)]
      };

      setResult(newResult);
      setSelectedSticker(newResult.stickerEffect);
      setLoading(false);
      setActiveTab('results');
    }, 2000);
  };

  const drawWithSticker = () => {
    if (!selectedImage || !selectedSticker || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);

      // 绘制贴纸效果
      const fontSize = Math.max(img.width, img.height) * 0.15;
      ctx!.font = `${fontSize}px Arial`;
      
      // 在不同位置绘制贴纸
      const positions = [
        { x: img.width * 0.2, y: img.height * 0.2 },
        { x: img.width * 0.8, y: img.height * 0.2 },
        { x: img.width * 0.5, y: img.height * 0.5 }
      ];

      positions.forEach(pos => {
        ctx?.fillText(selectedSticker.emoji, pos.x, pos.y);
      });
    };

    img.src = selectedImage;
  };

  return (
    <div className="space-y-6">
      {/* 标题 */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="w-8 h-8 animate-bounce" />
          <h2 className="text-3xl font-bold">✨ 趣味皮肤检测</h2>
        </div>
        <p className="text-pink-100">大头贴 • 虚拟妆容 • 趣味检测 • 一键美颜</p>
      </div>

      {/* 标签页 */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('detection')}
          className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'detection'
              ? 'border-pink-600 text-pink-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <Camera className="w-4 h-4" />
          趣味检测
        </button>
        {result && (
          <button
            onClick={() => setActiveTab('results')}
            className={`px-4 py-2 font-medium border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'results'
                ? 'border-pink-600 text-pink-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Smile className="w-4 h-4" />
            检测结果
          </button>
        )}
      </div>

      {/* 检测页面 */}
      {activeTab === 'detection' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <div className="max-w-3xl mx-auto">
            {/* 图片上传 */}
            <div className="mb-8">
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Fun preview"
                    className="w-full h-80 object-cover rounded-lg shadow-lg border-4 border-pink-300"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-bold"
                  >
                    重新上传
                  </button>
                </div>
              ) : (
                <div className="border-4 border-dashed border-purple-300 rounded-lg p-16 text-center bg-gradient-to-br from-purple-50 to-pink-50">
                  <div className="text-6xl mb-4">📸</div>
                  <p className="text-gray-700 font-bold text-xl mb-2">上传你的自拍照</p>
                  <p className="text-sm text-gray-600 mb-8">开启趣味皮肤检测之旅</p>

                  <label className="inline-block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg hover:shadow-lg transition-all cursor-pointer flex items-center gap-2 inline-flex font-bold text-lg">
                      <Upload className="w-5 h-5" />
                      选择照片
                    </span>
                  </label>
                </div>
              )}
            </div>

            {/* 虚拟妆容选择 */}
            {selectedImage && (
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-3">💄 选择虚拟妆容</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {makeups.map(makeup => (
                    <button
                      key={makeup.id}
                      onClick={() => setSelectedMakeup(makeup)}
                      className={`p-3 rounded-lg transition-all text-center ${
                        selectedMakeup?.id === makeup.id
                          ? `bg-gradient-to-br ${makeup.color} text-white shadow-lg scale-110`
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <div className="text-2xl mb-1">{makeup.emoji}</div>
                      <div className="text-xs font-bold">{makeup.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 虚拟贴纸选择 */}
            {selectedImage && (
              <div className="mb-8">
                <h4 className="font-bold text-gray-900 mb-3">✨ 选择虚拟贴纸</h4>
                <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                  {stickers.map(sticker => (
                    <button
                      key={sticker.id}
                      onClick={() => setSelectedSticker(sticker)}
                      className={`p-3 rounded-lg transition-all text-center text-3xl ${
                        selectedSticker?.id === sticker.id
                          ? 'bg-pink-200 shadow-lg scale-110'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title={sticker.description}
                    >
                      {sticker.emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 检测按钮 */}
            {selectedImage && (
              <button
                onClick={testSkin}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    趣味检测中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5" />
                    开启趣味检测
                  </span>
                )}
              </button>
            )}

            {/* 趣味提示 */}
            <div className="mt-8 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-5 flex gap-4">
              <div className="text-3xl">🎉</div>
              <div className="text-sm text-yellow-900">
                <p className="font-bold mb-2">😊 趣味检测说明</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ 这是一个有趣的皮肤检测游戏</li>
                  <li>✓ 选择你喜欢的虚拟妆容和贴纸</li>
                  <li>✓ 获得个性化的趣味评价</li>
                  <li>✓ 分享你的检测结果给朋友</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 结果页面 */}
      {activeTab === 'results' && result && (
        <div className="space-y-6">
          {/* 趣味评分卡 */}
          <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-red-100 rounded-lg border-4 border-pink-300 p-8">
            <div className="text-center">
              <div className="text-6xl mb-4">{result.stickerEffect.emoji}</div>
              <h3 className="text-3xl font-bold text-purple-900 mb-2">{result.mood}</h3>
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                {result.skinScore}分
              </div>
              <p className="text-lg text-pink-900 font-semibold">{result.funMessage}</p>
            </div>
          </div>

          {/* 虚拟妆容卡 */}
          <div className={`rounded-lg border-4 border-pink-200 p-8 bg-gradient-to-br ${selectedMakeup?.color || 'from-pink-50 to-purple-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">💄 虚拟妆容推荐</h4>
                <p className="text-lg text-gray-700">{selectedMakeup?.name || '✨ 闪耀妆'}</p>
                <p className="text-sm text-gray-600 mt-2">{selectedMakeup?.description}</p>
              </div>
              <div className="text-6xl">{selectedMakeup?.emoji}</div>
            </div>
          </div>

          {/* 贴纸效果卡 */}
          <div className="bg-white rounded-lg border-4 border-purple-200 p-8">
            <div className="text-center">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">✨ 虚拟贴纸效果</h4>
              <div className="text-9xl mb-4 animate-bounce">{result.stickerEffect.emoji}</div>
              <p className="text-lg text-gray-600">{result.stickerEffect.name}</p>
              <p className="text-sm text-gray-500 mt-2">{result.stickerEffect.description}</p>
            </div>
          </div>

          {/* 美容建议卡 */}
          <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-lg border-4 border-green-300 p-8">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-8 h-8 text-red-500" />
              <h4 className="text-2xl font-bold text-gray-900">💚 护肤建议</h4>
            </div>
            <p className="text-lg text-gray-700 font-semibold">{result.makeupRecommendation}</p>
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-200">
              <p className="text-sm text-gray-600">
                🌟 保持现在的护肤习惯，你的皮肤会越来越好！记住：防晒、保湿、坚持是美女的最大秘密！
              </p>
            </div>
          </div>

          {/* 趣味排行榜 */}
          <div className="bg-white rounded-lg border-4 border-yellow-300 p-8">
            <h4 className="text-2xl font-bold text-gray-900 mb-4">🏆 趣味排行榜</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <span className="text-lg">👑 皮肤女王</span>
                <span className="text-2xl font-bold">90-100分</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <span className="text-lg">✨ 闪耀天使</span>
                <span className="text-2xl font-bold">80-89分</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-lg">🌟 美颜少女</span>
                <span className="text-2xl font-bold">{result.skinScore}分</span>
              </div>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                setActiveTab('detection');
                setSelectedImage(null);
                setResult(null);
              }}
              className="flex-1 bg-gray-200 text-gray-900 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              再检测一次
            </button>
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              分享结果
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
