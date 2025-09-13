import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const UserDashboard = () => {
    const { user } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        window.location.href = '/login';
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            {user ? (
                <div>
                    <h2>Welcome, {user.name}</h2>
                    <p>Email: {user.email}</p>
                </div>
            ) : (
                <p>No user data available.</p>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default UserDashboard;