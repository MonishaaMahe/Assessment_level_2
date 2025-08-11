@echo off
echo Checking for Java installation...

java -version >nul 2>&1
if %errorlevel% == 0 (
    echo Java is installed!
    for /f "tokens=*" %%i in ('where java') do set JAVA_PATH=%%i
    for %%i in ("%JAVA_PATH%") do set JAVA_DIR=%%~dpi
    for %%i in ("%JAVA_DIR%..") do set "JAVA_HOME=%%~fi"
    echo JAVA_HOME should be: %JAVA_HOME%
    echo.
    echo Run this command to set JAVA_HOME for current session:
    echo set JAVA_HOME=%JAVA_HOME%
    echo.
    echo Then run: mvnw.cmd spring-boot:run
) else (
    echo Java not found. Please install Java 17+ from:
    echo https://adoptium.net/temurin/releases/
)
pause