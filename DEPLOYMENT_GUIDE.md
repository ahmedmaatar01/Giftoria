# Giftoria Deployment Guide - Hostinger KVM 2 with EasyPanel

## Prerequisites

### On Your VPS (Hostinger KVM 2)
- **SSH Access** to your VPS
- **EasyPanel** installed and running
- **Domain** pointed to your VPS IP
- **Minimum Requirements**: 2GB RAM, 2 CPU cores, 20GB storage

### On Your Local Machine
- Git installed
- Project repository access
- Database backup (if migrating data)

---

## Architecture Overview

Your Giftoria project has:
1. **Laravel Backend** (`backend/`) - REST API on port 8000
2. **React Admin Dashboard** (`Giftoria/`) - Admin panel
3. **Next.js Storefront** (`GiftoriaStore/`) - Customer-facing store

---

## Step 1: Initial VPS Setup

### 1.1 Connect to Your VPS

```bash
ssh root@your-vps-ip
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Required Tools (if not present)

```bash
# Install Docker and Docker Compose (required for EasyPanel)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Git
apt install git -y

# Install Node.js (for local builds if needed)
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs
```

---

## Step 2: Access EasyPanel

1. Navigate to EasyPanel in your browser:
   ```
   http://your-vps-ip:3000
   ```
   or if you've configured a domain:
   ```
   https://panel.yourdomain.com
   ```

2. Login with your EasyPanel credentials

---

## Step 3: Deploy Laravel Backend

### 3.1 Create MySQL Database Service

1. In EasyPanel, click **"New Service"**
2. Select **"MySQL"**
3. Configure:
   - **Name**: `giftoria-db`
   - **Database Name**: `giftoria`
   - **Username**: `giftoria_user`
   - **Password**: Generate a strong password (save it!)
   - **Port**: `3306`
4. Click **"Create"**

### 3.2 Create Laravel App

1. Click **"New App"**
2. Select **"PHP"** or **"Custom"**
3. Configure:
   - **Name**: `giftoria-backend`
   - **Repository**: Your Git repository URL
   - **Branch**: `ahmedM` (or your production branch)
   - **Build Path**: `/backend`
   - **Port**: `8000`

### 3.3 Environment Variables

Add these environment variables in EasyPanel for the backend app:

```env
APP_NAME=Giftoria
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=giftoria-db
DB_PORT=3306
DB_DATABASE=giftoria
DB_USERNAME=giftoria_user
DB_PASSWORD=YOUR_DB_PASSWORD

CACHE_DRIVER=file
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,admin.yourdomain.com
SESSION_DOMAIN=.yourdomain.com

FILESYSTEM_DISK=public
```

### 3.4 Create Dockerfile for Laravel

In your `backend/` directory, create a `Dockerfile`:

```dockerfile
FROM php:8.2-fpm

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    nginx

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    && chmod -R 775 /var/www/html/bootstrap/cache

# Generate app key if not set
RUN php artisan key:generate --no-interaction || true

# Run migrations
RUN php artisan migrate --force || true

# Optimize
RUN php artisan config:cache \
    && php artisan route:cache \
    && php artisan view:cache

# Copy nginx config
COPY docker/nginx.conf /etc/nginx/sites-available/default

EXPOSE 8000

