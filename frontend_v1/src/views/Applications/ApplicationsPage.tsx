import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Search,
  Plus,
  MoreVertical,
  Activity,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { RegisterApplicationDialog } from "./RegisterApplicationDialog";
import { Application } from "./types/application";

/* =========================
   TYPES
========================= */
interface Host {
  server_id: string;
  hostname: string;
}

/* =========================
   STATUS HELPERS (UNCHANGED)
========================= */
const getStatusIcon = (status: string) => {
  switch (status) {
    case "RUNNING":
      return <CheckCircle className="size-4 text-green-400" />;
    case "warning":
      return <AlertCircle className="size-4 text-yellow-400" />;
    case "stopped":
      return <Activity className="size-4 text-red-400" />;
    default:
      return <Activity className="text-slate-400 size-4" />;
  }
};

const formatUTC = (date: string) => {
  const d = new Date(date);

  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}
          ${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}:${String(d.getUTCSeconds()).padStart(2, '0')}`;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "RUNNING":
      return "bg-green-500/10 text-green-400";
    case "warning":
      return "bg-yellow-500/10 text-yellow-400";
    case "stopped":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-slate-500/10 text-slate-400";
  }
};

export function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  /* =========================
     LOAD APPLICATIONS
  ========================= */
  const loadApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     LOAD HOSTS (SERVER NAMES)
  ========================= */
  useEffect(() => {
    fetch("/api/hosts")
      .then((r) => r.json())
      .then((res) => setHosts(Array.isArray(res) ? res : []))
      .catch(() => setHosts([]));
  }, []);

  useEffect(() => {
    loadApplications();
  }, []);

  /* =========================
     HOST LOOKUP MAP
  ========================= */
  const hostMap = useMemo(() => {
    const map: Record<string, string> = {};
    hosts.forEach((h) => {
      map[h.server_id] = h.hostname;
    });
    return map;
  }, [hosts]);

  /* =========================
     FILTER
  ========================= */
  const filteredApplications = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return applications.filter(
      (app) =>
        app.name.toLowerCase().includes(q) ||
        app.description?.toLowerCase().includes(q) ||
        app.version?.includes(q) ||
        hostMap[app.server_id]?.toLowerCase().includes(q)
    );
  }, [applications, searchQuery, hostMap]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Applications</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Register and manage applications running on your hosts
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="from-nebula-purple to-nebula-blue bg-gradient-to-r text-white"
        >
          <Plus className="mr-2 size-4" />
          Register Application
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-4">
          <div
            className="
      border-nebula-navy-lighter bg-nebula-navy-dark focus-within:border-nebula-blue
      focus-within:ring-nebula-blue
      relative flex
      items-center
      rounded-lg
      border focus-within:ring-1
    "
          >
            <Search className="text-slate-400 ml-3 size-4 shrink-0" />

            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, version, server..."
              className="
          bg-transparent
          placeholder:text-slate-500
          border-0
          py-2
          pl-3
          pr-3
          text-white
          focus-visible:ring-0
          focus-visible:ring-offset-0
        "
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nebula-navy-dark border-nebula-navy-lighter border-b">
                <tr>
                  {[
                    "APPLICATION",
                    "DESCRIPTION",
                    "VERSION",
                    "SERVER",
                    "STATUS",
                    "CREATED",
                    "UPDATED",
                    "",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-slate-400 px-6 py-4 text-left align-middle text-xs font-semibold uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-nebula-navy-lighter divide-y">
                {loading ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="text-slate-400 px-6 py-12 text-center"
                    >
                      Loading applications…
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <Box className="text-slate-600 mx-auto mb-3 size-12" />
                      <p className="text-slate-400">No applications found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-nebula-navy-dark transition-colors"
                    >
                      {/* APPLICATION */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-3">
                          <div className="bg-nebula-blue/10 flex h-10 w-10 items-center justify-center rounded-lg">
                            <Box className="text-nebula-blue size-5" />
                          </div>
                          <span className="font-medium text-white">
                            {app.name}
                          </span>
                        </div>
                      </td>

                      {/* DESCRIPTION */}
                      <td className="text-slate-300 px-6 py-4 align-middle">
                        {app.description}
                      </td>

                      {/* VERSION */}
                      <td className="px-6 py-4 align-middle">
                        <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-400">
                          {app.version}
                        </span>
                      </td>

                      {/* SERVER NAME */}
                      <td className="text-slate-300 px-6 py-4 align-middle">
                        {hostMap[app.server_id] ?? "—"}
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(app.status)}
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                              app.status
                            )}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </td>

                      {/* CREATED */}
                      <td className="text-slate-300 whitespace-nowrap px-6 py-4 align-middle">
                        {formatUTC(app.created_at)}
                      </td>

                      {/* UPDATED */}
                      <td className="text-slate-300 whitespace-nowrap px-6 py-4 align-middle">
                        {formatUTC(app.updated_at)}
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4 align-middle">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="size-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Register Dialog */}
      <RegisterApplicationDialog
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={loadApplications}
      />
    </div>
  );
}
