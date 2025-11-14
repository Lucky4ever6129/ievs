import React, { useState } from 'react';
import EligibilityForm from '../components/EligibilityForm';
import EligibilityResult from '../components/EligibilityResult';
import { checkEligibility } from '../services/api';

const EligibilityCheckPage = () => {
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleEligibilityCheck = async (formData) => {
    setLoading(true);
    setError(null);
    setEligibilityResult(null);

    try {
      const result = await checkEligibility(formData);
      setEligibilityResult(result);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to check eligibility. Please try again.');
      console.error('Eligibility check error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Insurance Eligibility Verification
        </h1>
        <p className="text-lg text-gray-600">
          Verify patient insurance coverage before services are rendered
        </p>
      </div>

      {/* Form */}
      <EligibilityForm onSubmit={handleEligibilityCheck} isLoading={loading} />

      {/* Error Alert */}
      {error && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {eligibilityResult && (
        <EligibilityResult result={eligibilityResult} />
      )}
    </div>
  );
};

export default EligibilityCheckPage;

