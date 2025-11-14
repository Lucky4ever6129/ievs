import { Router, Request, Response } from 'express';
import { EligibilityService } from '../services/eligibilityService';

const router = Router();
const eligibilityService = new EligibilityService();

/**
 * POST /eligibility/check
 * Performs a new eligibility check
 */
router.post('/check', async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      patientName,
      dateOfBirth,
      memberNumber,
      insuranceCompany,
      serviceDate
    } = req.body;

    const result = await eligibilityService.performEligibilityCheck({
      patientId,
      patientName,
      dateOfBirth,
      memberNumber,
      insuranceCompany,
      serviceDate
    });

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error performing eligibility check:', error);
    res.status(400).json({
      error: error.message || 'Failed to perform eligibility check'
    });
  }
});

/**
 * GET /eligibility/history/:patientId
 * Retrieves eligibility history for a patient
 */
router.get('/history/:patientId', async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    const history = await eligibilityService.getEligibilityHistory(patientId);
    res.status(200).json(history);
  } catch (error: any) {
    console.error('Error retrieving eligibility history:', error);
    res.status(500).json({
      error: error.message || 'Failed to retrieve eligibility history'
    });
  }
});

export default router;

