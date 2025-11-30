import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

// layouts
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// views
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Applications = Loadable(lazy(() => import('views/applications')));
const ApplicationServices = Loadable(lazy(() => import('views/application-services')));
const Hosts = Loadable(lazy(() => import('views/hosts')));
const Logs = Loadable(lazy(() => import('views/logs')));
const LoginPage = Loadable(lazy(() => import('views/auth/authentication/Login')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  children: [
    // Redirect root → /auth/login
    {
      path: '',
      element: <Navigate to="/auth/login" replace />
    },

    // Login page with MinimalLayout
    {
      path: '/',
      element: <MinimalLayout />,
      children: [
        {
          path: 'auth/login',
          element: <LoginPage />
        }
      ]
    },

    // Authenticated pages with MainLayout
    {
      path: '/',
      element: <MainLayout />,
      children: [
        {
          path: 'dashboard',
          element: <DashboardDefault />
        },
        {
          path: 'applications',
          element: <Applications />
        },
        {
          path: 'hosts',
          element: <Hosts />
        },
        {
          path: 'application-services',
          element: <ApplicationServices />
        },
        {
          path: 'logs',
          element: <Logs />
        }
      ]
    }
  ]
};

export default MainRoutes;
