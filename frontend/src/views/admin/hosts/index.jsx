import { useEffect, useMemo, useState } from "react";
import Card from "components/card";
import HostsTable from "./components/HostsTable";
import RegisterHostModal from "./RegisterHostModal";
import { FiSearch } from "react-icons/fi";

/**
 * Safely parse API responses
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

export default function Hosts() {
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [search, setSearch] = useState("");

  /* =========================
     LOAD HOSTS
  ========================= */
  const loadHosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hosts");
      const data = await safeJson(res);
      setHosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load hosts:", err);
      setHosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHosts();
  }, []);

  /* =========================
     CLIENT-SIDE SEARCH
  ========================= */
  const filteredHosts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hosts;

    return hosts.filter((h) => {
      const name = (h.hostname || "").toLowerCase();
      const ip = (h.ip_address || "").toLowerCase();
      const env = (h.environment || "").toLowerCase();
      const os = (h.os_type || "").toLowerCase();

      return (
        name.includes(q) ||
        ip.includes(q) ||
        env.includes(q) ||
        os.includes(q)
      );
    });
  }, [hosts, search]);

  return (
    <>
      <Card extra="w-full px-6 pb-6">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-navy-700 dark:text-white">
              Hosts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Monitor infrastructure health and connected agents.
            </p>
          </div>

          <button
            onClick={() => setOpenModal(true)}
            className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600"
          >
            + Register Host
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
              placeholder="Search by hostname, IP, environment..."
              className="h-full w-full rounded-full bg-lightPrimary text-sm font-medium
                text-navy-700 outline-none
                placeholder:text-gray-400
                dark:bg-navy-900 dark:text-white dark:placeholder:text-white"
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="mt-6">
          <HostsTable tableData={filteredHosts} loading={loading} />
        </div>
      </Card>

      {/* ================= MODAL ================= */}
      <RegisterHostModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSuccess={loadHosts}
      />
    </>
  );
}
