import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function readStoredAuth() {
    try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (!storedToken || !storedUser) return { user: null, token: null };

        const base64Url = storedToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
        );
        const decoded = JSON.parse(jsonPayload);
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return { user: null, token: null };
        }
        return { user: JSON.parse(storedUser), token: storedToken };
    } catch (e) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return { user: null, token: null };
    }
}

export const AuthProvider = ({ children }) => {
    const initial = readStoredAuth();
    const [user, setUser] = useState(initial.user);
    const [token, setToken] = useState(initial.token);
    const navigate = useNavigate();

    // Debug: log auth state changes
    useEffect(() => {
        console.log('[AuthProvider] user state changed:', user);
    }, [user]);

    const login = (userData, jwtToken) => {
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setToken(jwtToken);
        // Small delay to let React batch state update before navigating
        setTimeout(() => navigate('/dashboard'), 0);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loadingAuth: false }}>
            {children}
        </AuthContext.Provider>
    );
};
