@echo off
REM One-command Windows startup for frontend and backend dev servers
cd /d "%~dp0"
start "Backend Dev" cmd /k "pushd \"%~dp0backend\" && npm run dev"
start "Frontend Dev" cmd /k "pushd \"%~dp0frontend\" && npm run dev"
exit /b 0
