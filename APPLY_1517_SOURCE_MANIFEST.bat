@echo off
node tools\apply-1517-source-manifest.cjs
if errorlevel 1 pause
