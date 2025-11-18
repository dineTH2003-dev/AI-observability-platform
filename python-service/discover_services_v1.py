import paramiko

# -------------------------------
# Server config
# -------------------------------
SERVER = {
    "host": "16.16.201.173",           # Replace with your EC2 public IP
    "username": "ubuntu",            # Usually ec2-user or ubuntu
    "key_filename": "app_server_1.pem"  # PEM key path
}

# Commands
DISCOVERY_COMMANDS = {
    "Java Services": "ps -ef | grep java | grep -v grep",
    "Node Services": "ps -ef | grep node | grep -v grep",
    "Python Services": "ps -ef | grep python | grep -v grep"
}

# -------------------------------
# SSH Connection
# -------------------------------
def ssh_connect():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        hostname=SERVER["host"],
        username=SERVER["username"],
        key_filename=SERVER["key_filename"]
    )
    return ssh

# -------------------------------
# Discover services
# -------------------------------
def discover_services(ssh):
    discovered = {}
    for service_type, cmd in DISCOVERY_COMMANDS.items():
        stdin, stdout, stderr = ssh.exec_command(cmd)
        output = stdout.read().decode().splitlines()
        discovered[service_type] = []
        for line in output:
            parts = line.split()
            pid = parts[1]  # PID is usually the second column in ps -ef
            discovered[service_type].append({
                "line": line,
                "pid": pid
            })
    return discovered

# -------------------------------
# Discover ports per PID
# -------------------------------
def discover_ports(ssh, pids):
    port_mapping = {}
    for pid in pids:
        try:
            # Requires sudo for full mapping
            cmd = f"sudo netstat -tulpn | grep {pid}"
            stdin, stdout, stderr = ssh.exec_command(cmd)
            output = stdout.read().decode().splitlines()
            port_mapping[pid] = output
        except Exception as e:
            port_mapping[pid] = [f"Error fetching ports: {e}"]
    return port_mapping

# -------------------------------
# Run discovery
# -------------------------------
if __name__ == "__main__":
    ssh = ssh_connect()
    print(f"Connected to {SERVER['host']}")

    # Discover services
    services = discover_services(ssh)
    print("\nDiscovered Services:")
    for svc_type, svc_list in services.items():
        print(f"\n{svc_type}:")
        if svc_list:
            for svc in svc_list:
                print(f"  PID {svc['pid']}: {svc['line']}")
        else:
            print("  None found")

    # Discover ports
    all_pids = [svc['pid'] for svc_type in services for svc in services[svc_type]]
    ports = discover_ports(ssh, all_pids)
    print("\nService Ports:")
    for pid, port_list in ports.items():
        print(f"\nPID {pid}:")
        if port_list:
            for p in port_list:
                print(f"  {p}")
        else:
            print("  No ports found")

    ssh.close()
    print("\nDiscovery completed.")
