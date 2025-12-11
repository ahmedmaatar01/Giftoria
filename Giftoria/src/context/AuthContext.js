
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
                const storedToken = localStorage.getItem('access_token');
                if (storedUser) {
                    let parsedUser = JSON.parse(storedUser);
                    // Always ensure access_token is present in user object
                    if (!parsedUser.access_token && storedToken) {
                        parsedUser.access_token = storedToken;
                        localStorage.setItem('user', JSON.stringify(parsedUser));
                    }
                    setUser(parsedUser);
                    setLoading(false);
                    return;
                }
                // If not in localStorage, fetch from API
                const currentUser = await getCurrentUser();
                let userWithSuper = currentUser;
                if (currentUser && typeof currentUser === 'object' && currentUser.id) {
                    if (typeof currentUser.is_super !== 'undefined') {
                        userWithSuper = { ...currentUser };
                    } else if (currentUser.role === 'admin') {
                        userWithSuper = { ...currentUser, is_super: null };
                    }
                }
                // Also ensure access_token is present if available
                if (!userWithSuper.access_token && storedToken) {
                    userWithSuper.access_token = storedToken;
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
            let rawData = await apiLogin(credentials);
            let data = rawData;
            // If response contains extra text before JSON, extract JSON part
            if (typeof rawData === 'string') {
                const jsonMatch = rawData.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    try {
                        data = JSON.parse(jsonMatch[0]);
                    } catch (e) {
                        console.error('Failed to parse login JSON:', e, jsonMatch[0]);
                        data = {};
                    }
                } else {
                    data = {};
                }
            }
            console.log('LOGIN RESPONSE DATA (parsed):', data);
            let userWithToken = { ...data.user };
            userWithToken.access_token = data.access_token;
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