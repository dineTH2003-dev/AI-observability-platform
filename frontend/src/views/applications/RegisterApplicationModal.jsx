import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useState, useEffect } from 'react';

export default function RegisterApplicationModal({ open, onClose, onSuccess }) {
  const [appName, setAppName] = useState('');
  const [description, setDescription] = useState('');
  const [serverId, setServerId] = useState('');
  const [hosts, setHosts] = useState([]);

  // Load hosts from backend
  const loadHosts = async () => {
    try {
      const res = await fetch('/api/hosts');
      const data = await res.json();
      setHosts(data);
    } catch (err) {
      console.error('Failed to load hosts', err);
    }
  };

  useEffect(() => {
    if (open) {
      loadHosts();
    }
  }, [open]);

  const handleSubmit = async () => {
    const payload = {
      app_name: appName,
      description,
      server_id: Number(serverId)
    };

    try {
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to register application', err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Register Application</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Application Name" fullWidth value={appName} onChange={(e) => setAppName(e.target.value)} />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Host Dropdown */}
          <FormControl fullWidth>
            <InputLabel>Select Server</InputLabel>
            <Select value={serverId} label="Select Server" onChange={(e) => setServerId(e.target.value)}>
              {hosts.map((h) => (
                <MenuItem key={h.server_id} value={h.server_id}>
                  {h.hostname || h.server_name || `Server ${h.server_id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
