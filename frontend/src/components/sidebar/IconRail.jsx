/* eslint-disable */
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "routes";
import logo from "assets/img/favicon.png";
import { useSidebar } from "context/SidebarContext";

const IconRail = ({ activeGroup, setActiveGroup, panelOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarExpanded, setSidebarExpanded } = useSidebar();

  // Last CLICKED group (not hover)
  const lastClickedGroup = useRef(null);

  const groups = Object.values(
    routes.reduce((acc, route) => {
      if (
        route.layout === "/admin" &&
        route.group &&
        route.icon &&
        !acc[route.group]
      ) {
        acc[route.group] = route;
      }
      return acc;
    }, {})
  );

  useEffect(() => {
    const match = routes.find(
      (r) => r.layout === "/admin" && location.pathname.includes(r.path)
    );
    if (match?.group) {
      setActiveGroup(match.group);
      lastClickedGroup.current = match.group;
    }
  }, [location.pathname, setActiveGroup]);

  const handleIconClick = (group) => {
    // Sidebar closed → open with selected group
    if (!sidebarExpanded) {
      setActiveGroup(group);
      setSidebarExpanded(true);
      lastClickedGroup.current = group;
      return;
    }

    // Sidebar open + SAME clicked group → collapse
    if (sidebarExpanded && lastClickedGroup.current === group) {
      setSidebarExpanded(false);
      return;
    }

    // Sidebar open + DIFFERENT group → switch panel
    setActiveGroup(group);
    lastClickedGroup.current = group;
  };

  return (
    <div className="flex w-16 flex-col items-center border-r border-gray-200 bg-white py-4 dark:border-white/10 dark:bg-navy-800">
      {/* LOGO */}
      <div
        className="mb-6 flex cursor-pointer justify-center"
        onClick={() => {
          navigate("/admin/dashboard");
          setSidebarExpanded(false);
          lastClickedGroup.current = null;
        }}
      >
        <img src={logo} alt="Application Logo" className="h-8 w-8" />
      </div>

      {/* ICONS */}
      <div className="flex flex-col items-center space-y-3">
        {groups.map((route) => (
          <div
            key={route.group}
            className="group relative"
            // onMouseEnter={() => setActiveGroup(route.group)} // hover highlight ONLY
            onClick={() => handleIconClick(route.group)}
          >
            <div
              className={`flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl transition-all duration-200
                ${
                  activeGroup === route.group
                    ? "bg-brand-100 text-brand-500 dark:bg-white/10"
                    : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/10"
                }`}
            >
              {route.icon}
            </div>

            {!panelOpen && (
              <span className="pointer-events-none absolute left-14 top-1/2 -translate-y-1/2 rounded-md bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                {route.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconRail;
