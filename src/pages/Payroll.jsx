import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Download, DollarSign, Calendar } from 'lucide-react';

export const Payroll = () => {
    const { user } = useAuth();

    // Mock payroll data
    const salarySlips = [
        { id: 1, month: 'June 2025', netSalary: 4500, status: 'Pd', paymentDate: '2025-06-30' },
        { id: 2, month: 'May 2025', netSalary: 4500, status: 'Pd', paymentDate: '2025-05-31' },
        { id: 3, month: 'April 2025', netSalary: 4500, status: 'Pd', paymentDate: '2025-04-30' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Payroll</h1>
                <p className="text-slate-500">View your salary history and download slips.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Salary Structure Card */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-indigo-600" />
                        Current Salary Structure
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Basic Salary</span>
                            <span className="font-medium text-slate-900">$3,000.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">HRA</span>
                            <span className="font-medium text-slate-900">$1,200.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Special Allowance</span>
                            <span className="font-medium text-slate-900">$800.00</span>
                        </div>
                        <div className="pt-4 border-t border-slate-100 flex justify-between font-bold">
                            <span className="text-slate-900">Gross Salary</span>
                            <span className="text-indigo-600">$5,000.00</span>
                        </div>
                    </div>
                </div>

                {/* Payslips List */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100">
                        <h2 className="text-lg font-semibold text-slate-900">Recent Payslips</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Month</th>
                                    <th className="px-6 py-3 font-medium">Net Pay</th>
                                    <th className="px-6 py-3 font-medium">Status</th>
                                    <th className="px-6 py-3 font-medium text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {salarySlips.map((slip) => (
                                    <tr key={slip.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-slate-900 flex items-center gap-2">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {slip.month}
                                        </td>
                                        <td className="px-6 py-4 text-slate-600">${slip.netSalary.toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Paid
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 ml-auto">
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
