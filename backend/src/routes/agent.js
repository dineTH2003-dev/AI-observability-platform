const express = require("express");
const { pool } = require("../db");
const path = require("path");
const fs = require("fs");
const router = express.Router();
require("dotenv").config();

/* =========================================================================
   1) DOWNLOAD INSTALLER (PEM embedded + agent installation)
   ========================================================================= */
router.get("/download-installer", async (req, res) => {
  const client = await pool.connect();
  try {
    const { server_id } = req.query;
    if (!server_id) return res.status(400).send("server_id required");

    const result = await client.query(
      `SELECT hostname, ip_address, username FROM servers WHERE server_id=$1`,
      [server_id]
    );
    if (!result.rows.length) return res.status(404).send("Server not found");

    const host = result.rows[0];
    const backend = process.env.BACKEND_URL;

    const pemPath = path.join(
      __dirname,
      "../../uploads",
      `server_${server_id}.pem`
    );

    if (!fs.existsSync(pemPath))
      return res.status(400).send("PEM file missing for server");

    const pemBase64 = Buffer.from(fs.readFileSync(pemPath, "utf8")).toString(
      "base64"
    );

    const installer = `#!/bin/bash
set -e
mkdir -p /opt/oneagent

echo "${pemBase64}" | base64 -d > /opt/oneagent/key.pem
chmod 600 /opt/oneagent/key.pem

cat <<EOF > /opt/oneagent/config.ini
[agent]
server_id=${server_id}
backend=${backend}
host=${host.ip_address}
username=${host.username}
pem_path=/opt/oneagent/key.pem
interval=30
EOF

curl -s -o /opt/oneagent/agent.py ${backend}/static/agent/agent.py
curl -s -o /opt/oneagent/discovery.py ${backend}/static/agent/discovery.py
curl -s -o /opt/oneagent/utils.py ${backend}/static/agent/utils.py
chmod +x /opt/oneagent/agent.py

cat <<EOF > /etc/systemd/system/oneagent.service
[Unit]
Description=OneAgent
After=network.target
[Service]
ExecStart=/usr/bin/python3 /opt/oneagent/agent.py
Restart=always
RestartSec=5
[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable oneagent
systemctl restart oneagent
echo "Agent installed successfully."
`;

    res.setHeader("Content-Type", "application/x-sh");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="install-oneagent-${host.hostname}.sh"`
    );
    res.send(installer);
  } finally {
    client.release();
  }
});

/* =========================================================================
   2) GET COMMAND FOR AGENT
   Stored in `servers.pending_command`
   ========================================================================= */
router.get("/command", async (req, res) => {
  const { server_id } = req.query;
  if (!server_id) return res.status(400).send("server_id required");

  const q = await pool.query(
    `SELECT pending_command, last_command_at 
     FROM servers WHERE server_id=$1`,
    [server_id]
  );

  if (!q.rows.length || !q.rows[0].pending_command)
    return res.json({ command: null });

  return res.json({
    command: q.rows[0].pending_command,
    id: server_id, // used only to ack complete
  });
});

/* =========================================================================
   3) COMMAND COMPLETE → CLEAR FIELD IN SERVERS TABLE
   ========================================================================= */
router.post("/command/complete", async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("id required");

  await pool.query(
    `UPDATE servers SET pending_command=NULL WHERE server_id=$1`,
    [id]
  );

  return res.json({ status: "ok" });
});

/* =========================================================================
   4) FETCH PATTERNS FOR SERVICE DISCOVERY
   READS FROM services.command_pattern
   ========================================================================= */
router.get("/service-patterns", async (req, res) => {
  const { server_id } = req.query;
  if (!server_id) return res.status(400).send("server_id required");

  const q = await pool.query(
    `SELECT command_pattern 
     FROM services WHERE server_id=$1 AND command_pattern IS NOT NULL`,
    [server_id]
  );

  res.json(q.rows.map((r) => r.command_pattern));
});

/* =========================================================================
   5) SERVICE DISCOVERY PROCESSING
   inserts/updates into services + inserts into service_metrics
   ========================================================================= */
router.post("/discovery", async (req, res) => {
  const client = await pool.connect();
  try {
    const { server_id, services } = req.body;
    if (!server_id || !services)
      return res.status(400).send("server_id + services required");

    for (const svc of services) {
      const {
        name,
        technology,
        command_pattern,
        pid,
        user,
        ports,
        cwd,
        status,
        cpu_usage,
        memory_usage,
      } = svc;

      // CREATE or UPDATE base service entry
      const existing = await client.query(
        `SELECT service_id FROM services WHERE server_id=$1 AND name=$2 LIMIT 1`,
        [server_id, name]
      );

      let service_id;
      if (existing.rows.length) {
        service_id = existing.rows[0].service_id;
        await client.query(
          `UPDATE services SET
            technology=$1,
            command_pattern=$2,
            pid=$3,
            user=$4,
            ports=$5,
            cwd=$6,
            status=$7,
            updated_at=NOW()
           WHERE service_id=$8`,
          [
            technology,
            command_pattern,
            pid,
            user,
            ports,
            cwd,
            status,
            service_id,
          ]
        );
      } else {
        const ins = await client.query(
          `INSERT INTO services(server_id,name,technology,command_pattern,pid,user,ports,cwd,status)
           VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
           RETURNING service_id`,
          [
            server_id,
            name,
            technology,
            command_pattern,
            pid,
            user,
            ports,
            cwd,
            status,
          ]
        );
        service_id = ins.rows[0].service_id;
      }

      // save metrics snapshot
      await client.query(
        `INSERT INTO service_metrics(server_id,service_id,cpu_usage,memory_usage,status)
         VALUES($1,$2,$3,$4,$5)`,
        [server_id, service_id, cpu_usage, memory_usage, status]
      );
    }

    res.json({ status: "ok", saved: services.length });
  } catch (err) {
    console.error("discovery saving failed:", err);
    res.status(500).json({ error: "failed to save services + metrics" });
  } finally {
    client.release();
  }
});

/* =========================================================================
   SEND COMMAND TO AGENT FROM UI
   This populates servers.pending_command -> agent picks it up
   UI calls POST /api/agent/send-command
========================================================================= */
router.post("/send-command", async (req, res) => {
  const { server_id, command } = req.body;

  if (!server_id || !command) {
    return res.status(400).json({ error: "server_id and command required" });
  }

  try {
    await pool.query(
      `UPDATE servers 
       SET pending_command=$1, last_command_at=NOW()
       WHERE server_id=$2`,
      [command, server_id]
    );

    return res.json({ success: true, message: `Command '${command}' sent` });
  } catch (err) {
    console.error("send-command failed:", err);
    return res.status(500).json({ error: "failed to send command" });
  }
});

module.exports = router;
