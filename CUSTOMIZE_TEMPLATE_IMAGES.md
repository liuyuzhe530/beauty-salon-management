# 自定义模板图片指南

## 快速自定义

### 方法 1: 修改图片 URL

直接在 `SmartPosterMaker.tsx` 中修改 `imageUrl`:

```typescript
// src/components/SmartPosterMaker.tsx

const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'promo-seasonal',
    name: '季节促销',
    // ... 其他属性 ...
    imageUrl: 'https://your-image-url.jpg'  // 改这里
  },
  // ...
];
```

### 方法 2: 使用本地图片

1. 将图片放到 `public` 文件夹

```
project/
├── public/
│   ├── images/
│   │   ├── seasonal.jpg
│   │   ├── product.jpg
│   │   └── ...
│   └── ...
└── ...
```

2. 引用本地图片

```typescript
imageUrl: '/images/seasonal.jpg'
```

## 图片来源推荐

### 免费高质量图片网站

#### 1. Unsplash (推荐)
- 网址: https://unsplash.com
- 特点: 高质量、免费、可商用
- 用途: 完美用于促销和商业

```
搜索关键词:
- 季节促销: "shopping" "sale"
- 新品上市: "beauty products" "skincare"
- 护肤方案: "skincare" "beauty"
- 会员卡权益: "loyalty" "card"
- 活动邀请: "event" "gathering"
- 课程推广: "education" "learning"
- 限时秒杀: "flash sale" "urgent"
- 推荐返利: "share" "referral"
```

#### 2. Pexels
- 网址: https://www.pexels.com
- 特点: 免费、无需署名、可商用

#### 3. Pixabay
- 网址: https://pixabay.com
- 特点: 免费、高质量、可编辑

#### 4. Envato Elements
- 网址: https://elements.envato.com
- 特点: 高级素材库（付费）

## 图片优化技巧

### 图片格式

推荐: **JPEG** 或 **WebP**

```
JPEG: 优先选择
- 文件小
- 支持广泛
- 质量好

WebP: 现代浏览器优先
- 文件更小
- 质量更好
```

### 图片尺寸

最优: **800x400px**

```
Unsplash 调整参数示例:
https://images.unsplash.com/photo-xxx?w=800&h=400&fit=crop

参数说明:
- w=800: 宽度
- h=400: 高度
- fit=crop: 裁剪模式
```

### 图片质量

建议: **80-90 质量**

```
Unsplash 质量参数:
https://images.unsplash.com/photo-xxx?q=85
```

### 完整优化 URL

```
https://images.unsplash.com/photo-xxx
?w=800
&h=400
&fit=crop
&q=85
```

## 为每个模板选择图片

### 1️⃣ 季节促销 (promo-seasonal)

**关键词**: shopping, sale, discount, seasonal

```typescript
imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=400&fit=crop'
```

**替代图片**:
- 购物场景
- 打折标签
- 季节装饰
- 买家笑脸

### 2️⃣ 新品上市 (new-product)

**关键词**: beauty products, skincare, cosmetics, new

```typescript
imageUrl: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=400&fit=crop'
```

**替代图片**:
- 化妆品展示
- 产品包装
- 实验室场景
- 优雅产品

### 3️⃣ 护肤方案 (skincare-routine)

**关键词**: skincare, beauty, spa, facial treatment

```typescript
imageUrl: 'https://images.unsplash.com/photo-1556228541-91c674f1bac1?w=800&h=400&fit=crop'
```

**替代图片**:
- 护肤产品
- Spa 场景
- 面部护理
- 自然成分

### 4️⃣ 会员卡权益 (member-card)

**关键词**: loyalty, membership, card, premium

```typescript
imageUrl: 'https://images.unsplash.com/photo-1533928298208-27ff66555d0d?w=800&h=400&fit=crop'
```

**替代图片**:
- 会员卡
- VIP 标签
- 特权图标
- 金卡设计

### 5️⃣ 活动邀请 (event-invitation)

**关键词**: event, party, gathering, celebration

```typescript
imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=400&fit=crop'
```

**替代图片**:
- 聚会场景
- 庆祝氛围
- 人群互动
- 舞台灯光

### 6️⃣ 课程推广 (course-promotion)

**关键词**: education, training, learning, classroom

```typescript
imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop'
```

**替代图片**:
- 课堂场景
- 讲师教学
- 学习资料
- 技能培训

### 7️⃣ 限时秒杀 (flash-sale)

**关键词**: flash sale, urgency, countdown, offer

```typescript
imageUrl: 'https://images.unsplash.com/photo-1576516927231-cd206f08470f?w=800&h=400&fit=crop'
```

