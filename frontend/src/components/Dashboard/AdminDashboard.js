import React, { useEffect, useState } from 'react';
import { getAdminData } from '../../api/auth';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const data = await getAdminData();
                console.log('Admin data fetched:', data);
                await setAdminData(data.admin);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <button onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('access_token');
                window.location.href = '/admin-login';
            }}>Logout</button>
            {adminData ? (
                <div>
                    <h2>Welcome, {adminData.name}</h2>
                    <p>Email: {adminData.email}</p>
                    {/* Additional admin functionalities can be added here */}
                </div>
            ) : (
                <p>No admin data available.</p>
            )}
        </div>
    );
};

export default AdminDashboard;