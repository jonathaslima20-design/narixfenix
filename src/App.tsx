import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { BrainLoader } from './components/ui/BrainLoader';

const AuthPage = lazy(() => import('./pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const AdminLayout = lazy(() => import('./components/layout/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const UserLayout = lazy(() => import('./components/layout/UserLayout').then((m) => ({ default: m.UserLayout })));
const CampaignBuilder = lazy(() => import('./pages/dashboard/CampaignBuilder').then((m) => ({ default: m.CampaignBuilder })));
const CampaignDetailPage = lazy(() => import('./pages/dashboard/CampaignDetailPage').then((m) => ({ default: m.CampaignDetailPage })));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome').then((m) => ({ default: m.DashboardHome })));
const InboxPage = lazy(() => import('./pages/dashboard/InboxPage').then((m) => ({ default: m.InboxPage })));
const LeadsPage = lazy(() => import('./pages/dashboard/LeadsPage').then((m) => ({ default: m.LeadsPage })));
const CampaignsPage = lazy(() => import('./pages/dashboard/CampaignsPage').then((m) => ({ default: m.CampaignsPage })));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('./pages/dashboard/HelpPage').then((m) => ({ default: m.HelpPage })));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then((m) => ({ default: m.AdminOverview })));
const ClientManagement = lazy(() => import('./pages/admin/ClientManagement').then((m) => ({ default: m.ClientManagement })));
const PlanManagement = lazy(() => import('./pages/admin/PlanManagement').then((m) => ({ default: m.PlanManagement })));
const CheckoutSettings = lazy(() => import('./pages/admin/CheckoutSettings').then((m) => ({ default: m.CheckoutSettings })));
const AuditLogs = lazy(() => import('./pages/admin/AuditLogs').then((m) => ({ default: m.AuditLogs })));

function NotFoundRedirect() {
  const { user, profile } = useAuth();
  if (user) {
    if (profile?.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Navigate to="/" replace />;
}

function RouteFallback() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <BrainLoader size="lg" />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: 'easeOut' }}>
      <AuthProvider>
        <Suspense fallback={<RouteFallback />}>
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
              <Route path="campaigns/:id" element={<CampaignDetailPage />} />
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
        </Suspense>
      </AuthProvider>
      </MotionConfig>
    </BrowserRouter>
  );
}
