# Frontend Documentation for Laravel and React Authentication App

This project is a full-stack application built with Laravel as the backend and React as the frontend. It includes user authentication for both admin and user roles, with a private dashboard for admins. The application is designed to be extendable for mobile app integration through APIs.

## Project Structure

The frontend of the application is structured as follows:

```
frontend
├── public                # Static files
├── src                   # Source files
│   ├── components        # React components
│   │   ├── Auth         # Authentication components
│   │   │   ├── Login.js  # Login component
│   │   │   └── Register.js # Registration component
│   │   ├── Dashboard     # Dashboard components
│   │   │   ├── AdminDashboard.js # Admin dashboard component
│   │   │   └── UserDashboard.js  # User dashboard component
│   ├── context           # Context API for state management
│   │   └── AuthContext.js # Authentication context
│   ├── api               # API calls
│   │   └── auth.js       # Authentication API functions
│   ├── App.js            # Main application component
│   └── index.js          # Entry point of the React application
├── package.json          # NPM dependencies and scripts
└── README.md             # Frontend documentation
```

## Features

- **User Authentication**: Users can register and log in to access their dashboards.
- **Role-Based Access**: Admins have access to a private dashboard with additional functionalities.
- **API Integration**: The application is designed to communicate with the backend through RESTful APIs, making it suitable for mobile app development.

## Getting Started

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd laravel-react-auth-app/frontend
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Application**:
   ```
   npm start
   ```

4. **Access the Application**: Open your browser and navigate to `http://localhost:3000`.

## API Endpoints

The frontend communicates with the backend through the following API endpoints:

- **Authentication**:
  - `POST /api/auth/login` - Log in a user.
  - `POST /api/auth/register` - Register a new user.

- **User Management**:
  - `GET /api/user` - Fetch user details.
  - `PUT /api/user` - Update user profile.

- **Admin Functions**:
  - `GET /api/admin/dashboard` - Access the admin dashboard.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or features.

## License

This project is licensed under the MIT License. See the LICENSE file for details.