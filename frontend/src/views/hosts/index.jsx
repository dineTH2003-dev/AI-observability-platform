import { useEffect, useState } from 'react';
import { Box, TextField, MenuItem, Button, Table, TableHead, TableRow, TableCell, TableBody, Chip, Paper, Stack } from '@mui/material';

import { useNavigate } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import VisibilityIcon from '@mui/icons-material/Visibility';

import MainCard from 'ui-component/cards/MainCard';
import RegisterHostModal from './RegisterHostModal';
import InstallAgentModal from './InstallAgentModal';

/* USED NOW — HEALTH STATUS COLOR */
const hostStatusColor = {
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

  /* Auto refresh host list every 10s */
  const loadHosts = async () => {
    try {
      const res = await fetch('/api/hosts');
      const data = await res.json();
      setHosts(data);
    } catch (err) {
      console.error('Failed to load hosts:', err);
    }
  };

  useEffect(() => {
    loadHosts();
    const timer = setInterval(loadHosts, 10000);
    return () => clearInterval(timer);
  }, []);

  const filteredHosts = hosts.filter((h) => {
    const match =
      !search || h.hostname?.toLowerCase().includes(search.toLowerCase()) || h.ip_address?.toLowerCase().includes(search.toLowerCase());

    return match && (envFilter === 'All' || h.environment === envFilter);
  });

  const viewServices = (host) => navigate(`/services/${host.server_id}`);

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
          <Box sx={{ mt: 2, mb: 3 }}>
            <Stack direction="row" gap={2}>
              <TextField
                size="small"
                placeholder="Search hosts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                }}
                sx={{ width: 260 }}
              />

              <TextField
                select
                size="small"
                label="Environment"
                sx={{ width: 200 }}
                value={envFilter}
                onChange={(e) => setEnvFilter(e.target.value)}
              >
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Production">Production</MenuItem>
                <MenuItem value="Staging">Staging</MenuItem>
                <MenuItem value="Dev">Dev</MenuItem>
              </TextField>
            </Stack>
          </Box>

          <Paper variant="outlined" sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Host</TableCell>
                  <TableCell>IP</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>Health</TableCell> {/* ✔ FIXED */}
                  <TableCell>Agent</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredHosts.map((h) => (
                  <TableRow key={h.server_id} hover>
                    <TableCell>
                      <b>{h.hostname}</b>
                    </TableCell>
                    <TableCell>{h.ip_address}</TableCell>
                    <TableCell>{h.environment}</TableCell>

                    {/* hostStatusColor is USED HERE */}
                    <TableCell>
                      <Chip label={h.status || 'Unknown'} size="small" color={hostStatusColor[h.status] || 'default'} />
                    </TableCell>

                    {/* Agent installed? */}
                    <TableCell>
                      <Chip
                        label={h.agent_installed ? 'Online' : 'Not Installed'}
                        color={h.agent_installed ? 'success' : 'warning'}
                        size="small"
                      />
                    </TableCell>

                    <TableCell align="right">
                      {!h.agent_installed ? (
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudDownloadIcon />}
                          onClick={() => setInstallModal({ open: true, host: h })}
                          sx={{ mr: 1 }}
                        >
                          Install Agent
                        </Button>
                      ) : (
                        <Button variant="contained" size="small" startIcon={<VisibilityIcon />} onClick={() => viewServices(h)}>
                          View Services
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {filteredHosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      🚫 No Hosts Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </MainCard>
      </Box>

      <RegisterHostModal open={openRegister} onClose={() => setOpenRegister(false)} onRegistered={(h) => setHosts([h, ...hosts])} />

      <InstallAgentModal open={installModal.open} host={installModal.host} onClose={() => setInstallModal({ open: false, host: null })} />
    </>
  );
}
