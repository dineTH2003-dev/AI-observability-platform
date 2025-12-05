import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem, Box } from '@mui/material';
import { useState } from 'react';

export default function RegisterHostModal({ open, onClose, onRegistered }) {
  const [form, setForm] = useState({
    hostname: '',
    ip_address: '',
    username: '',
    os_type: '',
    environment: '',
    description: '',
    ssh_port: 22
  });

  const [pemFile, setPemFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePemSelect = (e) => {
    setPemFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!pemFile) return alert('Please select a PEM file');

    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    formData.append('pemFile', pemFile);

    try {
      setLoading(true);

      const res = await fetch('/api/hosts/register', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) return alert('Failed to register host');

      if (onRegistered) onRegistered(data.server);

      onClose();
      setForm({
        hostname: '',
        ip_address: '',
        username: '',
        os_type: '',
        environment: '',
        description: '',
        ssh_port: 22
      });
      setPemFile(null);
    } catch (err) {
      console.error('Register host failed', err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Register New Host</DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Host Name"
            fullWidth
            required
            value={form.hostname}
            onChange={(e) => handleChange('hostname', e.target.value)}
          />

          <TextField
            label="IP Address"
            fullWidth
            required
            value={form.ip_address}
            onChange={(e) => handleChange('ip_address', e.target.value)}
          />

          <TextField
            label="SSH Username"
            fullWidth
            required
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
          />

          <TextField
            label="OS Type"
            fullWidth
            placeholder="Ubuntu 22.04, CentOS 7, etc."
            value={form.os_type}
            onChange={(e) => handleChange('os_type', e.target.value)}
          />

          <TextField
            label="Environment"
            select
            fullWidth
            required
            value={form.environment}
            onChange={(e) => handleChange('environment', e.target.value)}
          >
            <MenuItem value="Production">Production</MenuItem>
            <MenuItem value="Staging">Staging</MenuItem>
            <MenuItem value="Dev">Development</MenuItem>
          </TextField>

          <TextField
            label="Description"
            multiline
            rows={2}
            fullWidth
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />

          <Button variant="outlined" component="label">
            {pemFile ? `Selected: ${pemFile.name}` : 'Select PEM File'}
            <input type="file" accept=".pem" hidden onChange={handlePemSelect} />
          </Button>

          <TextField
            label="SSH Port"
            type="number"
            fullWidth
            value={form.ssh_port}
            onChange={(e) => handleChange('ssh_port', e.target.value)}
          />
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
