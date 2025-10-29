#  自动化测试完整指南

完成日期：2025年10月21日  
框架：Vitest + Testing Library  
覆盖率目标：> 70%

---

##  目录

1. [快速开始](#快速开始)
2. [测试框架简介](#测试框架简介)
3. [已实现的测试](#已实现的测试)
4. [如何编写新测试](#如何编写新测试)
5. [常用命令](#常用命令)
6. [最佳实践](#最佳实践)
7. [故障排查](#故障排查)

---

##  快速开始

### 1. 安装依赖（已完成）

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### 2. 运行测试

```bash
# 运行所有测试
npm test

# 监视模式（代码改动时自动重新运行）
npm test -- --watch

# 显示测试UI界面
npm run test:ui

# 生成覆盖率报告
npm run test:coverage
```

### 3. 查看测试结果

```bash
npm test
```

你将看到类似的输出：
```
  src/test/shoppingCart.test.ts (34)
  src/test/search.test.ts (29)

Test Files  2 passed (2)
Tests      63 passed (63)
Duration   1.23s
```

---

##  测试框架简介

### Vitest 特点

- **快速**：基于Vite，比Jest快10倍+
- **简单**：Jest兼容的API
- **集成好**：内置ESM支持
- **智能**：仅运行变更相关的测试

### Testing Library 特点

- **用户中心**：从用户视角测试
- **简洁**：API简单易用
- **可靠**：测试更稳定

---

##  已实现的测试

### 1. 购物车逻辑测试 (34个用例)

 **文件**: `src/test/shoppingCart.test.ts`

**测试覆盖**：
-  添加商品（单个、多个、重复）
-  移除商品
-  调整数量
-  价格计算（单个、多个、重复商品）
-  统计信息（商品数、总件数）
-  清空购物车
-  完整购物流程

**运行测试**：
```bash
npm test -- shoppingCart
```

**示例测试**：
```typescript
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
```

### 2. 搜索和筛选测试 (29个用例)

 **文件**: `src/test/search.test.ts`

**测试覆盖**：
-  按名称搜索
-  按分类筛选
-  按价格范围筛选
-  按评分筛选
-  组合搜索和筛选
-  获取分类列表
-  获取价格范围

**运行测试**：
```bash
npm test -- search
```

**示例测试**：
```typescript
it('应该能按名称搜索到商品', () => {
  const results = search.searchByName('护肤');

  expect(results).toHaveLength(2);
  expect(results.every(p => p.name.includes('护肤'))).toBe(true);
});
```

---

##  如何编写新测试

### 第1步：创建测试文件

在 `src/test/` 目录创建文件，命名格式为 `*.test.ts`

```bash
touch src/test/myFeature.test.ts
```

### 第2步：编写测试

```typescript
import { describe, it, expect, beforeEach } from 'vitest';

describe('我的功能', () => {
  // 设置测试环境
  beforeEach(() => {
    // 初始化数据
  });

  // 测试用例
  it('应该能做某事', () => {
    // 执行操作
    const result = myFunction();

    // 断言结果
    expect(result).toBe(expectedValue);
  });

  it('应该在特定情况下工作', () => {
    // 更复杂的测试
    expect(value).toEqual(expected);
  });
});
```

### 第3步：运行测试

```bash
npm test -- myFeature
```

---

##  常用命令

| 命令 | 说明 |
|------|------|
| `npm test` | 运行所有测试 |
| `npm test -- --watch` | 监视模式 |
| `npm test -- shoppingCart` | 运行特定测试 |
| `npm run test:ui` | 打开UI界面 |
| `npm run test:coverage` | 生成覆盖率报告 |

---

##  最佳实践

### 1. 编写清晰的测试描述

 不好：
```typescript
it('test 1', () => { ... });
```

 好：
```typescript
it('应该能添加商品到购物车并增加数量', () => { ... });
```

### 2. 遵循AAA模式

```typescript
it('应该能计算总价', () => {
  // Arrange（准备）
  const cart = new ShoppingCart();
  cart.addItem({ id: 'p1', name: '商品', price: 100, image: '' });

  // Act（执行）
  const total = cart.getTotalPrice();

  // Assert（断言）
  expect(total).toBe(100);
});
```

### 3. 测试一个概念

```typescript
//  不好：测试太多
it('购物车应该能添加、删除、计算', () => {
  // 3个不同的概念
});

//  好：每个测试一个概念
it('应该能添加商品', () => { ... });
it('应该能删除商品', () => { ... });
it('应该能计算总价', () => { ... });
```

### 4. 使用有意义的断言

```typescript
//  不清晰
expect(items.length).toBe(1);

//  清晰
expect(items).toHaveLength(1);
```

---

##  常用断言方法

### 基础断言

```typescript
expect(value).toBe(expected);                 // 严格相等
expect(value).toEqual(expected);              // 深度相等
expect(value).not.toBe(expected);             // 不相等
```

### 数组/对象

```typescript
expect(array).toHaveLength(5);                // 数组长度
expect(array).toContain('item');              // 包含元素
expect(obj).toHaveProperty('key');            // 有该属性
expect(obj).toMatchObject({ id: 1 });        // 对象包含特定属性
```

### 数值

```typescript
expect(value).toBeGreaterThan(5);             // 大于
expect(value).toBeLessThanOrEqual(10);        // 小于等于
```

### 函数

```typescript
expect(() => func()).not.toThrow();          // 不抛错
expect(func).toHaveBeenCalled();              // 被调用过（需要mock）
```

---

##  测试覆盖率解释

### 什么是覆盖率？

代码覆盖率表示测试覆盖的代码百分比。

### 运行覆盖率报告

```bash
npm run test:coverage
```

### 目标

- **行覆盖率（Line Coverage）**：> 70%
- **分支覆盖率（Branch Coverage）**：> 60%
- **函数覆盖率（Function Coverage）**：> 70%

---

##  故障排查

### 问题1：测试找不到

**错误**：`Cannot find module '@/types'`

**解决**：检查 `vitest.config.ts` 中的路径别名配置

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### 问题2：localStorage未定义

**错误**：`localStorage is not defined`

**解决**：已在 `src/test/setup.ts` 中mock，确保配置正确

### 问题3：测试超时

**错误**：`Test timeout`

**解决**：增加超时时间
```typescript
it('慢速测试', async () => {
  // 测试代码
}, 10000); // 10秒超时
```

---

##  更多测试用例建议

### 下一步应该测试

1. **组件测试**（集成测试）
   ```bash
   npm test -- components/
   ```

2. **数据验证**
   ```typescript
   describe('数据验证', () => {
     it('应该验证邮箱格式', () => { ... });
     it('应该验证电话号码', () => { ... });
   });
   ```

3. **API集成**
   ```typescript
   describe('API调用', () => {
     it('应该能获取产品列表', async () => { ... });
   });
   ```

---

##  测试覆盖目标

| 模块 | 目标覆盖率 | 状态 |
|------|-----------|------|
| 购物车逻辑 | 100% |  完成 |
| 搜索和筛选 | 100% |  完成 |
| 数据验证 | 80% |  待做 |
| 组件渲染 | 70% |  待做 |
| 状态管理 | 90% |  待做 |
| **总体** | **> 70%** |  进行中 |

---

##  测试文件结构

```
src/
├── test/
│   ├── setup.ts                 # 测试环境配置
│   ├── shoppingCart.test.ts     # 购物车测试
│   └── search.test.ts           # 搜索测试
│
├── components/
├── types/
└── services/

vitest.config.ts                # Vitest配置
```

---

##  快速参考

### 运行测试的3种方式

```bash
# 1. 单次运行
npm test

# 2. 监视模式（推荐开发时使用）
npm test -- --watch

# 3. UI模式（最直观）
npm run test:ui
```

### 查看覆盖率

```bash
npm run test:coverage
```

### 只运行特定测试

```bash
# 运行包含"购物车"的测试
npm test -- --grep="购物车"

# 运行特定文件
npm test -- shoppingCart.test
```

---

##  推荐阅读

- [Vitest 官方文档](https://vitest.dev)
- [Testing Library 文档](https://testing-library.com)
- [Jest 断言API](https://vitest.dev/guide/comparisons.html#jest)

---

##  下一步

1. **运行现有测试**：`npm test`
2. **查看UI界面**：`npm run test:ui`
3. **编写新测试**：添加组件测试
4. **提高覆盖率**：目标 > 70%
5. **持续集成**：在CI/CD中运行测试

---

**现在就开始测试吧！** 

```bash
npm test
```

---

*最后更新：2025年10月21日*  
*测试框架：Vitest v3.2.4*


































