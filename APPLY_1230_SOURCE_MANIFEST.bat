@echo off
node tools\apply-1230-source-manifest.cjs
if errorlevel 1 pause
