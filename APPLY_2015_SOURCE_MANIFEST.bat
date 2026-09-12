@echo off
node tools\apply-2015-source-manifest.cjs
if errorlevel 1 pause
