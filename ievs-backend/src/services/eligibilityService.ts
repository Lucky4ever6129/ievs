import { pool } from '../config/database';
import { MockInsuranceService, EligibilityRequest, EligibilityResponse } from './mockInsuranceService';

export class EligibilityService {
  private mockInsuranceService: MockInsuranceService;

  constructor() {
    this.mockInsuranceService = new MockInsuranceService();
  }

  /**
   * Performs an eligibility check and stores the result
   */
  async performEligibilityCheck(request: EligibilityRequest): Promise<EligibilityResponse> {
    // Validate input
    this.validateRequest(request);

    // Check with mock insurance API
    const eligibilityResult = await this.mockInsuranceService.checkEligibility(request);

    // Store patient information if not exists
    await this.upsertPatient({
      patientId: request.patientId,
      patientName: request.patientName,
      dateOfBirth: request.dateOfBirth
    });

    // Store eligibility check result
    await this.storeEligibilityCheck(request, eligibilityResult);

    return eligibilityResult;
  }

  /**
   * Retrieves eligibility history for a patient
   */
  async getEligibilityHistory(patientId: string): Promise<EligibilityResponse[]> {
    const result = await pool.query(
      `SELECT 
        ec.eligibility_id,
        ec.patient_id,
        ec.member_number,
        ec.insurance_company,
        ec.service_date,
        ec.check_date_time,
        ec.status,
        ec.deductible,
        ec.deductible_met,
        ec.copay,
        ec.out_of_pocket_max,
        ec.out_of_pocket_met,
        ec.errors
      FROM eligibility_checks ec
      WHERE ec.patient_id = $1
      ORDER BY ec.check_date_time DESC`,
      [patientId]
    );

    return result.rows.map(row => ({
      eligibilityId: `ELG-${row.eligibility_id}`,
      patientId: row.patient_id,
      checkDateTime: row.check_date_time.toISOString(),
      status: row.status as 'Active' | 'Inactive' | 'Unknown',
      insuranceCompany: row.insurance_company,
      memberNumber: row.member_number,
      serviceDate: row.service_date ? new Date(row.service_date).toISOString().split('T')[0] : null,
      coverage: row.status === 'Active' ? {
        deductible: parseFloat(row.deductible),
        deductibleMet: parseFloat(row.deductible_met),
        copay: parseFloat(row.copay),
        outOfPocketMax: parseFloat(row.out_of_pocket_max),
        outOfPocketMet: parseFloat(row.out_of_pocket_met)
      } : null,
      errors: row.errors || []
    }));
  }

  private validateRequest(request: EligibilityRequest): void {
    if (!request.patientId || !request.patientName || !request.dateOfBirth || 
        !request.memberNumber || !request.insuranceCompany || !request.serviceDate) {
      throw new Error('All fields are required');
    }

    // Validate date format
    const dob = new Date(request.dateOfBirth);
    const serviceDate = new Date(request.serviceDate);
    
    if (isNaN(dob.getTime())) {
      throw new Error('Invalid date of birth format');
    }
    
    if (isNaN(serviceDate.getTime())) {
      throw new Error('Invalid service date format');
    }
  }

  private async upsertPatient(patient: { patientId: string; patientName: string; dateOfBirth: string }): Promise<void> {
    await pool.query(
      `INSERT INTO patients (patient_id, patient_name, date_of_birth)
       VALUES ($1, $2, $3)
       ON CONFLICT (patient_id) 
       DO UPDATE SET 
         patient_name = EXCLUDED.patient_name,
         date_of_birth = EXCLUDED.date_of_birth,
         updated_at = CURRENT_TIMESTAMP`,
      [patient.patientId, patient.patientName, patient.dateOfBirth]
    );
  }

  private async storeEligibilityCheck(
    request: EligibilityRequest,
    result: EligibilityResponse
  ): Promise<void> {
    await pool.query(
      `INSERT INTO eligibility_checks (
        patient_id, member_number, insurance_company, service_date,
        check_date_time, status, deductible, deductible_met, copay,
        out_of_pocket_max, out_of_pocket_met, errors
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        request.patientId,
        request.memberNumber,
        request.insuranceCompany,
        request.serviceDate,
        result.checkDateTime,
        result.status,
        result.coverage?.deductible || null,
        result.coverage?.deductibleMet || null,
        result.coverage?.copay || null,
        result.coverage?.outOfPocketMax || null,
        result.coverage?.outOfPocketMet || null,
        result.errors
      ]
    );
  }
}

