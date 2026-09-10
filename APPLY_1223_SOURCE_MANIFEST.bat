@echo off
cd /d "%~dp0"
node tools\apply-1223-source-manifest.cjs
if errorlevel 1 pause
