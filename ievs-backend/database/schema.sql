-- Insurance Eligibility Verification System Database Schema
-- PostgreSQL Database Script

-- Create database (run this separately if needed)
-- CREATE DATABASE ievs_db;

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
    patient_id VARCHAR(50) PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Eligibility checks table
CREATE TABLE IF NOT EXISTS eligibility_checks (
    eligibility_id SERIAL PRIMARY KEY,
    patient_id VARCHAR(50) NOT NULL,
    member_number VARCHAR(100) NOT NULL,
    insurance_company VARCHAR(255) NOT NULL,
    service_date DATE NOT NULL,
    check_date_time TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    deductible DECIMAL(10, 2),
    deductible_met DECIMAL(10, 2),
    copay DECIMAL(10, 2),
    out_of_pocket_max DECIMAL(10, 2),
    out_of_pocket_met DECIMAL(10, 2),
    errors TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE
);

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_eligibility_checks_patient_id 
ON eligibility_checks(patient_id);

CREATE INDEX IF NOT EXISTS idx_eligibility_checks_check_date_time 
ON eligibility_checks(check_date_time DESC);

CREATE INDEX IF NOT EXISTS idx_patients_patient_id 
ON patients(patient_id);

-- Comments for documentation
COMMENT ON TABLE patients IS 'Stores patient demographic information';
COMMENT ON TABLE eligibility_checks IS 'Stores eligibility verification results from insurance carriers';
COMMENT ON COLUMN eligibility_checks.status IS 'Eligibility status: Active, Inactive, or Unknown';
COMMENT ON COLUMN eligibility_checks.errors IS 'Array of error messages if eligibility check failed';

