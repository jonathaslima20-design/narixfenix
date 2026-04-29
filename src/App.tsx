import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { CampaignBuilder } from './pages/dashboard/CampaignBuilder';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { InboxPage } from './pages/dashboard/InboxPage';
import { LeadsPage } from './pages/dashboard/LeadsPage';
import { CampaignsPage } from './pages/dashboard/CampaignsPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { HelpPage } from './pages/dashboard/HelpPage';
import { AdminOverview } from './pages/admin/AdminOverview';
import { ClientManagement } from './pages/admin/ClientManagement';
import { PlanManagement } from './pages/admin/PlanManagement';
import { CheckoutSettings } from './pages/admin/CheckoutSettings';
import { AuditLogs } from './pages/admin/AuditLogs';

function NotFoundRedirect() {
  const { user, profile } = useAuth();
  if (user) {
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/cadastro" element={<AuthPage />} />

          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="leads" element={<InboxPage />} />
            <Route path="crm" element={<LeadsPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/new" element={<CampaignBuilder />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="ajuda" element={<HelpPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="plans" element={<PlanManagement />} />
            <Route path="clients" element={<ClientManagement />} />
            <Route path="checkout" element={<CheckoutSettings />} />
            <Route path="audit" element={<AuditLogs />} />
          </Route>

          <Route path="*" element={<NotFoundRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
