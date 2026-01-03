import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Button } from '../components/Button';
import { Mail, Phone, MapPin, User, Search, Plus } from 'lucide-react';

export const Employees = () => {
    const { user } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        // Only fetch if admin, though route protection should handle it, nice to be safe
        const users = db.getUsers();
        setEmployees(users);
    }, []);

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
                    <p className="text-slate-500">Manage your team members and their roles.</p>
                </div>
                <Button>
                    <Plus className="w-5 h-5 mr-2" />
                    Add Employee
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                    {filteredEmployees.map((emp) => (
                        <div key={emp.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-slate-900">{emp.name}</h3>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide">{emp.role}</p>
                                    </div>
                                </div>
                                {/* <button className="text-slate-400 hover:text-indigo-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button> */}
                            </div>

                            <div className="space-y-2.5">
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <Mail className="w-4 h-4 text-slate-400" />
                                    <span className="truncate">{emp.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <User className="w-4 h-4 text-slate-400" />
                                    <span>{emp.jobTitle || 'Employee'}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-600">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span>{emp.department || 'General'}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm">
                                <span className="text-slate-500">Joined: {emp.joinedDate || 'N/A'}</span>
                                <button className="text-indigo-600 font-medium hover:underline">View Profile</button>
                            </div>
                        </div>
                    ))}

                    {filteredEmployees.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            No employees found matching configuration.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
