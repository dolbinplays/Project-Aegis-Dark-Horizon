@echo off
node tools\apply-2248-source-manifest.cjs
if errorlevel 1 pause
