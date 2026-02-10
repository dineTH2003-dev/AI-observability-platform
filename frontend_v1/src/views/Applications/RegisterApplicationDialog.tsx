import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
} from '../../components/ui/sheet';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

/* =========================
   TYPES
========================= */
interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Host {
  server_id: string;
  hostname: string;
}

export function RegisterApplicationDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  /* =========================
     VISIBILITY
  ========================= */
  const [visible, setVisible] = useState(open);

  /* =========================
     FORM STATE
  ========================= */
  const [name, setName] = useState('');
  const [version, setVersion] = useState('');
  const [description, setDescription] = useState('');
  const [serverId, setServerId] = useState('');

  /* =========================
     HOSTS
  ========================= */
  const [hosts, setHosts] = useState<Host[]>([]);
  const [hostSearch, setHostSearch] = useState('');
  const [loading, setLoading] = useState(false);

  /* =========================
     MOUNT / UNMOUNT
  ========================= */
  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* =========================
     LOAD HOSTS
  ========================= */
  useEffect(() => {
    if (!open) return;

    fetch('/api/hosts')
      .then(r => r.json())
      .then(res => setHosts(Array.isArray(res) ? res : []))
      .catch(() => setHosts([]));
  }, [open]);

  if (!visible) return null;

  const filteredHosts = hosts.filter(h =>
    h.hostname.toLowerCase().includes(hostSearch.toLowerCase())
  );

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!name || !serverId) return;

    setLoading(true);
    try {
      await fetch('/api/applications/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          version: version || null,
          description: description || null,
          server_id: serverId,
        }),
      });

      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="
          h-full w-[420px]
          bg-nebula-navy-light
          border-l border-nebula-navy-lighter
          shadow-2xl
          p-0
          flex flex-col
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:slide-in-from-right
          data-[state=closed]:slide-out-to-right
          data-[state=open]:duration-300
          data-[state=closed]:duration-200
        "
      >
        {/* ================= HEADER ================= */}
        <div className="p-6 border-b border-nebula-navy-lighter flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Register Application
          </h2>
          {/* <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="size-5" />
          </button> */}
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Application Name */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Application Name *</p>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. user-service"
            />
          </div>

          {/* Version */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Version</p>
            <Input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="v1.0.0"
            />
          </div>

          {/* Description */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Description</p>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of the application"
            />
          </div>

          {/* Server */}
          <div>
            <p className="text-xs text-slate-400 mb-1">Server *</p>

            <input
              value={hostSearch}
              onChange={(e) => setHostSearch(e.target.value)}
              placeholder="Search server..."
              className="
                w-full rounded-lg border
                border-nebula-navy-lighter
                bg-nebula-navy
                px-3 py-2 text-sm text-white
                focus:outline-none focus:ring-2 focus:ring-nebula-blue
              "
            />

            <div className="mt-2 max-h-40 overflow-auto rounded-lg border border-nebula-navy-lighter">
              {filteredHosts.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate-400">
                  No servers found
                </p>
              )}

              {filteredHosts.map(h => (
                <button
                  key={h.server_id}
                  type="button"
                  onClick={() => setServerId(h.server_id)}
                  className={`
                    w-full px-3 py-2 text-left text-sm
                    hover:bg-white/10
                    ${serverId === h.server_id ? 'bg-white/10' : ''}
                  `}
                >
                  {h.hostname}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-6 border-t border-nebula-navy-lighter flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 h-11 bg-nebula-navy border border-nebula-navy-lighter text-white"
          >
            Close
          </Button>

          <Button
            onClick={submit}
            disabled={loading}
            className="flex-1 h-11 bg-gradient-to-r from-nebula-purple to-nebula-blue"
          >
            {loading ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
