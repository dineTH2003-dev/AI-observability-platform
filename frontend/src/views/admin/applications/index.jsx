import { useEffect, useMemo, useState } from "react";
import Card from "components/card";
import ApplicationsTable from "./components/ApplicationsTable";
import RegisterApplicationModal from "./RegisterApplicationModal";
import { FiSearch, FiAlertTriangle } from "react-icons/fi";

/**
 * Safely parse API responses
 * (helps detect proxy / HTML responses)
 */
async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `API did not return JSON. First 80 chars: ${text.slice(0, 80)}`
    );
  }
}

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  /* =========================
     TOAST
  ========================= */
  const [toast, setToast] = useState(null);

  /* =========================
     LOAD APPLICATIONS
  ========================= */
  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");

      const data = await safeJson(res);

      // support both [] and { data: [] }
      setApplications(
        Array.isArray(data) ? data : data?.data || []
      );
    } catch {
      setApplications([]);

      setToast({
        type: "error",
        msg: "Failed to load applications",
      });

      // auto dismiss
      setTimeout(() => setToast(null), 4000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  /* =========================
     CLIENT-SIDE SEARCH
  ========================= */
  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return applications;

    return applications.filter((a) => {
      const name = (a.name || "").toLowerCase();
      const desc = (a.description || "").toLowerCase();
      const version = (a.version || "").toLowerCase();
      const server = String(a.server_id ?? "").toLowerCase();

      return (
        name.includes(q) ||
        desc.includes(q) ||
        version.includes(q) ||
        server.includes(q)
      );
    });
  }, [applications, search]);

  return (
    <>
      <Card extra="w-full px-6 pb-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-700 dark:text-white">
              Applications
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Register and manage applications running on your hosts.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            + Register Application
          </button>
        </div>

        {/* ================= SEARCH ================= */}
        <div className="mt-6">
          <div
            className="flex h-[44px] w-full max-w-[680px] items-center
              rounded-full bg-lightPrimary text-navy-700
              dark:bg-navy-900 dark:text-white"
          >
            <span className="pl-4 pr-2">
              <FiSearch className="h-4 w-4 text-gray-400 dark:text-white" />
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, version, server id..."
              className="h-full w-full rounded-full bg-lightPrimary text-sm font-medium
                text-navy-700 outline-none
                placeholder:text-gray-400
                dark:bg-navy-900 dark:text-white dark:placeholder:text-white"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="mt-6">
          <ApplicationsTable
            tableData={filteredApplications}
            loading={loading}
          />
        </div>
      </Card>

      {/* ================= MODAL ================= */}
      <RegisterApplicationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadApplications}
      />

      {/* ================= TOAST ================= */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-[10000]
          flex items-center gap-2 rounded-lg
          bg-red-500 px-4 py-3 text-white shadow-lg"
        >
          <FiAlertTriangle />
          {toast.msg}
        </div>
      )}
    </>
  );
}
