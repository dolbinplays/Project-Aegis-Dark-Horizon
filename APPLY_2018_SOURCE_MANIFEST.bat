@echo off
node tools\apply-2018-source-manifest.cjs
if errorlevel 1 exit /b %errorlevel%
echo Source manifest updated to Browser 2018.
