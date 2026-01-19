@echo off
echo ========================================
echo     Web Design Generation Fix
echo ========================================
echo.
echo This script will help you restart Inngest
echo.
echo STEP 1: Stop Inngest (if running)
echo ----------------------------------------
echo.
echo Please go to the terminal where Inngest is running
echo and press Ctrl+C to stop it.
echo.
pause
echo.
echo STEP 2: Starting Inngest Dev Server
echo ----------------------------------------
echo.
start "Inngest Dev Server" cmd /k "cd /d "%~dp0" && npx inngest-cli@latest dev"
echo.
echo Inngest should now be starting in a new window...
echo Wait for it to fully start (you'll see "Listening on...")
echo.
pause
echo.
echo STEP 3: Done!
echo ----------------------------------------
echo.
echo Your Inngest dev server is now running with the new web generation function.
echo.
echo Go to your Next.js app and try creating a web design:
echo 1. Enter a prompt
echo 2. Click "Design"
echo 3. Select "Web Design"
echo 4. Wait for generation (10-15 screens at 1440px)
echo.
echo Press any key to close this window...
pause >nul
