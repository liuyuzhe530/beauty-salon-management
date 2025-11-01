#!/usr/bin/env powershell
# 美容院管理系统 - 三端拆分自动化脚本

$rootPath = "E:\xincs\xincs"
$srcPath = "$rootPath\src"

Write-Host "`n🚀 开始拆分三个应用..." -ForegroundColor Green
Write-Host "根目录: $rootPath" -ForegroundColor Cyan

# 定义要复制的目录（共享文件）
$sharedDirs = @(
    "api",
    "context",
    "services",
    "types",
    "styles",
    "hooks",
    "data"
)

# 定义要复制的单个文件（共享文件）
$sharedFiles = @(
    "main.tsx",
    "vite-env.d.ts"
)

# 三个应用的定义
$portals = @(
    @{ name = "admin-portal"; role = "admin" },
    @{ name = "staff-portal"; role = "staff" },
    @{ name = "customer-app"; role = "customer" }
)

# 为每个应用创建 src 结构
foreach ($portal in $portals) {
    $portalName = $portal.name
    $portalPath = "$rootPath\$portalName\src"
    
    Write-Host "`n📂 处理应用: $portalName" -ForegroundColor Yellow
    
    # 1. 创建目录结构
    Write-Host "  ✓ 创建目录结构..." -ForegroundColor Gray
    
    if (!(Test-Path $portalPath)) {
        New-Item -ItemType Directory -Path $portalPath -Force | Out-Null
    }
    
    # 创建子目录
    foreach ($dir in $sharedDirs) {
        $dirPath = "$portalPath\$dir"
        if (!(Test-Path $dirPath)) {
            New-Item -ItemType Directory -Path $dirPath -Force | Out-Null
        }
    }
    
    # 2. 复制共享目录的内容
    Write-Host "  ✓ 复制共享代码文件..." -ForegroundColor Gray
    
    foreach ($dir in $sharedDirs) {
        $sourceDir = "$srcPath\$dir"
        $destDir = "$portalPath\$dir"
        
        if (Test-Path $sourceDir) {
            # 清空目标目录
            if (Test-Path $destDir) {
                Remove-Item "$destDir\*" -Recurse -Force
            }
            
            # 复制所有文件
            Get-ChildItem -Path $sourceDir -Recurse | ForEach-Object {
                $relativePath = $_.FullName.Substring($sourceDir.Length + 1)
                $targetPath = "$destDir\$relativePath"
                $targetDir = Split-Path $targetPath
                
                if (!(Test-Path $targetDir)) {
                    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
                }
                
                if ($_.PSIsContainer -eq $false) {
                    Copy-Item -Path $_.FullName -Destination $targetPath -Force | Out-Null
                }
            }
        }
    }
    
    # 3. 复制共享的单个文件
    Write-Host "  ✓ 复制单个文件..." -ForegroundColor Gray
    
    foreach ($file in $sharedFiles) {
        $sourceFile = "$srcPath\$file"
        $destFile = "$portalPath\$file"
        
        if (Test-Path $sourceFile) {
            Copy-Item -Path $sourceFile -Destination $destFile -Force | Out-Null
        }
    }
    
    # 4. 复制 components 目录（所有应用都需要）
    Write-Host "  ✓ 复制组件文件..." -ForegroundColor Gray
    
    $sourceComponents = "$srcPath\components"
    $destComponents = "$portalPath\components"
    
    if (Test-Path $sourceComponents) {
        if (!(Test-Path $destComponents)) {
            New-Item -ItemType Directory -Path $destComponents -Force | Out-Null
        }
        
        Get-ChildItem -Path $sourceComponents -Filter "*.tsx" | ForEach-Object {
            Copy-Item -Path $_.FullName -Destination "$destComponents\$($_.Name)" -Force | Out-Null
        }
    }
    
    Write-Host "  ✅ $portalName 文件复制完成！" -ForegroundColor Green
}

Write-Host "`n✨ 文件复制完成！" -ForegroundColor Green
Write-Host "`n下一步，您需要修改各应用的 App.tsx 文件..." -ForegroundColor Cyan
Write-Host "请参考 SPLIT_THREE_PORTALS_GUIDE.md 了解详细信息" -ForegroundColor Cyan

Write-Host "`n现在运行: npm install" -ForegroundColor Yellow
Write-Host "对于每个应用:" -ForegroundColor Yellow
Write-Host "  cd admin-portal && npm install" -ForegroundColor Gray
Write-Host "  cd staff-portal && npm install" -ForegroundColor Gray
Write-Host "  cd customer-app && npm install" -ForegroundColor Gray


