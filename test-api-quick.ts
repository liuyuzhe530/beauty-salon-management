#!/usr/bin/env node

/**
 * 快速 API 测试脚本
 * 可以直接在浏览器控制台或 Node.js 环境运行
 * 
 * 使用方法:
 * 1. 浏览器: 复制到 F12 控制台
 * 2. Node.js: npx ts-node test-api-quick.ts
 */

import posterGenerationAPIService from './src/services/posterGenerationAPIService';

// 颜色输出工具
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function success(msg: string) {
  console.log(`${colors.green} ${msg}${colors.reset}`);
}

function error(msg: string) {
  console.log(`${colors.red} ${msg}${colors.reset}`);
}

function info(msg: string) {
  console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`);
}

function warn(msg: string) {
  console.log(`${colors.yellow}️  ${msg}${colors.reset}`);
}

// ============================================================================
// 快速测试
// ============================================================================

async function quickTest() {
  console.log('\n');
  log('╔════════════════════════════════════════════╗', 'cyan');
  log('║   RunningHub API 快速集成测试              ║', 'cyan');
  log('╚════════════════════════════════════════════╝', 'cyan');
  console.log('');

  try {
    // 测试 1: API 状态
    log('━━━ 测试 1: API 可用性 ━━━', 'bright');
    const status = await posterGenerationAPIService.getAPIStatus();
    info(`状态检查完成`);
    console.log(status);

    if (status.available) {
      success('API 在线，可以调用远程服务');
    } else {
      warn('API 暂时不可用，将使用本地降级方案');
    }

    console.log('');

    // 测试 2: 单个海报生成
    log('━━━ 测试 2: 生成单个海报 ━━━', 'bright');
    const startTime = Date.now();
    const response = await posterGenerationAPIService.generatePoster({
      content: '限时优惠 50% 折扣 仅限今天',
      style: 'modern',
      format: 'vertical',
      type: 'promotion',
      includeQRCode: true
    });
    const duration = Date.now() - startTime;

    if (response.success) {
      success(`海报生成成功 (${duration}ms)`);
      info(`格式: ${response.data?.format}`);
      info(`尺寸: ${response.data?.size.width}x${response.data?.size.height}`);
      info(`风格: ${response.data?.design.style}`);
      info(`元素: ${response.data?.design.elements.join(', ')}`);
    } else {
      error(`生成失败: ${response.error?.message}`);
    }

    console.log('');

    // 测试 3: 批量生成
    log('━━━ 测试 3: 批量生成海报 ━━━', 'bright');
    const batchStartTime = Date.now();
    const batchResponses = await posterGenerationAPIService.generatePosterBatch([
      { content: '新客优惠', type: 'promotion' },
      { content: '会员招募', type: 'event' },
      { content: '护肤方案', type: 'skincare' }
    ]);
    const batchDuration = Date.now() - batchStartTime;

    const successCount = batchResponses.filter(r => r.success).length;
    success(`批量生成完成 (${batchDuration}ms)`);
    info(`成功: ${successCount}/${batchResponses.length}`);

    console.log('');

    // 测试 4: 降级机制
    log('━━━ 测试 4: 自动降级机制 ━━━', 'bright');
    posterGenerationAPIService.setAPIFallbackMode(true);
    const fallbackResponse = await posterGenerationAPIService.generatePoster({
      content: '测试降级机制'
    });

    if (fallbackResponse.success) {
      success('降级机制工作正常');
      info(`来源: ${fallbackResponse.meta?.source || 'local'}`);
      info(`响应时间: ${fallbackResponse.meta?.processingTime}ms`);
    } else {
      error('降级机制出现问题');
    }

    console.log('');

    // 总结
    log('━━━ 测试总结 ━━━', 'bright');
    success('所有基础测试已完成');

    const summary = {
      ' API 可用性': status.available ? '在线' : '离线(已启用降级)',
      ' 单个生成': response.success ? '成功' : '失败',
      ' 批量生成': `成功 ${successCount}/${batchResponses.length}`,
      ' 自动降级': fallbackResponse.success ? '正常' : '异常'
    };

    Object.entries(summary).forEach(([key, value]) => {
      console.log(`${key}: ${value}`);
    });

    console.log('');
    success(' API 集成测试完成！');
    console.log('');

    return {
      success: true,
      summary: {
        apiAvailable: status.available,
        singleGenerationSuccess: response.success,
        batchGenerationSuccess: successCount === batchResponses.length,
        fallbackWorking: fallbackResponse.success
      }
    };

  } catch (err: any) {
    console.log('');
    error(`测试执行失败: ${err.message}`);
    console.log('');
    throw err;
  }
}

// ============================================================================
// 详细测试
// ============================================================================

async function detailedTest() {
  console.log('\n');
  log('╔════════════════════════════════════════════╗', 'cyan');
  log('║   详细集成测试 (完整版)                    ║', 'cyan');
  log('╚════════════════════════════════════════════╝', 'cyan');
  console.log('');

  const testCases = [
    {
      name: '促销海报',
      params: {
        content: '限时优惠 50% 折扣 仅限今天',
        style: 'modern',
        format: 'vertical',
        type: 'promotion',
        includeQRCode: true
      }
    },
    {
      name: '产品海报',
      params: {
        content: '新品上市 高端护肤精华液 专业美容师推荐',
        style: 'elegant',
        format: 'vertical',
        type: 'product'
      }
    },
    {
      name: '事件海报',
      params: {
        content: '周年庆典 感恩回馈 开业5周年',
        style: 'vibrant',
        format: 'horizontal',
        type: 'event'
      }
    },
    {
      name: '护肤方案',
      params: {
        content: '深层护肤 皮肤管理专家 专业美容团队',
        style: 'elegant',
        format: 'vertical',
        type: 'skincare'
      }
    }
  ];

  let passCount = 0;
  let failCount = 0;
  let totalTime = 0;

  for (const testCase of testCases) {
    try {
      info(`测试: ${testCase.name}`);
      const start = Date.now();
      const response = await posterGenerationAPIService.generatePoster(testCase.params as any);
      const duration = Date.now() - start;
      totalTime += duration;

      if (response.success) {
        success(` ${testCase.name} (${duration}ms)`);
        passCount++;
      } else {
        error(` ${testCase.name}: ${response.error?.message}`);
        failCount++;
      }
    } catch (err: any) {
      error(` ${testCase.name}: ${err.message}`);
      failCount++;
    }
  }

  console.log('');
  log('━━━ 测试汇总 ━━━', 'bright');
  success(`通过: ${passCount}/${testCases.length}`);
  if (failCount > 0) warn(`失败: ${failCount}/${testCases.length}`);
  info(`总耗时: ${totalTime}ms`);
  info(`平均时间: ${(totalTime / testCases.length).toFixed(0)}ms`);

  return {
    total: testCases.length,
    passed: passCount,
    failed: failCount,
    totalTime,
    avgTime: totalTime / testCases.length
  };
}

// ============================================================================
// 主函数
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  const mode = args[0] || 'quick';

  try {
    if (mode === 'quick') {
      await quickTest();
    } else if (mode === 'detailed') {
      await quickTest();
      console.log('\n');
      await detailedTest();
    } else if (mode === 'help') {
      console.log(`
使用方法:
  npx ts-node test-api-quick.ts [mode]

模式:
  quick     - 快速测试 (默认)
  detailed  - 详细测试
  help      - 显示帮助信息

示例:
  npx ts-node test-api-quick.ts quick
  npx ts-node test-api-quick.ts detailed
      `);
    } else {
      error(`未知模式: ${mode}`);
    }
  } catch (err) {
    console.error('测试失败:', err);
    process.exit(1);
  }
}

// 导出函数供其他模块使用
export { quickTest, detailedTest, log, success, error, info, warn };

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
