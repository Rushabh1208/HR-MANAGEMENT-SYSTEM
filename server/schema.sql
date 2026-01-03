-- Create Database
CREATE DATABASE IF NOT EXISTS dayflow_db;
USE dayflow_db;

-- 1. Users Table (Expanded for Profile & Salary Config)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    login_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    role ENUM('admin', 'employee') DEFAULT 'employee',
    company_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    job_title VARCHAR(100),
    department VARCHAR(100),
    joined_date DATE,
    
    -- Profile / Personal Info
    about TEXT,
    skills TEXT,           -- Store as comma-separated string or JSON
    dob DATE,
    nationality VARCHAR(50),
    address TEXT,
    gender VARCHAR(20),
    marital_status VARCHAR(20),

    -- Bank Details
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    ifsc VARCHAR(20),
    pan VARCHAR(20),

    -- Salary Configuration
    monthly_wage DECIMAL(10, 2) DEFAULT 0.00,
    basic_percent DECIMAL(5, 2) DEFAULT 50.00,
    hra_percent DECIMAL(5, 2) DEFAULT 50.00,
    standard_allowance DECIMAL(10, 2) DEFAULT 4167.00,
    pf_rate DECIMAL(5, 2) DEFAULT 12.00,
    prof_tax DECIMAL(10, 2) DEFAULT 200.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    working_hours DECIMAL(4, 2),
    status ENUM('Present', 'Absent', 'Half-day', 'Leave', 'Late') DEFAULT 'Absent',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Leaves Table
CREATE TABLE IF NOT EXISTS leaves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days INT DEFAULT 1,
    reason TEXT,
    status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Payroll Table
CREATE TABLE IF NOT EXISTS payroll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    month VARCHAR(20) NOT NULL, -- e.g., 'June'
    year INT NOT NULL,          -- e.g., 2025
    working_days INT DEFAULT 0,
    
    -- Snapshot of values at time of generation
    basic_salary DECIMAL(10, 2),
    hra DECIMAL(10, 2),
    allowances DECIMAL(10, 2),
    deductions DECIMAL(10, 2),
    net_salary DECIMAL(10, 2),
    
    status ENUM('Pending', 'In Progress', 'Released') DEFAULT 'Pending',
    generated_on DATE DEFAULT (CURRENT_DATE),
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert Default Admin (Optional, user usually registers)
-- INSERT INTO users (login_id, password, name, email, role, company_name) 
-- VALUES ('ADMIN001', 'admin123', 'System Admin', 'admin@dayflow.com', 'admin', 'Dayflow Corp');
