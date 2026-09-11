@echo off
node tools\apply-1448-source-manifest.cjs
if errorlevel 1 pause
