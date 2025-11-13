# Giftoria E-Commerce Platform

A full-stack luxury gifting e-commerce platform with Laravel REST API backend, Next.js storefront, and React admin dashboard. Features multi-language support (English/Arabic), custom product fields, order management, and scheduled delivery.

## Project Structure

```
giftoriaWeb
├── backend (Laravel 10 REST API)
│   ├── app
│   │   ├── Http/Controllers/Api
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── OccasionController.php
│   │   │   ├── CommandController.php (Orders)
│   │   │   └── CustomFieldController.php
│   │   ├── Models
│   │   │   ├── User.php
│   │   │   ├── Product.php
│   │   │   ├── Category.php
│   │   │   ├── Occasion.php
│   │   │   ├── Command.php
│   │   │   └── CustomField.php
│   │   └── Middleware
│   │       └── AdminMiddleware.php
│   ├── database/migrations
│   ├── routes/api.php
│   ├── config
│   │   ├── cors.php
│   │   └── sanctum.php
│   └── storage/app/public (Product images)
│
├── GiftoriaStore (Next.js 13+ Customer Storefront)
│   ├── app
│   │   ├── (homes)/page.jsx (Homepage)
│   │   ├── (shop)
│   │   │   ├── shop-default/page.jsx
│   │   │   └── shop-collection-sub/page.jsx
│   │   ├── (shop-details)/product-detail/[id]/page.jsx
│   │   ├── (otherPages)
│   │   │   ├── checkout/page.jsx
│   │   │   └── about-us/page.jsx
│   │   ├── translation
│   │   │   ├── en.json
│   │   │   └── ar.json
│   │   └── globals.css
│   ├── components
│   │   ├── headers/Header6.jsx
│   │   ├── footers/Footer1.jsx
│   │   ├── modals/ShopCart.jsx
│   │   ├── shopDetails/DetailsOuterZoom.jsx
│   │   └── othersPages/Checkout.jsx
│   ├── context/Context.jsx (Global state)
│   └── next.config.mjs
│
└── Giftoria (React Admin Dashboard)
    ├── src
    │   ├── pages/dashboard
    │   │   ├── ManageProducts.js
    │   │   ├── ManageCategories.js
    │   │   ├── ManageOccasions.js
    │   │   ├── ManageCommands.js (Order management)
    │   │   └── ManageCustomFields.js
    │   ├── components
    │   └── routes.js
    └── package.json
```

## Features

### Customer Storefront (GiftoriaStore)
- 🌐 Bilingual (English/Arabic) with RTL support
- 🛒 Shopping cart with custom product options
- 📦 Product catalog with categories and occasions
- 🎁 Custom field selection per product (text, number, color, date)
- 📅 Desired delivery date scheduling (min. 6 hours ahead)
- 💳 Payment methods: Cash on Delivery / Online Payment
- 🔐 User authentication with Sanctum
- 📱 Responsive design
- 🖼️ Image galleries with featured products

### Admin Dashboard (Giftoria)
- 📊 Order management (status, customer info, notes)
- 🏷️ Product CRUD with custom fields
- 📂 Category and occasion management
- 🎨 Custom field builder (for dynamic product options)
- 🔍 Search and filter functionality
- 📈 Order tracking with timestamps

### Backend API (Laravel)
- 🔒 Sanctum authentication with role-based access
- 📡 RESTful API endpoints
- 🗄️ MySQL database with migrations
- 🖼️ File upload handling (storage:link)
- 🔗 Eloquent relationships
- ✅ Request validation
- 🌍 CORS configured for frontend origins

## Tech Stack

### Backend
- **Laravel 10+** - PHP framework
- **MySQL** - Database
- **Laravel Sanctum** - API authentication
- **Storage** - File uploads with symlinks
- **Eloquent ORM** - Database relationships

### Customer Storefront
- **Next.js 13+** - React framework with App Router
- **React 18** - UI library
- **react-i18next** - Internationalization
- **axios** - HTTP client
- **Bootstrap 5** - CSS framework

### Admin Dashboard
- **React 18** - UI library
- **React Bootstrap** - UI components
- **React Router** - Client-side routing
- **axios** - HTTP client
- **FontAwesome** - Icons

## Getting Started

### Prerequisites

- PHP >= 8.1
- Composer
- Node.js >= 18.x
- npm or yarn
- MySQL/MariaDB
- Redis (optional, for caching/sessions)

