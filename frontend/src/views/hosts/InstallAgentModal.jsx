import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Box } from '@mui/material';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';

export default function InstallAgentModal({ open, onClose, host }) {
  if (!host) return null;

  const downloadInstaller = async () => {
    try {
      const response = await fetch(`/api/agent/download-installer?server_id=${host.server_id}`);

      if (!response.ok) {
        alert('Failed to generate installer.');
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `oneagent-install-${host.hostname}.sh`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Install OneAgent on {host.hostname}</DialogTitle>

      <DialogContent dividers>
        <Typography sx={{ mb: 1 }}>A custom OneAgent installer will be generated for:</Typography>

        <Box
          sx={{
            background: '#f5f5f5',
            p: 2,
            borderRadius: 1,
            mb: 2,
            fontFamily: 'monospace'
          }}
        >
          <Typography>
            <b>Server ID:</b> {host.server_id}
          </Typography>
          <Typography>
            <b>Hostname:</b> {host.hostname}
          </Typography>
          <Typography>
            <b>IP:</b> {host.ip_address}
          </Typography>
          <Typography>
            <b>SSH User:</b> {host.username}
          </Typography>
        </Box>

        <Typography sx={{ mb: 1 }}>After downloading, upload the script to the target server and run:</Typography>

        <Box
          sx={{
            background: '#111',
            color: '#0f0',
            p: 2,
            borderRadius: 1,
            mb: 2,
            fontFamily: 'monospace',
            whiteSpace: 'pre-line'
          }}
        >
          {`chmod +x oneagent-install-${host.hostname}.sh
sudo ./oneagent-install-${host.hostname}.sh`}
        </Box>

        <Button variant="contained" startIcon={<CloudDownloadIcon />} fullWidth onClick={downloadInstaller}>
          Download Installer
        </Button>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
