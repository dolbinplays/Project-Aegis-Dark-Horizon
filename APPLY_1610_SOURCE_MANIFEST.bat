@echo off
node tools\apply-1610-source-manifest.cjs
if errorlevel 1 pause