# Start services
CMD php artisan serve --host=0.0.0.0 --port=8000
```

### 3.5 Alternative: Use docker-compose.yml

Create `backend/docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - APP_ENV=production
      - DB_HOST=giftoria-db
      - DB_DATABASE=giftoria
      - DB_USERNAME=giftoria_user
      - DB_PASSWORD=${DB_PASSWORD}
    volumes:
      - ./storage:/var/www/html/storage
      - ./public/storage:/var/www/html/public/storage
    depends_on:
      - db

  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: giftoria
      MYSQL_USER: giftoria_user
      MYSQL_PASSWORD: ${DB_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    ports:
      - "3306:3306"

volumes:
  db_data:
```

### 3.6 Deploy Backend

1. Push your code with Dockerfile to Git
2. In EasyPanel, click **"Deploy"** on your backend app
3. Wait for build to complete
4. Check logs for errors

### 3.7 Run Migrations Manually

Connect to your backend container:

```bash
docker exec -it giftoria-backend-1 bash
php artisan migrate --force
php artisan storage:link
php artisan db:seed --force  # if you have seeders
exit
```

---

## Step 4: Deploy React Admin Dashboard

### 4.1 Build React App Locally

On your local machine:

```bash
cd Giftoria

# Update API URL in your code
# Edit src/components/Navbar.js, src/api/*.js, etc.
# Change: http://localhost:8000/api -> https://api.yourdomain.com/api

# Build for production
npm install
npm run build
```

This creates a `build/` directory.

### 4.2 Create Static App in EasyPanel

1. Click **"New App"**
2. Select **"Static Site"** or **"Nginx"**
3. Configure:
   - **Name**: `giftoria-admin`
   - **Port**: `80`

### 4.3 Upload Build Files

Option A: **Use Git**
1. Commit your `build/` folder to a separate branch
2. Connect repository in EasyPanel
3. Set **Build Command**: `npm run build`
4. Set **Output Directory**: `build`

Option B: **Manual Upload**
1. Use SCP to upload build folder:
   ```bash
   scp -r Giftoria/build/* root@your-vps-ip:/path/to/easypanel/apps/giftoria-admin/
   ```

### 4.4 Nginx Configuration

Create `nginx.conf` for the admin app:

```nginx
server {
    listen 80;
    server_name admin.yourdomain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass https://api.yourdomain.com;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Step 5: Deploy Next.js Storefront (Optional)

### 5.1 Create Next.js App in EasyPanel

1. Click **"New App"**
2. Select **"Node.js"**
3. Configure:
   - **Name**: `giftoria-store`
   - **Repository**: Your Git repository
   - **Build Path**: `/GiftoriaStore`
   - **Port**: `3000`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### 5.2 Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api
NODE_ENV=production
```

### 5.3 Deploy

Click **"Deploy"** and wait for build.

---

## Step 6: Configure Domains & SSL

### 6.1 Point Your Domains

In your domain registrar (Hostinger DNS panel):

```
A    @                  -> YOUR_VPS_IP
A    api                -> YOUR_VPS_IP
A    admin              -> YOUR_VPS_IP
A    store              -> YOUR_VPS_IP  (optional)
```

### 6.2 Enable SSL in EasyPanel

For each app:
1. Go to app settings
2. Click **"Domains"**
3. Add your domain (e.g., `api.yourdomain.com`)
4. Click **"Enable SSL"** (EasyPanel uses Let's Encrypt)
5. Wait for certificate generation

---

## Step 7: Post-Deployment Tasks

### 7.1 Test API

```bash
curl https://api.yourdomain.com/api/categories
```

### 7.2 Test Admin Login

Navigate to `https://admin.yourdomain.com/admin-login`

### 7.3 Create Super Admin

Connect to backend container:

```bash
docker exec -it giftoria-backend-1 bash
php artisan tinker
```

In Tinker:

```php
$admin = new App\Models\Admin();
$admin->name = 'Super Admin';
$admin->email = 'admin@yourdomain.com';
$admin->password = bcrypt('your-secure-password');
$admin->is_super = 7;
$admin->save();
exit
```

### 7.4 Fix Storage Permissions

```bash
docker exec -it giftoria-backend-1 bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
php artisan storage:link
```

### 7.5 Set Up Backups

Create a backup script `/root/backup-giftoria.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/root/backups"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup database
docker exec giftoria-db-1 mysqldump -u giftoria_user -p'YOUR_DB_PASSWORD' giftoria > $BACKUP_DIR/db_$DATE.sql

# Backup storage
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz /path/to/backend/storage

# Delete backups older than 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and add to cron:

```bash
chmod +x /root/backup-giftoria.sh
crontab -e
# Add: 0 2 * * * /root/backup-giftoria.sh
```

---

## Step 8: Monitoring & Maintenance

### 8.1 Check Logs

```bash
# Backend logs
docker logs -f giftoria-backend-1

# Database logs
docker logs -f giftoria-db-1

# Laravel logs
docker exec giftoria-backend-1 tail -f storage/logs/laravel.log
```

### 8.2 Restart Services

```bash
# Restart backend
docker restart giftoria-backend-1

# Restart all
docker-compose -f /path/to/docker-compose.yml restart
```

### 8.3 Update Application

```bash
# Pull latest code
cd /path/to/app
git pull origin main

# Rebuild in EasyPanel
# Click "Rebuild" button in EasyPanel UI

# Or manually:
docker-compose down
docker-compose up -d --build
```

---

## Troubleshooting

### Issue: 500 Internal Server Error

**Solution:**
```bash
docker exec -it giftoria-backend-1 bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
chmod -R 775 storage bootstrap/cache
```

### Issue: CORS Errors

**Solution:**
Update `backend/config/cors.php`:

```php
'allowed_origins' => [
    'https://admin.yourdomain.com',
    'https://yourdomain.com',
],
```

Then:
```bash
php artisan config:cache
```

### Issue: Database Connection Failed

**Solution:**
1. Check DB container is running: `docker ps`
2. Verify environment variables
3. Test connection:
   ```bash
   docker exec -it giftoria-backend-1 bash
   php artisan tinker
   DB::connection()->getPdo();
   ```

### Issue: Images Not Loading

**Solution:**
```bash
docker exec -it giftoria-backend-1 bash
php artisan storage:link
chmod -R 775 storage/app/public
```

---

## Security Checklist

- [ ] APP_DEBUG=false in production
- [ ] Strong database passwords
- [ ] SSL certificates installed
- [ ] Firewall configured (UFW)
- [ ] Regular backups enabled
- [ ] .env file not in Git repository
- [ ] CORS properly configured
- [ ] Storage directories have correct permissions
- [ ] Database access restricted
- [ ] Admin panel on separate subdomain

---

## Performance Optimization

### Enable Caching

```bash
docker exec -it giftoria-backend-1 bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
composer install --optimize-autoloader --no-dev
```

### Configure Redis (Optional)

Add Redis service in `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  ports:
    - "6379:6379"
```

Update `.env`:
```env
CACHE_DRIVER=redis
SESSION_DRIVER=redis
REDIS_HOST=redis
REDIS_PORT=6379
```

---

## Quick Reference

### URLs
- **API**: https://api.yourdomain.com
- **Admin Panel**: https://admin.yourdomain.com
- **Store**: https://yourdomain.com (or https://store.yourdomain.com)
- **EasyPanel**: https://panel.yourdomain.com:3000

### Default Ports
- Laravel: 8000
- React Admin: 80/443
- Next.js Store: 3000
- MySQL: 3306
- Redis: 6379

### Important Commands
```bash
# Deploy new version
git pull && docker-compose up -d --build

# Run migrations
docker exec -it giftoria-backend-1 php artisan migrate --force

# Clear cache
docker exec -it giftoria-backend-1 php artisan cache:clear

# View logs
docker logs -f giftoria-backend-1

# Backup database
docker exec giftoria-db-1 mysqldump -u giftoria_user -pPASSWORD giftoria > backup.sql

# Restore database
docker exec -i giftoria-db-1 mysql -u giftoria_user -pPASSWORD giftoria < backup.sql
```

---

## Support

If you encounter issues:
1. Check EasyPanel logs
2. Check Docker container logs
3. Verify environment variables
4. Check Laravel logs in `storage/logs/`
5. Test API endpoints with curl/Postman

---

**Deployment completed!** Your Giftoria platform should now be live and accessible.
