import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Calendar, Plus, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import clsx from 'clsx';

export const Leaves = () => {
    const { user } = useAuth();
    const [leaves, setLeaves] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [leaveType, setLeaveType] = useState('Sick Leave');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    useEffect(() => {
        loadLeaves();
    }, [user]);

    const loadLeaves = () => {
        const allLeaves = db.getLeaves();
        // Filter for current user unless admin
        const myLeaves = allLeaves.filter(l => l.userId === user.id).sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
        setLeaves(myLeaves);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        const newLeave = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            type: leaveType,
            startDate,
            endDate,
            reason,
            status: 'Pending',
            appliedOn: new Date().toISOString().split('T')[0],
        };

        db.addLeave(newLeave);
        setShowForm(false);
        resetForm();
        loadLeaves();
    };

    const resetForm = () => {
        setStartDate('');
        setEndDate('');
        setReason('');
        setLeaveType('Sick Leave');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Leave Management</h1>
                    <p className="text-slate-500">View and apply for time off.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-5 h-5 mr-2" />
                    Apply for Leave
                </Button>
            </div>

            {/* Application Form */}
            {showForm && (
                <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 animate-in fade-in slide-in-from-top-4">
                    <h2 className="text-lg font-semibold mb-4">New Leave Application</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-slate-700">Leave Type</label>
                                <select
                                    className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                                    value={leaveType}
                                    onChange={(e) => setLeaveType(e.target.value)}
                                >
                                    <option>Sick Leave</option>
                                    <option>Casual Leave</option>
                                    <option>Paid Leave</option>
                                    <option>Unpaid Leave</option>
                                </select>
                            </div>
                            <Input
                                label="Reason"
                                placeholder="Reason for leave..."
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Start Date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                required
                            />
                            <Input
                                label="End Date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                            <Button type="submit">Submit Request</Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Leaves List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">My Leave History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Type</th>
                                <th className="px-6 py-3 font-medium">Dates</th>
                                <th className="px-6 py-3 font-medium">Days</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Reason</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {leaves.length > 0 ? (
                                leaves.map((leave) => (
                                    <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900">{leave.type}</td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">
                                            {Math.ceil((new Date(leave.endDate) - new Date(leave.startDate)) / (1000 * 60 * 60 * 24)) + 1}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                                                leave.status === 'Approved' ? "bg-green-50 text-green-700 border-green-100" :
                                                    leave.status === 'Rejected' ? "bg-red-50 text-red-700 border-red-100" :
                                                        "bg-amber-50 text-amber-700 border-amber-100"
                                            )}>
                                                {leave.status === 'Approved' && <CheckCircle className="w-3 h-3" />}
                                                {leave.status === 'Rejected' && <XCircle className="w-3 h-3" />}
                                                {leave.status === 'Pending' && <Clock className="w-3 h-3" />}
                                                {leave.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">{leave.reason || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No leave requests found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
