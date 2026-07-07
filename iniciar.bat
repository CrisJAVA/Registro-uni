@echo off
echo ========================================
echo   Universidad Nacional del Pacifico
echo   Sistema de Registro y Admision
echo ========================================
echo.

echo [1/2] Iniciando Backend (Spring Boot)...
echo Puerto: 8080
echo URL: http://localhost:8080/html/index.html
echo.
cd backend
start "Backend UNP" cmd /k "mvn spring-boot:run"
cd ..

echo [2/2] Backend iniciado.
echo.
echo ========================================
echo   INSTRUCCIONES
echo ========================================
echo.
echo 1. Espere a que el backend termine de iniciar
echo    (aparecera "Started UnpApplication")
echo.
echo 2. Abra su navegador en:
echo    http://localhost:8080/html/index.html
echo.
echo 3. Para ir al panel de administracion:
echo    http://localhost:8080/html/login.html
echo.
echo Credenciales: admin / 123456
echo ========================================
pause
