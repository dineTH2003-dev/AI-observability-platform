import { useEffect, useState } from "react";
import { FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Card from "components/card";
import { MdFileUpload } from "react-icons/md";

export default function RegisterHostModal({ open, onClose, onSuccess }) {
  /* =========================
     FORM STATE
  ========================= */
  const [hostName, setHostName] = useState("");
  const [ipAddress, setIpAddress] = useState("");
  const [sshUsername, setSshUsername] = useState("");
  const [osType, setOsType] = useState("");
  const [environment, setEnvironment] = useState("");
  const [description, setDescription] = useState("");
  const [sshPort, setSshPort] = useState(22);
  const [pemFile, setPemFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  /* =========================
     BODY SCROLL LOCK
  ========================= */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [open]);

  /* =========================
     CLEAR STATE WHEN CLOSED
  ========================= */
  useEffect(() => {
    if (!open) {
      setErrors({});
      setToast(null);
    }
  }, [open]);

  /* =========================
     ESC TO CLOSE
  ========================= */
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!open) return null;

  /* =========================
     VALIDATION
  ========================= */
  const validate = () => {
    const e = {};
    if (!hostName.trim()) e.hostName = "Host name is required";
    if (!ipAddress.trim()) e.ipAddress = "IP address is required";
    if (!sshUsername.trim()) e.sshUsername = "SSH username is required";
    if (!environment) e.environment = "Environment is required";
    if (!pemFile) e.pemFile = "PEM file is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     RESET FORM
  ========================= */
  const resetForm = () => {
    setHostName("");
    setIpAddress("");
    setSshUsername("");
    setOsType("");
    setEnvironment("");
    setDescription("");
    setSshPort(22);
    setPemFile(null);
    setErrors({});
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("hostname", hostName);
      formData.append("ip_address", ipAddress);
      formData.append("username", sshUsername);
      formData.append("os_type", osType);
      formData.append("environment", environment);
      formData.append("description", description);
      formData.append("ssh_port", sshPort);
      formData.append("pemFile", pemFile);

      await fetch("/api/hosts/register", {
        method: "POST",
        body: formData,
      });

      setToast({ type: "success", msg: "Host registered successfully" });

      resetForm();
      onSuccess?.();

      setTimeout(onClose, 300);
      setTimeout(() => setToast(null), 2500);
    } catch {
      setToast({ type: "error", msg: "Failed to register host" });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* OVERLAY */}
      <div
        className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* SIDE PANEL */}
      <div className="fixed right-0 top-0 z-[9999] h-full w-full max-w-md">
        <Card
          extra="
            h-full rounded-none p-6 flex flex-col
            bg-white dark:bg-navy-900
            text-gray-900 dark:text-white
            animate-[slideIn_0.35s_cubic-bezier(0.4,0,0.2,1)]
          "
        >
          {/* HEADER */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-white/10">
            <h2 className="text-lg font-bold">Register New Host</h2>
            <button onClick={onClose}>
              <FiX className="h-5 w-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="mt-6 flex-1 space-y-4 overflow-auto">
            <Input label="Host Name *" value={hostName} onChange={setHostName} error={errors.hostName} />
            <Input label="IP Address *" value={ipAddress} onChange={setIpAddress} error={errors.ipAddress} />
            <Input label="SSH Username *" value={sshUsername} onChange={setSshUsername} error={errors.sshUsername} />
            <Input label="OS Type" value={osType} onChange={setOsType} />

            {/* ENVIRONMENT */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                Environment *
              </label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                           focus:outline-none focus:border-brand-500
                           dark:border-white/10 dark:bg-navy-800 dark:text-white
                           dark:focus:border-brand-400"
              >
                <option value="">Select environment</option>
                <option value="prod">Production</option>
                <option value="qa">QA</option>
                <option value="dev">Development</option>
              </select>
              {errors.environment && (
                <p className="mt-1 text-xs text-red-500">{errors.environment}</p>
              )}
            </div>

            <Input label="Description" value={description} onChange={setDescription} />

            {/* PEM FILE */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
                PEM File *
              </label>
              <button
                type="button"
                onClick={() => document.getElementById("pem-file").click()}
                className="mt-1 flex w-full items-center gap-2 rounded-lg border-2 border-dashed
                           border-gray-300 bg-white px-3 py-2 text-sm transition
                           hover:border-brand-500 dark:border-white/10 dark:bg-navy-800"
              >
                <MdFileUpload className="text-xl text-brand-500 dark:text-white" />
                <span className="font-bold text-brand-500 dark:text-white">
                  {pemFile ? pemFile.name : "Select PEM File"}
                </span>
              </button>

              <input
                id="pem-file"
                type="file"
                accept=".pem"
                hidden
                onChange={(e) => setPemFile(e.target.files[0])}
              />

              {errors.pemFile && (
                <p className="mt-1 text-xs text-red-500">{errors.pemFile}</p>
              )}
            </div>

            <Input label="SSH Port" value={sshPort} onChange={setSshPort} />
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex gap-3 border-t border-gray-200 pt-4 dark:border-white/10">
            <button onClick={onClose} className="flex-1 rounded-lg border py-2 text-sm">
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 rounded-lg bg-brand-500 py-2 text-sm font-medium
                         text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Registering..." : "Register Host"}
            </button>
          </div>
        </Card>
      </div>

      {/* TOAST */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[10000] flex items-center gap-2
            rounded-lg px-4 py-3 text-white shadow-lg
            ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        >
          {toast.type === "success" ? <FiCheckCircle /> : <FiAlertTriangle />}
          {toast.msg}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

/* =========================
   INPUT COMPONENT
========================= */
function Input({ label, value, onChange, error }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 bg-white
                   px-3 py-2 text-sm
                   focus:outline-none focus:border-brand-500
                   dark:border-white/10 dark:bg-navy-800 dark:text-white
                   dark:focus:border-brand-400"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
