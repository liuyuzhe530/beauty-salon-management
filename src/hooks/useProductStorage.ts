import { useState, useCallback, useEffect } from 'react';
import { Product } from '../types/index';
import { shopData as initialData } from '../data/shopData';

const STORAGE_KEY = 'beauty_salon_products';

export const useProductStorage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => {
      try {
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

  const addProduct = useCallback((newProduct: Omit<Product, 'id'>) => {
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
  }, []);

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p =>
        p.id === id ? { ...p, ...updates } : p
      );
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
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




