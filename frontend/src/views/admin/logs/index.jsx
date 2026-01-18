import { useEffect, useMemo, useState } from "react";
import Card from "components/card";
import LogsTable from "./components/LogsTable";
import { FiSearch } from "react-icons/fi";
import Checkbox from "components/checkbox";

/* =========================
   MOCK LOG DATA
========================= */
const MOCK_LOGS = [
  {
    id: 1,
    timestamp: "2026-01-16 21:12:43",
    level: "ERROR",
    service: "snmp-agent",
    host: "server-01",
    message: "SNMP trap (SNMPv2-MIB::coldStart) reported from 10.69.0.19",
  },
  {
    id: 2,
    timestamp: "2026-01-16 21:12:41",
    level: "WARN",
    service: "snmp-agent",
    host: "server-02",
    message: "SNMP trap (CISCO-SMI::ciscoMgmt) reported from 10.69.0.3",
  },
  {
    id: 3,
    timestamp: "2026-01-16 21:12:39",
    level: "INFO",
    service: "kube-controller",
    host: "master-01",
    message: "ClusterRoleBinding system:controller:token-cleaner updated",
  },
];

/* =========================
   LOGS PAGE
========================= */
export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [advanced, setAdvanced] = useState(true);

  /* =========================
     LOAD LOGS (MOCK)
  ========================= */
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLogs(MOCK_LOGS);
      setLoading(false);
    }, 600);
  }, []);

  /* =========================
     SEARCH FILTER
  ========================= */
  const filteredLogs = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return logs;

    return logs.filter((l) =>
      [l.message, l.service, l.host, l.level]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [logs, search]);

  return (
    <Card extra="w-full px-6 pb-6">
      {/* ================= HEADER ================= */}
      <div className="pt-4">
        <h1 className="text-xl font-bold text-navy-700 dark:text-white">
          Logs and events
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Explore your log data and Kubernetes events. Switch to advanced mode
          for deeper analysis.
        </p>
      </div>

      {/* ================= ADVANCED MODE ================= */}
      <div className="mt-4 flex items-center">
        <Checkbox
          defaultChecked={advanced}
          colorScheme="brandScheme"
          me="10px"
          onChange={() => setAdvanced(!advanced)}
        />
        <p className="ml-3 text-sm font-bold text-navy-700 dark:text-white">
          Advanced mode
        </p>
      </div>

      {/* ================= SEARCH BAR ================= */}
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
            placeholder="Search by message, service, host, level..."
            className="h-full w-full rounded-full bg-lightPrimary
              text-sm font-medium text-navy-700 outline-none
              placeholder:text-gray-400
              dark:bg-navy-900 dark:text-white
              dark:placeholder:text-white"
          />
        </div>
      </div>

      {/* ================= META INFO ================= */}
      <div className="mt-4 flex items-center gap-6 text-xs text-gray-500">
        <span>Execution time: 1s</span>
        <span>Scanned data: 6.44 GB</span>
      </div>

      {/* ================= ACTION BAR ================= */}
      <div
        className="mt-4 flex flex-wrap items-center gap-2
                   border-t border-gray-200 pt-3
                   dark:border-navy-700"
      >
        {[
          "Open with...",
          "Create processing rule",
          "Create metric",
          "Format table",
          "Actions",
        ].map((label) => (
          <button
            key={label}
            className="rounded-md border border-gray-200 bg-white
                       px-3 py-1.5 text-xs font-medium
                       text-navy-700 hover:bg-gray-50
                       dark:border-navy-700 dark:bg-navy-800
                       dark:text-white"
          >
            {label}
          </button>
        ))}
      </div>

      {/* ================= TABLE ================= */}
      <div className="mt-4">
        <LogsTable tableData={filteredLogs} loading={loading} />
      </div>
    </Card>
  );
}
