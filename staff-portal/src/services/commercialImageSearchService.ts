/**
 * 商用图片搜索服务
 * 根据海报主题搜索可用的免费商用图片
 * 支持多个图片源：Unsplash, Pixabay, Pexels
 */

export interface StockImage {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  source: 'unsplash' | 'pixabay' | 'pexels';
  attribution?: string;
  license: string;
  width: number;
  height: number;
}

export interface ImageSearchRequest {
  theme: string;           // 海报主题（季节促销、新品上市等）
  category: string;        // 类别
  style?: 'modern' | 'elegant' | 'playful' | 'minimalist';
  perPage?: number;
}

export interface ImageSearchResponse {
  success: boolean;
  images: StockImage[];
  totalResults: number;
  error?: string;
}

class CommercialImageSearchService {
  private unsplashAccessKey = 'demo'; // 需要配置真实的 API key
  private pixabayApiKey = 'demo';     // 需要配置真实的 API key
  private pexelsApiKey = 'demo';      // 需要配置真实的 API key

  /**
   * 主题到搜索关键词的映射
   */
  private themeKeywordMap: { [key: string]: string[] } = {
    'seasonal-promotion': ['季节促销', '春夏秋冬', '限时折扣', '季节特卖', '促销活动'],
    'new-product': ['新品上市', '产品展示', '护肤品', '美容产品', '新货'],
    'skincare-routine': ['护肤方案', '美容护肤', '肌肤护理', '护肤工具', '美容仪'],
    'member-card': ['会员卡', '贵宾卡', '权益', '特权', '会员专享'],
    'event-invitation': ['活动邀请', '盛大活动', '聚会', '派对', '庆典'],
    'course-promotion': ['美容课程', '培训课程', '教学', '学习', '培训班'],
    'flash-sale': ['限时秒杀', '闪购', '抢购', '倒计时', '快速购买'],
    'referral-bonus': ['推荐返利', '分享', '转介', '奖励', '赠送']
  };

  /**
   * 获取主题的搜索关键词
   */
  private getKeywordsForTheme(theme: string): string[] {
    return this.themeKeywordMap[theme] || [theme];
  }

