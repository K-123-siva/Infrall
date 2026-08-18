@echo off
echo ========================================
echo   INFRAALL Database Export Tool
echo ========================================
echo.

cd /d "%~dp0"

echo Creating backup of nestbazaar database...
echo.

mysqldump -u root -pPrasad!5002 nestbazaar > nestbazaar_backup.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Database exported
    echo ========================================
    echo.
    echo File saved as: nestbazaar_backup.sql
    echo Location: %CD%
    echo.
    echo Next steps:
    echo 1. Deploy to Railway/Render
    echo 2. Import this file to production database
    echo 3. See DATABASE_MIGRATION.md for instructions
    echo.
) else (
    echo.
    echo ========================================
    echo   ERROR! Export failed
    echo ========================================
    echo.
    echo Possible issues:
    echo - MySQL not in PATH
    echo - Wrong password
    echo - Database doesn't exist
    echo.
    echo Try running this command manually:
    echo mysqldump -u root -p nestbazaar ^> backup.sql
    echo.
)

pause
