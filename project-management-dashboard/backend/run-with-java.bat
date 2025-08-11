@echo off
echo Finding Java installation...

REM Check common Java installation paths
set JAVA_PATHS="%ProgramFiles%\Java\jdk*" "%ProgramFiles%\Eclipse Adoptium\jdk*" "%ProgramFiles%\Microsoft\jdk*" "%ProgramFiles(x86)%\Java\jdk*"

for %%p in (%JAVA_PATHS%) do (
    for /d %%d in (%%p) do (
        if exist "%%d\bin\java.exe" (
            set "JAVA_HOME=%%d"
            goto found_java
        )
    )
)

echo Java not found in common locations.
echo Please install Java 17+ from: https://adoptium.net/
pause
exit /b 1

:found_java
echo Found Java at: %JAVA_HOME%
echo Starting application...
mvnw.cmd spring-boot:run