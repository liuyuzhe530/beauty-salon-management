# Database Connection Test Tool
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Connection Diagnostic Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Get network info
Write-Host "Step 1: Get Your Network Information" -ForegroundColor Yellow
Write-Host ""

$localIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notmatch "127.0.0.1" } | Select-Object -First 1).IPAddress
Write-Host "Local IP: $localIP" -ForegroundColor Green

Write-Host "Getting public IP..." -ForegroundColor Gray
try {
    $publicIP = (Invoke-WebRequest -Uri "http://checkip.amazonaws.com" -ErrorAction Stop -TimeoutSec 5).Content.Trim()
    Write-Host "Public IP: $publicIP" -ForegroundColor Green
    Write-Host ""
    Write-Host "Note: Add this IP to Tencent Cloud security group" -ForegroundColor Yellow
}
catch {
    Write-Host "Warning: Cannot get public IP" -ForegroundColor Yellow
}

Write-Host ""

# Step 2: Check .env file
Write-Host "Step 2: Check .env Configuration" -ForegroundColor Yellow
Write-Host ""

$envFile = "E:\xincs\xincs\backend\.env"

if (Test-Path $envFile) {
    Write-Host "OK: .env file exists" -ForegroundColor Green
    Write-Host ""
    
    $envContent = Get-Content $envFile
    Write-Host "Database Configuration:" -ForegroundColor Green
    foreach ($line in $envContent) {
        if ($line -match "^DB_") {
            if ($line -match "DB_PASSWORD") {
                Write-Host $line.Substring(0, 15) + "***" -ForegroundColor Cyan
            }
            else {
                Write-Host $line -ForegroundColor Cyan
            }
        }
    }
}
else {
    Write-Host "ERROR: .env file not found!" -ForegroundColor Red
}

Write-Host ""

# Step 3: Test connection
Write-Host "Step 3: Test Database Network Connection" -ForegroundColor Yellow
Write-Host ""

Write-Host "Testing connection to 10.25.111.180:3306..." -ForegroundColor Gray

try {
    $tcpClient = New-Object System.Net.Sockets.TcpClient
    $result = $tcpClient.BeginConnect("10.25.111.180", 3306, $null, $null)
    $success = $result.AsyncWaitHandle.WaitOne(5000, $false)
    
    if ($success -and $tcpClient.Connected) {
        Write-Host "OK: Network connection successful!" -ForegroundColor Green
    }
    else {
        Write-Host "ERROR: Cannot connect to database server" -ForegroundColor Red
        Write-Host "Check:" -ForegroundColor Yellow
        Write-Host "  1. Is port 3306 allowed in security group?" -ForegroundColor Gray
        Write-Host "  2. Is your IP in the whitelist?" -ForegroundColor Gray
        Write-Host "  3. Is MySQL instance running?" -ForegroundColor Gray
    }
    
    $tcpClient.Close()
}
catch {
    Write-Host "ERROR: Connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Step 4: Check backend
Write-Host "Step 4: Check Backend Service" -ForegroundColor Yellow
Write-Host ""

$process = Get-Process -Name "node" -ErrorAction SilentlyContinue

if ($process) {
    Write-Host "OK: Node.js process is running" -ForegroundColor Green
    
    Write-Host "Testing backend API..." -ForegroundColor Gray
    try {
        $health = Invoke-WebRequest -Uri "http://localhost:5000/api/health" -ErrorAction Stop -TimeoutSec 3
        if ($health.StatusCode -eq 200) {
            Write-Host "OK: Backend API is responding" -ForegroundColor Green
        }
    }
    catch {
        Write-Host "WARNING: Backend API not responding" -ForegroundColor Yellow
    }
}
else {
    Write-Host "ERROR: Node.js process not found" -ForegroundColor Red
    Write-Host "Start backend: cd E:\xincs\xincs\backend && npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Step 5: Summary
Write-Host "Step 5: Recommended Actions" -ForegroundColor Yellow
Write-Host ""

Write-Host "If network test failed, follow these steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Open Tencent Cloud Console" -ForegroundColor Blue
Write-Host "   https://console.cloud.tencent.com/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Go to MySQL Database" -ForegroundColor Blue
Write-Host "   Products -> Databases -> MySQL" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Find instance: ma961120-0gn5q3yfd523d6c0" -ForegroundColor Blue
Write-Host ""
Write-Host "4. Click Instance -> Security Groups" -ForegroundColor Blue
Write-Host ""
Write-Host "5. Edit inbound rules, add:" -ForegroundColor Blue
Write-Host "   Protocol: TCP" -ForegroundColor Cyan
Write-Host "   Port: 3306" -ForegroundColor Cyan
Write-Host "   Source: 0.0.0.0/0 (for testing)" -ForegroundColor Cyan
Write-Host "   Action: Allow" -ForegroundColor Cyan
Write-Host ""
Write-Host "6. Restart backend service" -ForegroundColor Blue
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Diagnostic Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
