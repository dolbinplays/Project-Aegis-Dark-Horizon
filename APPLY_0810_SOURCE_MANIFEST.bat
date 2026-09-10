@echo off
setlocal
cd /d "%~dp0"
node tools\apply-0810-source-manifest.cjs
if errorlevel 1 exit /b %errorlevel%
echo Source manifest synchronized to Browser 0810.
