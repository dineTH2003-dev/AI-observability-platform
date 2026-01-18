import React, { useMemo, useState } from "react";
import CardMenu from "components/card/CardMenu";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const columnHelper = createColumnHelper();

/* =========================
   STATUS PILL
========================= */
function StatusPill({ status }) {
  const s = (status || "unknown").toLowerCase();

  const cls =
    s === "healthy" || s === "active"
      ? "border-green-300 bg-green-50 text-green-700"
      : s === "warning"
      ? "border-amber-300 bg-amber-50 text-amber-700"
      : s === "critical" || s === "error"
      ? "border-red-300 bg-red-50 text-red-700"
      : "border-gray-300 bg-gray-50 text-gray-700";

  const label =
    s === "active" ? "Healthy" : status || "Unknown";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

/* =========================
   APPLICATIONS TABLE
========================= */
export default function ApplicationsTable({
  tableData = [],
  loading = false,
}) {
  const [sorting, setSorting] = useState([]);

  /* =========================
     COLUMNS
  ========================= */
  const columns = useMemo(
    () => [
      /* APPLICATION NAME */
      columnHelper.accessor("name", {
        header: "APPLICATION",
        cell: (info) => (
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue() || "—"}
          </p>
        ),
      }),

      /* DESCRIPTION */
      columnHelper.accessor("description", {
        header: "DESCRIPTION",
        cell: (info) => (
          <p className="max-w-[420px] truncate text-sm text-gray-600 dark:text-gray-300">
            {info.getValue() || "—"}
          </p>
        ),
      }),

      /* VERSION */
      columnHelper.accessor("version", {
        header: "VERSION",
        cell: (info) => (
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {info.getValue() || "—"}
          </p>
        ),
      }),

      /* SERVER */
      columnHelper.accessor("server_id", {
        header: "SERVER",
        cell: (info) => (
          <p className="text-sm font-medium text-navy-700 dark:text-white">
            {info.getValue() ?? "—"}
          </p>
        ),
      }),

      /* STATUS */
      columnHelper.accessor("status", {
        header: "STATUS",
        cell: (info) => <StatusPill status={info.getValue()} />,
      }),

      /* CREATED */
      columnHelper.accessor("created_at", {
        header: "CREATED",
        cell: (info) => {
          const v = info.getValue();
          const d = v ? new Date(v) : null;
          return (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {d && !Number.isNaN(d.getTime())
                ? d.toLocaleString()
                : "—"}
            </p>
          );
        },
      }),

      /* UPDATED */
      columnHelper.accessor("updated_at", {
        header: "UPDATED",
        cell: (info) => {
          const v = info.getValue();
          const d = v ? new Date(v) : null;
          return (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {d && !Number.isNaN(d.getTime())
                ? d.toLocaleString()
                : "—"}
            </p>
          );
        },
      }),

      // /* ACTIONS */
      // columnHelper.display({
      //   id: "actions",
      //   header: "",
      //   cell: ({ row }) => (
      //     <div className="flex justify-end">
      //       <CardMenu app={row.original} />
      //     </div>
      //   ),
      // }),
    ],
    []
  );

  /* =========================
     TABLE INSTANCE
  ========================= */
  const table = useReactTable({
    data: Array.isArray(tableData) ? tableData : [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr
              key={headerGroup.id}
              className="border-b border-gray-200 dark:border-white/10"
            >
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="cursor-pointer py-3 pr-4 text-left text-sm font-bold text-gray-600 dark:text-white"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-sm text-gray-500"
              >
                Loading applications…
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-10 text-center text-sm text-gray-500"
              >
                No applications found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 last:border-none dark:border-white/5"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className="py-4 pr-4 align-middle"
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
