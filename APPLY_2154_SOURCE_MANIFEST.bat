@echo off
node tools\apply-2154-source-manifest.cjs
if errorlevel 1 pause
