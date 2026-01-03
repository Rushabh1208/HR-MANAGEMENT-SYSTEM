import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Users, Clock, Calendar, CheckCircle, XCircle, AlertCircle, ArrowRight, UserPlus, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === 'admin';
    const navigate = useNavigate();

    if (!user) return null;

    // --- ADMIN DASHBOARD ---
    const AdminDashboard = () => {
        const [employees, setEmployees] = useState([]);
        const [attendanceData, setAttendanceData] = useState([]);
        const [selectedEmployee, setSelectedEmployee] = useState(null);
        const [searchTerm, setSearchTerm] = useState('');
        const [loading, setLoading] = useState(true);

        useEffect(() => {
            const loadAdminData = async () => {
                setLoading(true);
                const allUsers = await db.getUsers();
                // Filter by company (db.js might return all, so filter again mostly redundant but safe)
                const myEmployees = allUsers.filter(u => u.companyName === user.companyName);

                const allAttendance = await db.getAttendance(); // Fetch all (filtered by company on backend)

                setEmployees(myEmployees);
                setAttendanceData(allAttendance);
                setLoading(false);
            };
            loadAdminData();
        }, [user]);

        // Handlers
        const handleViewEmployee = (emp) => {
            setSelectedEmployee(emp);
        };

        const handleBackToOverview = () => {
            setSelectedEmployee(null);
        };

        const handleApproveLeave = async (leaveId) => {
            // Leave logic not fully migrated to API in this step, skipping implementation detail 
            // to focus on main requirements (Attendance/Payroll). 
            // Would call db.updateLeave(leaveId, 'Approved')
            alert("Leave approval API logic would be here.");
        };

        // Filter Sidebar
        const filteredSideEmployees = employees.filter(emp =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.jobTitle && emp.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        // --- DERIVED DATA ---
        const today = new Date().toISOString().split('T')[0];

        // Overview Stats
        const totalEmployees = employees.length;
        const presentToday = attendanceData.filter(r => r.date === today && r.status === 'Present').length;
        // Mocking leaves for now as db.getLeaves() not migrated fully in this snippet context
        const pendingLeaves = 3;

        // Employee Specific Data
        const getEmpAttendance = (id) => attendanceData.filter(r => (r.user_id === id || r.userId === id)).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (loading) return <div className="p-8">Loading dashboard...</div>;

        return (
            <div className="flex h-[calc(100vh-theme(spacing.24))] gap-6">
                {/* LEFT SIDEBAR: Employee List */}
                <div className="w-80 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden shrink-0">
                    <div className="p-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-700 mb-2">Employees</h2>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        <button
                            onClick={handleBackToOverview}
                            className={clsx(
                                "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                                !selectedEmployee ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-50 text-slate-600"
                            )}
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard Overview
                        </button>

                        <div className="pt-2 pb-1 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Team Members
                        </div>

                        {filteredSideEmployees.map(emp => (
                            <button
                                key={emp.id}
                                onClick={() => handleViewEmployee(emp)}
                                className={clsx(
                                    "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3",
                                    selectedEmployee?.id === emp.id ? "bg-indigo-50 text-indigo-700 font-medium" : "hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                    {emp.name.charAt(0)}
                                </div>
                                <div className="truncate">
                                    <div className="truncate">{emp.name}</div>
                                    <div className="text-xs text-slate-400 truncate">{emp.jobTitle || 'Employee'}</div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* MAIN CONTENT AREA */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    {!selectedEmployee ? (
                        // --- GLOBAL OVERVIEW ---
                        <div className="flex-1 overflow-y-auto p-8">
                            <h1 className="text-2xl font-bold text-slate-900 mb-6">Company Overview</h1>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <StatCard icon={<Users className="w-5 h-5" />} label="Total Employees" value={totalEmployees} color="bg-blue-50 text-blue-700" />
                                <StatCard icon={<CheckCircle className="w-5 h-5" />} label="Present Today" value={presentToday} color="bg-green-50 text-green-700" />
                                <StatCard icon={<AlertCircle className="w-5 h-5" />} label="Pending Leaves" value={pendingLeaves} color="bg-orange-50 text-orange-700" />
                            </div>

                            {/* Today's Attendance Visual */}
                            <div className="mb-8">
                                <h2 className="text-lg font-bold text-slate-800 mb-4">Today's Attendance</h2>
                                <div className="border border-slate-200 rounded-xl p-6 flex flex-wrap gap-4">
                                    {employees.map(emp => {
                                        // Find record
                                        const record = attendanceData.find(r => (r.user_id === emp.id || r.userId === emp.id) && r.date === today);
                                        const status = record?.status || 'Absent';

                                        const colors = {
                                            'Present': 'bg-green-100 text-green-700 border-green-200',
                                            'Absent': 'bg-red-50 text-red-400 border-red-100 grayscale',
                                            'Half-day': 'bg-orange-100 text-orange-700 border-orange-200',
                                            'Leave': 'bg-blue-100 text-blue-700 border-blue-200'
                                        };

                                        return (
                                            <div key={emp.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colors[status]} transition-all`} title={status}>
                                                <div className="w-6 h-6 rounded-full bg-white/50 flex items-center justify-center text-xs font-bold">
                                                    {emp.name.charAt(0)}
                                                </div>
                                                <span className="text-sm font-medium">{emp.name}</span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                        </div>
                    ) : (
                        // --- EMPLOYEE DETAIL VIEW ---
                        <div className="flex-1 overflow-y-auto flex flex-col h-full">
                            {/* Header */}
                            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
                                <div className="flex gap-4">
                                    <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-600 border-2 border-white shadow-sm">
                                        {selectedEmployee.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-slate-900">{selectedEmployee.name}</h1>
                                        <div className="flex gap-4 text-sm text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {selectedEmployee.jobTitle || 'No Title'}</span>
                                            <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {selectedEmployee.department || 'No Dept'}</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/profile/${selectedEmployee.loginId || selectedEmployee.id}`)}
                                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 shadow-sm"
                                >
                                    View Full Profile
                                </button>
                            </div>

                            <div className="p-6 space-y-8">
                                {/* Recent Attendance */}
                                <div>
                                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-slate-400" /> Recent Attendance
                                    </h3>
                                    <div className="border rounded-lg overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                                <tr>
                                                    <th className="px-4 py-2">Date</th>
                                                    <th className="px-4 py-2">In</th>
                                                    <th className="px-4 py-2">Out</th>
                                                    <th className="px-4 py-2">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {getEmpAttendance(selectedEmployee.id).slice(0, 5).map(r => (
                                                    <tr key={r.id}>
                                                        <td className="px-4 py-2">{r.date}</td>
                                                        <td className="px-4 py-2 font-mono text-xs">{r.check_in || r.checkIn}</td>
                                                        <td className="px-4 py-2 font-mono text-xs">{r.check_out || r.checkOut || '-'}</td>
                                                        <td className="px-4 py-2"><StatusBadge status={r.status} /></td>
                                                    </tr>
                                                ))}
                                                {getEmpAttendance(selectedEmployee.id).length === 0 && (
                                                    <tr><td colSpan="4" className="px-4 py-4 text-center text-slate-400 italic">No recent records</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // --- EMPLOYEE DASHBOARD (Original Simple View) ---
    const EmployeeDashboard = () => {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user.name}</h1>
                    <p className="text-slate-500">Here's what's happening today.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickParams icon={<Clock className="w-5 h-5 text-indigo-600" />} label="Attendance" value="Checked In" sub="09:00 AM" onClick={() => navigate('/attendance')} />
                    <QuickParams icon={<Calendar className="w-5 h-5 text-blue-600" />} label="Leave Balance" value="12 Days" sub="Available" onClick={() => navigate('/leaves')} />
                    <QuickParams icon={<FileText className="w-5 h-5 text-green-600" />} label="Payslips" value="June 2025" sub="Latest" onClick={() => navigate('/payroll')} />
                    <QuickParams icon={<Users className="w-5 h-5 text-purple-600" />} label="Team" value="Marketing" sub="View Dept" onClick={() => { }} />
                </div>
                {/* ... Could add more widgets here ... */}
            </div>
        );
    }

    return isAdmin ? <AdminDashboard /> : <EmployeeDashboard />;
};

// Helpers
const StatCard = ({ icon, label, value, color }) => (
    <div className={`p-4 rounded-xl border border-slate-100 ${color} flex items-center gap-4`}>
        <div className="p-3 bg-white/60 rounded-lg">{icon}</div>
        <div>
            <p className="text-sm opacity-80 font-medium">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const QuickParams = ({ icon, label, value, sub, onClick }) => (
    <button onClick={onClick} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all text-left group">
        <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">{icon}</div>
            <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
        </div>
        <div className="font-semibold text-slate-900">{label}</div>
        <div className="text-lg font-bold text-indigo-900">{value}</div>
        <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </button>
);

const StatusBadge = ({ status }) => {
    const styles = {
        'Present': 'bg-green-100 text-green-700',
        'Absent': 'bg-red-100 text-red-700',
        'Late': 'bg-yellow-100 text-yellow-700',
    };
    return <span className={`px-2 py-0.5 rounded text-xs font-semibold ${styles[status] || 'bg-slate-100 text-slate-600'}`}>{status}</span>;
}
