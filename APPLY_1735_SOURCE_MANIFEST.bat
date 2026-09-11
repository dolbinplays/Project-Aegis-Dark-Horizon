@echo off
node tools\apply-1735-source-manifest.cjs
if errorlevel 1 pause
