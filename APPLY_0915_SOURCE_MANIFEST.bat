@echo off
node tools\apply-0915-source-manifest.cjs
if errorlevel 1 pause
