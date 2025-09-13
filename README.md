# Laravel and React Authentication App

This project is a full-stack application built with Laravel for the backend and React for the frontend. It includes user authentication for both admin and user roles, allowing admins to access a private dashboard. The application is designed to be extensible for mobile app integration through APIs.

## Project Structure

```
laravel-react-auth-app
├── backend
│   ├── app
│   │   ├── Console
│   │   ├── Exceptions
│   │   ├── Http
│   │   │   ├── Controllers
│   │   │   │   ├── Api
│   │   │   │   │   ├── AuthController.php
│   │   │   │   │   ├── UserController.php
│   │   │   │   │   └── AdminController.php
│   │   │   │   └── Controller.php
│   │   │   ├── Middleware
│   │   │   │   ├── AdminMiddleware.php
│   │   │   │   └── Authenticate.php
│   │   ├── Models
│   │   │   └── User.php
│   ├── config
│   ├── database
│   │   ├── factories
│   │   ├── migrations
│   │   └── seeders
│   ├── routes
│   │   ├── api.php
│   │   └── web.php
│   ├── tests
│   ├── composer.json
│   └── README.md
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   │   ├── Auth
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   ├── Dashboard
│   │   │   │   ├── AdminDashboard.js
│   │   │   │   └── UserDashboard.js
│   │   ├── context
│   │   │   └── AuthContext.js
│   │   ├── api
│   │   │   └── auth.js
│   │   ├── App.js
│   │   ├── index.js
│   ├── package.json
│   └── README.md
└── README.md
```

## Features

- User authentication with roles (admin and user)
- Admin dashboard with restricted access
- User dashboard for regular users
- API endpoints for mobile app integration

## Getting Started

### Prerequisites

- PHP >= 7.3
- Composer
- Node.js >= 12.x
- npm

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd laravel-react-auth-app
   ```

2. Set up the backend:
   - Navigate to the `backend` directory:
     ```
     cd backend
     ```
   - Install PHP dependencies:
     ```
     composer install
     ```
   - Set up your `.env` file and configure your database settings.
   - Run migrations:
     ```
     php artisan migrate
     ```

3. Set up the frontend:
   - Navigate to the `frontend` directory:
     ```
     cd ../frontend
     ```
   - Install npm dependencies:
     ```
     npm install
     ```

### Running the Application

- Start the Laravel server:
  ```
  php artisan serve
  ```
- Start the React application:
  ```
  npm start
  ```

## API Documentation

Refer to the backend `README.md` for detailed API documentation and usage.

## License

This project is licensed under the MIT License.