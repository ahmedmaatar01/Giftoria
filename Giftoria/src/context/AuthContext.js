import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Try to get user from localStorage first
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                    setLoading(false);
                    return;
                }
                // If not in localStorage, fetch from API
                const currentUser = await getCurrentUser();
                setUser(currentUser);
                localStorage.setItem('user', JSON.stringify(currentUser));
            } catch (error) {
                setUser(null);
                localStorage.removeItem('user');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const data = await apiLogin(credentials);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            localStorage.removeItem('user');
        } catch (error) {
            throw error;
        }
    };

    const register = async (userData) => {
        try {
            const data = await apiRegister(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
};