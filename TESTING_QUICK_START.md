# ⚡ 自动化测试 - 快速启动

## 🎯 3个基本命令

```bash
# 1️⃣ 运行所有测试
npm test

# 2️⃣ 监视模式（开发时推荐）
npm test -- --watch

# 3️⃣ 查看UI界面（最直观）
npm run test:ui
```

---

## ✅ 当前测试状态

```
✓ src/test/search.test.ts          (20 tests)
✓ src/test/shoppingCart.test.ts    (17 tests)

Test Files  2 passed (2)
Tests       37 passed (37)
Duration    1.19s
```

---

## 📊 测试覆盖

| 功能 | 用例数 | 状态 |
|------|--------|------|
| 购物车逻辑 | 17个 | ✅ 全部通过 |
| 搜索筛选 | 20个 | ✅ 全部通过 |
| **总计** | **37个** | **✅ 100% 通过** |

---

## 🚀 测试的内容

### 购物车测试 (17个用例)
- ✅ 添加商品
- ✅ 移除商品
- ✅ 调整数量
- ✅ 计算价格
- ✅ 统计信息
- ✅ 清空购物车
- ✅ 完整流程

### 搜索筛选 (20个用例)
- ✅ 按名称搜索
- ✅ 按分类筛选
- ✅ 按价格筛选
- ✅ 按评分筛选
- ✅ 组合搜索
- ✅ 获取元数据

---

## 📝 编写新测试

### 1. 创建测试文件
```bash
touch src/test/myFeature.test.ts
```

### 2. 基本模板
```typescript
import { describe, it, expect } from 'vitest';

describe('我的功能', () => {
  it('应该能做某事', () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### 3. 运行测试
```bash
npm test -- myFeature
```

---

## 🔥 更多命令

```bash
# 监视特定文件
npm test -- --watch shoppingCart

# 生成覆盖率报告
npm run test:coverage

# 只运行失败的测试
npm test -- --failed-only

# 运行包含特定文本的测试
npm test -- --grep="购物车"
```

---

## 📖 常用断言

```typescript
// 基础
expect(value).toBe(5);
expect(value).toEqual(expected);
expect(value).not.toBe(5);

// 数组
expect(arr).toHaveLength(3);
expect(arr).toContain('item');

// 对象
expect(obj).toHaveProperty('key');
expect(obj).toMatchObject({ id: 1 });

// 数值
expect(num).toBeGreaterThan(5);
expect(num).toBeLessThanOrEqual(10);

// 异常
expect(() => func()).not.toThrow();
```

---

## 💡 测试最佳实践

### ✅ 好的做法
```typescript
it('应该能添加商品到购物车', () => {
  // Arrange（准备）
  const cart = new ShoppingCart();

  // Act（执行）
  cart.addItem(product);

  // Assert（断言）
  expect(cart.getItems()).toHaveLength(1);
});
```

### ❌ 不好的做法
```typescript
// 描述不清
it('test', () => { ... });

// 测试太多概念
it('应该能添加、删除、计算', () => { ... });

// 无意义的断言
expect(items.length).toBe(1);
```

---

## 📁 文件结构

```
src/
├── test/
│   ├── setup.ts              # ← 测试配置
│   ├── shoppingCart.test.ts  # ← 购物车测试
│   └── search.test.ts        # ← 搜索测试
```

---

## 🎓 下一步

1. **运行测试**：`npm test`
2. **查看覆盖率**：`npm run test:coverage`
3. **添加新测试**：基于模板创建
4. **提高覆盖率**：目标 > 70%

---

**立即开始测试！** 🧪

```bash
npm test
```

---

*框架*：Vitest v3.2.4  
*总测试*：37 个  
*通过率*：100% ✅





