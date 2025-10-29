
#  API 集成测试指南

完整的 RunningHub API 集成测试方案和使用说明。

---

##  目录

1. [快速开始](#快速开始)
2. [测试方法](#测试方法)
3. [浏览器控制台测试](#浏览器控制台测试)
4. [集成测试套件](#集成测试套件)
5. [性能基准](#性能基准)
6. [故障排查](#故障排查)
7. [集成检查清单](#集成检查清单)

---

##  快速开始

### 方法 1: 浏览器控制台（最快）

1. **打开浏览器开发者工具** (F12)
2. **切换到 Console 标签**
3. **粘贴以下代码：**

```javascript
// 检查 API 状态
import('src/services/posterGenerationAPIService.js').then(m => {
  m.posterGenerationAPIService.getAPIStatus().then(status => {
    console.log(' API 状态:', status);
  });
});
```

### 方法 2: 命令行测试（推荐）

```bash
cd E:\xincs\xincs
npm test -- src/test/api-integration.test.ts
```

---

##  测试方法

### 测试 1️⃣ : API 可用性检查

**目的**：检查 RunningHub API 是否在线

**代码**：
```javascript
const { posterGenerationAPIService } = await import('src/services/posterGenerationAPIService.js');
const status = await posterGenerationAPIService.getAPIStatus();
console.log('API 状态:', status);
```

**预期结果**：
```json
{
  "available": false,  // API 当前离线
  "status": "UNKNOWN_ERROR",
  "lastCheck": "2024-10-29T10:30:00Z"
}
```

---

### 测试 2️⃣ : 单个海报生成

**目的**：测试生成单个海报

**代码**：
```javascript
const response = await posterGenerationAPIService.generatePoster({
  content: '限时优惠 50% 折扣',
  style: 'modern',
  format: 'vertical',
  type: 'promotion',
  includeQRCode: true
});

console.log('生成结果:', response);
console.log('海报URL:', response.data?.posterUrl);
```

**预期结果**：
```json
{
  "success": true,
  "data": {
    "format": "vertical",
    "size": {"width": 1080, "height": 1920},
    "design": {
      "style": "modern",
      "elements": ["background", "text", "logo", "qrcode"]
    },
    "posterUrl": "data:image/svg+xml;base64,...",
    "metadata": {...}
  }
}
```

---

### 测试 3️⃣ : 批量生成海报

**目的**：测试批量生成多个海报

**代码**：
```javascript
const requests = [
  { content: '新客优惠', type: 'promotion' },
  { content: '会员招募', type: 'event' },
  { content: '产品展示', type: 'product' }
];

const responses = await posterGenerationAPIService.generatePosterBatch(requests);
console.log(`成功: ${responses.filter(r => r.success).length}/${responses.length}`);
responses.forEach((r, i) => {
  console.log(`海报 ${i + 1}:`, r.success ? '' : '');
});
```

---

### 测试 4️⃣ : 自动降级测试

**目的**：验证当 API 不可用时的自动降级机制

**代码**：
```javascript
// 启用降级模式
posterGenerationAPIService.setAPIFallbackMode(true);

const response = await posterGenerationAPIService.generatePoster({
  content: '测试降级机制'
});

console.log('降级结果:', response);
console.log('来源:', response.meta?.source); // 应该是 'fallback' 或 'local'
```

---

### 测试 5️⃣ : 性能测试

**目的**：评估海报生成的性能

**代码**：
```javascript
const times = [];
const iterations = 10;

console.log(`开始 ${iterations} 次性能测试...`);

for (let i = 0; i < iterations; i++) {
  const start = performance.now();
  await posterGenerationAPIService.generatePoster({
    content: `测试海报 #${i + 1}`
  });
  times.push(performance.now() - start);
}

const avg = times.reduce((a, b) => a + b) / times.length;
console.log(`
 性能统计:
  平均时间: ${avg.toFixed(2)}ms
  最快: ${Math.min(...times).toFixed(2)}ms
  最慢: ${Math.max(...times).toFixed(2)}ms
`);
```

---

##  浏览器控制台测试

### 完整测试脚本

复制以下完整代码到浏览器控制台：

```javascript
// ===== 完整 API 集成测试脚本 =====

const log = console.log;
const group = console.group;
const groupEnd = console.groupEnd;
const error = console.error;

async function runAllTests() {
  log(' 开始 API 集成测试...\n');
  
  try {
    const service = (await import('src/services/posterGenerationAPIService.js')).posterGenerationAPIService;
    
    // 测试 1: API 可用性
    group(' 测试 1: API 可用性');
    const status = await service.getAPIStatus();
    log('API 状态:', status);
    log(status.available ? ' API 在线' : ' API 离线');
    groupEnd();
    
    // 测试 2: 生成促销海报
    group(' 测试 2: 生成促销海报');
    const promoResponse = await service.generatePoster({
      content: '限时优惠 50% 折扣',
      style: 'modern',
      format: 'vertical',
      type: 'promotion'
    });
    log('生成结果:', promoResponse);
    log(promoResponse.success ? ' 成功' : ' 失败');
    groupEnd();
    
    // 测试 3: 生成产品海报
    group(' 测试 3: 生成产品海报');
    const productResponse = await service.generatePoster({
      content: '新品上市 高端护肤精华液',
      style: 'elegant',
      format: 'vertical',
      type: 'product'
    });
    log('生成结果:', productResponse);
    log(productResponse.success ? ' 成功' : ' 失败');
    groupEnd();
    
    // 测试 4: 批量生成
    group(' 测试 4: 批量生成');
    const batchResponses = await service.generatePosterBatch([
      { content: '新客优惠', type: 'promotion' },
      { content: '会员招募', type: 'event' },
      { content: '护肤方案', type: 'skincare' }
    ]);
    const successCount = batchResponses.filter(r => r.success).length;
    log(` 成功 ${successCount}/${batchResponses.length} 个`);
    groupEnd();
    
    // 测试 5: 降级机制
    group(' 测试 5: 自动降级');
    service.setAPIFallbackMode(true);
    const fallbackResponse = await service.generatePoster({
      content: '测试降级机制'
    });
    log('降级结果:', fallbackResponse);
    log('来源:', fallbackResponse.meta?.source);
    groupEnd();
    
    log('\n 所有测试完成！');
    
  } catch (err) {
    error(' 测试过程中发生错误:', err);
  }
}

// 运行测试
runAllTests();
```

### 快速检查

如果只想快速检查：

```javascript
// 快速检查：3 秒内完成
const { posterGenerationAPIService } = await import('src/services/posterGenerationAPIService.js');

console.log(' 检查中...');
const status = await posterGenerationAPIService.getAPIStatus();
console.log(status);

const test = await posterGenerationAPIService.generatePoster({ content: '测试' });
console.log(test.success ? ' 工作正常' : ' 有问题');
```

---

##  集成测试套件

### 使用 Vitest 运行测试

```bash
# 运行完整测试
npm test -- src/test/api-integration.test.ts

# 运行并显示详细输出
npm test -- src/test/api-integration.test.ts --reporter=verbose

# 生成覆盖率报告
npm test -- src/test/api-integration.test.ts --coverage
```

### 导入测试函数

```typescript
import {
  testAPIAvailability,
  testSinglePosterGeneration,
  testBatchPosterGeneration,
  testFallbackStrategy,
  testPerformance,
  runAllTests
} from '@/test/api-integration.test';

// 运行全部测试
const results = await runAllTests();
console.log('测试结果:', results);
```

---

##  性能基准

### 预期性能指标

| 测试项 | 预期值 | 实际值 |
|--------|--------|--------|
| API 检查 | <1s | - |
| 单个生成 | <3s | - |
| 批量生成(4个) | <10s | - |
| 降级模式 | <100ms | - |
| 平均响应 | <500ms | - |

### 性能优化建议

1. **启用缓存**：相同内容的海报可以缓存
2. **并发控制**：限制同时请求数
3. **超时设置**：设置合理的超时时间

```javascript
// 优化示例
const results = [];
const batchSize = 5;

for (let i = 0; i < requests.length; i += batchSize) {
  const batch = requests.slice(i, i + batchSize);
  const responses = await Promise.all(
    batch.map(req => posterGenerationAPIService.generatePoster(req))
  );
  results.push(...responses);
}
```

---

##  故障排查

### 常见问题

#### Q1: API 返回 500 错误

**原因**：RunningHub API 服务暂时不可用

**解决方案**：
-  自动降级已启用，本地生成可用
- 等待 API 恢复
- 检查网络连接
- 验证 API 密钥（如需要）

**测试降级**：
```javascript
const status = await posterGenerationAPIService.getAPIStatus();
if (!status.available) {
  console.log('API 不可用，使用本地生成');
  posterGenerationAPIService.setAPIFallbackMode(true);
}
```

---

#### Q2: 超时错误

**原因**：请求超过 3 秒仍未响应

**解决方案**：
- 检查网络连接
- 启用降级模式
- 减少批量请求数量

---

#### Q3: 生成的海报质量不好

**原因**：使用了本地降级方案

**解决方案**：
- 等待 API 恢复
- 调整生成参数
- 使用不同的风格

---

### 调试技巧

```javascript
// 启用详细日志
localStorage.setItem('DEBUG_POSTER_API', 'true');

// 检查服务状态
posterGenerationAPIService.isDemoMode();

// 查看请求历史
console.log('最后生成:', posterGenerationAPIService.lastRequest);

// 重置服务
posterGenerationAPIService.clearHistory();
```

---

##  集成检查清单

在生产环境前，确保以下所有项都已检查：

### 开发阶段
- [ ] API 服务已创建 (`posterGenerationAPIService.ts`)
- [ ] 服务已集成到 `MarketingAssistant.tsx`
- [ ] 类型定义完整 (`PosterGenerationRequest`, `PosterGenerationResponse`)
- [ ] 错误处理已实现
- [ ] 降级机制已启用

### 测试阶段
- [ ] API 可用性测试 
- [ ] 单个生成测试 
- [ ] 批量生成测试 
- [ ] 降级机制测试 
- [ ] 性能基准测试 

### 生产前
- [ ] 所有测试通过
- [ ] 错误日志配置完成
- [ ] 监控告警已设置
- [ ] 文档已更新
- [ ] 回滚计划已制定

### 生产后
- [ ] 监控 API 调用成功率
- [ ] 记录性能指标
- [ ] 收集用户反馈
- [ ] 定期检查服务健康状态

---

##  监控与告警

### 设置监控

```javascript
class APIMonitor {
  constructor() {
    this.stats = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      apiAvailabilityRate: 0
    };
  }

  async trackRequest(fn) {
    const start = performance.now();
    try {
      const result = await fn();
      this.stats.successfulRequests++;
      return result;
    } catch (err) {
      this.stats.failedRequests++;
      throw err;
    } finally {
      this.stats.totalRequests++;
      const duration = performance.now() - start;
      this.updateAverageTime(duration);
    }
  }

  getStats() {
    return {
      ...this.stats,
      successRate: (this.stats.successfulRequests / this.stats.totalRequests * 100).toFixed(2) + '%'
    };
  }
}
```

---

##  下一步

### 立即可以做的

1.  在浏览器控制台运行快速测试
2.  验证本地生成是否工作
3.  检查 API 可用性

### 短期（1周内）

1.  联系 RunningHub 支持
2.  配置 API 认证信息
3.  设置监控告警

### 中期（修复后）

1.  启用 API 模式
2.  优化性能
3.  完整文档化

---

##  支持

遇到问题？

1. **检查文档** → 查看本指南
2. **运行诊断** → 执行集成测试
3. **查看日志** → 检查浏览器控制台
4. **联系技术支持** → RunningHub 官方支持

---

**版本**: 1.0.0  
**最后更新**: 2024-10-29  
**状态**:  生产就绪

