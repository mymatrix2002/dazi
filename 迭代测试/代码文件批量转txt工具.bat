@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
title Code to TXT Tool

:menu
cls
echo ========================================
echo   Code File Batch Rename Tool
echo ========================================
echo.
echo   1. Code to TXT  (add .txt suffix)
echo   2. TXT to Code  (remove .txt suffix)
echo   3. Exit
echo.
echo Only process .html .css .js files
echo Other files will NOT be touched
echo.
set /p choice=Choose option (1-3): 

if "%choice%"=="1" goto totxt
if "%choice%"=="2" goto fromtxt
if "%choice%"=="3" goto end
echo.
echo Invalid choice, please enter 1-3
pause
goto menu


:totxt
echo.
echo ---------- Code to TXT Mode ----------
echo.

call :find_folder
if "%folder%"=="" goto menu

echo Processing: %folder%
echo.

set count=0
for /r "%folder%" %%f in (*.html *.css *.js) do (
    if "%%~xf" neq ".txt" (
        set /a count+=1
        echo   Convert: %%~nxf -^> %%~nxf.txt
        ren "%%f" "%%~nxf.txt"
    )
)

echo.
echo Done! %count% files processed.
echo All code files have .txt suffix now, ready to upload.
echo.
pause
goto menu


:fromtxt
echo.
echo ---------- TXT to Code Mode ----------
echo.

call :find_folder
if "%folder%"=="" goto menu

echo Processing: %folder%
echo.

set count=0
for /r "%folder%" %%f in (*.html.txt *.css.txt *.js.txt) do (
    set /a count+=1
    set "newname=%%~nf"
    echo   Restore: %%~nxf -^> !newname!
    ren "%%f" "!newname!"
)

echo.
echo Done! %count% files processed.
echo All files restored to original format.
echo.
pause
goto menu


:find_folder
set "folder=%~1"

rem 1. Check if folder is provided as argument (drag and drop)
if "%folder%" neq "" (
    if exist "%folder%" (
        exit /b
    )
)

rem 2. FIRST: Check if current directory IS the project folder
rem    (only need css and js folders to exist, works both ways)
if exist "css" if exist "js" (
    set "folder=."
    echo Detected: Current directory is project folder
    echo Will process current directory
    echo.
    exit /b
)

rem 3. SECOND: Check default folder name (typing-practice)
if exist "typing-practice" (
    set "folder=typing-practice"
    exit /b
)

rem 4. List folders and let user choose
echo.
echo Folders in current directory:
dir /b /ad
echo.
echo Tip: Enter . (dot) to process current directory
echo.
set /p folder=Enter folder name: 

if "%folder%"=="" (
    echo Error: Folder name cannot be empty
    pause
    set "folder="
    exit /b
)

if not exist "%folder%" (
    echo Error: Folder not found
    pause
    set "folder="
    exit /b
)

exit /b


:end
echo.
echo Bye!
endlocal