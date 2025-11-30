import paramiko
import sys
import time
import json
from datetime import datetime
import psycopg2


# -------------------------------------------------------
# Hardcoded DB config (TEST MODE)
# -------------------------------------------------------
DB_CONFIG = {
    "host": "localhost",
    "user": "postgres",
    "password": "admin",
    "database": "aiops",
    "port": 5432
}


# -------------------------------------------------------
# Connect to PostgreSQL
# -------------------------------------------------------
def get_db_connection():
    return psycopg2.connect(
        host=DB_CONFIG["host"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        dbname=DB_CONFIG["database"],
        port=DB_CONFIG["port"]
    )


# -------------------------------------------------------
# Save log entry to DB
# -------------------------------------------------------
def save_log_to_db(conn, log_entry):
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO log_entry (service_id, log_level, message, raw_line, timestamp)
            VALUES (%s, %s, %s, %s, %s)
        """, (
            log_entry["service_id"],
            log_entry["log_level"],
            log_entry["message"],
            log_entry["raw_line"],
            log_entry["timestamp"]
        ))
        conn.commit()
        cursor.close()
    except Exception as e:
        print(f"[DB ERROR] {e}")
        conn.rollback()


# -------------------------------------------------------
# Detect log level
# -------------------------------------------------------
def detect_log_level(line):
    lvl = line.upper()
    if "ERROR" in lvl:
        return "ERROR"
    if "WARN" in lvl or "WARNING" in lvl:
        return "WARN"
    if "INFO" in lvl:
        return "INFO"
    if "DEBUG" in lvl:
        return "DEBUG"
    return "UNKNOWN"


# -------------------------------------------------------
# Real-time log streaming from server
# -------------------------------------------------------
def stream_logs(host, username, pem_path, log_path, service_id):
    print("[INFO] Connecting to DB...")
    conn = get_db_connection()
    print("[INFO] DB connected.")

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    print(f"[INFO] Connecting to {host} via SSH...")
    ssh.connect(hostname=host, username=username, key_filename=pem_path)
    print("[INFO] SSH connected.")

    cmd = f"tail -Fn0 {log_path}"

    transport = ssh.get_transport()
    channel = transport.open_session()
    channel.exec_command(cmd)

    print(f"[INFO] Monitoring log file: {log_path}")

    buffer = ""

    while True:
        if channel.recv_ready():
            data = channel.recv(4096).decode(errors="ignore")

            buffer += data
            lines = buffer.split("\n")
            buffer = lines[-1]

            for line in lines[:-1]:
                if not line.strip():
                    continue

                log_entry = {
                    "service_id": service_id,
                    "log_level": detect_log_level(line),
                    "message": line.strip(),
                    "raw_line": line,
                    "timestamp": datetime.now()
                }

                print(json.dumps({
                    **log_entry,
                    "timestamp": log_entry["timestamp"].isoformat()
                }))

                # Save to DB
                save_log_to_db(conn, log_entry)

        if channel.exit_status_ready():
            print("[WARN] tail -F exited")
            break

        time.sleep(0.2)

    ssh.close()
    conn.close()
    print("[INFO] Closed SSH and DB connections.")


# -------------------------------------------------------
# CLI
# -------------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) != 6:
        print("\nUsage:")
        print("python log_monitor_agent.py <host> <username> <pem_path> <log_path> <service_id>\n")
        sys.exit(1)

    host = sys.argv[1]
    username = sys.argv[2]
    pem_path = sys.argv[3]
    log_path = sys.argv[4]
    service_id = int(sys.argv[5])

    stream_logs(host, username, pem_path, log_path, service_id)
