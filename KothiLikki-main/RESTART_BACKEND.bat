@echo off
echo ========================================
echo   RESTARTING BACKEND SERVER
echo ========================================
echo.
echo Stopping existing backend server on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /F /PID %%a
)
echo.
echo Waiting 2 seconds...
timeout /t 2 /nobreak >nul
echo.
echo Starting backend server...
cd backend
start "KothiLikki Backend" cmd /k "node src/index.js"
echo.
echo ========================================
echo   Backend server restarted!
echo   Check the new window for logs
echo ========================================
pause
