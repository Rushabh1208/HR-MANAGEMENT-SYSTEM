// DB Service: Replaced with API calls
const API_URL = 'http://localhost:5000/api';

export const db = {
    // AUTH
    authenticate: async (identifier, password) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                console.warn('Login failed:', data.message);
                return null;
            }
            return data.user;
        } catch (error) {
            console.error('Login network/server error:', error);
            return null;
        }
    },

    createUser: async (userData, companyName) => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...userData, companyName }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }
            return data;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    // USERS
    getUsers: async () => {
        const userStr = localStorage.getItem('dayflow_user');
        const user = userStr ? JSON.parse(userStr) : null;
        const companyName = user ? user.companyName : '';

        try {
            const res = await fetch(`${API_URL}/employees?companyName=${encodeURIComponent(companyName)}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    updateUser: async (user) => {
        try {
            const res = await fetch(`${API_URL}/employees/${user.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
            });
            return await res.json();
        } catch (error) {
            console.error(error);
        }
    },

    // ATTENDANCE
    getAttendance: async () => {
        const userStr = localStorage.getItem('dayflow_user');
        const user = userStr ? JSON.parse(userStr) : null;
        const companyName = user ? user.companyName : '';

        try {
            const res = await fetch(`${API_URL}/attendance?companyName=${encodeURIComponent(companyName)}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    addAttendance: async (record) => {
        try {
            const res = await fetch(`${API_URL}/attendance/checkin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: record.userId,
                    date: record.date,
                    time: record.checkIn,
                    status: record.status
                }),
            });
            return res.ok;
        } catch (error) {
            console.error(error);
        }
    },

    updateAttendance: async (record) => {
        try {
            const res = await fetch(`${API_URL}/attendance/checkout`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: record.userId,
                    date: record.date,
                    time: record.checkOut,
                    workingHours: record.workingHours
                }),
            });
            return res.ok;
        } catch (error) {
            console.error(error);
        }
    },

    // PAYROLL
    getPayroll: async (userId) => {
        const userStr = localStorage.getItem('dayflow_user');
        const user = userStr ? JSON.parse(userStr) : null;
        const companyName = user ? user.companyName : '';

        try {
            let url = `${API_URL}/payroll?companyName=${encodeURIComponent(companyName)}`;
            if (userId) url += `&userId=${userId}`;

            const res = await fetch(url);
            if (!res.ok) return [];
            return await res.json();
        } catch (error) {
            console.error(error);
            return [];
        }
    },

    generatePayslip: async (data) => {
        try {
            const res = await fetch(`${API_URL}/payroll/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            return res.ok;
        } catch (error) {
            console.error(error);
        }
    }
};

export const DB_KEYS = {
    USERS: 'dayflow_users',
    CURRENT_USER: 'dayflow_user',
    ATTENDANCE: 'dayflow_attendance',
    LEAVES: 'dayflow_leaves'
};
