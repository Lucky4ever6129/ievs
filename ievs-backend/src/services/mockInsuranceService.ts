export interface EligibilityRequest {
  patientId: string;
  patientName: string;
  dateOfBirth: string;
  memberNumber: string;
  insuranceCompany: string;
  serviceDate: string;
}

export interface CoverageDetails {
  deductible: number;
  deductibleMet: number;
  copay: number;
  outOfPocketMax: number;
  outOfPocketMet: number;
}

export interface EligibilityResponse {
  eligibilityId: string;
  patientId: string;
  checkDateTime: string;
  status: 'Active' | 'Inactive' | 'Unknown';
  coverage: CoverageDetails | null;
  errors: string[];
}

/**
 * Mock Insurance API Service
 * Simulates different insurance company responses based on input data
 */
export class MockInsuranceService {
  /**
   * Simulates an eligibility check with an insurance carrier
   * Returns different responses based on various conditions
   */
  async checkEligibility(request: EligibilityRequest): Promise<EligibilityResponse> {
    // Simulate API delay
    await this.delay(500 + Math.random() * 1000);

    const checkDateTime = new Date().toISOString();
    const eligibilityId = `ELG-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;

    // Error case: Invalid member number format
    if (request.memberNumber.length < 6) {
      return {
        eligibilityId,
        patientId: request.patientId,
        checkDateTime,
        status: 'Unknown',
        coverage: null,
        errors: ['Invalid member number format. Member number must be at least 6 characters.']
      };
    }

    // Error case: Future service date too far in advance
    const serviceDate = new Date(request.serviceDate);
    const today = new Date();
    const daysDiff = Math.floor((serviceDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff > 90) {
      return {
        eligibilityId,
        patientId: request.patientId,
        checkDateTime,
        status: 'Unknown',
        coverage: null,
        errors: ['Service date cannot be more than 90 days in advance.']
      };
    }

    // Error case: Past service date
    if (daysDiff < 0) {
      return {
        eligibilityId,
        patientId: request.patientId,
        checkDateTime,
        status: 'Unknown',
        coverage: null,
        errors: ['Service date cannot be in the past.']
      };
    }

    // Determine eligibility status based on member number patterns
    let status: 'Active' | 'Inactive' | 'Unknown' = 'Active';
    
    // Some member numbers result in inactive status
    if (request.memberNumber.endsWith('999') || request.memberNumber.startsWith('INACT')) {
      status = 'Inactive';
    } else if (request.memberNumber.endsWith('000')) {
      status = 'Unknown';
    }

    // Generate coverage details for active policies
    let coverage: CoverageDetails | null = null;
    
    if (status === 'Active') {
      // Different insurance companies have different coverage structures
      const baseDeductible = request.insuranceCompany.includes('BlueCross') ? 1500 : 2000;
      const baseCopay = request.insuranceCompany.includes('BlueCross') ? 25 : 30;
      const baseOOPMax = request.insuranceCompany.includes('BlueCross') ? 5000 : 6000;

      coverage = {
        deductible: baseDeductible,
        deductibleMet: Math.floor(Math.random() * baseDeductible * 0.6),
        copay: baseCopay,
        outOfPocketMax: baseOOPMax,
        outOfPocketMet: Math.floor(Math.random() * baseOOPMax * 0.3)
      };
    }

    return {
      eligibilityId,
      patientId: request.patientId,
      checkDateTime,
      status,
      coverage,
      errors: []
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

