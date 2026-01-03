import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LayoutDashboard } from 'lucide-react';

export const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const from = location.state?.from?.pathname || '/dashboard';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Updated to await the async login function
            const success = await login(identifier, password);
            if (success) {
                navigate(from, { replace: true });
            } else {
                setError('Invalid email/ID or password');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <LayoutDashboard className="w-8 h-8" />
                        <span className="text-2xl font-bold text-slate-900">Dayflow</span>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Welcome back</h2>
                <p className="text-slate-500 text-center mb-8">Please enter your details to sign in.</p>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 flex items-center justify-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email or Login ID"
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="john@company.com or CMP1234"
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-slate-600">Remember me</span>
                        </label>
                        <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Forgot password?
                        </a>
                    </div>

                    <Button type="submit" className="w-full" isLoading={isLoading}>
                        Sign in
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium">
                        Create company
                    </Link>
                </p>
            </div>
        </div>
    );
};
