import React, { useState } from 'react';
import EligibilityHistory from '../components/EligibilityHistory';

const EligibilityHistoryPage = () => {
  const [patientId, setPatientId] = useState('');
  const [searchPatientId, setSearchPatientId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchPatientId(patientId);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          Eligibility History
        </h1>
        <p className="text-lg text-gray-600">
          View past eligibility verification records for any patient
        </p>
      </div>

      {/* Search Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                Patient ID
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="patientId"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  placeholder="Enter Patient ID (e.g., P123456)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Search History
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* History Results */}
      {searchPatientId && (
        <EligibilityHistory patientId={searchPatientId} />
      )}

      {!searchPatientId && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="mb-4">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Patient Selected</h3>
            <p className="text-gray-600">Enter a Patient ID above to view their eligibility history</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EligibilityHistoryPage;

