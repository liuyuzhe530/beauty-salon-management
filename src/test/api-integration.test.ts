/**
 * API 集成测试套件
 * 测试 RunningHub API 集成和海报生成功能
 */

import posterGenerationAPIService, {
  PosterGenerationRequest,
  PosterGenerationResponse
} from '../services/posterGenerationAPIService';

// ============================================================================
// 1. API 可用性测试
// ============================================================================

export async function testAPIAvailability() {
  console.log('🧪 测试 1: API 可用性检查');
  console.log('━'.repeat(50));

  try {
    const status = await posterGenerationAPIService.getAPIStatus();
    
    console.log('✅ 检查完成');
    console.log(`   API 状态: ${status.available ? '🟢 在线' : '🔴 离线'}`);
    console.log(`   状态: ${status.status}`);
    console.log(`   最后检查时间: ${status.lastCheck}`);
    
    return {
      success: true,
      available: status.available,
      details: status
    };
  } catch (error: any) {
    console.error('❌ 测试失败:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// 2. 单个海报生成测试
// ============================================================================

export async function testSinglePosterGeneration() {
  console.log('\n🧪 测试 2: 单个海报生成');
  console.log('━'.repeat(50));

  const testCases = [
    {
      name: '促销海报',
      request: {
        content: '限时优惠 50% 折扣 仅限今天',
        style: 'modern' as const,
        format: 'vertical' as const,
        type: 'promotion' as const,
        includeQRCode: true
      }
    },
    {
      name: '产品海报',
      request: {
        content: '新品上市 高端护肤精华液 专业美容师推荐',
        style: 'elegant' as const,
        format: 'vertical' as const,
        type: 'product' as const,
        includeQRCode: false
      }
    },
    {
      name: '护肤海报',
      request: {
        content: '深层护肤 皮肤管理专家 专业美容团队服务',
        style: 'elegant' as const,
        format: 'horizontal' as const,
        type: 'skincare' as const,
        includeQRCode: true
      }
    }
  ];

  const results = [];

  for (const testCase of testCases) {
    console.log(`\n📝 生成: ${testCase.name}`);
    try {
      const startTime = Date.now();
      const response = await posterGenerationAPIService.generatePoster(testCase.request);
      const duration = Date.now() - startTime;

      if (response.success && response.data) {
        console.log(`   ✅ 成功 (${duration}ms)`);
        console.log(`   格式: ${response.data.format}`);
        console.log(`   尺寸: ${response.data.size.width}x${response.data.size.height}`);
        console.log(`   风格: ${response.data.design.style}`);
        console.log(`   元素数: ${response.data.design.elements.length}`);
        results.push({ success: true, name: testCase.name, duration });
      } else {
        console.log(`   ⚠️ 失败: ${response.error?.message}`);
        results.push({ success: false, name: testCase.name, error: response.error });
      }
    } catch (error: any) {
      console.error(`   ❌ 异常: ${error.message}`);
      results.push({ success: false, name: testCase.name, error: error.message });
    }
  }

  return results;
}

// ============================================================================
// 3. 批量生成测试
// ============================================================================

export async function testBatchPosterGeneration() {
  console.log('\n🧪 测试 3: 批量海报生成');
  console.log('━'.repeat(50));

  const requests: PosterGenerationRequest[] = [
    { content: '新客优惠', type: 'promotion' },
    { content: '会员招募', type: 'event' },
    { content: '产品展示', type: 'product' },
    { content: '护肤方案', type: 'skincare' }
  ];

  console.log(`📦 批量生成 ${requests.length} 个海报...`);

  try {
    const startTime = Date.now();
    const responses = await posterGenerationAPIService.generatePosterBatch(requests);
    const duration = Date.now() - startTime;

    const successCount = responses.filter(r => r.success).length;
    console.log(`   ✅ 完成 (${duration}ms)`);
    console.log(`   成功: ${successCount}/${responses.length}`);
    console.log(`   平均时间: ${Math.round(duration / responses.length)}ms`);

    return {
      success: true,
      total: responses.length,
      succeeded: successCount,
      duration,
      results: responses
    };
  } catch (error: any) {
    console.error(`   ❌ 异常: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

// ============================================================================
// 4. 降级策略测试
// ============================================================================

export async function testFallbackStrategy() {
  console.log('\n🧪 测试 4: 自动降级策略');
  console.log('━'.repeat(50));

  console.log('📝 配置测试：启用降级模式');
  posterGenerationAPIService.setAPIFallbackMode(true);

  try {
    const response = await posterGenerationAPIService.generatePoster({
      content: '测试降级策略',
      type: 'general'
    });

    if (response.success) {
      console.log('   ✅ 降级策略工作正常');
      console.log(`   生成来源: 本地生成`);
      console.log(`   响应时间: ${response.meta?.processingTime}ms`);
      return { success: true };
    }
  } catch (error: any) {
    console.error(`   ❌ 测试失败: ${error.message}`);
    return { success: false, error: error.message };
  }
}

// ============================================================================
// 5. 性能测试
// ============================================================================

export async function testPerformance() {
  console.log('\n🧪 测试 5: 性能测试');
  console.log('━'.repeat(50));

  const iterations = 10;
  const times: number[] = [];

  console.log(`📊 执行 ${iterations} 次海报生成...`);

  for (let i = 0; i < iterations; i++) {
    try {
      const startTime = Date.now();
      await posterGenerationAPIService.generatePoster({
        content: `测试海报 #${i + 1}`,
        type: 'general'
      });
      times.push(Date.now() - startTime);
      process.stdout.write(`\r   进度: ${i + 1}/${iterations}`);
    } catch (error) {
      console.error(`   ❌ 生成失败 #${i + 1}`);
    }
  }

  const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  console.log('\n   ✅ 性能统计:');
  console.log(`   平均时间: ${avgTime.toFixed(2)}ms`);
  console.log(`   最快: ${minTime}ms`);
  console.log(`   最慢: ${maxTime}ms`);

  return {
    iterations,
    average: avgTime,
    min: minTime,
    max: maxTime,
    times
  };
}

// ============================================================================
// 6. 完整测试套件
// ============================================================================

export async function runAllTests() {
  console.log('\n');
  console.log('╔' + '═'.repeat(48) + '╗');
  console.log('║' + '  API 集成完整测试套件'.padEnd(48) + '║');
  console.log('║' + '  RunningHub 海报生成 API'.padEnd(48) + '║');
  console.log('╚' + '═'.repeat(48) + '╝');

  const results: any = {};

  try {
    // 测试 1: API 可用性
    results.apiAvailability = await testAPIAvailability();

    // 测试 2: 单个生成
    results.singleGeneration = await testSinglePosterGeneration();

    // 测试 3: 批量生成
    results.batchGeneration = await testBatchPosterGeneration();

    // 测试 4: 降级策略
    results.fallbackStrategy = await testFallbackStrategy();

    // 测试 5: 性能测试
    results.performance = await testPerformance();

    // 输出总结
    console.log('\n');
    console.log('╔' + '═'.repeat(48) + '╗');
    console.log('║' + '  测试总结'.padEnd(48) + '║');
    console.log('╚' + '═'.repeat(48) + '╝');

    console.log(`\n✅ API 可用性: ${results.apiAvailability.success ? '✅ 通过' : '❌ 失败'}`);
    console.log(`✅ 单个生成: ${results.singleGeneration.filter((r: any) => r.success).length}/${results.singleGeneration.length} 通过`);
    console.log(`✅ 批量生成: ${results.batchGeneration.success ? '✅ 通过' : '❌ 失败'}`);
    console.log(`✅ 降级策略: ${results.fallbackStrategy.success ? '✅ 通过' : '❌ 失败'}`);
    console.log(`✅ 性能测试: 平均 ${results.performance.average.toFixed(2)}ms`);

    return results;
  } catch (error: any) {
    console.error('\n❌ 测试套件执行错误:', error.message);
    throw error;
  }
}

// ============================================================================
// 7. 浏览器控制台测试代码
// ============================================================================

export function getBrowserTestCode(): string {
  return `
// 在浏览器控制台运行以下代码进行测试

import posterGenerationAPIService from '@/services/posterGenerationAPIService';

// 测试 1: 检查 API 状态
async function testAPI() {
  const status = await posterGenerationAPIService.getAPIStatus();
  console.log('API 状态:', status);
  return status;
}

// 测试 2: 生成海报
async function generatePoster() {
  const response = await posterGenerationAPIService.generatePoster({
    content: '限时优惠 50% 折扣',
    style: 'modern',
    format: 'vertical',
    type: 'promotion'
  });
  console.log('生成结果:', response);
  return response;
}

// 测试 3: 检查降级
async function testFallback() {
  posterGenerationAPIService.setAPIFallbackMode(true);
  const response = await posterGenerationAPIService.generatePoster({
    content: '测试降级'
  });
  console.log('降级结果:', response);
  return response;
}

// 运行测试
await testAPI();
await generatePoster();
await testFallback();
`;
}
