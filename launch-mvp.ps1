#!/usr/bin/env pwsh
<#
.SYNOPSIS
Beauty Salon Management System - Automated MVP Launch Script
.DESCRIPTION
One-click launch of MySQL, Backend, and Frontend services
.VERSION 2.0
#>

# 设置脚本参数
$ErrorActionPreference = "Continue"
$VerbosePreference = "SilentlyContinue"

# 颜色定义
$Colors = @{
    Success = "Green"
    Warning = "Yellow"
    Error   = "Red"
    Info    = "Cyan"
    Title   = "Magenta"
}

# 输出函数
function Write-Step {
    param(
        [int]$Step,
        [string]$Message,
        [string]$Status = "..."
    )
    Write-Host ""
    Write-Host "步骤 $Step | $Message $Status" -ForegroundColor $Colors.Info -BackgroundColor Black
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor $Colors.Info
}

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor $Colors.Success
}

function Write-Error-Custom {
    param([string]$Message)
    Write-Host "❌ $Message" -ForegroundColor $Colors.Error
}

function Write-Warning-Custom {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor $Colors.Warning
}

# 主程序开始
Clear-Host
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Title
Write-Host "║   🚀  美容院管理系统 - MVP 一键启动                   ║" -ForegroundColor $Colors.Title
Write-Host "║        Beauty Salon Management System - MVP           ║" -ForegroundColor $Colors.Title
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Title
Write-Host ""
Write-Host "⏱️  预计启动时间: 10-15 分钟" -ForegroundColor $Colors.Info
Write-Host "📋 启动顺序: MySQL → 后端 → 前端" -ForegroundColor $Colors.Info
Write-Host ""

# ============================================
# 第一步: 启动 MySQL
# ============================================
Write-Step -Step 1 -Message "MySQL 数据库服务" -Status "启动中..."

try {
    $mysqlService = Get-Service MySQL80 -ErrorAction SilentlyContinue
    
    if ($null -eq $mysqlService) {
        Write-Error-Custom "MySQL80 服务未找到"
        Write-Warning-Custom "请先安装 MySQL: choco install mysql -y"
        Write-Host ""
        Read-Host "按 Enter 继续（如果已安装MySQL，请确保服务名称为 MySQL80）"
    } else {
        if ($mysqlService.Status -eq "Running") {
            Write-Success "MySQL 已在运行"
        } else {
            Write-Host "启动 MySQL 服务..." -ForegroundColor $Colors.Warning
            Start-Service MySQL80
            Start-Sleep -Seconds 2
            $status = (Get-Service MySQL80).Status
            if ($status -eq "Running") {
                Write-Success "MySQL 启动成功"
            } else {
                Write-Error-Custom "MySQL 启动失败，状态: $status"
            }
        }
    }
} catch {
    Write-Error-Custom "无法启动 MySQL: $_"
    Write-Warning-Custom "请手动启动 MySQL 并重试"
}

Start-Sleep -Seconds 1

# ============================================
# 第二步: 验证和创建数据库
# ============================================
Write-Step -Step 2 -Message "数据库初始化" -Status "进行中..."

try {
    $testConnection = & mysql -u root -e "SHOW DATABASES LIKE 'beauty_salon'" 2>$null
    
    if ($testConnection) {
        Write-Success "数据库已存在"
    } else {
        Write-Host "创建数据库..." -ForegroundColor $Colors.Warning
        $sqlCommand = @"
CREATE DATABASE IF NOT EXISTS beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_salon;
"@
        $sqlCommand | mysql -u root 2>$null
        Start-Sleep -Seconds 1
        Write-Success "数据库创建成功"
    }
} catch {
    Write-Error-Custom "数据库创建失败: $_"
    Write-Warning-Custom "请手动创建数据库：mysql -u root -p"
}

Start-Sleep -Seconds 1

# ============================================
# 第三步: 验证后端连接
# ============================================
Write-Step -Step 3 -Message "后端连接验证" -Status "进行中..."

