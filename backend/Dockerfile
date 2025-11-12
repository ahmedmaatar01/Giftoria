FROM php:8.2-cli

# Install system dependencies and clean up in same layer to reduce image size
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

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
RUN chmod -R 775 storage bootstrap/cache

# Create entrypoint script
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
echo "Starting Laravel application..."\n\
\n\
# Generate app key if needed\n\
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then\n\
    echo "Generating application key..."\n\
    php artisan key:generate --force\n\
fi\n\
\n\
# Wait for database to be ready\n\
echo "Waiting for database connection..."\n\
until php artisan migrate:status > /dev/null 2>&1; do\n\
    echo "Database not ready, waiting 2 seconds..."\n\
    sleep 2\n\
done\n\
\n\
# Run migrations\n\
echo "Running migrations..."\n\
php artisan migrate --force\n\
\n\
# Link storage (ignore if already exists)\n\
echo "Linking storage..."\n\
php artisan storage:link || echo "Storage link already exists"\n\
\n\
# Cache configuration for performance\n\
echo "Caching configuration..."\n\
php artisan config:cache\n\
php artisan route:cache || true\n\
php artisan view:cache || true\n\
\n\
echo "Starting Laravel server on 0.0.0.0:8000"\n\
exec php artisan serve --host=0.0.0.0 --port=8000\n\
' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 8000

# Use entrypoint script
CMD ["/entrypoint.sh"]