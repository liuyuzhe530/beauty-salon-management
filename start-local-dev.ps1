# 启动本地开发服务器
Write-Host "正在启动开发服务器..." -ForegroundColor Green
Write-Host ""

# 检查端口是否已被占用
$portInUse = netstat -ano | findstr :5173
if ($portInUse) {
    Write-Host "✅ 开发服务器已在运行！" -ForegroundColor Green
    Write-Host ""
    Write-Host "请在浏览器中访问：" -ForegroundColor Yellow
    Write-Host "http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "或者使用以下浏览器打开：" -ForegroundColor Yellow
    Write-Host "1. Chrome/Edge: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "2. Firefox: http://localhost:5173" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "正在启动开发服务器..." -ForegroundColor Yellow
    npm run dev
}

Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Gray
Write-Host ""





















