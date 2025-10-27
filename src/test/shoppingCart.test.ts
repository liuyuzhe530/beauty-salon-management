import { describe, it, expect, beforeEach } from 'vitest';

/**
 * 购物车逻辑测试
 * 测试购物车的添加、删除、数量调整等功能
 */

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

class ShoppingCart {
  private items: CartItem[] = [];

  /**
   * 添加商品到购物车
   */
  addItem(item: Omit<CartItem, 'quantity'>) {
    const existingItem = this.items.find(i => i.id === item.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.items.push({
        ...item,
        quantity: 1,
      });
    }
  }

  /**
   * 从购物车移除商品
   */
  removeItem(id: string) {
    this.items = this.items.filter(item => item.id !== id);
  }

  /**
   * 调整商品数量
   */
  updateQuantity(id: string, quantity: number) {
    const item = this.items.find(i => i.id === id);
    if (item && quantity > 0) {
      item.quantity = quantity;
    }
  }

  /**
   * 获取所有商品
   */
  getItems() {
    return this.items;
  }

  /**
   * 获取购物车总价
   */
  getTotalPrice() {
    return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  /**
   * 获取购物车商品总数
   */
  getItemCount() {
    return this.items.length;
  }

  /**
   * 获取购物车总件数
   */
  getTotalQuantity() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * 清空购物车
   */
  clear() {
    this.items = [];
  }
}

describe('购物车逻辑', () => {
  let cart: ShoppingCart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('添加商品', () => {
    it('应该能添加单个商品', () => {
      const item = {
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      };

      cart.addItem(item);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0]).toMatchObject({
        ...item,
        quantity: 1,
      });
    });

    it('应该能添加多个不同商品', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });

      expect(cart.getItems()).toHaveLength(2);
    });

    it('添加相同商品时应该增加数量而不是添加新项目', () => {
      const item = {
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      };

      cart.addItem(item);
      cart.addItem(item);

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].quantity).toBe(2);
    });
  });

  describe('移除商品', () => {
    it('应该能移除购物车中的商品', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });

      cart.removeItem('p1');

      expect(cart.getItems()).toHaveLength(1);
      expect(cart.getItems()[0].id).toBe('p2');
    });

    it('移除不存在的商品应该不报错', () => {
      expect(() => {
        cart.removeItem('non-existent');
      }).not.toThrow();
    });
  });

  describe('调整数量', () => {
    beforeEach(() => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
    });

    it('应该能调整商品数量', () => {
      cart.updateQuantity('p1', 5);

      expect(cart.getItems()[0].quantity).toBe(5);
    });

    it('数量不能为0或负数', () => {
      cart.updateQuantity('p1', 0);
      expect(cart.getItems()[0].quantity).toBe(1);

      cart.updateQuantity('p1', -5);
      expect(cart.getItems()[0].quantity).toBe(1);
    });

    it('调整不存在的商品应该不报错', () => {
      expect(() => {
        cart.updateQuantity('non-existent', 5);
      }).not.toThrow();
    });
  });

  describe('价格计算', () => {
    it('空购物车总价应该为0', () => {
      expect(cart.getTotalPrice()).toBe(0);
    });

    it('应该正确计算单个商品总价', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });

      expect(cart.getTotalPrice()).toBe(168);
    });

    it('应该正确计算多个商品总价', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });

      expect(cart.getTotalPrice()).toBe(213); // 168 + 45
    });

    it('应该正确计算相同商品的总价', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.updateQuantity('p1', 3);

      expect(cart.getTotalPrice()).toBe(504); // 168 * 3
    });
  });

  describe('统计信息', () => {
    it('空购物车商品数应该为0', () => {
      expect(cart.getItemCount()).toBe(0);
      expect(cart.getTotalQuantity()).toBe(0);
    });

    it('应该正确统计商品数', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });

      expect(cart.getItemCount()).toBe(2);
      expect(cart.getTotalQuantity()).toBe(2);
    });

    it('应该正确统计总件数（包括数量）', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.updateQuantity('p1', 3);

      expect(cart.getItemCount()).toBe(1); // 1种商品
      expect(cart.getTotalQuantity()).toBe(3); // 3件
    });
  });

  describe('清空购物车', () => {
    it('应该能清空所有商品', () => {
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });

      cart.clear();

      expect(cart.getItems()).toHaveLength(0);
      expect(cart.getTotalPrice()).toBe(0);
      expect(cart.getTotalQuantity()).toBe(0);
    });
  });

  describe('完整购物流程', () => {
    it('应该支持完整的购物流程', () => {
      // 1. 添加商品
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      expect(cart.getTotalPrice()).toBe(168);

      // 2. 增加相同商品
      cart.addItem({
        id: 'p1',
        name: '护肤精油',
        price: 168,
        image: 'https://example.com/oil.jpg',
      });
      expect(cart.getTotalQuantity()).toBe(2);

      // 3. 添加不同商品
      cart.addItem({
        id: 'p2',
        name: '面膜',
        price: 45,
        image: 'https://example.com/mask.jpg',
      });
      expect(cart.getTotalPrice()).toBe(381); // 168*2 + 45

      // 4. 调整数量
      cart.updateQuantity('p1', 1);
      expect(cart.getTotalPrice()).toBe(213); // 168 + 45

      // 5. 移除商品
      cart.removeItem('p2');
      expect(cart.getTotalPrice()).toBe(168);

      // 6. 清空购物车
      cart.clear();
      expect(cart.getItems()).toHaveLength(0);
    });
  });
});
























