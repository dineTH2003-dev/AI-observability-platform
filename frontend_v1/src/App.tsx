import { useState } from 'react';
import { Layout } from './components/Layout';
import { LoginPage } from './views/auth/Login/LoginPage';
import { SignupPage } from './views/auth/Signup/SignupPage';
import { DashboardPage } from './views/Dashboard/DashboardPage';
import { HostsPage } from './views/Hosts/HostsPage';
import { ApplicationsPage } from './views/Applications/ApplicationsPage';
import { ServicesPage } from './views/Services/ServicesPage';
import { LogsPage } from './views/Logs/LogsPage';
import { MetricsPage } from './views/Metrics/MetricsPage';
import { AnomaliesPage } from './views/Anomalies/AnomaliesPage';
import { IncidentsPage } from './views/Incidents/IncidentsPage';
import { SettingsPage } from './views/Settings/SettingsPage';
import { AlertSettingsPage } from './views/AlertSettings/AlertSettingsPage';
import { ReportsPage } from './views/Reports/ReportsPage';
import { TicketsPage } from './views/Tickets/TicketsPage';
import { ProfilePage } from './views/Profile/ProfilePage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | undefined>();

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleSignup = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string, anomalyId?: string) => {
    setCurrentPage(page);
    if (anomalyId) {
      setSelectedAnomalyId(anomalyId);
    }
  };

  // Authentication Views
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} />;
    }
    return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} />;
  }

  // Main Application
  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate} onLogout={handleLogout}>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
      {currentPage === 'hosts' && <HostsPage />}
      {currentPage === 'applications' && <ApplicationsPage />}
      {currentPage === 'services' && <ServicesPage />}
      {currentPage === 'logs' && <LogsPage />}
      {currentPage === 'metrics' && <MetricsPage />}
      {currentPage === 'incidents' && <IncidentsPage />}
      {currentPage === 'anomalies' && <AnomaliesPage selectedAnomalyId={selectedAnomalyId} />}
      {currentPage === 'tickets' && <TicketsPage />}
      {currentPage === 'settings' && <SettingsPage />}
      {currentPage === 'alert-settings' && <AlertSettingsPage />}
      {currentPage === 'reports' && <ReportsPage />}
      {currentPage === 'profile' && <ProfilePage />}
    </Layout>
  );
}