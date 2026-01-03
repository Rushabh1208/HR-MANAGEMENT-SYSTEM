import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/db';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Upload, FileText, Shield, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

export const Profile = () => {
    const { user: currentUser } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    // Determine which user profile to show
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('resume');
    const [isEditing, setIsEditing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({});

    // Salary Calculation State (Mirrored from Payroll)
    const [salaryConfig, setSalaryConfig] = useState({
        monthlyWage: 0,
        basicPercent: 50,
        hraPercent: 50,
        standardAllowance: 4167,
        pfRate: 12,
        profTax: 200,
    });

    const isAdmin = currentUser?.role === 'admin';
    const isOwnProfile = !id || id === currentUser?.id || id === currentUser?.loginId;
    const canEdit = isAdmin || isOwnProfile;

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            let foundUser = currentUser;

            if (id) {
                // If ID is provided, try fetch from DB specifically
                // NOTE: Frontend routes use /profile/:id. 
                // :id could be INT or LoginID string. 
                // EmployeeRoutes supports both.
                // But efficient way is to fetch specific user if not current one.
                const user = await fetch(`${'http://localhost:5000/api'}/employees/${id}`).then(r => r.ok ? r.json() : null);
                if (user) foundUser = user;
            }

            if (foundUser) {
                setProfileUser(foundUser);
                setFormData({
                    ...foundUser,
                    // snake_case to camelCase mapping might be needed if API returns raw snake_case
                    // Assuming API returns mixed or we handle it. 
                    // Let's assume API returns raw DB columns (snake_case) for specific fields we added manually to schema?
                    // Actually, our API does SELECT * which returns snake_case for new columns.
                    // We should normalize or use snake_case accessing.
                    // For simplicity, I'll access via OR.

                    about: foundUser.about || '',
                    skills: typeof foundUser.skills === 'string' ? foundUser.skills.split(',') : (foundUser.skills || []), // Handle JSON/String
                    dob: foundUser.dob || '',
                    nationality: foundUser.nationality || '',
                    address: foundUser.address || '',
                    bankName: foundUser.bank_name || foundUser.bankName || '',
                    accountNumber: foundUser.account_number || foundUser.accountNumber || '',
                    ifsc: foundUser.ifsc || '',
                    pan: foundUser.pan || '',
                    monthlyWage: parseFloat(foundUser.monthly_wage || foundUser.monthlyWage || 50000),
                });
            }
            setLoading(false);
        };
        fetchProfile();
    }, [id, currentUser]);

    // --- SALARY CALCULATIONS ---
    const calculateSalary = (wage) => {
        const basic = wage * (salaryConfig.basicPercent / 100);
        const hra = basic * (salaryConfig.hraPercent / 100);
        const performanceBonus = basic * 0.0833;
        const lta = basic * 0.0833;
        const standard = salaryConfig.standardAllowance;

        let fixed = wage - (basic + hra + standard + performanceBonus + lta);
        if (fixed < 0) fixed = 0;

        const pf = basic * (salaryConfig.pfRate / 100);

        return {
            basic, hra, standard, performanceBonus, lta, fixed, pf,
            gross: wage,
            net: wage - pf - salaryConfig.profTax
        };
    };

    const salaryComponents = calculateSalary(formData.monthlyWage || 50000);

    const handleSave = async () => {
        // Prepare payload, converting to snake_case if schema requires or handled by API
        // Our API endpoint takes body and maps to UPDATE sets.
        // It expects keys matching the destructuring in the route.
        const updatedData = {
            id: profileUser.id,
            ...profileUser,
            ...formData,
            // Ensure specific fields map correctly for API
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            monthlyWage: formData.monthlyWage,
            // Flatten skills to array
            skills: Array.isArray(formData.skills) ? formData.skills : [],
        };

        const savedUser = await db.updateUser(updatedData);
        if (savedUser) {
            setProfileUser(savedUser);
            setIsEditing(false);
        } else {
            alert("Failed to save profile");
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (loading || !profileUser) return <div className="p-8">Loading profile...</div>;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden min-h-[80vh]">
            {/* Header Content Omitted for brevity, assuming same visual structure */}
            {/* Just ensuring Inputs bind to formData correctly */}

            <div className="p-8 border-b border-slate-200">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-4xl font-bold text-indigo-600 border-4 border-white shadow-lg">
                            {profileUser.name?.charAt(0)}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        {isEditing ? (
                            <Input label="Full Name" value={formData.name} onChange={e => handleInputChange('name', e.target.value)} disabled={!isAdmin} />
                        ) : (
                            <div><h1 className="text-3xl font-bold text-slate-900">{profileUser.name}</h1></div>
                        )}
                        <h2 className="text-lg text-slate-500">{profileUser.jobTitle || profileUser.job_title}</h2>
                        <div className="flex flex-col gap-1 text-sm text-slate-500">
                            <p>Email: {profileUser.email}</p>
                            <p>ID: {profileUser.loginId || profileUser.login_id}</p>
                        </div>
                    </div>


                    <div className="flex flex-col gap-2">
                        {!isEditing && canEdit && (
                            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        )}
                        {isEditing && (
                            <>
                                <Button onClick={handleSave}>Save</Button>
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-8">
                {['resume', 'private_info', ...(isAdmin ? ['salary_info'] : [])].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={clsx(
                            "px-6 py-4 text-sm font-medium border-b-2 transition-colors capitalize",
                            activeTab === tab ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500"
                        )}
                    >
                        {tab.replace('_', ' ')}
                    </button>
                ))}
            </div>

            <div className="p-8 bg-slate-50/50 min-h-[500px]">
                {/* Resume Logic */}
                {activeTab === 'resume' && (
                    <div className="space-y-6">
                        <h3 className="font-bold">About</h3>
                        {isEditing ? (
                            <textarea className="w-full border rounded p-2" value={formData.about} onChange={e => handleInputChange('about', e.target.value)} />
                        ) : (
                            <p>{profileUser.about || 'No bio'}</p>
                        )}
                    </div>
                )}

                {/* Private Info */}
                {activeTab === 'private_info' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded shadow-sm space-y-4">
                            <h3 className="font-bold">Personal</h3>
                            <Input label="Address" value={formData.address} onChange={e => handleInputChange('address', e.target.value)} disabled={!isEditing} />
                            <Input label="Nationality" value={formData.nationality} onChange={e => handleInputChange('nationality', e.target.value)} disabled={!isEditing} />
                        </div>
                        <div className="bg-white p-6 rounded shadow-sm space-y-4">
                            <h3 className="font-bold">Bank Details</h3>
                            <Input label="Bank Name" value={formData.bankName} onChange={e => handleInputChange('bankName', e.target.value)} disabled={!isAdmin} />
                            <Input label="Account Number" value={formData.accountNumber} onChange={e => handleInputChange('accountNumber', e.target.value)} disabled={!isAdmin} />
                        </div>
                    </div>
                )}

                {/* Salary Info (Admin) */}
                {activeTab === 'salary_info' && isAdmin && (
                    <div className="bg-white p-6 rounded shadow-sm space-y-4">
                        <h3 className="font-bold flex items-center gap-2"><DollarSign className="w-4 h-4" /> Salary Config</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-bold">Monthly Wage</label>
                                <input
                                    type="number"
                                    className="w-full border rounded p-2 text-xl font-bold text-indigo-600"
                                    value={formData.monthlyWage}
                                    onChange={e => handleInputChange('monthlyWage', Number(e.target.value))}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-slate-50 rounded border">
                            <p className="font-bold">Net Salary: {salaryComponents.net.toFixed(2)}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
