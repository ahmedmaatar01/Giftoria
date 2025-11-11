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
                // If backend returns is_super, merge it
                let userWithSuper = currentUser;
                if (currentUser && typeof currentUser === 'object' && currentUser.id) {
                    if (typeof currentUser.is_super !== 'undefined') {
                        userWithSuper = { ...currentUser };
                    } else if (currentUser.role === 'admin') {
                        // Try to fetch is_super from /api/admin/me if not present
                        // (Assumes getCurrentUser uses /admin/me for admin)
                        // If not, you may need to update backend to include is_super
                        userWithSuper = { ...currentUser, is_super: null };
                    }
                }
                setUser(userWithSuper);
                localStorage.setItem('user', JSON.stringify(userWithSuper));
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
            // Save the full response (user + token) for admin/user
            let userWithToken = { ...data.user, access_token: data.access_token };
            // If backend does not send is_super, try to fetch it from /admin/me
            if (userWithToken.role === 'admin' && typeof userWithToken.is_super === 'undefined') {
                try {
                    const res = await getCurrentUser();
                    if (typeof res.is_super !== 'undefined') {
                        userWithToken.is_super = res.is_super;
                    }
                } catch {}
            }
            setUser(userWithToken);
            localStorage.setItem('user', JSON.stringify(userWithToken));
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
            }
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
            const userWithToken = { ...data.user, access_token: data.access_token };
            setUser(userWithToken);
            localStorage.setItem('user', JSON.stringify(userWithToken));
            if (data.access_token) {
                localStorage.setItem('access_token', data.access_token);
            }
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