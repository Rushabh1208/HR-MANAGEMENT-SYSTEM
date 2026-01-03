import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, DB_KEYS } from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(DB_KEYS.CURRENT_USER);
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        const loggedUser = await db.authenticate(identifier, password);
        if (loggedUser) {
            setUser(loggedUser);
            localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(loggedUser));
            return true;
        }
        return false;
    };

    const register = async (userData) => {
        // Placeholder for consistency
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(DB_KEYS.CURRENT_USER);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
