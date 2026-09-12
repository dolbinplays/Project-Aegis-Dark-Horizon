@echo off
node tools\apply-1226-source-manifest.cjs
if errorlevel 1 pause
