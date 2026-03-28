import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { LandingPage } from '@/pages/LandingPage';
import { Dashboard } from '@/pages/Dashboard';
import { Transactions } from '@/pages/Transactions';
import { Goals } from '@/pages/Goals';
import { Insights } from '@/pages/Insights';
import { Billing } from '@/pages/Billing';
import { Settings } from '@/pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
