/* eslint-disable */
import { useState } from "react";
import Links from "./components/Links";
import routes from "routes";
import { getFavorites } from "./FavoritesStore";

const SidePanel = ({ activeGroup }) => {
  const group = activeGroup || "dashboard";

  // Favorites (unchanged)
  const [favorites] = useState(getFavorites());

  // Filter routes by group
  const groupRoutes = routes.filter(
    (r) => r.layout === "/admin" && r.group === group
  );

  if (!groupRoutes.length) return null;

  return (
    <div className="h-full flex-1 overflow-y-auto border-l border-gray-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-navy-800">
      {/* GROUP TITLE */}
      <p className="mb-3 text-[14px] font-semibold uppercase tracking-wider text-gray-400">
        {group}
      </p>

      {/* ROUTES */}
      <ul className="flex flex-col gap-1">
        <Links routes={groupRoutes} />
      </ul>

      {/* FAVORITES */}
      {favorites.length > 0 && (
        <div className="mt-6">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
            Favorites
          </p>

          <div className="flex flex-col gap-1">
            {favorites.map((path) => (
              <div
                key={path}
                className="duration-120 flex h-9 items-center rounded-md px-3 text-sm text-brand-500 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
              >
                {path}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidePanel;
