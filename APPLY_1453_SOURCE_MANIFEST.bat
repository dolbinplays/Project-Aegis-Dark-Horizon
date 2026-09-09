@echo off
node tools\apply-1453-source-manifest.cjs
if errorlevel 1 pause
