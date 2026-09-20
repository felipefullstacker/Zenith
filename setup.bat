@echo off
echo.
echo =====================================
echo    Bem-vindo ao Zenith
echo =====================================
echo.
echo Instalando dependências...
echo.

call npm install

if errorlevel 1 (
    echo.
    echo =====================================
    echo    ERRO NA INSTALAÇÃO
    echo =====================================
    echo.
    echo Não foi possível instalar as dependências.
    echo Por favor, verifique se o Node.js está instalado.
    echo.
    pause
    exit /b 1
)

echo.
echo =====================================
echo    CONFIGURAÇÃO COMPLETA
echo =====================================
echo.
echo Instalação concluída com sucesso!
echo.
echo Para iniciar o desenvolvimento:
echo   1. Copie .env.example para .env
echo   2. Preencha suas credenciais do Supabase
echo   3. Execute: npm start
echo.
echo Para testar no Android:
echo   1. Conecte seu dispositivo Android
echo   2. Execute: npm run android
echo.
echo Para testar no emulador:
echo   1. Execute: npm run android -- --android-emulator
echo.
echo Para build de produção:
echo   1. Execute: npx expo build:android
echo.
pause
