import React from 'react';

const EligibilityResult = ({ result }) => {
  if (!result) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Active':
        return {
          bg: 'bg-green-50',
          border: 'border-green-500',
          text: 'text-green-800',
          badge: 'bg-green-100 text-green-800',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'Inactive':
        return {
          bg: 'bg-red-50',
          border: 'border-red-500',
          text: 'text-red-800',
          badge: 'bg-red-100 text-red-800',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'Unknown':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-500',
          text: 'text-yellow-800',
          badge: 'bg-yellow-100 text-yellow-800',
          icon: (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-500',
          text: 'text-gray-800',
          badge: 'bg-gray-100 text-gray-800',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig(result.status);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className={`${statusConfig.bg} border-l-4 ${statusConfig.border} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {statusConfig.icon}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Eligibility Check Result</h2>
                <p className="text-sm text-gray-600">
                  Checked on {new Date(result.checkDateTime).toLocaleString()}
                </p>
              </div>
            </div>
            <span className={`${statusConfig.badge} px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide flex items-center gap-2`}>
              {result.status}
            </span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6 border-b border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Eligibility ID</p>
              <p className="text-lg font-bold text-gray-900">{result.eligibilityId}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Patient ID</p>
              <p className="text-lg font-bold text-gray-900">{result.patientId}</p>
            </div>
          </div>

          {/* Errors */}
          {result.errors && result.errors.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-5">
              <div className="flex items-start">
                <svg className="h-6 w-6 text-red-400 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-red-800 mb-2">Errors</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {result.errors.map((error, index) => (
                      <li key={index} className="text-red-700">{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Coverage Details */}
          {result.coverage && result.status === 'Active' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Coverage Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Deductible</p>
                  <p className="text-2xl font-bold text-gray-900">${result.coverage.deductible.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Deductible Met</p>
                  <p className="text-2xl font-bold text-gray-900">${result.coverage.deductibleMet.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Remaining Deductible</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${(result.coverage.deductible - result.coverage.deductibleMet).toFixed(2)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-5 border border-yellow-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Copay</p>
                  <p className="text-2xl font-bold text-gray-900">${result.coverage.copay.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-5 border border-indigo-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Out-of-Pocket Max</p>
                  <p className="text-2xl font-bold text-gray-900">${result.coverage.outOfPocketMax.toFixed(2)}</p>
                </div>
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-5 border border-teal-100">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Out-of-Pocket Met</p>
                  <p className="text-2xl font-bold text-gray-900">${result.coverage.outOfPocketMet.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EligibilityResult;
