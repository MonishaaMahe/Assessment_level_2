@echo off
for /f "tokens=*" %%i in ('where java') do set JAVA_PATH=%%i
for %%i in ("%JAVA_PATH%") do set JAVA_DIR=%%~dpi
for %%i in ("%JAVA_DIR%..") do set "JAVA_HOME=%%~fi"

echo Using Java at: %JAVA_HOME%
echo Starting Project Management API...
mvnw.cmd spring-boot:run