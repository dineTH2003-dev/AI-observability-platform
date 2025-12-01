import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Paper,
  Stack
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import VisibilityIcon from '@mui/icons-material/Visibility';

import MainCard from 'ui-component/cards/MainCard';
import RegisterHostModal from './RegisterHostModal';
import InstallAgentModal from './InstallAgentModal';

const statusColor = {
  Healthy: 'success',
  Warning: 'warning',
  Critical: 'error',
  Unknown: 'default'
};

export default function Hosts() {
  const navigate = useNavigate();

  const [openRegister, setOpenRegister] = useState(false);
  const [installModal, setInstallModal] = useState({ open: false, host: null });
  const [hosts, setHosts] = useState([]);
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('All');

  // Load real API hosts
  useEffect(() => {
    fetch('/api/hosts')
      .then((res) => res.json())
      .then((data) => setHosts(data))
      .catch((err) => console.error('Failed to load hosts:', err));
  }, []);

  const filteredHosts = hosts.filter((h) => {
    const matchesSearch =
      !search || h.hostname.toLowerCase().includes(search.toLowerCase()) || h.ip_address.toLowerCase().includes(search.toLowerCase());

    const matchesEnv = envFilter === 'All' || h.environment === envFilter;

    return matchesSearch && matchesEnv;
  });

  // Trigger immediate discovery
  const triggerDiscovery = async (host) => {
    try {
      const res = await fetch('/api/agent/send-command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ server_id: host.server_id, command: 'discover_now' })
      });

      if (res.ok) {
        alert(`Discovery triggered for ${host.hostname}`);
      } else {
        alert('Failed to trigger discovery');
      }
    } catch (err) {
      console.error('Discovery error:', err);
      alert('Error triggering discovery');
    }
  };

  // Navigate to services list page
  const viewServices = (host) => {
    navigate(`/services/${host.server_id}`);
  };

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <MainCard
          title="Hosts Overview"
          secondary={
            <Button variant="contained" startIcon={<AddCircleIcon />} onClick={() => setOpenRegister(true)}>
              Register Host
            </Button>
          }
        >
          {/* Search + Filters */}
          <Box sx={{ mt: 2, mb: 3 }}>
            <Stack direction="row" gap={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Search hosts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{ width: 280 }}
              />

              <TextField
                select
                size="small"
                label="Environment"
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value)}
                sx={{ width: 200 }}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Staging">Staging</MenuItem>
                <MenuItem value="Dev">Development</MenuItem>
              </TextField>
            </Stack>
          </Box>

          {/* Hosts Table */}
          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Host Name</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>SSH User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Agent</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredHosts.map((h) => (
                  <TableRow key={h.server_id} hover>
                    <TableCell>
                      <Typography fontWeight={600}>{h.hostname}</Typography>
                    </TableCell>

                    <TableCell>{h.ip_address}</TableCell>
                    <TableCell>{h.environment}</TableCell>
                    <TableCell>{h.username}</TableCell>

                    <TableCell>
                      <Chip label={h.status || 'Unknown'} size="small" color={statusColor[h.status] || 'default'} />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={h.agent_installed ? 'Installed' : 'Not Installed'}
                        color={h.agent_installed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {/* Install Agent */}
                      {!h.agent_installed && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudDownloadIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => setInstallModal({ open: true, host: h })}
                        >
                          Install Agent
                        </Button>
                      )}

                      {/* View Services */}
                      {h.agent_installed && (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityIcon />}
                          sx={{ mr: 1 }}
                          onClick={() => viewServices(h)}
                        >
                          View Services
                        </Button>
                      )}

                      {/* Trigger Discovery */}
                      {h.agent_installed && (
                        <Button variant="contained" size="small" startIcon={<RocketLaunchIcon />} onClick={() => triggerDiscovery(h)}>
                          Discover
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredHosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Typography color="text.secondary">No hosts registered yet.</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </MainCard>
      </Box>

      {/* Register Host Modal */}
      <RegisterHostModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onRegistered={(newHost) => setHosts((prev) => [newHost, ...prev])}
      />

      {/* Install Agent Modal */}
      <InstallAgentModal open={installModal.open} host={installModal.host} onClose={() => setInstallModal({ open: false, host: null })} />
    </>
  );
}
