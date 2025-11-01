// 全网价格查询服务
// 支持在线查询多平台产品价格

interface PriceRecord {
  marketplace: string;
  supplier: string;
  price: number;
  rating: number;
  delivery: string;
  quantity: string;
  link: string;
  lastUpdate: string;
}

interface PriceQueryResult {
  productName: string;
  results: PriceRecord[];
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  bestDeal: PriceRecord;
  queryTime: string;
}

// 模拟的全网数据库
const GLOBAL_PRICE_DATABASE: Record<string, PriceRecord[]> = {
  '护肤精油': [
    {
      marketplace: '1688',
      supplier: '浙江美妆有限公司',
      price: 45,
      rating: 4.8,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://1688.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '阿里巴巴',
      supplier: '浙江美妆工厂',
      price: 42,
      rating: 4.7,
      delivery: '3-5天',
      quantity: '≥5件',
      link: 'https://alibaba.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '抖音电商',
      supplier: '浙江美妆零售',
      price: 48,
      rating: 4.6,
      delivery: '1-2天',
      quantity: '≥1件',
      link: 'https://douyin.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '京东',
      supplier: '京东自营',
      price: 50,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件',
      link: 'https://jd.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '拼多多',
      supplier: '拼多多官方',
      price: 43,
      rating: 4.5,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://pinduoduo.com/...',
      lastUpdate: '2025-01-28'
    }
  ],
  '面膜贴片': [
    {
      marketplace: '1688',
      supplier: '广州美妆工厂',
      price: 6.5,
      rating: 4.5,
      delivery: '3-5天',
      quantity: '≥10件',
      link: 'https://1688.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '阿里巴巴',
      supplier: '广州美妆批发',
      price: 8,
      rating: 4.7,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://alibaba.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '抖音电商',
      supplier: '广州美妆直供',
      price: 9,
      rating: 4.8,
      delivery: '1-2天',
      quantity: '≥1件',
      link: 'https://douyin.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '京东',
      supplier: '京东自营',
      price: 10,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件',
      link: 'https://jd.com/...',
      lastUpdate: '2025-01-28'
    }
  ],
  '精华液': [
    {
      marketplace: '1688',
      supplier: '上海美妆集团',
      price: 22,
      rating: 4.9,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://1688.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '阿里巴巴',
      supplier: '上海美妆工厂',
      price: 20,
      rating: 4.8,
      delivery: '3-5天',
      quantity: '≥5件',
      link: 'https://alibaba.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '京东',
      supplier: '京东自营',
      price: 25,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件',
      link: 'https://jd.com/...',
      lastUpdate: '2025-01-28'
    }
  ],
  '口红': [
    {
      marketplace: '1688',
      supplier: '深圳彩妆厂',
      price: 15,
      rating: 4.7,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://1688.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '抖音电商',
      supplier: '深圳彩妆直营',
      price: 18,
      rating: 4.8,
      delivery: '1-2天',
      quantity: '≥1件',
      link: 'https://douyin.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '京东',
      supplier: '京东自营',
      price: 22,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件',
      link: 'https://jd.com/...',
      lastUpdate: '2025-01-28'
    }
  ],
  '眼影': [
    {
      marketplace: '1688',
      supplier: '广州彩妆厂',
      price: 12,
      rating: 4.6,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://1688.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '拼多多',
      supplier: '拼多多卖家',
      price: 14,
      rating: 4.5,
      delivery: '2-3天',
      quantity: '≥1件',
      link: 'https://pinduoduo.com/...',
      lastUpdate: '2025-01-28'
    },
    {
      marketplace: '京东',
      supplier: '京东自营',
      price: 18,
      rating: 4.9,
      delivery: '次日达',
      quantity: '≥1件',
      link: 'https://jd.com/...',
      lastUpdate: '2025-01-28'
    }
  ]
};

/**
 * 执行全网价格查询
 * @param productName 产品名称
 * @returns 查询结果
 */
export async function queryGlobalPrices(productName: string): Promise<PriceQueryResult | null> {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 500));

  // 在数据库中搜索匹配的产品
  const key = Object.keys(GLOBAL_PRICE_DATABASE).find(k => 
    k.includes(productName) || productName.includes(k)
  );

  if (!key) {
    // 如果没找到精确匹配，返回空结果
    return null;
  }

  const results = GLOBAL_PRICE_DATABASE[key] || [];

  if (results.length === 0) {
    return null;
  }

  // 计算统计数据
  const prices = results.map(r => r.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b) / prices.length * 10) / 10;

  // 找到最佳价格
  const bestDeal = results.reduce((best, current) => {
    const bestScore = (best.rating * 0.3) + ((100 - best.price) * 0.7);
    const currentScore = (current.rating * 0.3) + ((100 - current.price) * 0.7);
    return currentScore > bestScore ? current : best;
  });

  return {
    productName: key,
    results: results.sort((a, b) => a.price - b.price),
    minPrice,
    maxPrice,
    avgPrice,
    bestDeal,
    queryTime: new Date().toLocaleTimeString('zh-CN')
  };
}

/**
 * 搜索相关产品
 * @param keyword 搜索关键词
 * @returns 匹配的产品列表
 */
export function searchRelatedProducts(keyword: string): string[] {
  const allProducts = Object.keys(GLOBAL_PRICE_DATABASE);
  return allProducts.filter(p => p.includes(keyword) || keyword.includes(p));
}

/**
 * 获取热门产品列表
 * @returns 热门产品
 */
export function getPopularProducts(): string[] {
  return Object.keys(GLOBAL_PRICE_DATABASE);
}

/**
 * 获取价格趋势
 * @param productName 产品名称
 * @returns 价格趋势数据
 */
export function getPriceTrend(productName: string) {
  // 模拟价格趋势数据
  const trends = [
    { date: '1月24日', price: Math.random() * 50 + 20 },
    { date: '1月25日', price: Math.random() * 50 + 20 },
    { date: '1月26日', price: Math.random() * 50 + 20 },
    { date: '1月27日', price: Math.random() * 50 + 20 },
    { date: '1月28日', price: Math.random() * 50 + 20 }
  ];
  return trends;
}
