import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, DB_KEYS } from '../services/db';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem(DB_KEYS.CURRENT_USER);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        const user = db.authenticate(email, password);
        if (user) {
            setUser(user);
            localStorage.setItem(DB_KEYS.CURRENT_USER, JSON.stringify(user));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(DB_KEYS.CURRENT_USER);
    };

    const register = (userData) => {
        // Basic validation check if email exists
        const users = db.getUsers();
        if (users.find(u => u.email === userData.email)) {
            throw new Error('Email already exists');
        }
        const newUser = {
            ...userData,
            id: Date.now().toString(),
            role: 'employee', // Default role for signup
            joinedDate: new Date().toISOString().split('T')[0],
        };
        db.addUser(newUser);
        return newUser;
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
