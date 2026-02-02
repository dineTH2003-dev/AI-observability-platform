/* eslint-disable */
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import IconRail from './IconRail';
import SidePanel from './SidePanel';
import { useSidebar } from 'context/SidebarContext';
import routes from 'routes';

const Sidebar = () => {
  const { sidebarExpanded } = useSidebar();
  const location = useLocation();

  const initialGroup = routes.find((r) => r.layout === '/admin' && location.pathname.includes(r.path))?.group || 'dashboard';

  const [activeGroup, setActiveGroup] = useState(initialGroup);

  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (sidebarExpanded) {
      const t = setTimeout(() => setShowPanel(true), 180);
      return () => clearTimeout(t);
    } else {
      setShowPanel(false);
    }
  }, [sidebarExpanded]);

  return (
    <aside
      className={`
    fixed left-0 top-0 z-50
    flex
    h-screen
    border-r border-gray-200
    bg-white transition-[width] duration-300
    ease-[cubic-bezier(.4,0,.2,1)] dark:border-white/10
    dark:bg-navy-800
    ${sidebarExpanded ? 'w-[320px]' : 'w-[64px]'}
  `}
    >
      {/* ICON RAIL (64px) */}
      <IconRail panelOpen={sidebarExpanded} activeGroup={activeGroup} setActiveGroup={setActiveGroup} />

      {/* SIDE PANEL (flex-1 = 256px) */}
      {showPanel && <SidePanel activeGroup={activeGroup} />}
    </aside>
  );
};

export default Sidebar;
