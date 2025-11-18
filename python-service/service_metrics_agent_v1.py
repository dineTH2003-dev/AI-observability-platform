import paramiko
import sys
import time
import json
from datetime import datetime
import re

# -----------------------------
# Uncomment for actual DB usage
# -----------------------------
# import pymysql
# def save_metrics_to_db(db_config, metrics_list):
#     conn = pymysql.connect(
#         host=db_config['host'],
#         user=db_config['user'],
#         password=db_config['password'],
#         database=db_config['database'],
#         port=db_config.get('port', 3306)
#     )
#     cursor = conn.cursor()
#     for metric in metrics_list:
#         cursor.execute("""
#             INSERT INTO service_metrics
#             (service_id, pid, technology, command_pattern, cpu_percent, memory_percent, ports, timestamp)
#             VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
#         """, (
#             metric['service_id'],
#             metric['pid'],
#             metric['technology'],
#             metric['command_pattern'],
#             metric['cpu_percent'],
#             metric['memory_percent'],
#             ",".join(metric['ports']),
#             metric['timestamp']
#         ))
#     conn.commit()
#     cursor.close()
#     conn.close()

# -----------------------------
# Fetch metrics for a service
# -----------------------------
def fetch_metrics(host, username, pem_path, service_info):
    metrics_list = []

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=host, username=username, key_filename=pem_path)

    # Get all processes
    stdin, stdout, stderr = ssh.exec_command("ps -eo pid,comm,args --no-heading")
    output = stdout.read().decode().splitlines()

    for line in output:
        line = line.strip()
        if not line:
            continue
        parts = re.split(r'\s+', line, maxsplit=2)
        if len(parts) < 3:
            continue
        pid_str, comm, command = parts
        if not pid_str.isdigit():
            continue
        pid = int(pid_str)
        cmd_lower = command.lower()

        # Match the service pattern
        tech = service_info['technology'].lower()
        cmd_pattern = service_info['command_pattern'].lower()
        match_service = False
        if tech == "java" and "java" in cmd_lower and cmd_pattern in cmd_lower:
            match_service = True
        elif tech == "node" and "node" in cmd_lower and cmd_pattern in cmd_lower:
            match_service = True
        elif tech == "python" and "python" in cmd_lower and cmd_pattern in cmd_lower:
            match_service = True

        if not match_service:
            continue

        # CPU & Memory
        try:
            stdin_m, stdout_m, stderr_m = ssh.exec_command(f"ps -p {pid} -o %cpu,%mem --no-heading")
            cpu_mem = stdout_m.read().decode().strip().split()
            cpu_percent = float(cpu_mem[0])
            mem_percent = float(cpu_mem[1])
        except:
            cpu_percent = 0.0
            mem_percent = 0.0

        # Ports
        ports = []
        try:
            cmd_ports = f"sudo lsof -Pan -p {pid} -iTCP -sTCP:LISTEN"
            stdin_p, stdout_p, stderr_p = ssh.exec_command(cmd_ports)
            port_output = stdout_p.read().decode().splitlines()
            for po in port_output[1:]:
                po_parts = po.split()
                if len(po_parts) >= 9:
                    ports.append(po_parts[8].split(':')[-1])
        except:
            ports = []

        metrics_list.append({
            "service_id": service_info['service_id'],
            "pid": pid,
            "technology": service_info['technology'],
            "command_pattern": service_info['command_pattern'],
            "cpu_percent": cpu_percent,
            "memory_percent": mem_percent,
            "ports": ports,
            "timestamp": str(datetime.now())
        })

    ssh.close()
    return metrics_list

# -----------------------------
# Main loop
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python service_metrics_db_test.py <host> <username> <pem_path>")
        sys.exit(1)

    host = sys.argv[1]
    username = sys.argv[2]
    pem_path = sys.argv[3]

    # -----------------------------
    # Example service info for testing
    # -----------------------------
    service_info = {
        "service_id": 101,
        "technology": "Java",
        "command_pattern": "discovery-service"
    }

    # -----------------------------
    # DB config (commented)
    # -----------------------------
    # db_config = {
    #     "host": "localhost",
    #     "user": "root",
    #     "password": "your_db_password",
    #     "database": "observability"
    # }

    while True:
        try:
            metrics = fetch_metrics(host, username, pem_path, service_info)
            print(f"[{datetime.now()}] Metrics for service_id {service_info['service_id']}:")
            print(json.dumps(metrics, indent=4))

            # -----------------------------
            # Save to DB (uncomment when ready)
            # -----------------------------
            # save_metrics_to_db(db_config, metrics)

        except Exception as e:
            print(f"Error fetching metrics: {e}")

        time.sleep(60)
