import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { CampaignBuilder } from './pages/dashboard/CampaignBuilder';
import { AdminOverview } from './pages/admin/AdminOverview';
import { ClientManagement } from './pages/admin/ClientManagement';
import { PlanManagement } from './pages/admin/PlanManagement';
import { CheckoutSettings } from './pages/admin/CheckoutSettings';
import { AuditLogs } from './pages/admin/AuditLogs';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cadastro" element={<AuthPage />} />
          <Route path="/campaigns/new" element={<CampaignBuilder />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="checkout" element={<CheckoutSettings />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