try {
    Write-Host "测试数据库连接..." -ForegroundColor $Colors.Warning
    $connectionTest = & node E:\xincs\xincs\backend\test-connection.js 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "数据库连接测试通过"
    } else {
        Write-Warning-Custom "连接测试警告"
    }
} catch {
    Write-Warning-Custom "无法运行测试脚本: $_"
}

Start-Sleep -Seconds 1

# ============================================
# 第四步: 启动后端服务
# ============================================
Write-Step -Step 4 -Message "后端服务启动" -Status "启动中..."

Write-Host ""
Write-Host "📌 在新窗口启动后端服务..." -ForegroundColor $Colors.Warning
Write-Host "⚠️  请保持该窗口打开" -ForegroundColor $Colors.Warning

try {
    $backendCmd = @"
cd 'E:\xincs\xincs\backend'
npm run start
"@
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -Wait:$false
    Start-Sleep -Seconds 3
    Write-Success "后端启动命令已发送"
} catch {
    Write-Error-Custom "后端启动失败: $_"
}

# ============================================
# 第五步: 启动前端应用
# ============================================
Write-Step -Step 5 -Message "前端应用启动" -Status "启动中..."

Write-Host ""
Write-Host "📌 在新窗口启动前端应用..." -ForegroundColor $Colors.Warning
Write-Host "⚠️  请保持该窗口打开" -ForegroundColor $Colors.Warning

try {
    $frontendCmd = @"
cd 'E:\xincs\xincs'
npm run dev
"@
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCmd -Wait:$false
    Start-Sleep -Seconds 3
    Write-Success "前端启动命令已发送"
} catch {
    Write-Error-Custom "前端启动失败: $_"
}

# ============================================
# 完成总结
# ============================================
Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor $Colors.Success
Write-Host "║          ✅ 系统启动完成！                            ║" -ForegroundColor $Colors.Success
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor $Colors.Success

Write-Host ""
Write-Host "📱 访问地址:" -ForegroundColor $Colors.Info
Write-Host "   前端应用: http://localhost:3000" -ForegroundColor $Colors.Success
Write-Host "   后端 API: http://localhost:3001" -ForegroundColor $Colors.Success
Write-Host "   健康检查: http://localhost:3001/api/health" -ForegroundColor $Colors.Success

Write-Host ""
Write-Host "⏳ 等待时间说明:" -ForegroundColor $Colors.Info
Write-Host "   • 后端可能需要 2-5 分钟才能完全启动" -ForegroundColor $Colors.Warning
Write-Host "   • 前端启动后浏览器会自动打开 (稍等...)" -ForegroundColor $Colors.Warning
Write-Host "   • 如果没有打开，手动访问 http://localhost:3000" -ForegroundColor $Colors.Warning

Write-Host ""
Write-Host "✨ 验证步骤:" -ForegroundColor $Colors.Info
Write-Host "   1. 等待前端浏览器打开" -ForegroundColor $Colors.Info
Write-Host "   2. 看到登录页面" -ForegroundColor $Colors.Info
Write-Host "   3. 点击'以管理员身份进入'" -ForegroundColor $Colors.Info
Write-Host "   4. 验证所有菜单可用" -ForegroundColor $Colors.Info

Write-Host ""
Write-Host "💡 提示:" -ForegroundColor $Colors.Info
Write-Host "   • 保持所有 PowerShell 窗口打开" -ForegroundColor $Colors.Info
Write-Host "   • 如遇问题，查看 QUICK_MVP_LAUNCH.md" -ForegroundColor $Colors.Info
Write-Host "   • 查看浏览器控制台 (F12) 了解错误详情" -ForegroundColor $Colors.Info

Write-Host ""
Write-Host "🎉 MVP 系统已启动！祝您使用愉快！" -ForegroundColor $Colors.Success
Write-Host ""

# 等待用户确认
Read-Host "按 Enter 关闭此窗口"
