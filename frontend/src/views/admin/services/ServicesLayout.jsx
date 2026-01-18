import Checkbox from "components/checkbox";
import { FiFilter } from "react-icons/fi";

export default function ServicesLayout({
  children,
  serviceCount,
  statusFilters,
  onStatusChange,
}) {
  return (
    <div className="w-full bg-white dark:bg-navy-800">
      {/* ===== HEADER ===== */}
      <div className="border-b border-gray-200 dark:border-navy-700 px-6 py-4">
        <h1 className="text-lg font-semibold text-navy-700 dark:text-white">
          Services
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          See all services that were active within the selected timeframe and
          match the filter settings
        </p>
      </div>

      {/* ===== FILTERED BY BAR ===== */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-navy-700 px-6 py-2 text-sm text-gray-500 dark:text-gray-400">
        <FiFilter />
        Filtered by
      </div>

      {/* ===== BODY ===== */}
      <div className="flex min-h-[420px]">
        {/* ===== LEFT SIDEBAR ===== */}
        <aside className="w-[220px] border-r border-gray-200 dark:border-navy-700 px-6 py-4">
          <h3 className="mb-3 text-sm font-semibold text-navy-700 dark:text-white">
            Status
          </h3>

          <div className="space-y-2">
            {["healthy", "warning", "critical"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
              >
                <Checkbox
                  checked={statusFilters[status]}
                  onChange={() =>
                    onStatusChange({
                      ...statusFilters,
                      [status]: !statusFilters[status],
                    })
                  }
                  colorScheme="brandScheme"
                />
                <span className="capitalize">{status}</span>
              </label>
            ))}
          </div>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <main className="flex-1 px-6 py-4">
          <div className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
            {serviceCount} Services
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