**替代图片**:
- 闪购标签
- 倒计时
- 紧急图标
- 炸裂效果

### 8️⃣ 推荐返利 (referral-bonus)

**关键词**: referral, share, social, sharing

```typescript
imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=400&fit=crop'
```

**替代图片**:
- 分享图标
- 社交网络
- 朋友群体
- 传播效应

## 实际操作步骤

### 使用 Unsplash 图片

**第 1 步**: 访问 Unsplash
```
https://unsplash.com
```

**第 2 步**: 搜索关键词
```
例如: "shopping sale"
```

**第 3 步**: 选择喜欢的图片
```
点击图片查看详情
```

**第 4 步**: 获取图片 URL
```
右键 → 复制图片地址
或点击"Download Free"获取链接
```

**第 5 步**: 修改代码
```typescript
imageUrl: 'https://images.unsplash.com/photo-xxx'
```

### 使用本地图片

**第 1 步**: 下载或制作图片
```
尺寸: 800x400px
格式: JPEG 或 PNG
质量: 高清
```

**第 2 步**: 放到项目中
```
project/
└── public/
    └── images/
        └── my-image.jpg
```

**第 3 步**: 修改代码
```typescript
imageUrl: '/images/my-image.jpg'
```

## 图片加载失败处理

如果图片 URL 无效，会自动降级到渐变背景：

```typescript
// 自动选择
const backgroundImage = template.imageUrl 
  ? `url('${template.imageUrl}')`  // 尝试图片
  : `linear-gradient(135deg, ...)` // 降级到渐变
```

## 性能优化建议

### 1. 使用 CDN
```
使用 CDN 加速图片加载:
- Unsplash (推荐)
- Cloudinary
- Imgix
```

### 2. 启用缓存
```
浏览器会自动缓存图片
无需额外配置
```

### 3. 图片压缩
```
使用在线工具压缩:
- TinyPNG
- Compressor.io
- ImageOptim
```

### 4. 懒加载
```
等待改进版本
当前已支持异步加载
```

## 常用 Unsplash 搜索

```javascript
// 季节促销
https://unsplash.com/napi/search/photos?query=shopping%20sale

// 新品上市
https://unsplash.com/napi/search/photos?query=beauty%20products

// 护肤方案
https://unsplash.com/napi/search/photos?query=skincare

// 会员卡权益
https://unsplash.com/napi/search/photos?query=loyalty%20card

// 活动邀请
https://unsplash.com/napi/search/photos?query=event%20party

// 课程推广
https://unsplash.com/napi/search/photos?query=education

// 限时秒杀
https://unsplash.com/napi/search/photos?query=flash%20sale

// 推荐返利
https://unsplash.com/napi/search/photos?query=sharing%20referral
```

## 故障排除

### 问题 1: 图片不显示
**原因**: URL 无效或网络问题

**解决**:
1. 检查 URL 是否正确
2. 在浏览器中直接访问 URL
3. 检查网络连接

### 问题 2: 图片加载很慢
**原因**: 图片文件过大

**解决**:
1. 使用更小的图片尺寸
2. 添加 `?q=80` 降低质量
3. 换个图片源

### 问题 3: 文字不清晰
**原因**: 颜色遮罩不适配

**解决**:
1. 选择对比度高的图片
2. 使用较暗的颜色遮罩
3. 调整遮罩透明度

## 代码示例

### 完整的自定义示例

```typescript
const POSTER_TEMPLATES: PosterTemplate[] = [
  {
    id: 'promo-seasonal',
    name: '季节促销',
    category: 'promotion',
    description: '适合春夏秋冬季节性推广',
    icon: '',
    contentTemplate: '{season}优惠\n全场{discount}折\n{callToAction}',
    style: 'modern',
    colors: { primary: '#FF6B6B', secondary: '#FFE66D' },
    tags: ['促销', '季节', '优惠'],
    // 自定义你的图片 URL
    imageUrl: 'https://你的图片URL.jpg'
  },
  // ... 其他模板 ...
];
```

### 本地图片示例

```typescript
{
  id: 'new-product',
  name: '新品上市',
  // ...
  imageUrl: '/images/new-product.jpg'  // 本地图片
}
```

### 没有图片时自动降级

```typescript
{
  id: 'skincare-routine',
  name: '护肤方案',
  // ...
  // 不设置 imageUrl 时自动用渐变背景
}
```

## 总结

- 📸 可以使用任何公开 URL 的图片
- 🎨 支持本地和远程图片
- 🚀 异步加载不影响性能
- 📱 完全响应式
- ✅ 失败自动降级

现在你可以随时修改模板图片了！

---

**最后更新**: 2024 年 10 月 29 日
