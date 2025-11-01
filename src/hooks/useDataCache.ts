import { useState, useCallback } from 'react';

interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // 生存时间（毫秒）
}

// 全局缓存存储
const dataCache = new Map<string, CacheEntry>();

/**
 * 数据缓存 Hook
 * @param cacheKey 缓存键名
 * @param ttl 缓存生存时间（毫秒），默认5分钟
 */
export const useDataCache = (cacheKey: string, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (fetchFn: () => Promise<any>) => {
      // 检查是否有有效的缓存
      const cached = dataCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < cached.ttl) {
        console.log(`[Cache Hit] ${cacheKey}`);
        setData(cached.data);
        setLoading(false);
        return cached.data;
      }

      // 执行数据获取
      console.log(`[Cache Miss] ${cacheKey} - Fetching data...`);
      setLoading(true);
      setError(null);
      
      try {
        const result = await fetchFn();
        
        // 存储到缓存
        dataCache.set(cacheKey, {
          data: result,
          timestamp: Date.now(),
          ttl
        });
        
        setData(result);
        return result;
      } catch (err: any) {
        const errorMsg = err.message || '数据加载失败';
        setError(errorMsg);
        console.error(`[Cache Error] ${cacheKey}:`, errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [cacheKey, ttl]
  );

  // 手动清除缓存
  const clearCache = useCallback(() => {
    dataCache.delete(cacheKey);
    setData(null);
    setError(null);
  }, [cacheKey]);

  // 清除所有缓存
  const clearAllCache = useCallback(() => {
    dataCache.clear();
    setData(null);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    fetchData,
    clearCache,
    clearAllCache,
    cacheSize: dataCache.size
  };
};

// 导出缓存管理工具
export const cacheManager = {
  clear: (key?: string) => {
    if (key) {
      dataCache.delete(key);
    } else {
      dataCache.clear();
    }
  },
  get: (key: string) => dataCache.get(key),
  has: (key: string) => dataCache.has(key),
  size: () => dataCache.size
};
