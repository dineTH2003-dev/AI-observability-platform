// routes/hosts.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

const router = express.Router();

// POST /api/hosts/register
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      hostname,
      ip_address,
      username,
      os_type, // currently not stored; keep if you later add column
      environment,
      description,
      ssh_port,
    } = req.body;

    if (!hostname || !ip_address || !username) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!req.files || !req.files.pemFile) {
      return res.status(400).json({ error: "PEM file required" });
    }

    const pemFile = req.files.pemFile;
    const sshPortNum = ssh_port ? parseInt(ssh_port, 10) : 22;

    const insertQuery = `
      INSERT INTO servers (hostname, ip_address, username, ssh_port, environment, description)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING server_id, hostname, ip_address, username, ssh_port, environment, description, agent_installed, created_at
    `;
    const insertValues = [
      hostname,
      ip_address,
      username,
      sshPortNum,
      environment || null,
      description || null,
    ];

    const result = await client.query(insertQuery, insertValues);
    const server = result.rows[0];

    const uploadDir = process.env.UPLOAD_DIR || "./uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const pemPath = path.join(uploadDir, `server_${server.server_id}.pem`);
    await pemFile.mv(pemPath);

    res.json({ server });
  } catch (err) {
    console.error("Register host failed:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// GET /api/hosts
router.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT server_id, hostname, ip_address, username, ssh_port,
             environment, description, agent_installed, created_at
      FROM servers
      ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("List hosts failed:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

module.exports = router;
