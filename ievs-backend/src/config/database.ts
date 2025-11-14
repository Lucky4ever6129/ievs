import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export const initializeDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        patient_id VARCHAR(50) PRIMARY KEY,
        patient_name VARCHAR(255) NOT NULL,
        date_of_birth DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
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
    `);

    // Create indexes for better query performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_eligibility_checks_patient_id 
      ON eligibility_checks(patient_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_eligibility_checks_check_date_time 
      ON eligibility_checks(check_date_time DESC);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_patients_patient_id 
      ON patients(patient_id);
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

