import { useState, useCallback, useEffect } from 'react';
import { Product } from '../types/index';
import { productService } from '../api';
import { shopData as initialData } from '../data/shopData';

const STORAGE_KEY = 'beauty_salon_products';

export const useProductStorage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // 尝试从API加载
        try {
          const apiProducts = await productService.getAll();
          if (apiProducts && apiProducts.length > 0) {
            setProducts(apiProducts);
            // 同步到本地存储
            localStorage.setItem(STORAGE_KEY, JSON.stringify(apiProducts));
            return;
          }
        } catch (apiError) {
          console.warn('API加载产品失败，使用本地缓存:', apiError);
        }

        // 如果API失败，从本地存储加载
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProducts(JSON.parse(stored));
        } else {
          setProducts(initialData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
        }
      } catch (error) {
        console.error('Failed to load products from localStorage:', error);
        setProducts(initialData);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  const addProduct = useCallback(async (newProduct: Omit<Product, 'id'>) => {
    try {
      // 尝试通过API添加
      try {
        const apiProduct = await productService.create(newProduct);
        setProducts(prev => {
          const updated = [...prev, apiProduct];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return apiProduct;
      } catch (apiError) {
        console.warn('API添加产品失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      const id = Date.now().toString();
      const product: Product = {
        ...newProduct,
        id
      };

      setProducts(prev => {
        const updated = [...prev, product];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });

      return product;
    } catch (error) {
      console.error('Failed to add product:', error);
      throw error;
    }
  }, []);

  const updateProduct = useCallback(async (id: string, updates: Partial<Product>) => {
    try {
      // 尝试通过API更新
      try {
        await productService.update(id, updates);
        setProducts(prev => {
          const updated = prev.map(p =>
            p.id === id ? { ...p, ...updates } : p
          );
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return;
      } catch (apiError) {
        console.warn('API更新产品失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setProducts(prev => {
        const updated = prev.map(p =>
          p.id === id ? { ...p, ...updates } : p
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    try {
      // 尝试通过API删除
      try {
        await productService.delete(id);
        setProducts(prev => {
          const updated = prev.filter(p => p.id !== id);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return;
      } catch (apiError) {
        console.warn('API删除产品失败，使用本地方式:', apiError);
      }

      // 如果API失败，使用本地方式
      setProducts(prev => {
        const updated = prev.filter(p => p.id !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  }, []);

  const getProduct = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const searchProducts = useCallback((keyword: string) => {
    if (!keyword.trim()) return products;
    const lower = keyword.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(lower) ||
      p.category.toLowerCase().includes(lower)
    );
  }, [products]);

  const filterByCategory = useCallback((category: string) => {
    if (!category) return products;
    return products.filter(p => p.category === category);
  }, [products]);

  const getCategories = useCallback(() => {
    const categories = new Set(products.map(p => p.category));
    return Array.from(categories);
  }, [products]);

  // 获取库存不足的产品
  const getLowStockProducts = useCallback((threshold: number = 20) => {
    return products.filter(p => p.stock <= threshold);
  }, [products]);

  // 按销售量排序
  const getTopSellingProducts = useCallback((limit: number = 5) => {
    return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
  }, [products]);

  return {
    products,
    isLoading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProduct,
    searchProducts,
    filterByCategory,
    getCategories,
    getLowStockProducts,
    getTopSellingProducts
  };
};




