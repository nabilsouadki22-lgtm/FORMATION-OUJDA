@echo off
REM One-command Windows startup for public exposure via localtunnel
cd /d "%~dp0"
start "App Serve" cmd /k "npm run serve"
timeout /t 8 /nobreak >nul
start "Public Tunnel" cmd /k "npx localtunnel --port 4000"
exit /b 0
