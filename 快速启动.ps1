# XINCS 美容院管理系统 - 自动启动脚本
# 设置编码
$OutputEncoding = [System.Text.UTF8Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::UTF8

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║         🚀 XINCS 美容院管理系统 - 自动启动                 ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 启动后端服务器
Write-Host "[1/3] 启动后端服务器 (端口 5000)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\xincs\xincs\backend'; npm run dev" -WindowStyle Normal

# 等待后端启动
Start-Sleep -Seconds 3

# 启动前端开发服务器
Write-Host "[2/3] 启动前端应用 (端口 5173)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'E:\xincs\xincs'; npm run dev -- --port 5173" -WindowStyle Normal

# 等待前端启动
Start-Sleep -Seconds 3

# 打开浏览器
Write-Host "[3/3] 打开浏览器..." -ForegroundColor Green
Start-Sleep -Seconds 2
Start-Process "http://localhost:5173"

# 显示完成信息
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "✅ 系统启动完成！" -ForegroundColor Green
Write-Host ""
Write-Host "📌 重要信息：" -ForegroundColor Yellow
Write-Host "   • 后端服务器: http://localhost:5000" -ForegroundColor Cyan
Write-Host "   • 前端应用: http://localhost:5173" -ForegroundColor Cyan
Write-Host "   • 登录用户名: admin" -ForegroundColor Cyan
Write-Host "   • 登录密码: Admin@123" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 两个终端窗口已打开，请勿关闭！" -ForegroundColor Yellow
Write-Host "   • 第一个窗口 - 后端服务器日志" -ForegroundColor Cyan
Write-Host "   • 第二个窗口 - 前端开发日志" -ForegroundColor Cyan
Write-Host ""
Write-Host "════════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "浏览器将在 2 秒后打开..." -ForegroundColor Green
