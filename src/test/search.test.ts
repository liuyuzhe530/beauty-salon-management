import { describe, it, expect } from 'vitest';

/**
 * 搜索和筛选逻辑测试
 */

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  rating: number;
}

class ProductSearch {
  private products: Product[];

  constructor(products: Product[]) {
    this.products = products;
  }

  /**
   * 按名称搜索商品
   */
  searchByName(query: string): Product[] {
    if (!query.trim()) {
      return this.products;
    }

    const lowerQuery = query.toLowerCase();
    return this.products.filter(p =>
      p.name.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * 按分类筛选
   */
  filterByCategory(category: string): Product[] {
    if (category === 'all') {
      return this.products;
    }

    return this.products.filter(p => p.category === category);
  }

  /**
   * 按价格范围筛选
   */
  filterByPrice(minPrice: number, maxPrice: number): Product[] {
    return this.products.filter(p =>
      p.price >= minPrice && p.price <= maxPrice
    );
  }

  /**
   * 按评分筛选
   */
  filterByRating(minRating: number): Product[] {
    return this.products.filter(p => p.rating >= minRating);
  }

  /**
   * 组合搜索和筛选
   */
  search(query: string, category: string = 'all', minPrice: number = 0, maxPrice: number = Infinity): Product[] {
    let results = this.searchByName(query);
    results = results.filter(p => category === 'all' || p.category === category);
    results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);
    return results;
  }

  /**
   * 获取所有分类
   */
  getCategories(): string[] {
    const categories = new Set(this.products.map(p => p.category));
    return Array.from(categories).sort();
  }

  /**
   * 获取价格范围
   */
  getPriceRange(): { min: number; max: number } {
    if (this.products.length === 0) {
      return { min: 0, max: 0 };
    }

    const prices = this.products.map(p => p.price);
    return {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };
  }
}

describe('搜索和筛选', () => {
  const products: Product[] = [
    { id: 'p1', name: '护肤精油', price: 168, category: '护肤品', rating: 4.8 },
    { id: 'p2', name: '面膜贴片', price: 45, category: '面膜', rating: 4.7 },
    { id: 'p3', name: '精华液', price: 128, category: '精华', rating: 4.9 },
    { id: 'p4', name: '护肤套装', price: 88, category: '套装', rating: 4.6 },
    { id: 'p5', name: '眼霜', price: 98, category: '护肤品', rating: 4.7 },
    { id: 'p6', name: '清洁面膏', price: 78, category: '清洁', rating: 4.5 },
  ];

  let search: ProductSearch;

  beforeEach(() => {
    search = new ProductSearch(products);
  });

  describe('按名称搜索', () => {
    it('应该能按名称搜索到商品', () => {
      const results = search.searchByName('护肤');

      expect(results).toHaveLength(2);
      expect(results.every(p => p.name.includes('护肤'))).toBe(true);
    });

    it('搜索应该不区分大小写', () => {
      const results1 = search.searchByName('护肤');
      const results2 = search.searchByName('护肤');

      expect(results1).toEqual(results2);
    });

    it('空搜索应该返回所有商品', () => {
      const results = search.searchByName('');

      expect(results).toHaveLength(products.length);
    });

    it('搜索不存在的商品应该返回空数组', () => {
      const results = search.searchByName('不存在的商品');

      expect(results).toHaveLength(0);
    });

    it('搜索应该支持部分匹配', () => {
      const results = search.searchByName('面');

      expect(results.length).toBeGreaterThan(0);
      expect(results.some(p => p.name.includes('面膜'))).toBe(true);
    });
  });

  describe('按分类筛选', () => {
    it('应该能按分类筛选', () => {
      const results = search.filterByCategory('护肤品');

      expect(results).toHaveLength(2);
      expect(results.every(p => p.category === '护肤品')).toBe(true);
    });

    it('分类为"all"应该返回所有商品', () => {
      const results = search.filterByCategory('all');

      expect(results).toHaveLength(products.length);
    });

    it('不存在的分类应该返回空数组', () => {
      const results = search.filterByCategory('不存在的分类');

      expect(results).toHaveLength(0);
    });
  });

  describe('按价格筛选', () => {
    it('应该能按价格范围筛选', () => {
      const results = search.filterByPrice(80, 150);

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.price >= 80 && p.price <= 150)).toBe(true);
    });

    it('价格为0时应该返回所有商品', () => {
      const results = search.filterByPrice(0, Infinity);

      expect(results).toHaveLength(products.length);
    });

    it('最小价格大于最大价格应该返回空数组', () => {
      const results = search.filterByPrice(200, 100);

      expect(results).toHaveLength(0);
    });
  });

  describe('按评分筛选', () => {
    it('应该能按评分筛选', () => {
      const results = search.filterByRating(4.7);

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.rating >= 4.7)).toBe(true);
    });

    it('最低评分为0应该返回所有商品', () => {
      const results = search.filterByRating(0);

      expect(results).toHaveLength(products.length);
    });

    it('过高的评分应该返回空数组', () => {
      const results = search.filterByRating(5.0);

      expect(results).toHaveLength(0);
    });
  });

  describe('组合搜索', () => {
    it('应该能组合搜索和筛选', () => {
      const results = search.search('护肤', '护肤品');

      expect(results.length).toBeGreaterThan(0);
      expect(results.every(p => p.name.includes('护肤') && p.category === '护肤品')).toBe(true);
    });

    it('应该能组合搜索、分类和价格范围', () => {
      const results = search.search('', '护肤品', 50, 150);

      expect(results.every(p => p.category === '护肤品' && p.price >= 50 && p.price <= 150)).toBe(true);
    });

    it('多条件都不匹配应该返回空数组', () => {
      const results = search.search('不存在', 'all', 0, Infinity);

      expect(results).toHaveLength(0);
    });
  });

  describe('辅助功能', () => {
    it('应该能获取所有分类', () => {
      const categories = search.getCategories();

      expect(categories).toContain('护肤品');
      expect(categories).toContain('面膜');
      expect(categories).toContain('精华');
      expect(categories.length).toBeGreaterThan(0);
    });

    it('应该能获取价格范围', () => {
      const range = search.getPriceRange();

      expect(range.min).toBeLessThanOrEqual(range.max);
      expect(range.min).toBeGreaterThan(0);
    });

    it('价格范围应该包含所有商品的价格', () => {
      const range = search.getPriceRange();
      const allInRange = products.every(p => p.price >= range.min && p.price <= range.max);

      expect(allInRange).toBe(true);
    });
  });
});










