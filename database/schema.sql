-- EventHub Database Schema
-- MySQL Database Setup Script

-- Create database
CREATE DATABASE IF NOT EXISTS eventhub_db;
USE eventhub_db;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS registrations;
DROP TABLE IF EXISTS events;

-- Create events table
CREATE TABLE events (
    id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    seats INT NOT NULL,
    icon VARCHAR(50) NOT NULL,
    gradient JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create registrations table
CREATE TABLE registrations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(20) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    organization VARCHAR(150) NOT NULL,
    tickets INT NOT NULL DEFAULT 1,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Insert sample events (matching frontend data)
INSERT INTO events (id, name, category, date, location, seats, icon, gradient) VALUES
('eh-01', 'IndiaDev Summit 2026', 'tech', 'Mar 14, 2026', 'Bengaluru, IN', 312, 'code', '["#00e5ff", "#5b8bff"]'),
('eh-02', 'Jaipur Lit & Sound Fest', 'cultural', 'Feb 28, 2026', 'Jaipur, IN', 540, 'music', '["#ff6ec7", "#ff9a76"]'),
('eh-03', 'Trail Run Nilgiris 50K', 'sports', 'Apr 06, 2026', 'Ooty, IN', 95, 'run', '["#ffb547", "#ff6e6e"]'),
('eh-04', 'Hands-on Prompt Engineering', 'workshop', 'Mar 02, 2026', 'Online · Zoom', 60, 'spark', '["#8b7dff", "#00e5ff"]'),
('eh-05', 'Hackathon: Build for Bharat', 'tech', 'Mar 22-24, 2026', 'Hyderabad, IN', 220, 'terminal', '["#00e5ff", "#2ee59d"]'),
('eh-06', 'Berlin Design Week Talks', 'cultural', 'May 11, 2026', 'Berlin, DE', 180, 'palette', '["#ff6ec7", "#8b7dff"]'),
('eh-07', 'Padel Open · Mumbai 2026', 'sports', 'Apr 19, 2026', 'Mumbai, IN', 64, 'racket', '["#ffb547", "#ff6ec7"]'),
('eh-08', 'Figma to Framer · Studio Workshop', 'workshop', 'Mar 29, 2026', 'Pune, IN', 40, 'pen', '["#8b7dff", "#ff6ec7"]');

-- Create indexes for better performance
CREATE INDEX idx_category ON events(category);
CREATE INDEX idx_event_id ON registrations(event_id);
CREATE INDEX idx_email ON registrations(email);

-- Display confirmation
SELECT 'Database setup completed successfully!' AS Status;
SELECT COUNT(*) AS 'Total Events' FROM events;
