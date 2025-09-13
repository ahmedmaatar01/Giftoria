import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { registerAdmin } from '../../api/auth';

const AdminRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState(null);
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            await registerAdmin(formData);
            history.push('/login'); // Redirect to login after successful registration
        } catch (err) {
            setError(err.message || 'Admin registration failed');
        }
    };

    return (
        <div className="register-container">
            <h2>Register Admin</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input type="password" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
                </div>
                <button type="submit">Register Admin</button>
            </form>
        </div>
    );
};

export default AdminRegister;
