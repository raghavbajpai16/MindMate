import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('user_id');
        if (token && userId) {
            setUser({ id: userId }); // In real app, fetch profile here
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { token, user_id } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user_id', user_id);
            setUser({ id: user_id });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Login failed' };
        }
    };

    const signup = async (name, email, password) => {
        try {
            const response = await authAPI.signup(name, email, password);
            return { success: true };
        } catch (error) {
            return { success: false, message: error.response?.data?.detail || 'Signup failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