### Backend Setup

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Install PHP dependencies:
   ```powershell
   composer install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```powershell
   copy .env.example .env
   ```

4. Configure database in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=giftoria_db
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

5. Generate application key:
   ```powershell
   php artisan key:generate
   ```

6. Run migrations:
   ```powershell
   php artisan migrate
   ```

7. Create storage symlink:
   ```powershell
   php artisan storage:link
   ```

8. Start the Laravel server:
   ```powershell
   php artisan serve
   ```

### GiftoriaStore Setup (Next.js Storefront)

1. Navigate to the GiftoriaStore directory:
   ```powershell
   cd GiftoriaStore
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```powershell
   npm run dev
   ```

5. Access at `http://localhost:3000`

### Admin Dashboard Setup (React)

1. Navigate to the Giftoria directory:
   ```powershell
   cd Giftoria
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Update API base URL in `src/api/` or config file:
   ```javascript
   const API_URL = 'http://localhost:8000/api';
   ```

4. Start the development server:
   ```powershell
   npm start
   ```

5. Access at `http://localhost:3001` (or assigned port)

## API Documentation

### Authentication Endpoints

- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user (authenticated)
- `GET /api/user` - Get authenticated user

### Product Endpoints

- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (admin)
- `PUT /api/products/{id}` - Update product (admin)
- `DELETE /api/products/{id}` - Delete product (admin)

### Category & Occasion Endpoints

- `GET /api/categories` - List categories
- `GET /api/occasions` - List occasions

### Order (Command) Endpoints

- `GET /api/commands` - List all orders (admin)
- `GET /api/commands/{id}` - Get order details
- `POST /api/commands` - Create order
- `PUT /api/commands/{id}` - Update order (admin)

### Custom Field Endpoints

- `GET /api/custom-fields` - List custom fields
- `POST /api/custom-fields` - Create custom field (admin)

## Deployment

### Server Requirements

- **CPU**: 2 vCPU
- **RAM**: 4GB
- **Storage**: 40GB SSD
- **OS**: Ubuntu 22.04 LTS
- **Web Server**: Nginx
- **PHP**: 8.2+ with extensions (mbstring, xml, bcmath, pdo_mysql)
- **Database**: MySQL 8.0 or MariaDB 10.6+
- **Cache**: Redis (optional)
- **Node.js**: 18.x LTS
- **Process Manager**: PM2 (for Node.js apps)

### Recommended Hosting

**Budget Option ($5-10/month)**:
- Hetzner Cloud + CloudPanel
- DigitalOcean Basic Droplet + Laravel setup

**Production-Ready ($25-30/month)**:
- Cloudways (managed Laravel)
- Laravel Forge + DigitalOcean/Vultr

### Architecture

Deploy as three separate applications:

1. **API Backend** (api.yourdomain.com)
   - Laravel on VPS with PHP-FPM + Nginx
   - MySQL database
   - SSL via Let's Encrypt

2. **Customer Storefront** (yourdomain.com)
   - Next.js on Vercel (recommended) or VPS with PM2
   - Static/SSR pages
   - CDN for assets

3. **Admin Dashboard** (admin.yourdomain.com)
   - React SPA on Netlify/Vercel or VPS
   - Static hosting with Nginx

### Environment Configuration

**Backend `.env` (Production)**:
```env
APP_URL=https://api.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,admin.yourdomain.com
SESSION_DOMAIN=.yourdomain.com
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://admin.yourdomain.com
```

**GiftoriaStore `.env.local` (Production)**:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

**Admin Dashboard (Production)**:
```javascript
const API_URL = 'https://api.yourdomain.com/api';
```

## Key Features Implementation

### Multi-Language Support
Translation files in `GiftoriaStore/app/translation/`:
- `en.json` - English translations
- `ar.json` - Arabic translations

Usage in components:
```javascript
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<h1>{t('checkout.title_billing_details')}</h1>
```

### Custom Product Fields
Dynamic fields defined per product:
- Text input (e.g., gift message)
- Number input (e.g., quantity)
- Color picker
- Date picker

Managed in admin dashboard via `ManageCustomFields.js`

### Order Management
Dashboard features:
- View all orders with status
- Edit customer information
- Update order status (pending, processing, completed, cancelled)
- Add internal notes
- View payment method and desired delivery date

### Scheduled Delivery
Customers can select desired delivery date (minimum 6 hours ahead) during checkout

## Development Notes

- Backend runs on port 8000 (default Laravel)
- Next.js storefront runs on port 3000
- React admin runs on port 3001 (configurable)
- Ensure CORS origins match frontend URLs
- Run `php artisan storage:link` after deploying backend
- Set proper file permissions: `storage/` and `bootstrap/cache/` writable

## Testing

Run backend tests:
```powershell
cd backend
php artisan test
```

## License

This project is licensed under the MIT License.