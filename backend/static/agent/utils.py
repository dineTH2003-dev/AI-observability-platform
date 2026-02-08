# utils.py
import configparser
import hashlib
import logging
import os
from pathlib import Path

CONFIG_PATH = "/opt/oneagent/config.ini"


def load_config(path: str = CONFIG_PATH) -> dict:
  """
  Load agent configuration from config.ini
  """
  config = configparser.ConfigParser()
  if not os.path.exists(path):
      raise FileNotFoundError(f"Config file not found at {path}")

  config.read(path)

  if "agent" not in config:
      raise ValueError("Missing [agent] section in config.ini")

  section = config["agent"]

  return {
      "server_id": section.get("server_id"),
      "backend": section.get("backend").rstrip("/"),
      "host": section.get("host", ""),
      "username": section.get("username", ""),
      "pem_path": section.get("pem_path", ""),
      "interval": int(section.get("interval", "60"))
  }


def make_fingerprint(server_id: str, name: str, technology: str) -> str:
  """
  Create SHA1 fingerprint from server_id, name, technology.
  """
  raw = f"{server_id}:{name}:{technology}"
  return hashlib.sha1(raw.encode("utf-8")).hexdigest()


def setup_logger(name: str = "oneagent") -> logging.Logger:
  """
  Basic logger to stdout and /opt/oneagent/agent.log
  """
  logger = logging.getLogger(name)
  if logger.handlers:
      return logger

  logger.setLevel(logging.INFO)

  formatter = logging.Formatter(
      "%(asctime)s [%(levelname)s] %(message)s", "%Y-%m-%d %H:%M:%S"
  )

  # console
  ch = logging.StreamHandler()
  ch.setFormatter(formatter)
  logger.addHandler(ch)

  # file
  log_dir = Path("/opt/oneagent")
  log_dir.mkdir(parents=True, exist_ok=True)
  fh = logging.FileHandler(log_dir / "agent.log")
  fh.setFormatter(formatter)
  logger.addHandler(fh)

  return logger
