#!/bin/bash

echo "🚀 Starting School Let Loose deployment update..."

# Stop current services
echo "📴 Stopping current services..."
pm2 stop school-let-loose-server

# Navigate to project directory
cd /home/matti/MagicSchool

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin main

# Update environment file with new database name
echo "🔧 Updating environment variables..."
sed -i 's/magicschool/schoolletloose/g' server/.env

# Install dependencies and rebuild
echo "🔨 Building project..."
npm install

# Build shared package
cd shared
npm install
npm run build
cd ..

# Build server
cd server
npm install
npm run build
cd ..

# Build client
cd client
npm install
npm run build
cd ..

# Copy client build to Nginx
echo "📂 Copying client files to Nginx..."
sudo rm -rf /var/www/schoolletloose/*
sudo cp -r client/dist/* /var/www/schoolletloose/
sudo chown -R www-data:www-data /var/www/schoolletloose

# Update Nginx configuration for new name
echo "🌐 Updating Nginx configuration..."
sudo sed -i 's/magicschool/schoolletloose/g' /etc/nginx/sites-available/schoolletloose

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Restart PM2 with updated code
echo "🔄 Restarting services..."
pm2 restart school-let-loose-server

# Show status
echo "📊 Service status:"
pm2 status

echo "✅ Deployment update complete!"
echo "🌍 Your School Let Loose app should now be running with the new branding!"
echo "🔗 Access it at: http://192.168.178.130"
