@echo off
node tools\apply-1046-source-manifest.cjs
if errorlevel 1 pause
