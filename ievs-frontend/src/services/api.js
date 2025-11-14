import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const checkEligibility = async (eligibilityData) => {
  const response = await api.post('/eligibility/check', eligibilityData);
  return response.data;
};

export const getEligibilityHistory = async (patientId) => {
  const response = await api.get(`/eligibility/history/${patientId}`);
  return response.data;
};

export default api;

