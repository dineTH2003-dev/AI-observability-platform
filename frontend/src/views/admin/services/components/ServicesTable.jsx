export default function ServicesTable({ tableData, loading }) {
  return (
    <div className="overflow-x-auto border-t border-gray-200 dark:border-navy-700">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 dark:border-navy-700 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
            <th className="py-3">Service Name</th>
            <th>Tech</th>
            <th>Server</th>
            <th>Status</th>
            <th>CPU %</th>
            <th>Memory MB</th>
            <th>Assigned App</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={8}
                className="py-10 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                Loading services...
              </td>
            </tr>
          ) : tableData.length === 0 ? (
            <tr>
              <td
                colSpan={8}
                className="py-10 text-center text-sm text-gray-400 dark:text-gray-500"
              >
                No services discovered yet.
              </td>
            </tr>
          ) : (
            tableData.map((s) => (
              <tr
                key={s.service_id}
                className="border-b border-gray-100 dark:border-navy-700 text-sm hover:bg-gray-50 dark:hover:bg-navy-700"
              >
                <td className="py-3 font-medium text-navy-700 dark:text-white">
                  {s.service_name}
                </td>
                <td className="text-gray-600 dark:text-gray-300">
                  {s.technology}
                </td>
                <td className="text-gray-600 dark:text-gray-300">
                  {s.server_name}
                </td>
                <td className="capitalize text-gray-600 dark:text-gray-300">
                  {s.status}
                </td>
                <td className="text-gray-600 dark:text-gray-300">
                  {s.cpu_percent ?? "—"}
                </td>
                <td className="text-gray-600 dark:text-gray-300">
                  {s.memory_mb ?? "—"}
                </td>
                <td className="text-gray-600 dark:text-gray-300">
                  {s.assigned_app || "—"}
                </td>
                <td className="text-right text-gray-400 dark:text-gray-300">
                  ⋮
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
