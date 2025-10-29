# 商用图片搜索功能指南

## 功能概述

商用图片搜索功能允许用户在制作智能海报时，直接从多个免费商用图片库中搜索和选择高质量的背景图片。

## 支持的图片源

### 1. Unsplash
- 完全免费的高质量图片库
- 所有图片均可用于商业用途
- API 文档: https://unsplash.com/api
- 免费配额: 50 请求/小时

### 2. Pixabay
- 包含超过 300 万张免费图片
- 所有内容均无版权限制
- API 文档: https://pixabay.com/api/docs/
- 免费配额: 100 请求/小时

### 3. Pexels
- 精选的免费高质量图片库
- 所有图片均可用于商业和非商业用途
- API 文档: https://www.pexels.com/api/
- 免费配额: 200 请求/小时

## 功能特性

### 主题匹配搜索

根据海报模板类型自动搜索相关图片:

| 海报类型 | 搜索关键词 | 示例 |
|--------|---------|------|
| 季节促销 | 春夏秋冬、折扣、促销 | 春季折扣、限时优惠 |
| 新品上市 | 产品展示、护肤品、新货 | 新产品发布 |
| 护肤方案 | 护肤、美容、肌肤护理 | 护肤方案展示 |
| 会员卡权益 | 会员卡、权益、特权 | 会员专享权益 |
| 活动邀请 | 活动、聚会、庆典 | 活动现场 |
| 课程推广 | 美容课程、培训、学习 | 培训课程 |
| 限时秒杀 | 限时、秒杀、抢购 | 闪购活动 |
| 推荐返利 | 推荐、分享、奖励 | 推荐返利计划 |

### 智能排序

搜索结果按以下规则排序:
1. **分辨率优先** - 更高分辨率的图片排在前面
2. **源优先级** - Unsplash > Pixabay > Pexels
3. **去重处理** - 自动去除重复图片

### 本地回退

当 API 不可用时，系统自动使用高质量的本地模拟图片数据，确保功能持续可用。

## 使用流程

### 步骤 1: 选择模板
1. 打开智能海报制作
2. 在模板库中选择一个合适的模板

### 步骤 2: 搜索商用图片
1. 点击模板卡片上的 **搜索图片** 按钮
2. 系统自动搜索与该模板主题相关的图片
3. 等待搜索完成（通常 2-3 秒）

### 步骤 3: 选择图片
1. 浏览搜索结果
2. 点击选择喜欢的图片
3. 点击 **确认选择** 保存选择

### 步骤 4: 生成海报
1. 点击 **一键生成** 按钮
2. 系统使用选中的图片和模板生成专业海报
3. 等待生成完成

## 技术架构

### CommercialImageSearchService

核心搜索服务类，提供以下主要功能:

```typescript
// 按主题搜索图片
searchByTheme(request: ImageSearchRequest): Promise<ImageSearchResponse>

// 按自定义关键词搜索
searchByKeyword(keyword: string, perPage: number): Promise<ImageSearchResponse>

// 搜索 Unsplash
searchUnsplash(query: string, perPage: number): Promise<StockImage[]>

// 搜索 Pixabay
searchPixabay(query: string, perPage: number): Promise<StockImage[]>

// 搜索 Pexels
searchPexels(query: string, perPage: number): Promise<StockImage[]>

// 设置 API 密钥
setApiKeys(unsplash?: string, pixabay?: string, pexels?: string): void

// 获取所有可用主题
getAvailableThemes(): Theme[]
```

### 数据结构

```typescript
interface StockImage {
  id: string;                          // 图片唯一标识
  title: string;                       // 标题
  description: string;                 // 描述
  imageUrl: string;                    // 高质量图片 URL
  thumbnailUrl: string;                // 缩略图 URL
  source: 'unsplash' | 'pixabay' | 'pexels';  // 来源
  attribution?: string;                // 作者署名
  license: string;                     // 许可证类型
  width: number;                       // 宽度
  height: number;                      // 高度
}

interface ImageSearchRequest {
  theme: string;                       // 主题 ID
  category: string;                    // 类别
  style?: 'modern' | 'elegant' | 'playful' | 'minimalist';
  perPage?: number;                    // 每页结果数
}

interface ImageSearchResponse {
  success: boolean;
  images: StockImage[];
  totalResults: number;
  error?: string;
}
```

## 配置 API 密钥

为了获得更好的性能，可以配置真实的 API 密钥:

### 环境变量配置

在 `.env.local` 中添加:

```env
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key
VITE_PIXABAY_API_KEY=your_pixabay_key
VITE_PEXELS_API_KEY=your_pexels_key
```

### 代码配置

```typescript
import commercialImageSearchService from '@/services/commercialImageSearchService';

// 设置 API 密钥
commercialImageSearchService.setApiKeys(
  'unsplash_key',
  'pixabay_key',
  'pexels_key'
);
```

## API 密钥获取

### Unsplash API Key
1. 访问 https://unsplash.com/developers
2. 注册或登录账户
3. 创建应用
4. 获取 Access Key

### Pixabay API Key
1. 访问 https://pixabay.com/api/
2. 注册账户
3. 获取 API Key

### Pexels API Key
1. 访问 https://www.pexels.com/api/
2. 注册账户
3. 获取 API Key

## 常见问题

### Q: 所有图片都支持商业使用吗?
A: 是的。所有三个图片源的图片都可以自由用于商业目的。

### Q: 搜索不到图片怎么办?
A: 系统会显示本地模拟图片。如果 API 配置不正确，也会使用回退数据。

### Q: 图片有版权限制吗?
A: 没有。所有图片都是免费提供的，无需署名（但建议提供）。

### Q: 可以上传自己的图片吗?
A: 目前只支持从商用图片库搜索。未来版本可能支持自定义上传。

### Q: 搜索速度慢吗?
A: 通常 2-3 秒内完成。受网络速度影响。

## 最佳实践

1. **选择高分辨率图片** - 系统会优先展示高分辨率的图片
2. **与模板风格匹配** - 选择与海报风格相符的图片
3. **关注图片清晰度** - 确保所选图片清晰无水印
4. **检查色调搭配** - 图片色调应与模板配色协调

## 未来计划

- 支持用户上传自定义图片
- 图片编辑功能（裁剪、滤镜等）
- 图片收藏夹功能
- 更多图片源集成
- AI 智能图片推荐

## 技术支持

如有问题，请检查:
1. 网络连接是否正常
2. API 密钥是否正确配置
3. 浏览器控制台是否有错误信息
4. 搜索关键词是否合适

## 许可证

所有集成的图片源遵循各自的许可证:
- Unsplash License
- Pixabay License
- Pexels License
