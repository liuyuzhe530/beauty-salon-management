# 上传功能启动脚本
# 此脚本将同时启动后端和前端服务

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "🚀 上传系统启动脚本" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Node.js 是否安装
Write-Host "检查 Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($null -eq $nodeVersion) {
    Write-Host "❌ Node.js 未安装或不在 PATH 中" -ForegroundColor Red
    Write-Host "请先安装 Node.js: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js 已安装: $nodeVersion" -ForegroundColor Green
Write-Host ""

# 启动后端
Write-Host "启动后端服务器..." -ForegroundColor Yellow
Write-Host "命令: cd backend && npm install && npm run build && npm start" -ForegroundColor Gray
Write-Host ""

$backendPath = Join-Path $PSScriptRoot "backend"
$frontendPath = $PSScriptRoot

# 在新窗口中启动后端
Write-Host "在新 PowerShell 窗口中启动后端..." -ForegroundColor Green
$backendScript = @"
cd "$backendPath"
Write-Host '=== 后端服务启动中 ===' -ForegroundColor Cyan
npm install
npm run build
npm start
"@

# 保存后端启动脚本
$backendScriptPath = Join-Path $PSScriptRoot "start-backend-temp.ps1"
$backendScript | Set-Content $backendScriptPath -Encoding UTF8

# 启动后端窗口
Start-Process powershell.exe -ArgumentList "-NoExit", "-File", $backendScriptPath

Write-Host "✅ 后端启动窗口已打开" -ForegroundColor Green
Write-Host ""

# 等待后端启动
Write-Host "等待后端启动（10秒）..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# 检查后端是否运行
Write-Host "检查后端健康状态..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET -TimeoutSec 3 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ 后端服务已启动: http://localhost:3001" -ForegroundColor Green
        Write-Host "   响应: $($response.Content)" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  后端可能需要更多时间启动" -ForegroundColor Yellow
    Write-Host "   如果错误，请检查后端窗口中的信息" -ForegroundColor Yellow
}

Write-Host ""

# 启动前端
Write-Host "启动前端开发服务器..." -ForegroundColor Yellow
Write-Host "命令: npm run dev" -ForegroundColor Gray
Write-Host ""

$frontendScript = @"
cd "$frontendPath"
Write-Host '=== 前端服务启动中 ===' -ForegroundColor Cyan
npm run dev
"@

# 保存前端启动脚本
$frontendScriptPath = Join-Path $PSScriptRoot "start-frontend-temp.ps1"
$frontendScript | Set-Content $frontendScriptPath -Encoding UTF8

# 启动前端窗口
Start-Process powershell.exe -ArgumentList "-NoExit", "-File", $frontendScriptPath

Write-Host "✅ 前端启动窗口已打开" -ForegroundColor Green
Write-Host ""

# 显示完成信息
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "✅ 启动完成！" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 您现在应该看到两个新的 PowerShell 窗口：" -ForegroundColor Yellow
Write-Host "   1️⃣  后端窗口 - 显示 'Server running on port 3001'" -ForegroundColor White
Write-Host "   2️⃣  前端窗口 - 显示 'Local: http://localhost:5173'" -ForegroundColor White
Write-Host ""
Write-Host "🌐 打开浏览器访问:" -ForegroundColor Yellow
Write-Host "   http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "📸 测试上传功能:" -ForegroundColor Yellow
Write-Host "   1. 进入 健康助手 → 舌苔检测" -ForegroundColor White
Write-Host "   2. 点击 上传照片 按钮" -ForegroundColor White
Write-Host "   3. 选择一张图片" -ForegroundColor White
Write-Host "   4. 应该看到图片预览" -ForegroundColor White
Write-Host ""
Write-Host "💡 提示:" -ForegroundColor Yellow
Write-Host "   - 不要关闭后端和前端窗口" -ForegroundColor White
Write-Host "   - 如果有错误，检查对应的窗口中的错误信息" -ForegroundColor White
Write-Host "   - 按 Ctrl+C 可以停止服务" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan

# 清理临时脚本（可选）
# Remove-Item $backendScriptPath -Force -ErrorAction SilentlyContinue
# Remove-Item $frontendScriptPath -Force -ErrorAction SilentlyContinue

