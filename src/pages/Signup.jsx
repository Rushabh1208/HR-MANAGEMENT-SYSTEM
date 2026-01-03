import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { UserPlus } from 'lucide-react';

export const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        id: '', // Employee ID
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsLoading(true);

        try {
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 800));

            const userData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: 'employee', // Default role
                jobTitle: 'Employee', // Default
                department: 'General', // Default
                employeeId: formData.id
            };

            register(userData);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                        <UserPlus className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Create an Account</h1>
                    <p className="text-slate-500 mt-2">Join Dayflow HRMS</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Input
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        required
                    />

                    <Input
                        label="Employee ID"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                        placeholder="EMP001"
                        required
                    />

                    <Input
                        label="Email address"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@dayflow.com"
                        required
                    />

                    <Input
                        label="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <Button
                        type="submit"
                        className="w-full mt-4"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div className="text-center text-sm text-slate-500 mt-4">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};
