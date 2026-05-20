@echo off
echo ========================================
echo INFRAALL DIAGNOSTIC CHECK
echo ========================================
echo.

echo [1] Checking Backend (Port 5000)...
curl -s http://localhost:5000/api/listings >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is RUNNING
) else (
    echo ❌ Backend is NOT running - Start it first!
)
echo.

echo [2] Checking Frontend (Port 5173)...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is RUNNING
) else (
    echo ❌ Frontend is NOT running - Start it first!
)
echo.

echo [3] Checking Environment Variables...
cd frontend
if exist .env (
    echo ✅ .env file exists
    type .env
) else (
    echo ❌ .env file missing!
)
echo.

echo ========================================
echo INSTRUCTIONS:
echo ========================================
echo 1. Open browser to: http://localhost:5173
echo 2. Press F12 to open Developer Console
echo 3. Look for RED errors in Console tab
echo 4. Take screenshot and share with me
echo ========================================
pause
