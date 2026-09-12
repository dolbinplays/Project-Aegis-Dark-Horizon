@echo off
node tools\apply-1800-source-manifest.cjs
if errorlevel 1 pause
