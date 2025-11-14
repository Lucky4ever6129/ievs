import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EligibilityCheckPage from './pages/EligibilityCheckPage';
import EligibilityHistoryPage from './pages/EligibilityHistoryPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<EligibilityCheckPage />} />
          <Route path="/history" element={<EligibilityHistoryPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
