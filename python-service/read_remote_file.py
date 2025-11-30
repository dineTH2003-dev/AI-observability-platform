import paramiko
import sys

def read_remote_file(host, username, pem_path, log_path):
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(hostname=host, username=username, key_filename=pem_path)

    print(f"[INFO] Reading file: {log_path}")

    cmd = f"cat {log_path}"
    stdin, stdout, stderr = ssh.exec_command(cmd)

    output = stdout.read().decode(errors="ignore")
    error = stderr.read().decode(errors="ignore")

    if error:
        print("[ERROR]")
        print(error)
    else:
        print("[FILE CONTENT]")
        print(output)

    ssh.close()


if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python read_remote_file.py <host> <username> <pem_path> <log_path>")
        sys.exit(1)

    host = sys.argv[1]
    username = sys.argv[2]
    pem_path = sys.argv[3]
    log_path = sys.argv[4]

    read_remote_file(host, username, pem_path, log_path)