  /**
   * 从 Unsplash 搜索图片
   */
  async searchUnsplash(query: string, perPage: number = 10): Promise<StockImage[]> {
    try {
      // Unsplash API 文档：https://unsplash.com/api
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${this.unsplashAccessKey}`
      );
      
      if (!response.ok) {
        console.warn('Unsplash API 调用失败，使用本地数据');
        return this.getLocalMockImages('unsplash', query);
      }

      const data = await response.json();
      
      return data.results.map((img: any) => ({
        id: `unsplash-${img.id}`,
        title: img.description || img.alt_description || query,
        description: img.alt_description || '',
        imageUrl: img.urls.regular,
        thumbnailUrl: img.urls.thumb,
        source: 'unsplash' as const,
        attribution: `Photo by ${img.user.name} on Unsplash`,
        license: 'Unsplash License',
        width: img.width,
        height: img.height
      }));
    } catch (error) {
      console.error('Unsplash 搜索失败:', error);
      return this.getLocalMockImages('unsplash', query);
    }
  }

  /**
   * 从 Pixabay 搜索图片
   */
  async searchPixabay(query: string, perPage: number = 10): Promise<StockImage[]> {
    try {
      // Pixabay API 文档：https://pixabay.com/api/docs/
      const response = await fetch(
        `https://pixabay.com/api/?key=${this.pixabayApiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&image_type=photo`
      );
      
      if (!response.ok) {
        console.warn('Pixabay API 调用失败，使用本地数据');
        return this.getLocalMockImages('pixabay', query);
      }

      const data = await response.json();
      
      return (data.hits || []).map((img: any) => ({
        id: `pixabay-${img.id}`,
        title: query,
        description: '',
        imageUrl: img.largeImageURL,
        thumbnailUrl: img.previewURL,
        source: 'pixabay' as const,
        attribution: `Image by ${img.user} on Pixabay`,
        license: 'Pixabay License',
        width: img.imageWidth,
        height: img.imageHeight
      }));
    } catch (error) {
      console.error('Pixabay 搜索失败:', error);
      return this.getLocalMockImages('pixabay', query);
    }
  }

  /**
   * 从 Pexels 搜索图片
   */
  async searchPexels(query: string, perPage: number = 10): Promise<StockImage[]> {
    try {
      // Pexels API 文档：https://www.pexels.com/api/
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`,
        {
          headers: {
            'Authorization': this.pexelsApiKey
          }
        }
      );
      
      if (!response.ok) {
        console.warn('Pexels API 调用失败，使用本地数据');
        return this.getLocalMockImages('pexels', query);
      }

      const data = await response.json();
      
      return (data.photos || []).map((img: any) => ({
        id: `pexels-${img.id}`,
        title: query,
        description: '',
        imageUrl: img.src.large,
        thumbnailUrl: img.src.small,
        source: 'pexels' as const,
        attribution: `Photo by ${img.photographer} on Pexels`,
        license: 'Pexels License',
        width: img.width,
        height: img.height
      }));
    } catch (error) {
      console.error('Pexels 搜索失败:', error);
      return this.getLocalMockImages('pexels', query);
    }
  }

  /**
   * 本地模拟图片数据（当 API 不可用时使用）
   */
  private getLocalMockImages(source: 'unsplash' | 'pixabay' | 'pexels', query: string): StockImage[] {
    const mockImages = {
      unsplash: [
        {
          id: 'unsplash-mock-1',
          title: `${query} - 专业照片 1`,
          description: '高质量的商用图片',
          imageUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=200',
          source: 'unsplash' as const,
          attribution: 'Photo on Unsplash',
          license: 'Unsplash License',
          width: 800,
          height: 600
        },
        {
          id: 'unsplash-mock-2',
          title: `${query} - 专业照片 2`,
          description: '高质量的商用图片',
          imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
          thumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200',
          source: 'unsplash' as const,
          attribution: 'Photo on Unsplash',
          license: 'Unsplash License',
          width: 800,
          height: 600
        }
      ],
      pixabay: [
        {
          id: 'pixabay-mock-1',
          title: `${query} - 商用图片 1`,
          description: '免费商用图片',
          imageUrl: 'https://pixabay.com/photos/beauty-skincare-woman-beauty-care-4597675/?auto=compress&cs=tinysrgb&w=600',
          thumbnailUrl: 'https://pixabay.com/photos/beauty-skincare-woman-beauty-care-4597675/?auto=compress&cs=tinysrgb&w=200',
          source: 'pixabay' as const,
          attribution: 'Image on Pixabay',
          license: 'Pixabay License',
          width: 600,
          height: 600
        }
      ],
      pexels: [
        {
          id: 'pexels-mock-1',
          title: `${query} - 精选图片 1`,
          description: '免费高质量图片',
          imageUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=600',
          thumbnailUrl: 'https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?w=200',
          source: 'pexels' as const,
          attribution: 'Photo on Pexels',
          license: 'Pexels License',
          width: 600,
          height: 600
        }
      ]
    };

    return mockImages[source] || [];
  }

  /**
   * 搜索主题相关的商用图片
   */
  async searchByTheme(request: ImageSearchRequest): Promise<ImageSearchResponse> {
    const { theme, category, perPage = 10 } = request;
    
    try {
      const keywords = this.getKeywordsForTheme(theme);
      const primaryKeyword = keywords[0];
      
      // 并行从多个源搜索图片
      const [unsplashResults, pixabayResults, pexelsResults] = await Promise.all([
        this.searchUnsplash(primaryKeyword, Math.ceil(perPage / 3)),
        this.searchPixabay(primaryKeyword, Math.ceil(perPage / 3)),
        this.searchPexels(primaryKeyword, Math.ceil(perPage / 3))
      ]);

      // 合并结果
      const allImages = [...unsplashResults, ...pixabayResults, ...pexelsResults];
      
      // 去重和排序
      const uniqueImages = this.deduplicateImages(allImages);
      const sortedImages = this.sortImagesByRelevance(uniqueImages, primaryKeyword);

      return {
        success: true,
        images: sortedImages.slice(0, perPage),
        totalResults: sortedImages.length
      };
    } catch (error) {
      console.error('搜索图片失败:', error);
      return {
        success: false,
        images: [],
        totalResults: 0,
        error: '搜索失败，请重试'
      };
    }
  }

  /**
   * 搜索自定义关键词的图片
   */
  async searchByKeyword(keyword: string, perPage: number = 10): Promise<ImageSearchResponse> {
    try {
      const [unsplashResults, pixabayResults, pexelsResults] = await Promise.all([
        this.searchUnsplash(keyword, Math.ceil(perPage / 3)),
        this.searchPixabay(keyword, Math.ceil(perPage / 3)),
        this.searchPexels(keyword, Math.ceil(perPage / 3))
      ]);

      const allImages = [...unsplashResults, ...pixabayResults, ...pexelsResults];
      const uniqueImages = this.deduplicateImages(allImages);
      const sortedImages = this.sortImagesByRelevance(uniqueImages, keyword);

      return {
        success: true,
        images: sortedImages.slice(0, perPage),
        totalResults: sortedImages.length
      };
    } catch (error) {
      console.error('搜索图片失败:', error);
      return {
        success: false,
        images: [],
        totalResults: 0,
        error: '搜索失败，请重试'
      };
    }
  }

  /**
   * 去重图片
   */
  private deduplicateImages(images: StockImage[]): StockImage[] {
    const seen = new Set<string>();
    const unique: StockImage[] = [];

    for (const image of images) {
      // 使用图片 URL 作为唯一标识
      const key = image.imageUrl;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(image);
      }
    }

    return unique;
  }

  /**
   * 按相关性排序图片
   */
  private sortImagesByRelevance(images: StockImage[], keyword: string): StockImage[] {
    return images.sort((a, b) => {
      // 优先显示高分辨率的图片
      const aResolution = a.width * a.height;
      const bResolution = b.width * b.height;
      
      if (aResolution !== bResolution) {
        return bResolution - aResolution;
      }

      // 其次优先显示来自 Unsplash 的图片
      const sourceOrder = { unsplash: 0, pixabay: 1, pexels: 2 };
      return (sourceOrder[a.source] || 3) - (sourceOrder[b.source] || 3);
    });
  }

  /**
   * 设置 API 密钥
   */
  setApiKeys(unsplash?: string, pixabay?: string, pexels?: string) {
    if (unsplash) this.unsplashAccessKey = unsplash;
    if (pixabay) this.pixabayApiKey = pixabay;
    if (pexels) this.pexelsApiKey = pexels;
  }

  /**
   * 获取所有可用主题
   */
  getAvailableThemes(): { id: string; name: string; keywords: string[] }[] {
    return [
      { id: 'seasonal-promotion', name: '季节促销', keywords: this.themeKeywordMap['seasonal-promotion'] },
      { id: 'new-product', name: '新品上市', keywords: this.themeKeywordMap['new-product'] },
      { id: 'skincare-routine', name: '护肤方案', keywords: this.themeKeywordMap['skincare-routine'] },
      { id: 'member-card', name: '会员卡权益', keywords: this.themeKeywordMap['member-card'] },
      { id: 'event-invitation', name: '活动邀请', keywords: this.themeKeywordMap['event-invitation'] },
      { id: 'course-promotion', name: '课程推广', keywords: this.themeKeywordMap['course-promotion'] },
      { id: 'flash-sale', name: '限时秒杀', keywords: this.themeKeywordMap['flash-sale'] },
      { id: 'referral-bonus', name: '推荐返利', keywords: this.themeKeywordMap['referral-bonus'] }
    ];
  }
}

export const commercialImageSearchService = new CommercialImageSearchService();
export default commercialImageSearchService;
