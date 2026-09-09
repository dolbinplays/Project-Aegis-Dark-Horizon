@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js is required to update src\manifest.json.& exit /b 1)
node tools\apply-1242-source-manifest.cjs
if errorlevel 1 exit /b %errorlevel%
echo.
echo Source manifest synchronized to Browser 1242.
