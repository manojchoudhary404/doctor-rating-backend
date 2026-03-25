-- ============================================================
-- Doctor Rating System - Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS doctor_rating_db;
USE doctor_rating_db;

-- ============================================================
-- Table: doctor_reviews
-- ============================================================
CREATE TABLE IF NOT EXISTS doctor_reviews (
    review_id    INT            NOT NULL AUTO_INCREMENT,
    doctor_id    INT            NOT NULL,
    patient_id   INT            NOT NULL,
    patient_name VARCHAR(255)   NOT NULL,
    rating       INT            NOT NULL,
    review_text  VARCHAR(1000)  NULL,
    review_date  DATE           DEFAULT (CURRENT_DATE),
    status       ENUM('Visible', 'Hidden', 'Reported') DEFAULT 'Visible',
    created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME       DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (review_id),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 5)
);

-- ============================================================
-- Table: doctors  (seed / reference data)
-- ============================================================
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id    INT            NOT NULL AUTO_INCREMENT,
    name         VARCHAR(255)   NOT NULL,
    specialty    VARCHAR(255)   NOT NULL,
    hospital     VARCHAR(255)   NOT NULL,
    experience   INT            NOT NULL COMMENT 'Years of experience',
    image_url    VARCHAR(500)   NULL,
    created_at   DATETIME       DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (doctor_id)
);

-- ============================================================
-- Seed: sample doctors
-- ============================================================
INSERT INTO doctors (name, specialty, hospital, experience, image_url) VALUES
('Dr. Ananya Sharma',    'Cardiologist',      'Apollo Hospitals, Mumbai',       15, NULL),
('Dr. Rohan Mehta',      'Neurologist',       'Fortis Healthcare, Delhi',       12, NULL),
('Dr. Priya Desai',      'Orthopedic Surgeon','Manipal Hospital, Bangalore',    10, NULL),
('Dr. Karan Patel',      'Dermatologist',     'Max Super Specialty, Pune',       8, NULL),
('Dr. Sunita Rao',       'Pediatrician',      'Narayana Health, Hyderabad',     14, NULL),
('Dr. Vikram Nair',      'Gastroenterologist','AIIMS, New Delhi',               18, NULL);

-- ============================================================
-- Seed: sample reviews
-- ============================================================
INSERT INTO doctor_reviews (doctor_id, patient_id, patient_name, rating, review_text, review_date, status) VALUES
(1, 101, 'Amit Verma',     5, 'Excellent doctor. Very thorough and caring.',        '2024-11-10', 'Visible'),
(1, 102, 'Neha Singh',     4, 'Very knowledgeable. Explained everything clearly.',  '2024-11-15', 'Visible'),
(1, 103, 'Suresh Kumar',   3, 'Good doctor but waiting time was long.',             '2024-12-01', 'Visible'),
(2, 104, 'Pooja Sharma',   5, 'Amazing neurologist. Highly recommend!',             '2024-12-05', 'Visible'),
(2, 105, 'Rahul Gupta',    4, 'Very professional and empathetic.',                  '2024-12-10', 'Visible'),
(3, 106, 'Meera Joshi',    5, 'Best orthopedic surgeon I have visited.',            '2024-12-12', 'Visible'),
(4, 107, 'Arjun Kapoor',   4, 'Very helpful. Solved my skin issue quickly.',        '2024-12-14', 'Visible'),
(5, 108, 'Kavita Reddy',   5, 'So gentle with my child. Highly recommend.',         '2024-12-18', 'Visible'),
(6, 109, 'Deepak Tiwari',  3, 'Decent consultation but rushed.',                   '2024-12-20', 'Visible');
