@echo off
echo 🚀 Deploying School Let Loose updates to server...
echo.

echo Please run these commands on your Ubuntu server:
echo.
echo 1. Connect to your server:
echo    ssh matti@192.168.178.130
echo.
echo 2. Run the deployment script:
echo    cd /home/matti/MagicSchool
echo    chmod +x deploy-update.sh
echo    ./deploy-update.sh
echo.
echo Or run the commands manually:
echo.
echo # Stop services
echo pm2 stop school-let-loose-server
echo.
echo # Update code
echo git pull origin main
echo.
echo # Update database name in .env
echo sed -i 's/magicschool/schoolletloose/g' server/.env
echo.
echo # Rebuild everything
echo npm install
echo cd shared ^&^& npm install ^&^& npm run build ^&^& cd ..
echo cd server ^&^& npm install ^&^& npm run build ^&^& cd ..
echo cd client ^&^& npm install ^&^& npm run build ^&^& cd ..
echo.
echo # Update Nginx
echo sudo rm -rf /var/www/schoolletloose/*
echo sudo cp -r client/dist/* /var/www/schoolletloose/
echo sudo chown -R www-data:www-data /var/www/schoolletloose
echo.
echo # Restart services
echo pm2 restart school-let-loose-server
echo pm2 status
echo.
pause
