import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { LandingPage } from './pages/LandingPage';
import { AdminLayout } from './components/layout/AdminLayout';
import { UserLayout } from './components/layout/UserLayout';
import { CampaignBuilder } from './pages/dashboard/CampaignBuilder';
import { DashboardHome } from './pages/dashboard/DashboardHome';
import { PlaceholderPage } from './pages/dashboard/PlaceholderPage';
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
            <Route path="leads" element={<PlaceholderPage title="Inbox" tag="inbox" />} />
            <Route path="crm" element={<PlaceholderPage title="Gestão de Leads" tag="crm" />} />
            <Route path="campaigns" element={<PlaceholderPage title="Campanhas" tag="campanhas" />} />
            <Route path="campaigns/new" element={<CampaignBuilder />} />
            <Route path="settings" element={<PlaceholderPage title="Configurações" tag="configurações" />} />
            <Route path="ajuda" element={<PlaceholderPage title="Ajuda" tag="ajuda" />} />
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
