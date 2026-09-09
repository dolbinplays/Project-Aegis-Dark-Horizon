@echo off
node tools\apply-1324-source-manifest.cjs
if errorlevel 1 pause
