@echo off
node tools\apply-1740-source-manifest.cjs
if errorlevel 1 pause
