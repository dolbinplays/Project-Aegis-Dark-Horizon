@echo off
node tools\apply-2058-source-manifest.cjs
if errorlevel 1 pause
