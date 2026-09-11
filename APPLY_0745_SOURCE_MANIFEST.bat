@echo off
node tools\apply-0745-source-manifest.cjs
if errorlevel 1 pause
