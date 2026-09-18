@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found in PATH.
  echo Install/use the same Node.js environment used for the AEGIS repository tests, then run this file again.
  pause
  exit /b 1
)
echo Applying AEGIS 2030 Full Editable Scenery Prop Migration...
node tools\apply-prop-scenery-migration-2030.cjs
if errorlevel 1 (
  echo.
  echo PATCH FAILED. No claim of success should be made until the error above is resolved.
  pause
  exit /b 1
)
echo.
echo Running focused regression checks...
node --test tools\test-prop-editor-full-scenery-migration.cjs
if errorlevel 1 (
  echo.
  echo PATCH WROTE FILES BUT VALIDATION FAILED. Review the test output above before committing.
  pause
  exit /b 1
)
echo.
echo Patch and focused validation completed successfully.
pause
