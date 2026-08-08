@echo off
setlocal
title English Game Library - Local Server

cd /d "%~dp0"
set "NODE_ROOT=%~dp0.runtime\node-v24.18.1-win-x64"
set "PATH=%NODE_ROOT%;%PATH%"

echo.
echo ========================================
echo   English Game Library - local launch
echo ========================================
echo.

if not exist "%NODE_ROOT%\node.exe" (
  echo ERROR: Local Node.js was not found:
  echo %NODE_ROOT%\node.exe
  echo.
  echo Do not close this window. Send a screenshot of this error.
  pause
  exit /b 1
)

if not exist "%~dp0node_modules\vite\bin\vite.js" (
  echo ERROR: Project dependencies were not found.
  echo Run this command in PowerShell:
  echo .\.runtime\node-v24.18.1-win-x64\npm.cmd install
  echo.
  pause
  exit /b 1
)

echo Starting the site...
echo The browser should open automatically.
echo If it does not, open: http://127.0.0.1:5173/
echo Keep this window open while you test the game.
echo Press Ctrl+C to stop the server.
echo.

call "%NODE_ROOT%\npm.cmd" run dev -- --host 127.0.0.1 --open %*
set "DEV_EXIT_CODE=%ERRORLEVEL%"

if not "%DEV_EXIT_CODE%"=="0" (
  echo.
  echo ERROR: The local server stopped with code %DEV_EXIT_CODE%.
  echo Send a screenshot of this window so the error can be diagnosed.
  pause
)

exit /b %DEV_EXIT_CODE%
