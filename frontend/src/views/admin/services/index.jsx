import { useEffect, useMemo, useState } from "react";
import ServicesLayout from "./ServicesLayout";
import ServicesTable from "./components/ServicesTable";
import { FiSearch } from "react-icons/fi";

/* SAFE JSON */
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid JSON response");
  }
}

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  /* Status unchecked by default */
  const [statusFilters, setStatusFilters] = useState({
    healthy: false,
    warning: false,
    critical: false,
  });

  /* LOAD SERVICES */
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/services");
        const data = await safeJson(res);
        setServices(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  /* FILTER LOGIC */
  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();
    const anyStatusChecked = Object.values(statusFilters).some(Boolean);

    return services.filter((s) => {
      if (anyStatusChecked && !statusFilters[s.status]) return false;

      if (!q) return true;

      return (
        s.service_name?.toLowerCase().includes(q) ||
        s.server_name?.toLowerCase().includes(q) ||
        s.assigned_app?.toLowerCase().includes(q)
      );
    });
  }, [services, search, statusFilters]);

  return (
    <ServicesLayout
      serviceCount={filteredServices.length}
      statusFilters={statusFilters}
      onStatusChange={setStatusFilters}
    >
      {/* ===== SEARCH BAR ===== */}

      <div className="mt-4">
        <div
          className="flex h-[38px] w-full max-w-[520px] items-center
              rounded-full bg-lightPrimary text-navy-700
              dark:bg-navy-900 dark:text-white"
        >
          <span className="pl-4 pr-2">
            <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
          </span>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search service name, server, assigned app..."
            className="h-full w-full rounded-full bg-lightPrimary text-sm font-medium
                text-navy-700 outline-none
                placeholder:text-gray-400
                dark:bg-navy-900 dark:text-white dark:placeholder:text-white"
          />
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="mt-6">
        <ServicesTable tableData={filteredServices} loading={loading} />
      </div>
    </ServicesLayout>
  );
}
