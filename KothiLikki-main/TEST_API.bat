@echo off
echo Testing All Requests API...
echo.

echo [1] Testing without auth (should fail):
curl -s http://localhost:5000/api/requests/all
echo.
echo.

echo [2] Checking if you have any buy requests:
curl -s http://localhost:5000/api/buy-requests
echo.
echo.

echo [3] Checking if you have any KYC documents:
curl -s http://localhost:5000/api/kyc
echo.
echo.

pause
