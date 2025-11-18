import paramiko
import json
import sys
import re
import time
from datetime import datetime

# -----------------------------
# DB connection function (commented for testing)
# -----------------------------
# import pymysql
# def get_service_patterns(db_config, server_id):
#     conn = pymysql.connect(
#         host=db_config['host'],
#         user=db_config['user'],
#         password=db_config['password'],
#         database=db_config['database'],
#         port=db_config.get('port', 3306)
#     )
#     cursor = conn.cursor(pymysql.cursors.DictCursor)
#     cursor.execute("""
#         SELECT service_id, technology, command_pattern
#         FROM services
#         WHERE server_id = %s
#     """, (server_id,))
#     rows = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return rows

# -----------------------------
# Discover services on server
# -----------------------------
def discover_services(host, username, pem_path, service_patterns):
    services = []
    found_ids = set()

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=host, username=username, key_filename=pem_path)

    stdin, stdout, stderr = ssh.exec_command("ps -eo pid,user,comm,args --no-heading")
    output = stdout.read().decode().splitlines()

    for line in output:
        line = line.strip()
        if not line:
            continue
        parts = re.split(r'\s+', line, maxsplit=3)
        if len(parts) < 4:
            continue

        pid_str, user, comm, command = parts
        if not pid_str.isdigit():
            continue
        pid = int(pid_str)
        cmd_lower = command.lower()

        for pattern in service_patterns:
            service_id = pattern['service_id']
            tech = pattern['technology'].lower()
            command_pattern = pattern['command_pattern'].lower()

            match_service = False
            if tech == "java" and "java" in cmd_lower and command_pattern in cmd_lower:
                match_service = True
            elif tech == "node" and "node" in cmd_lower and command_pattern in cmd_lower:
                match_service = True
            elif tech == "python" and "python" in cmd_lower and command_pattern in cmd_lower:
                match_service = True

            if not match_service:
                continue

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

            # Current working directory
            cwd = None
            try:
                stdin_c, stdout_c, stderr_c = ssh.exec_command(f"pwdx {pid}")
                cwd_out = stdout_c.read().decode().strip()
                if cwd_out and ":" in cwd_out:
                    cwd = cwd_out.split(":", 1)[1].strip()
            except:
                cwd = None

            services.append({
                "service_id": service_id,
                "pid": pid,
                "user": user,
                "command": command,
                "technology": tech.capitalize(),
                "ports": ports,
                "cwd": cwd,
                "status": "running"
            })
            found_ids.add(service_id)

    # Mark stopped services
    for pattern in service_patterns:
        if pattern['service_id'] not in found_ids:
            services.append({
                "service_id": pattern['service_id'],
                "pid": None,
                "user": None,
                "command": None,
                "technology": pattern['technology'],
                "ports": [],
                "cwd": None,
                "status": "stopped"
            })

    ssh.close()
    return services

# -----------------------------
# Main loop
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) != 4:
        print("Usage: python discover_services_test.py <host> <username> <pem_path>")
        sys.exit(1)

    host = sys.argv[1]
    username = sys.argv[2]
    pem_path = sys.argv[3]

    # -----------------------------
    # Example service patterns for testing
    # -----------------------------
    service_patterns = [
        {"service_id": 101, "technology": "Java", "command_pattern": "discovery-service"},
        {"service_id": 102, "technology": "Node", "command_pattern": "server.js"},
        {"service_id": 103, "technology": "Python", "command_pattern": "networkd-disp"}
    ]

    while True:
        try:
            discovered = discover_services(host, username, pem_path, service_patterns)
            print(f"[{datetime.now()}] Discovered {len(discovered)} services:")
            print(json.dumps(discovered, indent=4))
        except Exception as e:
            print(f"Error during discovery: {e}")
        time.sleep(60)
