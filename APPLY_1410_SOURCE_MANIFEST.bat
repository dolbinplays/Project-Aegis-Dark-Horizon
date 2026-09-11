@echo off
node tools\apply-1410-source-manifest.cjs
if errorlevel 1 pause
