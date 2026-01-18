import React from "react";

// Admin Imports
import MainDashboard from "views/admin/dashboard";
import Settings from "views/admin/Settings";
import Applications from "views/admin/applications";
import Hosts from "views/admin/hosts";
import Services from "views/admin/services";
import Logs from "views/admin/logs";

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdSettings,
  MdLock,
  MdApps,
  MdStorage,
  MdBuild,
  MdListAlt,
} from "react-icons/md";

const routes = [
  // DASHBOARD GROUP
  {
    name: "Dashboard",
    layout: "/admin",
    path: "dashboard",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    group: "dashboard",
  },

  // HOSTS GROUP
  {
    name: "Hosts",
    layout: "/admin",
    path: "hosts",
    icon: <MdStorage className="h-6 w-6" />,
    component: <Hosts />,
    group: "infrastructure",
  },

  // APPLICATIONS GROUP
  {
    name: "Applications",
    layout: "/admin",
    path: "applications",
    icon: <MdApps className="h-6 w-6" />,
    component: <Applications />,
    group: "applications",
  },

  // SERVICES GROUP
  {
    name: "Services",
    layout: "/admin",
    path: "services",
    icon: <MdBuild className="h-6 w-6" />,
    component: <Services />,
    group: "applications",
  },

  // LOGS GROUP
  {
    name: "Logs",
    layout: "/admin",
    path: "logs",
    icon: <MdListAlt className="h-6 w-6" />,
    component: <Logs />,
    group: "observability",
  },

  // SETTINGS GROUP
  {
    name: "Settings",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Settings />,
    group: "user",
  },

  // AUTH (no sidebar)
  {
    name: "Sign In",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];

export default routes;
