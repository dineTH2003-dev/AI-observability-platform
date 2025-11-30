import { lazy } from 'react';

// project imports
import MinimalLayout from 'layout/MinimalLayout';
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));
const Applications = Loadable(lazy(() => import('views/applications')));
const ApplicationServices = Loadable(lazy(() => import('views/application-services')));
const Hosts = Loadable(lazy(() => import('views/hosts')));
const Logs = Loadable(lazy(() => import('views/logs')));

const LoginPage = Loadable(lazy(() => import('views/auth/authentication/Login')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <MinimalLayout />,
  children: [
    {
      path: 'auth/login',
      element: <LoginPage />
    },
    {
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
