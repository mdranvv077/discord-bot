@echo off
title Mi Bot Discord - Consola
echo ================================
echo    Iniciando bot de Discord...
echo ================================
echo.

REM Ir al directorio donde está el .bat
cd /d "%~dp0"

REM Instalar dependencias si faltan (solo se ejecuta si falta node_modules)
if not exist node_modules (
    echo No se encontraron dependencias. Instalando...
    npm install
    echo.
)

echo Ejecutando bot...
echo -------------------------------

REM Iniciar el bot
node index.js

echo.
echo El bot se ha detenido.
pause