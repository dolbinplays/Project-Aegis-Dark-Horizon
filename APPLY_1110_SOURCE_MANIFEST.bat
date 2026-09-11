@echo off
node tools\apply-1110-source-manifest.cjs
if errorlevel 1 pause
