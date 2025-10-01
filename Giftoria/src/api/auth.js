import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Adjust the URL as needed

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/user/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/user/login`, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logout = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
        if (!token) throw new Error('No access token found.');
        let url = `${API_URL}/user/logout`;
        if (user && user.role === 'admin') {
            url = `${API_URL}/admin/logout`;
        }
        const response = await axios.post(url, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getUser = async () => {
    try {
        const response = await axios.get(`${API_URL}/user/me`);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getAdminData = async () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        // Try to get the access token from localStorage or from a separate key
        const token = (user && (user.access_token || user.token || user.accessToken)) || localStorage.getItem('access_token');
        if (!token) {
            throw new Error('No access token found for admin.');
        }
        const response = await axios.get(`${API_URL}/admin/dashboard`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

export const getCurrentUser = async () => {
    // Try to get user from localStorage to determine role and token
    const storedUser = localStorage.getItem('user');
    let role = null;
    let token = null;
    if (storedUser) {
        try {
            const userObj = JSON.parse(storedUser);
            role = userObj.role;
            token = userObj.access_token || userObj.token || userObj.accessToken;
        } catch {}
    }
    if (!token) {
        token = localStorage.getItem('access_token');
    }
    if (!token) throw new Error('No access token found.');
    let url = `${API_URL}/user/me`;
    if (role === 'admin') {
        url = `${API_URL}/admin/me`;
    }
    const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

export const registerAdmin = async (adminData) => {
    try {
        const response = await axios.post(`${API_URL}/admin/register`, adminData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};