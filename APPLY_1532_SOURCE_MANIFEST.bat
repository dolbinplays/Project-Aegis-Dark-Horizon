@echo off
node tools\apply-1532-source-manifest.cjs
if errorlevel 1 pause
