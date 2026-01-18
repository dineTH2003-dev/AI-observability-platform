import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Dropdown from "components/dropdown";
import { FiAlignJustify, FiSearch } from "react-icons/fi";
import { BsArrowBarUp } from "react-icons/bs";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { IoMdNotificationsOutline } from "react-icons/io";
import avatar from "assets/img/favicon.png";

const routeNameMap = {
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/hosts": "Hosts",
  "/admin/applications": "Applications",
  "/admin/services": "Services",
  "/admin/settings": "Settings",
};

const getPageName = (pathname) => {
  if (routeNameMap[pathname]) return routeNameMap[pathname];
  const parts = pathname.split("/").filter(Boolean);
  return parts.length ? parts[parts.length - 1] : "Dashboard";
};

const Navbar = ({ onOpenSidenav }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // State
  const [darkmode, setDarkmode] = React.useState(false);
  const searchRef = React.useRef(null);

  const pageName = getPageName(location.pathname);

  /**
   * SIGN OUT HANDLER
   */
  const handleSignOut = () => {
    // Clear auth-related storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // localStorage.clear();

    navigate("/auth/sign-in", { replace: true });
  };

  /**
   * Sync React state with already-applied theme
   */
  React.useEffect(() => {
    const saved = localStorage.getItem("darkmode");
    if (saved === "true") {
      setDarkmode(true);
    }
  }, []);

  /**
   * Apply theme on toggle
   */
  React.useEffect(() => {
    if (darkmode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkmode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkmode", "false");
    }
  }, [darkmode]);

  const toggleDarkMode = () => {
    setDarkmode((prev) => !prev);
  };

  /**
   * Focus search on "/"
   */
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <nav className="sticky top-0 z-40 flex h-[64px] items-center justify-between rounded-xl bg-white/10 px-4 backdrop-blur-xl dark:bg-[#0b14374d]">
      {/* LEFT */}
      <div className="flex items-center gap-3">
        <span
          onClick={onOpenSidenav}
          className="cursor-pointer text-gray-600 dark:text-white"
        >
          <FiAlignJustify className="h-5 w-5" />
        </span>

        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-white/70">
          <span>Pages</span>
          <span>/</span>
          <span className="font-medium capitalize text-navy-700 dark:text-white">
            {pageName}
          </span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="relative mt-[3px] flex h-[50px] w-[355px] flex-grow items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0">
        <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[225px]">
          <p className="pl-3 pr-2 text-xl">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </p>
          <input
            type="text"
            placeholder="Search..."
            className="block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
          />
        </div>

        {/* NOTIFICATIONS */}
        <Dropdown
          button={
            <IoMdNotificationsOutline className="h-4 w-4 cursor-pointer text-gray-600 dark:text-white" />
          }
          classNames="py-2 right-0 origin-top-right w-max"
        >
          <div className="flex w-[360px] flex-col gap-3 rounded-[20px] bg-white p-4 shadow-xl dark:!bg-navy-700 dark:text-white">
            <div className="flex items-center justify-between">
              <p className="font-bold">Notification</p>
              <p className="text-sm font-bold">Mark all read</p>
            </div>
            {[1].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex h-[60px] w-[60px] items-center justify-center rounded-xl bg-brand-500 text-white">
                  <BsArrowBarUp />
                </div>
                <div>
                  <p className="text-sm font-semibold">
                    New Update Available
                  </p>
                  <p className="text-xs opacity-70">
                    Dashboard updated successfully
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Dropdown>

        {/* Dark toggle */}
        <button
          onClick={toggleDarkMode}
          className="text-gray-600 dark:text-white"
          aria-label="Toggle theme"
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4" />
          ) : (
            <RiMoonFill className="h-4 w-4" />
          )}
        </button>

        {/* PROFILE */}
        <Dropdown
          button={
            <img
              className="h-7 w-7 cursor-pointer rounded-full"
              src={avatar}
            />
          }
          classNames="py-2 right-0 origin-top-right"
        >
          <div className="flex w-56 flex-col rounded-[20px] bg-white p-4 shadow-xl dark:!bg-navy-700 dark:text-white">
            <p className="text-sm font-bold">Admin</p>
            <div className="my-3 h-px bg-gray-200 dark:bg-white/20" />
            <a className="text-sm">Profile Settings</a>
            <a
              onClick={handleSignOut}
              className="mt-3 cursor-pointer text-sm font-medium text-red-500"
            >
              Log Out
            </a>
          </div>
        </Dropdown>
      </div>
    </nav>
  );
};

export default Navbar;
