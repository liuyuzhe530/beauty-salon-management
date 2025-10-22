@echo off
chcp 65001 >nul
echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║                                                            ║
echo ║         🚀 XINCS 美容院管理系统 - 自动启动                 ║
echo ║                                                            ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM 启动后端服务器
echo [1/2] 启动后端服务器 (端口 5000)...
start "XINCS 后端" cmd /k "cd /d E:\xincs\xincs\backend && npm run dev"

REM 等待后端启动
timeout /t 3 /nobreak

REM 启动前端开发服务器
echo [2/2] 启动前端应用 (端口 5173)...
start "XINCS 前端" cmd /k "cd /d E:\xincs\xincs && npm run dev -- --port 5173"

REM 等待前端启动
timeout /t 3 /nobreak

REM 自动打开浏览器
echo.
echo [3/3] 打开浏览器...
timeout /t 2 /nobreak
start http://localhost:5173

echo.
echo ════════════════════════════════════════════════════════════
echo ✅ 系统启动完成！
echo.
echo 📌 重要信息：
echo    • 后端服务器: http://localhost:5000
echo    • 前端应用: http://localhost:5173
echo    • 登录用户名: admin
echo    • 登录密码: Admin@123
echo.
echo 📝 两个终端窗口已打开，请勿关闭！
echo    • "XINCS 后端" - 后端服务器日志
echo    • "XINCS 前端" - 前端开发日志
echo.
echo ════════════════════════════════════════════════════════════
echo.
pause
