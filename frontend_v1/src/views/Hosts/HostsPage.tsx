import { useEffect, useMemo, useState } from "react";
import {
  Server,
  Search,
  Plus,
  Activity,
  CheckCircle,
  AlertCircle,
  Download,
  Copy,
} from "lucide-react";

import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import { RegisterHostDialog } from "./RegisterHostDialog";
import { InstallAgentDialog } from "./InstallAgentDialog";

/* =========================
   TYPES
========================= */
export interface Host {
  server_id: string;
  hostname: string;
  ip_address: string;
  environment: string;
  health: string;
  agent_status: string;
}

/* =========================
   STATUS HELPERS
========================= */
const getHealthIcon = (status: string) => {
  switch (status) {
    case "HEALTHY":
      return <CheckCircle className="size-4 text-green-400" />;
    case "WARNING":
      return <AlertCircle className="size-4 text-yellow-400" />;
    case "DOWN":
      return <Activity className="size-4 text-red-400" />;
    default:
      return <Activity className="text-slate-400 size-4" />;
  }
};

const getHealthColor = (status: string) => {
  switch (status) {
    case "HEALTHY":
      return "bg-green-500/10 text-green-400";
    case "WARNING":
      return "bg-yellow-500/10 text-yellow-400";
    case "DOWN":
      return "bg-red-500/10 text-red-400";
    default:
      return "bg-slate-500/10 text-slate-400";
  }
};

/* =========================
   PAGE
========================= */
export function HostsPage() {
  const [hosts, setHosts] = useState<Host[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [registerOpen, setRegisterOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [selectedHost, setSelectedHost] = useState<Host | null>(null);

  /* =========================
     LOAD HOSTS
  ========================= */
  const loadHosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hosts");
      const data = await res.json();
      setHosts(Array.isArray(data) ? data : data.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHosts();
  }, []);

  /* =========================
     FILTER
  ========================= */
  const filteredHosts = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return hosts.filter(
      (h) =>
        h.hostname.toLowerCase().includes(q) ||
        h.ip_address.includes(q) ||
        h.environment.toLowerCase().includes(q)
    );
  }, [hosts, searchQuery]);

  /* =========================
     ACTIONS
  ========================= */
  const openInstallAgent = (host: Host) => {
    setSelectedHost(host);
    setInstallOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Hosts</h1>
          <p className="text-slate-400 mt-1 text-sm">
            Monitor infrastructure health and connected agents
          </p>
        </div>

        <Button
          onClick={() => setRegisterOpen(true)}
          className="from-nebula-purple to-nebula-blue bg-gradient-to-r text-white"
        >
          <Plus className="mr-2 size-4" />
          Register Host
        </Button>
      </div>

      {/* Search */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-4">
          <div
            className="
              border-nebula-navy-lighter bg-nebula-navy-dark focus-within:border-nebula-blue focus-within:ring-nebula-blue relative
              flex items-center
              rounded-lg border
              focus-within:ring-1
            "
          >
            <Search className="text-slate-400 ml-3 size-4 shrink-0" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by hostname, IP, environment..."
              className="
                bg-transparent placeholder:text-slate-500 border-0
                px-3
                py-2 text-white
                focus-visible:ring-0 focus-visible:ring-offset-0
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
                  {["HOST", "IP", "ENV", "HEALTH", "AGENT", ""].map((h) => (
                    <th
                      key={h}
                      className="text-slate-400 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
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
                      colSpan={6}
                      className="text-slate-400 px-6 py-12 text-center"
                    >
                      Loading hosts…
                    </td>
                  </tr>
                ) : filteredHosts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Server className="text-slate-600 mx-auto mb-3 size-12" />
                      <p className="text-slate-400">No hosts found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredHosts.map((host) => (
                    <tr
                      key={host.server_id}
                      className="hover:bg-nebula-navy-dark transition-colors"
                    >
                      {/* HOST */}
                      <td className="px-6 py-4 font-medium text-white">
                        {host.hostname}
                      </td>

                      {/* IP */}
                      <td className="text-slate-300 px-6 py-4">
                        {host.ip_address}
                      </td>

                      {/* ENV */}
                      <td className="text-slate-300 px-6 py-4">
                        {host.environment}
                      </td>

                      {/* HEALTH */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getHealthIcon(host.health)}
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getHealthColor(
                              host.health
                            )}`}
                          >
                            {host.health ?? "Unknown"}
                          </span>
                        </div>
                      </td>

                      {/* AGENT */}
                      <td className="px-6 py-4">
                        <span className="bg-slate-500/10 text-slate-400 rounded-full px-3 py-1 text-xs">
                          {host.agent_status ?? "Unknown"}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openInstallAgent(host)}
                          className="border-nebula-purple text-nebula-purple hover:bg-nebula-purple/10"
                        >
                          Install Agent
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

      {/* Dialogs */}
      <RegisterHostDialog
        open={registerOpen}
        onClose={() => setRegisterOpen(false)}
        onSuccess={loadHosts}
      />

      <InstallAgentDialog
        open={installOpen}
        onClose={() => setInstallOpen(false)}
        host={selectedHost}
      />
    </div>
  );
}
