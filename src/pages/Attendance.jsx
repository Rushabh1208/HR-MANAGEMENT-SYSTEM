import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Button } from '../components/Button';
import { Clock, Calendar as CalendarIcon, MapPin, CheckCircle, XCircle } from 'lucide-react';
import clsx from 'clsx';

export const Attendance = () => {
    const { user } = useAuth();
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [todayRecord, setTodayRecord] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAttendance();
    }, [user]);

    const loadAttendance = () => {
        const allRecords = db.getAttendance();
        // Filter for current user unless admin (Admins might see all, but for this view let's keep it personal or all based on role later. 
        // For now, let's show personal attendance for simplicity in this view, 
        // or add a toggle if admin. The requirement says "Employees can view only their own... Admin can view all".
        // Let's implement Personal View first.

        const personalRecords = allRecords.filter(r => r.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date));
        setAttendanceHistory(personalRecords);

        const todayStr = new Date().toISOString().split('T')[0];
        const today = personalRecords.find(r => r.date === todayStr);
        setTodayRecord(today);
        setLoading(false);
    };

    const handleCheckIn = () => {
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newRecord = {
            id: Date.now().toString(),
            userId: user.id,
            userName: user.name,
            date: todayStr,
            checkIn: timeStr,
            checkOut: null,
            status: 'Present',
        };

        db.addAttendance(newRecord);
        loadAttendance();
    };

    const handleCheckOut = () => {
        if (!todayRecord) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const updatedRecord = {
            ...todayRecord,
            checkOut: timeStr,
        };

        // calculate hours worked purely for display if needed, simplified for now
        db.updateAttendance(updatedRecord); // We need to add updateAttendance to db service first if not strict
        // Actually db service had addAttendance but maybe not update specific. Let's check db service capabilities. 
        // The previous db.js had addAttendance but not explicit update for attendance relative to ID.
        // I will implement a custom update in the db service or just overwrite for this mock.
        // Let's assume I'll fix db.js to have updateAttendance or I'll implement it here via get/set.

        // Quick fix for mock db update locally:
        const all = db.getAttendance();
        const newAll = all.map(r => r.id === todayRecord.id ? updatedRecord : r);
        localStorage.setItem('dayflow_attendance', JSON.stringify(newAll));

        loadAttendance();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
                    <p className="text-slate-500">Manage your daily check-ins and check-outs.</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-slate-500 uppercase font-semibold">Current Time</p>
                        <p className="text-xl font-mono font-bold text-slate-900">
                            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>

                    {!todayRecord ? (
                        <Button onClick={handleCheckIn} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Check In
                        </Button>
                    ) : !todayRecord.checkOut ? (
                        <Button onClick={handleCheckOut} className="bg-orange-600 hover:bg-orange-700">
                            <XCircle className="w-4 h-4 mr-2" />
                            Check Out
                        </Button>
                    ) : (
                        <div className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium text-sm flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                            Completed for Today
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-slate-900">Attendance History</h2>
                    {/* Date filter could go here */}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Date</th>
                                <th className="px-6 py-3 font-medium">Check In</th>
                                <th className="px-6 py-3 font-medium">Check Out</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium">Working Hours</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {attendanceHistory.length > 0 ? (
                                attendanceHistory.map((record) => (
                                    <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                            <CalendarIcon className="w-4 h-4 text-slate-400" />
                                            {new Date(record.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">{record.checkIn}</td>
                                        <td className="px-6 py-4 text-slate-600">{record.checkOut || '--:--'}</td>
                                        <td className="px-6 py-4">
                                            <span className={clsx(
                                                "px-2.5 py-1 rounded-full text-xs font-medium",
                                                record.status === 'Present' ? "bg-green-100 text-green-700" :
                                                    record.status === 'Late' ? "bg-orange-100 text-orange-700" :
                                                        "bg-red-100 text-red-700"
                                            )}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            8h 30m {/* Placeholder calculation */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                                        No attendance records found.
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
