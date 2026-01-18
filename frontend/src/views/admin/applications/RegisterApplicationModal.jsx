import { useEffect, useState } from "react";
import { FiX, FiCheckCircle, FiAlertTriangle } from "react-icons/fi";
import Card from "components/card";

export default function RegisterApplicationModal({
  open,
  onClose,
  onSuccess,
}) {
  /* =========================
     FORM STATE
  ========================= */
  const [name, setName] = useState("");
  const [version, setVersion] = useState("");
  const [description, setDescription] = useState("");
  const [serverId, setServerId] = useState(null);

  const [hosts, setHosts] = useState([]);
  const [hostSearch, setHostSearch] = useState("");

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
     LOAD HOSTS
  ========================= */
  useEffect(() => {
    if (!open) return;

    fetch("/api/hosts")
      .then((r) => r.json())
      .then((res) => setHosts(Array.isArray(res) ? res : []))
      .catch(() => setHosts([]));
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
    if (!name.trim()) e.name = "Application name is required";
    if (!serverId) e.serverId = "Server is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* =========================
     RESET FORM
  ========================= */
  const resetForm = () => {
    setName("");
    setVersion("");
    setDescription("");
    setServerId(null);
    setHostSearch("");
    setErrors({});
  };

  /* =========================
     SUBMIT
  ========================= */
  const submit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/applications/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          version: version || null,
          description: description || null,
          server_id: serverId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed");

      setToast({
        type: "success",
        msg: "Application registered successfully",
      });

      resetForm();
      onSuccess?.();

      setTimeout(onClose, 300);
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      setToast({ type: "error", msg: err.message });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     FILTER HOSTS
  ========================= */
  const filteredHosts = hosts.filter((h) =>
    h.hostname?.toLowerCase().includes(hostSearch.toLowerCase())
  );

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
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-bold">Register Application</h2>
            <button onClick={onClose}>
              <FiX className="h-5 w-5 text-gray-500 hover:text-gray-800 dark:hover:text-white" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="mt-6 flex-1 space-y-4 overflow-auto">
            <Input
              label="Application Name *"
              value={name}
              onChange={setName}
              error={errors.name}
            />

            <Input
              label="Version"
              value={version}
              onChange={setVersion}
            />

            <Input
              label="Description"
              value={description}
              onChange={setDescription}
            />

            {/* SERVER */}
            <div>
              <label className="text-sm font-medium">Server *</label>

              <input
                value={hostSearch}
                onChange={(e) => setHostSearch(e.target.value)}
                placeholder="Search server..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                           focus:outline-none focus:border-brand-500
                           dark:border-white/10 dark:bg-navy-800 dark:text-white
                           dark:focus:border-brand-400"
              />

              <div className="mt-2 max-h-40 overflow-auto rounded-lg border">
                {filteredHosts.map((h) => (
                  <button
                    key={h.server_id}
                    onClick={() => setServerId(h.server_id)}
                    className={`w-full px-3 py-2 text-left text-sm
                      hover:bg-gray-100 dark:hover:bg-white/10
                      ${serverId === h.server_id ? "bg-brand-100 dark:bg-white/10" : ""}
                    `}
                  >
                    {h.hostname}
                  </button>
                ))}
              </div>

              {errors.serverId && (
                <p className="mt-1 text-xs text-red-500">{errors.serverId}</p>
              )}
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 flex gap-3 border-t pt-4">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border py-2 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={loading}
              className="flex-1 rounded-lg bg-brand-500 py-2 text-sm font-medium
                         text-white hover:bg-brand-600 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Register Application"}
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
      <label className="text-sm font-medium">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                   focus:outline-none focus:border-brand-500
                   dark:border-white/10 dark:bg-navy-800 dark:text-white
                   dark:focus:border-brand-400"
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
