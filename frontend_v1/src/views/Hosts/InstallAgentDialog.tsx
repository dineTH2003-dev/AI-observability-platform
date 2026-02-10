import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Download } from "lucide-react";
import { Host } from "./HostsPage";

interface Props {
  open: boolean;
  onClose: () => void;
  host: Host | null;
}

export function InstallAgentDialog({ open, onClose, host }: Props) {
  if (!host) return null;

  const downloadInstaller = async () => {
    try {
      const response = await fetch(
        `/api/agent/download-installer?server_id=${host.server_id}`
      );

      if (!response.ok) {
        alert("Failed to generate installer.");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `oneagent-install-${host.hostname}.sh`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Download failed.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-nebula-navy-light border-nebula-navy-lighter text-white max-w-2xl">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            Install OneAgent on {host.hostname}
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-6 py-4">
          <p className="text-slate-400 text-sm">
            A custom OneAgent installer will be generated for:
          </p>

          {/* Host info */}
          <div className="bg-nebula-navy-dark rounded-lg p-4 space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">Server ID:</span>
              <span className="text-white">{host.server_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hostname:</span>
              <span className="text-white">{host.hostname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IP:</span>
              <span className="text-white">{host.ip_address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">SSH User:</span>
              <span className="text-white">Ubuntu</span>
            </div>
          </div>

          <p className="text-slate-400 text-sm">
            After downloading, upload the script to the target server and run:
          </p>

          {/* Command block */}
          <div className="bg-nebula-navy-dark rounded-lg p-4 space-y-2 font-mono text-sm">
            <code className="block text-green-400">
              chmod +x oneagent-install-{host.hostname}.sh
            </code>
            <code className="block text-green-400">
              sudo ./oneagent-install-{host.hostname}.sh
            </code>
          </div>

          {/* Download Button */}
          <Button
            onClick={downloadInstaller}
            className="w-full bg-gradient-to-r from-nebula-purple to-nebula-blue text-white"
          >
            <Download className="mr-2 size-4" />
            Download Installer
          </Button>
        </div>

        {/* Footer */}
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
