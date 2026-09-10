@echo off
node tools\apply-1712-source-manifest.cjs
if errorlevel 1 pause
