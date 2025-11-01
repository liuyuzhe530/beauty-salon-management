const fs = require('fs-extra');
const path = require('path');

const rootPath = 'E:\\xincs\\xincs';
const srcPath = path.join(rootPath, 'src');

const sharedDirs = [
  'api',
  'context',
  'services',
  'types',
  'styles',
  'hooks',
  'data',
  'components'
];

const sharedFiles = [
  'main.tsx',
  'vite-env.d.ts'
];

const portals = [
  { name: 'admin-portal', role: 'admin' },
  { name: 'staff-portal', role: 'staff' },
  { name: 'customer-app', role: 'customer' }
];

console.log('\n🚀 开始拆分三个应用...');
console.log(`根目录: ${rootPath}\n`);

portals.forEach(portal => {
  const portalName = portal.name;
  const portalPath = path.join(rootPath, portalName, 'src');
  
  console.log(`📂 处理应用: ${portalName}`);
  
  // 创建 src 目录
  fs.ensureDirSync(portalPath);
  
  // 复制共享目录
  console.log('  ✓ 复制共享代码文件...');
  sharedDirs.forEach(dir => {
    const sourceDir = path.join(srcPath, dir);
    const destDir = path.join(portalPath, dir);
    
    if (fs.existsSync(sourceDir)) {
      fs.copySync(sourceDir, destDir, { overwrite: true });
    }
  });
  
  // 复制共享文件
  console.log('  ✓ 复制单个文件...');
  sharedFiles.forEach(file => {
    const sourceFile = path.join(srcPath, file);
    const destFile = path.join(portalPath, file);
    
    if (fs.existsSync(sourceFile)) {
      fs.copySync(sourceFile, destFile, { overwrite: true });
    }
  });
  
  console.log(`  ✅ ${portalName} 文件复制完成！\n`);
});

console.log('✨ 所有文件复制完成！');
console.log('\n下一步: 修改各应用的 App.tsx 文件');
console.log('参考: SPLIT_THREE_PORTALS_GUIDE.md\n');


