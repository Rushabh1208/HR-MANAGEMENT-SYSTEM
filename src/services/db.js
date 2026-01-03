export const DB_KEYS = {
    USERS: 'dayflow_users',
    ATTENDANCE: 'dayflow_attendance',
    LEAVES: 'dayflow_leaves',
    CURRENT_USER: 'dayflow_current_user',
};

const INITIAL_ADMIN = {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@dayflow.com',
    password: 'admin', // In a real app, this would be hashed
    role: 'admin',
    department: 'HR',
    jobTitle: 'HR Manager',
    salary: 50000,
    joinedDate: '2025-01-01',
};

export const db = {
    getUsers: () => {
        const users = localStorage.getItem(DB_KEYS.USERS);
        return users ? JSON.parse(users) : [INITIAL_ADMIN];
    },

    checkInitialized: () => {
        if (!localStorage.getItem(DB_KEYS.USERS)) {
            localStorage.setItem(DB_KEYS.USERS, JSON.stringify([INITIAL_ADMIN]));
        }
    },

    addUser: (user) => {
        const users = db.getUsers();
        users.push(user);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    },

    updateUser: (updatedUser) => {
        const users = db.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem(DB_KEYS.USERS, JSON.stringify(users));
    },

    authenticate: (email, password) => {
        db.checkInitialized();
        const users = db.getUsers();
        return users.find(u => u.email === email && u.password === password);
    },

    // Attendance
    getAttendance: () => {
        const data = localStorage.getItem(DB_KEYS.ATTENDANCE);
        return data ? JSON.parse(data) : [];
    },

    addAttendance: (record) => {
        const data = db.getAttendance();
        data.push(record);
        localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(data));
    },

    updateAttendance: (updatedRecord) => {
        const data = db.getAttendance().map(r => r.id === updatedRecord.id ? updatedRecord : r);
        localStorage.setItem(DB_KEYS.ATTENDANCE, JSON.stringify(data));
    },

    // Leaves
    getLeaves: () => {
        const data = localStorage.getItem(DB_KEYS.LEAVES);
        return data ? JSON.parse(data) : [];
    },

    addLeave: (leave) => {
        const data = db.getLeaves();
        data.push(leave);
        localStorage.setItem(DB_KEYS.LEAVES, JSON.stringify(data));
    },

    updateLeave: (updatedLeave) => {
        const data = db.getLeaves().map(l => l.id === updatedLeave.id ? updatedLeave : l);
        localStorage.setItem(DB_KEYS.LEAVES, JSON.stringify(data));
    }
};

// Initialize on load
db.checkInitialized();
