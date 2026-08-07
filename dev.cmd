@echo off
setlocal
set "NODE_ROOT=%~dp0.runtime\node-v24.18.1-win-x64"
set "PATH=%NODE_ROOT%;%PATH%"
call "%NODE_ROOT%\npm.cmd" run dev -- %*

