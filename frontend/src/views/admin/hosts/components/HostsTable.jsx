import React, { useMemo, useState } from 'react';
import { createColumnHelper, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import StatusPill from "./StatusPill";

const columnHelper = createColumnHelper();

/* =========================
HEALTH
========================= */
function HealthPill({ status }) {
  const s = (status || 'Unknown').toLowerCase();
  const cls =
    s === 'healthy'
      ? 'border-green-300 bg-green-50 text-green-700'
      : s === 'warning'
      ? 'border-amber-300 bg-amber-50 text-amber-700'
      : s === 'critical'
      ? 'border-red-300 bg-red-50 text-red-700'
      : 'border-gray-300 bg-gray-50 text-gray-700';

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>{status || 'Unknown'}</span>;
}

export default function HostsTable({ tableData = [], loading = false }) {
  const [sorting, setSorting] = useState([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('hostname', {
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">HOST</p>,
        cell: (i) => <p className="text-sm font-bold text-navy-700 dark:text-white">{i.getValue() || '—'}</p>
      }),

      columnHelper.accessor('ip_address', {
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">IP</p>,
        cell: (i) => <p className="text-sm">{i.getValue() || '—'}</p>
      }),

      columnHelper.accessor('environment', {
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">ENV</p>,
        cell: (i) => <p className="text-sm">{i.getValue() || '—'}</p>
      }),

      columnHelper.accessor('health', {
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">HEALTH</p>,
        cell: (info) => <StatusPill status={info.getValue()} />
      }),

      columnHelper.accessor('agent_status', {
        header: () => <p className="text-sm font-bold text-gray-600 dark:text-white">AGENT</p>,
        cell: (info) => <StatusPill status={info.getValue()} />
      })

      // columnHelper.display({
      //   id: "actions",
      //   header: () => <span className="sr-only">Actions</span>,
      //   cell: () => (
      //     <div className="flex justify-end">
      //       <CardMenu />
      //     </div>
      //   ),
      // }),
    ],
    []
  );

  const table = useReactTable({
    data: Array.isArray(tableData) ? tableData : [],
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  });

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px]">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-gray-200 dark:border-white/10">
              {hg.headers.map((h) => (
                <th key={h.id} onClick={h.column.getToggleSortingHandler()} className="cursor-pointer py-3 pr-4 text-left">
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-gray-500">
                Loading hosts…
              </td>
            </tr>
          ) : table.getRowModel().rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-gray-500">
                No hosts found.
              </td>
            </tr>
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b border-gray-100 dark:border-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-4 pr-4 align-middle">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
