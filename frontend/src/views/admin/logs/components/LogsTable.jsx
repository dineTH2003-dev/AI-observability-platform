import React, { useState } from "react";
import {
  MdCancel,
  MdOutlineError,
  MdCheckCircle,
  MdClose,
} from "react-icons/md";

/* -------------------- Severity styles -------------------- */
const levelBadge = {
  ERROR: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  WARN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  INFO: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  DEBUG: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
};

const levelIcon = {
  ERROR: <MdCancel className="mr-1" />,
  WARN: <MdOutlineError className="mr-1" />,
  INFO: <MdCheckCircle className="mr-1" />,
  DEBUG: null,
};

/* -------------------- ANSI stripping -------------------- */
const stripAnsi = (text = "") =>
  text.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/g, "");

/* -------------------- Side Panel -------------------- */
function LogDetailsPanel({ log, open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-[420px]
          bg-white dark:bg-navy-800
          border-l border-gray-200 dark:border-navy-700
          shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {log && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
                            border-b border-gray-200 dark:border-navy-700">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                Log Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500"
              >
                <MdClose size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
              <Detail label="Timestamp" value={log.timestamp} />
              <Detail
                label="Level"
                value={
                  <span
                    className={`inline-flex items-center rounded-full
                                px-3 py-1 text-xs font-medium
                                ${levelBadge[log.level]}`}
                  >
                    {levelIcon[log.level]}
                    {log.level}
                  </span>
                }
              />
              <Detail label="Service" value={log.service} />
              <Detail label="Host" value={log.host} />

              <div>
                <div className="mb-1 font-medium text-gray-600 dark:text-gray-300">
                  Message
                </div>
                <pre className="rounded-md bg-gray-100 dark:bg-navy-700
                                p-3 text-xs font-mono
                                whitespace-pre-wrap break-words">
                  {stripAnsi(log.message)}
                </pre>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-gray-800 dark:text-gray-200">{value}</div>
    </div>
  );
}

/* -------------------- Logs Table -------------------- */
export default function LogsTable({ tableData = [], loading }) {
  const [selectedLog, setSelectedLog] = useState(null);

  if (loading) {
    return <p className="text-sm text-gray-400">Loading logs...</p>;
  }

  if (!tableData.length) {
    return <p className="text-sm text-gray-400">No logs found.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-navy-700">
              <th className="py-2 font-medium text-gray-500">Time</th>
              <th className="py-2 font-medium text-gray-500">Level</th>
              <th className="py-2 font-medium text-gray-500">Service</th>
              <th className="py-2 font-medium text-gray-500">Host</th>
              <th className="py-2 font-medium text-gray-500">Message</th>
            </tr>
          </thead>

          <tbody>
            {tableData.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className={`border-b border-gray-100 last:border-none
                            cursor-pointer
                            hover:bg-gray-50/70 dark:border-navy-700
                            dark:hover:bg-navy-700/60
                            ${log.level === "DEBUG" ? "opacity-70" : ""}`}
              >
                <td className="py-2 text-gray-600 dark:text-gray-300">
                  {log.timestamp}
                </td>

                <td className="py-2">
                  <span
                    className={`inline-flex items-center rounded-full
                                px-3 py-1 text-xs font-medium
                                ${levelBadge[log.level]}`}
                  >
                    {levelIcon[log.level]}
                    {log.level}
                  </span>
                </td>

                <td className="py-2 text-gray-700 dark:text-gray-200">
                  {log.service}
                </td>

                <td className="py-2 text-gray-700 dark:text-gray-200">
                  {log.host}
                </td>

                <td className="py-2 text-gray-700 dark:text-gray-200">
                  <div className="truncate max-w-[520px]">
                    {stripAnsi(log.message)}
                  </div>
                  <span className="text-xs text-blue-500">
                    Click to view details
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide-in Panel */}
      <LogDetailsPanel
        log={selectedLog}
        open={!!selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </>
  );
}
