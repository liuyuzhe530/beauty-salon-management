#!/usr/bin/env pwsh
<#
.SYNOPSIS
美容院管理系统 - 完整自动启动脚本
.DESCRIPTION
一键启动 MySQL、后端和前端应用
#>

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   美容院管理系统 - 完整启动                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 第1步：启动 MySQL
Write-Host "📌 第1步: 启动 MySQL 服务..." -ForegroundColor Yellow
try {
    $mysqlService = Get-Service MySQL80 -ErrorAction SilentlyContinue
    if ($mysqlService) {
        if ($mysqlService.Status -eq 'Running') {
            Write-Host "✅ MySQL 已经在运行" -ForegroundColor Green
        } else {
            Write-Host "⏳ 正在启动 MySQL..." -ForegroundColor Cyan
            Start-Service MySQL80
            Start-Sleep -Seconds 3
            Write-Host "✅ MySQL 已启动" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  未找到 MySQL80 服务，请确保已安装 MySQL" -ForegroundColor Yellow
        Write-Host "   请手动运行: Start-Service MySQL80" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  启动 MySQL 失败: $_" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# 第2步：验证数据库连接
Write-Host ""
Write-Host "📌 第2步: 验证数据库连接..." -ForegroundColor Yellow
cd "$PSScriptRoot\backend"
$testResult = & node test-connection.js 2>&1
if ($testResult -like "*成功*" -or $testResult -like "*success*") {
    Write-Host "✅ 数据库连接成功" -ForegroundColor Green
} else {
    Write-Host "⚠️  数据库连接测试结果:" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# 第3步：启动后端
Write-Host ""
Write-Host "📌 第3步: 启动后端服务器..." -ForegroundColor Yellow
Write-Host "⏳ 在后台启动后端 (http://localhost:3001)..." -ForegroundColor Cyan

# 启动后端进程
$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d E:\xincs\xincs\backend && npm run start" -PassThru -NoNewWindow
Write-Host "✅ 后端进程已启动 (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 5

# 第4步：启动前端
Write-Host ""
Write-Host "📌 第4步: 启动前端应用..." -ForegroundColor Yellow
Write-Host "⏳ 在后台启动前端 Vite 开发服务器..." -ForegroundColor Cyan

cd "$PSScriptRoot"
$frontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev" -PassThru -NoNewWindow
Write-Host "✅ 前端进程已启动 (PID: $($frontendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# 第5步：显示启动信息
Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🎉 系统启动成功！                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📱 访问应用:" -ForegroundColor Cyan
Write-Host "  • 前端:  http://localhost:3000 (或其他可用端口)" -ForegroundColor White
Write-Host "  • 后端:  http://localhost:3001" -ForegroundColor White
Write-Host "  • 数据库: localhost:3306 (beauty_salon)" -ForegroundColor White
Write-Host ""

Write-Host "🔑 测试账户：" -ForegroundColor Cyan
Write-Host "  • 用户名: testuser" -ForegroundColor White
Write-Host "  • 密码: Test@123" -ForegroundColor White
Write-Host ""

Write-Host "⏸️  关闭系统：" -ForegroundColor Cyan
Write-Host "  • 按 Ctrl+C 关闭前端和后端" -ForegroundColor White
Write-Host "  • 或在对应窗口输入 exit" -ForegroundColor White
Write-Host ""

Write-Host "📖 查看完整指南: COMPLETE_SYSTEM_STARTUP.md" -ForegroundColor Cyan
Write-Host ""

# 保持脚本运行
Write-Host "系统现在已启动！按 Ctrl+C 退出..." -ForegroundColor Yellow
while ($true) {
    Start-Sleep -Seconds 1
}
