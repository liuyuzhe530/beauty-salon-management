# 一键启动上传功能
# One-Click Upload Function Startup

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║         🚀 一键启动上传功能                            ║" -ForegroundColor Cyan
Write-Host "║    Starting MySQL + Backend + Frontend                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 步骤 1: 启动 MySQL
Write-Host "📊 步骤 1: 启动 MySQL 服务..." -ForegroundColor Yellow
Start-Service MySQL80 -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

$mysqlStatus = Get-Service MySQL80 -ErrorAction SilentlyContinue
if ($mysqlStatus.Status -eq 'Running') {
    Write-Host "✅ MySQL 服务已启动" -ForegroundColor Green
} else {
    Write-Host "❌ MySQL 服务启动失败" -ForegroundColor Red
    Write-Host "请手动启动: Start-Service MySQL80" -ForegroundColor Yellow
}

Write-Host ""

# 步骤 2: 创建数据库
Write-Host "🗄️  步骤 2: 创建数据库..." -ForegroundColor Yellow
try {
    mysql -h localhost -u root -e "CREATE DATABASE IF NOT EXISTS beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" -ErrorAction SilentlyContinue
    Write-Host "✅ 数据库已创建/已存在" -ForegroundColor Green
} catch {
    Write-Host "⚠️  数据库创建失败或已存在" -ForegroundColor Yellow
}

Write-Host ""

# 步骤 3: 启动后端
Write-Host "⚙️  步骤 3: 启动后端服务器..." -ForegroundColor Yellow
Write-Host "在 Terminal 1 运行以下命令:" -ForegroundColor Cyan
Write-Host ""
Write-Host "cd E:\xincs\xincs\backend" -ForegroundColor Blue
Write-Host "npm start" -ForegroundColor Blue
Write-Host ""

# 步骤 4: 启动前端
Write-Host "🎨 步骤 4: 启动前端开发服务器..." -ForegroundColor Yellow
Write-Host "在 Terminal 2 运行以下命令:" -ForegroundColor Cyan
Write-Host ""
Write-Host "cd E:\xincs\xincs" -ForegroundColor Blue
Write-Host "npm run dev" -ForegroundColor Blue
Write-Host ""

# 步骤 5: 测试上传
Write-Host "🧪 步骤 5: 测试上传功能..." -ForegroundColor Yellow
Write-Host "在浏览器中:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 打开: http://localhost:5173/" -ForegroundColor Blue
Write-Host "2. 按: Ctrl + Shift + R (清除缓存)" -ForegroundColor Blue
Write-Host "3. 导航: 健康助手 → 舌苔检测" -ForegroundColor Blue
Write-Host "4. 上传图片并测试" -ForegroundColor Blue
Write-Host ""

Write-Host "╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✨ 准备就绪!                              ║" -ForegroundColor Green
Write-Host "║  现在打开两个新 Terminal 执行上述命令                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green
