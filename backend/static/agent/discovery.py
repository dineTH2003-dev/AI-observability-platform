# discovery.py
import subprocess
import re
from typing import List, Dict
from utils import make_fingerprint


def _run_cmd(cmd: str) -> str:
    try:
        out = subprocess.check_output(cmd, shell=True, stderr=subprocess.DEVNULL)
        return out.decode("utf-8", errors="ignore")
    except Exception:
        return ""


def discover_services(server_id: str, service_patterns: List[Dict]) -> List[Dict]:
    """
    REQUIRED RETURN FORMAT FOR BACKEND:

    {
        "command_pattern": "...",
        "server_id": server_id,
        "name": "payment-service",
        "technology": "java",
        "pid": 3232,
        "user": "ubuntu",
        "command": "java -jar app.jar",
        "ports": [8080],
        "cwd": "/opt/service",
        "status": "running" | "stopped",
        "cpu_usage": 23.6,
        "memory_usage": 512
    }
    """

    services = []
    seen = set()

    # ========= PROCESS LIST =========
    ps = _run_cmd("ps -eo pid,user,comm,%cpu,%mem,args --no-heading")
    if not ps:
        return services

    lines = ps.strip().splitlines()

    # normalize DB patterns
    normalized = []
    for pat in service_patterns:
        fp = pat.get("command_pattern") or make_fingerprint(server_id, pat["name"], pat["technology"])

        normalized.append({
            "name": pat["name"],
            "technology": (pat["technology"] or "").lower(),
            "command_pattern": fp
        })

    # ========= MATCH RUNNING SERVICES =========
    for line in lines:
        parts = re.split(r"\s+", line, maxsplit=5)
        if len(parts) < 6:
            continue

        pid, user, comm, cpu, mem, command = parts
        cmd_low = command.lower()

        for p in normalized:
            name = p["name"]
            tech = p["technology"]

            if name.lower() not in cmd_low:
                continue
            if tech == "java" and "java" not in cmd_low: continue
            if tech == "python" and "python" not in cmd_low: continue
            if tech == "node" and "node" not in cmd_low: continue

            # ------------ PORTS ------------
            ports = []
            lsof = _run_cmd(f"sudo lsof -Pan -p {pid} -iTCP -sTCP:LISTEN")
            for l in lsof.splitlines()[1:]:
                c = l.split()
                if len(c) >= 9 and ":" in c[8]:
                    ports.append(c[8].split(":")[-1])

            # ------------ WORKING DIR ------------
            pwd = _run_cmd(f"pwdx {pid}")
            cwd = pwd.split(":",1)[1].strip() if ":" in pwd else None

            # ------------ FINAL STRUCTURE ------------
            svc = {
                "command_pattern": p["command_pattern"],
                "server_id": server_id,
                "name": name,
                "technology": tech,
                "pid": int(pid),
                "user": user,
                "command": command,
                "ports": ports,
                "cwd": cwd,
                "status": "running",
                "cpu_usage": float(cpu),
                "memory_usage": float(mem)
            }

            services.append(svc)
            seen.add(p["command_pattern"])

    # ========= ADD STOPPED SERVICES =========
    for p in normalized:
        if p["command_pattern"] not in seen:
            services.append({
                "command_pattern": p["command_pattern"],
                "server_id": server_id,
                "name": p["name"],
                "technology": p["technology"],
                "pid": None,
                "user": None,
                "command": None,
                "ports": [],
                "cwd": None,
                "status": "stopped",
                "cpu_usage": 0,
                "memory_usage": 0
            })

    return services
