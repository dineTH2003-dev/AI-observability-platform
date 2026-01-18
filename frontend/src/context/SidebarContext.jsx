import { createContext, useContext, useEffect, useState } from "react";

const SidebarContext = createContext(null);

export function SidebarProvider({ children }) {
  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const initialized = localStorage.getItem("sidebarInitialized");

    if (!initialized) {
      localStorage.setItem("sidebarInitialized", "true");
      localStorage.setItem("sidebarExpanded", "false");
      return false; // first visit → collapsed
    }

    return localStorage.getItem("sidebarExpanded") === "true";
  });

  useEffect(() => {
    localStorage.setItem("sidebarExpanded", sidebarExpanded);
  }, [sidebarExpanded]);

  const toggleSidebar = () => {
    setSidebarExpanded((p) => !p);
  };

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "b") {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <SidebarContext.Provider
      value={{ sidebarExpanded, setSidebarExpanded, toggleSidebar }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) {
    throw new Error("useSidebar must be used inside SidebarProvider");
  }
  return ctx;
};
