@echo off
echo ================================
echo 1. Sinh file OG HTML
echo ================================
node gen-og.js
if errorlevel 1 (
  echo Loi khi chay gen-og.js
  pause
  exit /b
)

echo.
echo ================================
echo 2. Git add
echo ================================
git add posts posts_data.json
if errorlevel 1 (
  echo Loi git add
  pause
  exit /b
)

echo.
echo ================================
echo 3. Git commit
echo ================================
git commit -m "Auto generate OG files"
if errorlevel 1 (
  echo Khong co thay doi de commit
)

echo.
echo ================================
echo 4. Git push
echo ================================
git push
if errorlevel 1 (
  echo Loi git push
  pause
  exit /b
)

echo.
echo ================================
echo HOAN THANH - DA DAY LEN GITHUB
echo ================================
pause
