import { useEffect, useState } from 'react';
import { Box, Typography, TextField, Button, Table, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Chip } from '@mui/material';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import SearchIcon from '@mui/icons-material/Search';

import MainCard from 'ui-component/cards/MainCard';
import RegisterApplicationModal from './RegisterApplicationModal';

// Status color mapping (optional if you add health later)
const statusColor = {
  Healthy: 'success',
  Warning: 'warning',
  Critical: 'error',
  Unknown: 'default'
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);

  // Load apps from backend
  const loadApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      const data = await res.json();
      setApplications(data);
    } catch (err) {
      console.error('Failed to load applications', err);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const filteredApps = applications.filter(
    (app) =>
      app.app_name.toLowerCase().includes(search.toLowerCase()) || (app.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <MainCard
          title="Applications"
          secondary={
            <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => setOpenModal(true)}>
              Register Application
            </Button>
          }
        >
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search applications"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                }}
              />
            </Stack>
          </Box>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>App Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Server ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Created At</TableCell>
                  <TableCell>Updated At</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredApps.map((app) => (
                  <TableRow key={app.app_id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">{app.app_name}</Typography>
                    </TableCell>

                    <TableCell sx={{ maxWidth: 300 }}>
                      <Typography variant="body2" color="text.secondary">
                        {app.description || '—'}
                      </Typography>
                    </TableCell>

                    <TableCell>{app.server_id}</TableCell>
                    <TableCell>
                      <Chip label={app.status || 'Unknown'} size="small" color={statusColor[app.status] || 'default'} variant="outlined" />
                    </TableCell>

                    <TableCell>{new Date(app.created_at).toLocaleString()}</TableCell>

                    <TableCell>{new Date(app.updated_at).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </MainCard>
      </Box>
      {/* Register Application Modal */}
      <RegisterApplicationModal open={openModal} onClose={() => setOpenModal(false)} onSuccess={loadApplications} />
    </>
  );
}
