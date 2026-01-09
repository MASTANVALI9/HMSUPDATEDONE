-- MedCare Hospital Database Schema
-- PostgreSQL

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS contact_messages CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;
DROP TABLE IF EXISTS doctors CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) DEFAULT 'patient' CHECK (role IN ('patient', 'doctor', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    department_id INTEGER REFERENCES departments(id),
    specialization VARCHAR(255),
    experience_years INTEGER,
    photo_url TEXT,
    availability VARCHAR(50) DEFAULT 'available',
    availability_text VARCHAR(255),
    education VARCHAR(255),
    about TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    patient_id INTEGER REFERENCES users(id),
    patient_name VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) NOT NULL,
    patient_phone VARCHAR(50),
    doctor_id INTEGER REFERENCES doctors(id),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_doctors_department ON doctors(department_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);

-- Insert demo departments
INSERT INTO departments (name, description, icon) VALUES
('Cardiology', 'Heart and cardiovascular care', 'heartbeat'),
('Neurology', 'Brain and nervous system care', 'brain'),
('Oncology', 'Cancer treatment and care', 'ribbon'),
('Orthopedics', 'Bone and joint care', 'bone'),
('Pulmonology', 'Lung and respiratory care', 'lungs'),
('Gastroenterology', 'Digestive system care', 'stomach'),
('General Medicine', 'Primary healthcare', 'stethoscope');

-- Insert demo doctors
INSERT INTO doctors (name, email, department_id, specialization, experience_years, photo_url, availability, availability_text) VALUES
('Dr. Sarah Johnson', 'sarah.johnson@medcare.com', 1, 'Interventional Cardiologist', 15, 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop', 'available', 'Available Today'),
('Dr. Michael Chen', 'michael.chen@medcare.com', 2, 'Neurologist & Stroke Specialist', 12, 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop', 'available', 'Available Today'),
('Dr. Emily Rodriguez', 'emily.rodriguez@medcare.com', 3, 'Medical Oncologist', 18, 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop', 'available', 'Available Tomorrow'),
('Dr. James Wilson', 'james.wilson@medcare.com', 4, 'Orthopedic Surgeon', 20, 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop', 'busy', 'Next Available: Monday'),
('Dr. Amanda Foster', 'amanda.foster@medcare.com', 5, 'Pulmonologist', 10, 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop', 'available', 'Available Today'),
('Dr. Robert Kumar', 'robert.kumar@medcare.com', 6, 'Gastroenterologist', 14, 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop', 'available', 'Available Today'),
('Dr. Lisa Thompson', 'lisa.thompson@medcare.com', 7, 'Internal Medicine Specialist', 8, 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop', 'available', 'Available Today'),
('Dr. David Park', 'david.park@medcare.com', 1, 'Cardiac Electrophysiologist', 16, 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop', 'busy', 'Next Available: Wednesday');

-- Insert demo admin user (password: admin123)
INSERT INTO users (email, password_hash, name, phone, role) VALUES
('admin@medcare.com', '$2a$10$rZ5c.L.V.H.ZqK.Q.H.7Oe.WL.PLOh.sNq.n.LC.LqK.Q.H.7Oe.WL', 'Admin User', '+1234567890', 'admin');

COMMENT ON TABLE users IS 'Hospital system users including patients and staff';
COMMENT ON TABLE departments IS 'Medical departments in the hospital';
COMMENT ON TABLE doctors IS 'Doctor profiles and information';
COMMENT ON TABLE appointments IS 'Patient appointment bookings';
COMMENT ON TABLE contact_messages IS 'Contact form submissions';
