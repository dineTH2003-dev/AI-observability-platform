// routes/applications.js
const express = require("express");
const { pool } = require("../db");

const router = express.Router();

/* =====================================================
   GET /api/applications
   Get all applications
   ===================================================== */
router.get("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT
        app_id,
        name,
        description,
        version,
        server_id,
        status,
        created_at,
        updated_at
      FROM applications
      ORDER BY created_at DESC
    `);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("Fetch applications failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  } finally {
    client.release();
  }
});

/* =====================================================
   POST /api/applications/register
   Create new application
   ===================================================== */
router.post("/register", async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      name,
      description,
      version,
      server_id,
      status,
    } = req.body;

    if (!name || !server_id) {
      return res.status(400).json({
        success: false,
        message: "Application name and server_id are required",
      });
    }

    // Optional: validate server exists (recommended)
    const serverCheck = await client.query(
      "SELECT server_id FROM servers WHERE server_id = $1",
      [server_id]
    );

    if (serverCheck.rowCount === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid server_id",
      });
    }

    const insertQuery = `
      INSERT INTO applications
        (name, description, version, server_id, status)
      VALUES
        ($1, $2, $3, $4, $5)
      RETURNING
        app_id,
        name,
        description,
        version,
        server_id,
        status,
        created_at,
        updated_at
    `;

    const insertValues = [
      name,
      description || null,
      version || null,
      server_id,
      status || "RUNNING",
    ];

    const result = await client.query(insertQuery, insertValues);

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      application: result.rows[0],
    });
  } catch (err) {
    console.error("Create application failed:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create application",
    });
  } finally {
    client.release();
  }
});

module.exports = router;
