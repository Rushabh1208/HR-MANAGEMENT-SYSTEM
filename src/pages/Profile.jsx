import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);

    // Mock local state for "Edit" functionality, even if it doesn't persist deeply back to DB in this simple version
    const [formData, setFormData] = useState({
        phone: '+1 (555) 123-4567',
        address: '123 Main St, Cityville, CA',
    });

    const handleSave = () => {
        // Here we would call db.updateUser
        setIsEditing(false);
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Cover + Avatar */}
                <div className="h-32 bg-indigo-600 relative"></div>
                <div className="px-8 pb-8">
                    <div className="relative -mt-12 mb-6 flex justify-between items-end">
                        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
                            <div className="w-full h-full rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-700">
                                {user?.name?.charAt(0)}
                            </div>
                        </div>
                        {!isEditing ? (
                            <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                <Button onClick={handleSave}>Save Changes</Button>
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                        <p className="text-slate-500">{user?.jobTitle} • {user?.department}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Personal Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">{user?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {isEditing ? (
                                            <Input
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="h-8 py-1"
                                            />
                                        ) : (
                                            <span className="text-slate-600">{formData.phone}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <MapPin className="w-4 h-4 text-slate-400" />
                                        {isEditing ? (
                                            <Input
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                className="h-8 py-1"
                                            />
                                        ) : (
                                            <span className="text-slate-600">{formData.address}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Job Details</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <Briefcase className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">Employee ID: {user?.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <User className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">Reports to: Manager Name</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="w-4 h-4 text-slate-400" />
                                        <span className="text-slate-600">Joined: {user?.joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
