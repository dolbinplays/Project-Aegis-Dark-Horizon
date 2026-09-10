@echo off
node tools\apply-2054-source-manifest.cjs
if errorlevel 1 exit /b %errorlevel%
echo Browser 2054 source manifest update complete.
