import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useContext(AuthContext);
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('http://localhost:8000/api/admin/login', { email, password });
            console.log('Login response:', response.data);
            setUser(response.data.user);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            // Store access_token separately for API requests
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
            }
            history.push('/admin-dashboard');
        } catch (err) {
            // Improved error logging
            if (err.response) {
                console.error('Admin login error response:', err.response.data);
            } else {
                console.error('Admin login error:', err);
            }
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError('Invalid admin credentials. Please try again.');
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login as Admin</button>
            </form>
        </div>
    );
};

export default AdminLogin;
