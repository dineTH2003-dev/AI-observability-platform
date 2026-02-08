import { useEffect, useState } from "react";
import { Sheet, SheetContent } from "../../components/ui/sheet";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { MdFileUpload } from "react-icons/md";
import React from "react";

/* =========================
   TYPES
========================= */
interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Errors {
  hostname?: string;
  ip?: string;
  sshUser?: string;
  environment?: string;
  pemFile?: string;
}

export function RegisterHostDialog({
  open,
  onClose,
  onSuccess,
}: Props) {
  /* =========================
     VISIBILITY (ANIMATION SAFE)
  ========================= */
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setVisible(true);
    } else {
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  /* =========================
     FORM STATE
  ========================= */
  const [hostname, setHostname] = useState("");
  const [ip, setIp] = useState("");
  const [sshUser, setSshUser] = useState("");
  const [os, setOs] = useState("");
  const [environment, setEnvironment] = useState("");
  const [description, setDescription] = useState("");
  const [sshPort, setSshPort] = useState(22);
  const [pemFile, setPemFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  if (!visible) return null;

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const e: Errors = {};

    if (!hostname.trim()) e.hostname = "Host name is required";
    if (!ip.trim()) e.ip = "IP address is required";
    if (!sshUser.trim()) e.sshUser = "SSH username is required";
    if (!environment) e.environment = "Environment is required";
    if (!pemFile) e.pemFile = "PEM file is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("hostname", hostname);
      fd.append("ip_address", ip);
      fd.append("username", sshUser);
      fd.append("os_type", os);
      fd.append("environment", environment);
      fd.append("description", description);
      fd.append("ssh_port", String(sshPort));
      fd.append("pemFile", pemFile!);

      await fetch("/api/hosts/register", {
        method: "POST",
        body: fd,
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
          p-0 flex flex-col
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          data-[state=open]:slide-in-from-right
          data-[state=closed]:slide-out-to-right
          data-[state=open]:duration-300
          data-[state=closed]:duration-200
        "
      >
        {/* ================= HEADER ================= */}
        <div className="p-6 border-b border-nebula-navy-lighter">
          <h2 className="text-lg font-semibold text-white">
            Register New Host
          </h2>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <Field label="Host Name *" error={errors.hostname}>
            <Input
              value={hostname}
              onChange={(e) => setHostname(e.target.value)}
              placeholder="prod-web-01"
            />
          </Field>

          <Field label="IP Address *" error={errors.ip}>
            <Input
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="10.0.0.12"
            />
          </Field>

          <Field label="SSH Username *" error={errors.sshUser}>
            <Input
              value={sshUser}
              onChange={(e) => setSshUser(e.target.value)}
              placeholder="ubuntu"
            />
          </Field>

          <Field label="OS Type">
            <Input
              value={os}
              onChange={(e) => setOs(e.target.value)}
              placeholder="linux"
            />
          </Field>

          <Field label="Environment *" error={errors.environment}>
            <Input
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="prod / qa / dev"
            />
          </Field>

          <Field label="Description">
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>

          <Field label="SSH Port">
            <Input
              type="number"
              value={sshPort}
              onChange={(e) => setSshPort(Number(e.target.value))}
            />
          </Field>

          {/* PEM FILE */}
          <Field label="PEM File *" error={errors.pemFile}>
            <button
              type="button"
              onClick={() => document.getElementById("pem")?.click()}
              className="flex w-full items-center gap-2 rounded-lg border
                         border-dashed border-nebula-navy-lighter
                         px-3 py-2 text-sm text-white"
            >
              <MdFileUpload />
              {pemFile ? pemFile.name : "Select PEM file"}
            </button>

            <input
              id="pem"
              type="file"
              accept=".pem"
              hidden
              onChange={(e) => setPemFile(e.target.files?.[0] || null)}
            />
          </Field>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="p-6 border-t border-nebula-navy-lighter flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 h-11 bg-nebula-navy border border-nebula-navy-lighter"
          >
            Cancel
          </Button>

          <Button
            onClick={submit}
            disabled={loading}
            className="flex-1 h-11 bg-gradient-to-r from-nebula-purple to-nebula-blue"
          >
            {loading ? "Registering…" : "Register"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* =========================
   SMALL FIELD HELPER
========================= */
function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
