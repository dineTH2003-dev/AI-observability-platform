# agent.py
import time
import requests
from utils import load_config, setup_logger
from discovery import discover_services

logger = setup_logger("oneagent")


def get_command(backend: str, server_id: str):
    """GET /api/agent/command"""
    try:
        resp = requests.get(
            f"{backend}/api/agent/command",
            params={"server_id": server_id},
            timeout=10
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Failed to fetch command: {e}")
        return {"command": None}


def mark_command_complete(backend: str, command_id: int):
    """POST /api/agent/command/complete"""
    try:
        requests.post(
            f"{backend}/api/agent/command/complete",
            json={"id": command_id},
            timeout=10
        )
    except Exception as e:
        logger.error(f"Failed to mark command complete: {e}")


def fetch_service_patterns(backend: str, server_id: str):
    """GET /api/agent/service-patterns"""
    try:
        resp = requests.get(
            f"{backend}/api/agent/service-patterns",
            params={"server_id": server_id},
            timeout=10
        )
        resp.raise_for_status()
        return resp.json()
    except Exception as e:
        logger.error(f"Failed to fetch service patterns: {e}")
        return []


def send_discovery_results(backend: str, server_id: str, services):
    """
    POST /api/agent/discovery
    MUST contain : service identity + cpu/memory metrics
    """
    payload = {"server_id": server_id, "services": services}

    try:
        requests.post(
            f"{backend}/api/agent/discovery",
            json=payload,
            timeout=20
        )
        logger.info(f"Discovery sent → {len(services)} services")
    except Exception as e:
        logger.error(f"Failed to send discovery results: {e}")


def main():
    cfg = load_config()
    server_id = cfg["server_id"]
    backend = cfg["backend"]
    interval = cfg["interval"]

    logger.info(f"OneAgent started for server={server_id} backend={backend}")

    while True:
        try:
            cmd = get_command(backend, server_id)

            if cmd and cmd.get("command") == "discover_now":
                logger.info("Executing discovery…")

                patterns = fetch_service_patterns(backend, server_id)
                services = discover_services(server_id, patterns)

                # send (services + metrics snapshot)
                send_discovery_results(backend, server_id, services)

                mark_command_complete(backend, cmd.get("id"))

            time.sleep(interval)

        except Exception as err:
            logger.error(f"Main loop crashed: {err}")
            time.sleep(interval)


if __name__ == "__main__":
    main()
