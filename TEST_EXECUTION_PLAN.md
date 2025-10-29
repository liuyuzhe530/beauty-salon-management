#  API 集成测试执行计划

**目标**: 完整测试 RunningHub 海报生成 API 的集成情况

**状态**:  就绪

---

##  快速导航

- [方案一：浏览器控制台（最简单）](#方案一浏览器控制台最简单)
- [方案二：命令行测试（完整测试）](#方案二命令行测试完整测试)
- [方案三：集成测试套件（深度测试）](#方案三集成测试套件深度测试)
- [测试结果分析](#测试结果分析)

---

## 方案一：浏览器控制台（最简单）

### ️ 预计时间：2 分钟

###  步骤

#### 步骤 1: 打开浏览器开发者工具

```
按下: F12 或 Ctrl+Shift+I
```

#### 步骤 2: 切换到 Console 标签

点击 **Console** 标签

#### 步骤 3: 运行快速检查

复制以下代码到控制台，按 Enter 运行：

```javascript
// 快速检查（30秒内完成）
const { posterGenerationAPIService } = await import('src/services/posterGenerationAPIService.js');

console.log(' 开始检查...\n');

// 检查 1: API 状态
const status = await posterGenerationAPIService.getAPIStatus();
console.log(' API 状态检查完成');
console.log(status.available ? ' API 在线' : ' API 离线（启用降级）');
console.log('');

// 检查 2: 生成海报
const response = await posterGenerationAPIService.generatePoster({
  content: '限时优惠 50% 折扣'
});
console.log(' 海报生成检查完成');
console.log(response.success ? ' 生成成功' : ' 生成失败');
console.log('');

// 检查 3: 降级机制
posterGenerationAPIService.setAPIFallbackMode(true);
const fallback = await posterGenerationAPIService.generatePoster({ content: '测试' });
console.log(' 降级机制检查完成');
console.log(fallback.success ? ' 降级正常' : ' 降级异常');
console.log('\n 快速检查完成！');
```

###  预期输出

```
 开始检查...

 API 状态检查完成
 API 离线（启用降级）

 海报生成检查完成
 生成成功

 降级机制检查完成
 降级正常

 快速检查完成！
```

###  成功标志

-  三个检查都完成
-  没有红色错误信息
-  所有操作响应时间 < 3 秒

---

## 方案二：命令行测试（完整测试）

### ️ 预计时间：5 分钟

###  步骤

#### 步骤 1: 打开 PowerShell

在 `E:\xincs\xincs` 目录打开 PowerShell

#### 步骤 2: 运行快速测试

```powershell
cd E:\xincs\xincs
npx ts-node test-api-quick.ts quick
```

**输出示例**：

```
╔════════════════════════════════════════════╗
║   RunningHub API 快速集成测试              ║
╚════════════════════════════════════════════╝

━━━ 测试 1: API 可用性 ━━━
ℹ️  状态检查完成
{
  available: false,
  status: 'UNKNOWN_ERROR',
  lastCheck: '2024-10-29T10:35:00Z'
}
️  API 暂时不可用，将使用本地降级方案

━━━ 测试 2: 生成单个海报 ━━━
 海报生成成功 (45ms)
ℹ️  格式: vertical
ℹ️  尺寸: 1080x1920
ℹ️  风格: modern
ℹ️  元素: background, text, logo, qrcode

━━━ 测试 3: 批量生成海报 ━━━
 批量生成完成 (128ms)
ℹ️  成功: 3/3

━━━ 测试 4: 自动降级机制 ━━━
 降级机制工作正常
ℹ️  来源: local
ℹ️  响应时间: 32ms

━━━ 测试总结 ━━━
 所有基础测试已完成
 API 可用性: 离线(已启用降级)
 单个生成: 成功
 批量生成: 成功 3/3
 自动降级: 正常

 API 集成测试完成！
```

#### 步骤 3: 运行详细测试（可选）

```powershell
npx ts-node test-api-quick.ts detailed
```

这会运行 4 种不同类型的海报生成测试，包括：
- 促销海报
- 产品海报
- 事件海报
- 护肤方案海报

---

## 方案三：集成测试套件（深度测试）

### ️ 预计时间：10 分钟

###  步骤

#### 步骤 1: 运行完整测试套件

```powershell
npm test -- src/test/api-integration.test.ts
```

#### 步骤 2: 查看详细输出

```powershell
npm test -- src/test/api-integration.test.ts --reporter=verbose
```

#### 步骤 3: 生成覆盖率报告

```powershell
npm test -- src/test/api-integration.test.ts --coverage
```

###  测试套件包括

1. **API 可用性测试** 
   - 检查 API 在线/离线状态
   - 检查返回数据格式
   - 验证时间戳

2. **单个海报生成测试** 
   - 促销海报生成
   - 产品海报生成
   - 护肤方案生成
   - 验证生成时间
   - 验证海报质量

3. **批量生成测试** 
   - 4 张海报批量生成
   - 验证并发处理
   - 检查性能

4. **自动降级测试** 
   - 验证降级机制激活
   - 验证本地生成质量
   - 检查响应时间

5. **性能测试** 
   - 10 次连续生成
   - 计算平均响应时间
   - 找出性能瓶颈

---

##  详细测试场景

### 场景 1: API 在线 → 远程生成

```javascript
// 当 API 在线时的流程
用户请求生成海报
  ↓
检查 API 可用性 →  在线
  ↓
调用 RunningHub API
  ↓
返回高质量海报
  ↓
显示给用户
```

**预期结果**: 快速生成，质量最佳

### 场景 2: API 离线 → 本地降级

```javascript
// 当 API 离线时的流程
用户请求生成海报
  ↓
检查 API 可用性 →  离线
  ↓
启动本地生成引擎
  ↓
返回本地生成海报
  ↓
显示给用户
```

**预期结果**: 快速返回，降级无缝

### 场景 3: 批量生成 → 并发处理

```javascript
// 批量生成多个海报
用户请求生成 4 个海报
  ↓
并发处理请求（4 个并行）
  ↓
等待所有完成
  ↓
返回 4 个海报
```

**预期结果**: 总时间 < 单个时间 × 2

---

##  测试结果分析

### 成功标准 

| 测试项 | 标准 | 状态 |
|--------|------|------|
| API 可用性 | 能检查状态 |  |
| 单个生成 | 3/3 成功 |  |
| 批量生成 | 3/3 成功 |  |
| 降级机制 | 能自动转换 |  |
| 性能 | 平均 < 500ms |  |
| 质量 | 有效的海报 |  |

### 性能基准

| 场景 | 预期 | 实际 | 评分 |
|------|------|------|------|
| API 检查 | <1s | - | - |
| 单个生成 | <3s | - | - |
| 批量生成(4个) | <10s | - | - |
| 降级生成 | <100ms | - | - |
| 平均响应 | <500ms | - | - |

---

##  测试清单

### 开发阶段 

- [x] 创建 API 服务层 (`posterGenerationAPIService.ts`)
- [x] 实现降级机制
- [x] 创建测试套件 (`api-integration.test.ts`)
- [x] 编写快速测试脚本 (`test-api-quick.ts`)
- [x] 创建测试文档

### 测试阶段

- [ ] 运行快速检查（浏览器）
- [ ] 运行命令行测试
- [ ] 运行完整测试套件
- [ ] 记录性能指标
- [ ] 验证降级机制
- [ ] 检查错误处理

### 生产前

- [ ] 所有测试通过
- [ ] 性能达标
- [ ] 文档完整
- [ ] 告警配置
- [ ] 回滚计划

---

##  立即开始测试

### 最快方式（1 分钟）

```javascript
// 在浏览器控制台运行
const { posterGenerationAPIService } = await import('src/services/posterGenerationAPIService.js');
const status = await posterGenerationAPIService.getAPIStatus();
console.log(status);
```

### 推荐方式（5 分钟）

```bash
cd E:\xincs\xincs
npx ts-node test-api-quick.ts quick
```

### 完整方式（10 分钟）

```bash
npm test -- src/test/api-integration.test.ts --reporter=verbose
```

---

##  测试技巧

### 技巧 1: 查看详细日志

```javascript
// 启用详细日志
localStorage.setItem('DEBUG_POSTER_API', 'true');

// 运行测试后查看日志
console.log('所有日志已保存到 localStorage');
```

### 技巧 2: 多次运行对比

```javascript
// 运行 5 次，对比性能
for (let i = 0; i < 5; i++) {
  console.time(`测试 ${i + 1}`);
  await posterGenerationAPIService.generatePoster({ content: '测试' });
  console.timeEnd(`测试 ${i + 1}`);
}
```

### 技巧 3: 测试不同参数

```javascript
// 测试不同的生成参数
const params = [
  { content: '短文案', style: 'modern' },
  { content: '长文案长文案长文案', style: 'elegant' },
  { content: '特殊符号 !@#$%', format: 'horizontal' }
];

for (const param of params) {
  const result = await posterGenerationAPIService.generatePoster(param);
  console.log(`${param.content}: ${result.success ? '' : ''}`);
}
```

---

##  故障排查

### 问题 1: 测试脚本找不到

**解决**:
```bash
# 确保在正确的目录
cd E:\xincs\xincs

# 检查文件是否存在
ls test-api-quick.ts
```

### 问题 2: 超时错误

**解决**:
```javascript
// 增加超时时间
posterGenerationAPIService.setTimeout(10000); // 10 秒
```

### 问题 3: 导入错误

**解决**:
```javascript
// 确保使用正确的导入路径
import posterGenerationAPIService from '@/services/posterGenerationAPIService';

// 或在浏览器中
const service = (await import('src/services/posterGenerationAPIService.js')).posterGenerationAPIService;
```

---

##  获取帮助

### 查看完整文档

-  `API_INTEGRATION_TEST_GUIDE.md` - 完整测试指南
-  `RUNNINGHUB_API_INTEGRATION_REPORT.md` - API 集成报告
-  `posterGenerationAPIService.ts` - 服务代码注释

### 常见问题

**Q: API 返回 500 错误怎么办？**
A: 这是正常的，API 暂时不可用。自动降级已启用，本地生成可用。

**Q: 如何确认降级机制工作？**
A: 运行测试时查看 `response.meta?.source`，应该是 'local' 或 'fallback'。

**Q: 性能如何评估？**
A: 查看 `response.meta?.processingTime`，应该 < 100ms（本地）或 < 3s（API）。

---

##  总结

### 现在可以做的 

1.  在浏览器控制台运行快速检查
2.  命令行运行完整测试
3.  验证 API 集成工作
4.  确认降级机制启用
5.  评估性能指标

### 测试资源 

- 测试脚本: `test-api-quick.ts`
- 测试套件: `src/test/api-integration.test.ts`
- 服务层: `src/services/posterGenerationAPIService.ts`
- 文档: `API_INTEGRATION_TEST_GUIDE.md`

### 下一步 

- [ ] 执行快速测试
- [ ] 记录测试结果
- [ ] 评估性能数据
- [ ] 提交测试报告

---

**版本**: 1.0.0  
**状态**:  就绪  
**更新时间**: 2024-10-29  
**下一步**: 立即开始测试！
