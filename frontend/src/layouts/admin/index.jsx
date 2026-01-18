import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "routes";
import { useSidebar } from "context/SidebarContext";

export default function Admin() {
  const location = useLocation();
  const { sidebarExpanded, toggleSidebar } = useSidebar();

  const getRoutes = (routes) =>
    routes.map((r, k) =>
      r.layout === "/admin" ? (
        <Route path={`/${r.path}`} element={r.component} key={k} />
      ) : null
    );

  return (
    <div className="flex min-h-screen bg-lightPrimary dark:bg-navy-900">
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div
        className={`
          flex flex-1 flex-col
          transition-[padding-left] duration-300 ease-in-out
          ${sidebarExpanded ? "pl-[320px]" : "pl-[64px]"}
        `}
      >
        {/* NAVBAR */}
        <Navbar onOpenSidenav={toggleSidebar} brandText="Dashboard" />

        {/* CONTENT */}
        <main className="flex-1 p-4">
          <Routes>
            {getRoutes(routes)}
            <Route path="/" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}
