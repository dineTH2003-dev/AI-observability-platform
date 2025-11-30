import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from '@mui/material';
import { useState } from 'react';

export default function RegisterHostModal({ open, onClose, onRegistered }) {
  const [pemFile, setPemFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePemSelect = (e) => {
    setPemFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!pemFile) return;

    const formData = new FormData();
    formData.append('hostname', document.getElementById('hostname').value);
    formData.append('ip_address', document.getElementById('ip_address').value);
    formData.append('username', document.getElementById('username').value);
    formData.append('os_type', document.getElementById('os_type').value);
    formData.append('ssh_port', document.getElementById('ssh_port').value);
    formData.append('environment', document.getElementById('environment').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('pemFile', pemFile);

    try {
      setLoading(true);
      const res = await fetch('/api/hosts/register', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        console.error(data);
        return;
      }

      if (onRegistered) onRegistered(data.server);
      onClose();
    } catch (err) {
      console.error('Failed to register host', err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register New Host</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField id="hostname" label="Host Name" fullWidth required />
          <TextField id="ip_address" label="IP Address" fullWidth required />
          <TextField id="username" label="SSH Username" fullWidth required />

          <TextField id="os_type" label="OS Type" fullWidth placeholder="Ubuntu 22.04, CentOS 7, etc." />

          <TextField id="environment" select label="Environment" fullWidth required>
            <MenuItem value="Production">Production</MenuItem>
            <MenuItem value="Staging">Staging</MenuItem>
            <MenuItem value="Dev">Development</MenuItem>
          </TextField>

          <TextField id="description" label="Description" fullWidth multiline rows={2} placeholder="Optional notes about this host..." />

          <Button variant="outlined" component="label">
            {pemFile ? `Selected: ${pemFile.name}` : 'Select PEM File'}
            <input type="file" accept=".pem" hidden onChange={handlePemSelect} />
          </Button>

          <TextField id="ssh_port" label="SSH Port" type="number" defaultValue={22} fullWidth />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !pemFile}>
          {loading ? 'Registering...' : 'Register Host'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
