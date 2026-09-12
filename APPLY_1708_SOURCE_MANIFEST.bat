@echo off
node tools\apply-1708-source-manifest.cjs
if errorlevel 1 pause
