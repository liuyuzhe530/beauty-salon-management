#!/usr/bin/env pwsh
<#
.SYNOPSIS
Beauty Studio Management System - Complete Automated Startup
.DESCRIPTION
Start MySQL, Backend and Frontend with one script
#>

Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   美容院管理系统 - 完整启动                    ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Step 1: Start MySQL
Write-Host "📌 Step 1: Starting MySQL service..." -ForegroundColor Yellow
try {
    $mysqlService = Get-Service MySQL80 -ErrorAction SilentlyContinue
    if ($mysqlService) {
        if ($mysqlService.Status -eq 'Running') {
            Write-Host "✅ MySQL is already running" -ForegroundColor Green
        } else {
            Write-Host "⏳ Starting MySQL..." -ForegroundColor Cyan
            Start-Service MySQL80
            Start-Sleep -Seconds 3
            Write-Host "✅ MySQL started" -ForegroundColor Green
        }
    } else {
        Write-Host "⚠️  MySQL80 service not found. Please ensure MySQL is installed" -ForegroundColor Yellow
        Write-Host "   Run manually: Start-Service MySQL80" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Failed to start MySQL: $_" -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Step 2: Verify database connection
Write-Host ""
Write-Host "📌 Step 2: Verifying database connection..." -ForegroundColor Yellow
cd "$PSScriptRoot\backend"
$testResult = & node test-connection.js 2>&1
if ($testResult -like "*成功*" -or $testResult -like "*success*") {
    Write-Host "✅ Database connection successful" -ForegroundColor Green
} else {
    Write-Host "⚠️  Database connection test result:" -ForegroundColor Yellow
    Write-Host $testResult -ForegroundColor Yellow
}

Start-Sleep -Seconds 2

# Step 3: Start Backend
Write-Host ""
Write-Host "📌 Step 3: Starting backend server..." -ForegroundColor Yellow
Write-Host "⏳ Starting backend in background (http://localhost:3001)..." -ForegroundColor Cyan

$backendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k cd /d E:\xincs\xincs\backend && npm run start" -PassThru -NoNewWindow
Write-Host "✅ Backend process started (PID: $($backendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 5

# Step 4: Start Frontend
Write-Host ""
Write-Host "📌 Step 4: Starting frontend application..." -ForegroundColor Yellow
Write-Host "⏳ Starting frontend Vite dev server..." -ForegroundColor Cyan

cd "$PSScriptRoot"
$frontendProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/k npm run dev" -PassThru -NoNewWindow
Write-Host "✅ Frontend process started (PID: $($frontendProcess.Id))" -ForegroundColor Green

Start-Sleep -Seconds 3

# Step 5: Display startup info
Write-Host ""
Write-Host "╔════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         🎉 System Started Successfully!        ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "📱 Access Application:" -ForegroundColor Cyan
Write-Host "  • Frontend:  http://localhost:3000 (or available port)" -ForegroundColor White
Write-Host "  • Backend:   http://localhost:3001" -ForegroundColor White
Write-Host "  • Database:  localhost:3306 (beauty_salon)" -ForegroundColor White
Write-Host ""

Write-Host "🔑 Test Account:" -ForegroundColor Cyan
Write-Host "  • Username: testuser" -ForegroundColor White
Write-Host "  • Password: Test@123" -ForegroundColor White
Write-Host ""

Write-Host "⏸️  To Stop:" -ForegroundColor Cyan
Write-Host "  • Press Ctrl+C to close" -ForegroundColor White
Write-Host "  • Or type 'exit' in each window" -ForegroundColor White
Write-Host ""

Write-Host "📖 Full Guide: COMPLETE_SYSTEM_STARTUP.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "System is running! Press Ctrl+C to exit..." -ForegroundColor Yellow
while ($true) {
    Start-Sleep -Seconds 1
}
