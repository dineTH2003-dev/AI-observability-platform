import { Dialog, DialogTitle, DialogContent, DialogActions, Button, MenuItem, TextField } from '@mui/material';
import { useEffect, useState } from 'react';

export default function AssignApplicationModal({ open, service, onClose }) {
  const [apps, setApps] = useState([]);
  const [selectedApp, setSelectedApp] = useState('');

  useEffect(() => {
    fetch('/api/applications')
      .then((r) => r.json())
      .then(setApps);
  }, []);

  const assign = async () => {
    await fetch('/api/services/assign-app', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ service_id: service.service_id, app_id: selectedApp })
    });
    alert('Service assigned');
    onClose(true);
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)}>
      <DialogTitle>Assign Service to Application</DialogTitle>

      <DialogContent>
        <TextField
          label="Select Application"
          select
          fullWidth
          value={selectedApp}
          onChange={(e) => setSelectedApp(e.target.value)}
          sx={{ mt: 1 }}
        >
          {apps.map((a) => (
            <MenuItem key={a.app_id} value={a.app_id}>
              {a.app_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={() => onClose(false)}>Cancel</Button>
        <Button variant="contained" onClick={assign} disabled={!selectedApp}>
          Assign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
