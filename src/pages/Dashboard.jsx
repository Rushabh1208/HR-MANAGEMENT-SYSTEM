import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Clock, Calendar, CheckCircle, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

const StatCard = ({ title, value, icon: Icon, trend, color }) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={clsx("p-2 rounded-lg", color)}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {trend && (
            <p className="text-xs text-green-600 font-medium mt-3 flex items-center gap-1">
                <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700">+{trend}</span>
                <span className="text-slate-400 font-normal">from last month</span>
            </p>
        )}
    </div>
);

export const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-500">Welcome back, {user?.name}</p>
                </div>
                <div className="text-sm text-slate-500">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {isAdmin ? (
                    <>
                        <StatCard
                            title="Total Employees"
                            value="24"
                            icon={Users}
                            trend="12%"
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="On Time Today"
                            value="18"
                            icon={Clock}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="On Leave"
                            value="3"
                            icon={Calendar}
                            color="bg-orange-500"
                        />
                        <StatCard
                            title="Pending Requests"
                            value="5"
                            icon={AlertCircle}
                            color="bg-purple-500"
                        />
                    </>
                ) : (
                    <>
                        <StatCard
                            title="Attendance"
                            value="92%"
                            icon={CheckCircle}
                            color="bg-green-500"
                        />
                        <StatCard
                            title="Leave Balance"
                            value="12 Days"
                            icon={Calendar}
                            color="bg-blue-500"
                        />
                        <StatCard
                            title="Working Hours"
                            value="164h"
                            icon={Clock}
                            color="bg-indigo-500"
                        />
                        <StatCard
                            title="Next Holiday"
                            value="Aug 15"
                            icon={Calendar}
                            color="bg-pink-500"
                        />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity / Charts Placeholder */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-64 flex items-center justify-center text-slate-400">
                    Activity Check Placeholder
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 h-64 flex items-center justify-center text-slate-400">
                    Attendance Overview Placeholder
                </div>
            </div>
        </div>
    );
};
