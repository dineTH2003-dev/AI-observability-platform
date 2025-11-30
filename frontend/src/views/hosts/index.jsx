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

import SearchIcon from '@mui/icons-material/Search';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import MainCard from 'ui-component/cards/MainCard';
import RegisterHostModal from './RegisterHostModal';

const statusColor = {
  Healthy: 'success',
  Warning: 'warning',
  Critical: 'error',
  Unknown: 'default'
};

export default function Hosts() {
  const [openRegister, setOpenRegister] = useState(false);
  const [hosts, setHosts] = useState([]);
  const [search, setSearch] = useState('');
  const [envFilter, setEnvFilter] = useState('All');

  const sampleHosts = [
    {
      server_id: 1,
      hostname: 'prod-app-01',
      ip_address: '10.10.1.21',
      username: 'ubuntu',
      environment: 'Production',
      status: 'Healthy',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    },
    {
      server_id: 2,
      hostname: 'prod-db-01',
      ip_address: '10.10.1.10',
      username: 'ubuntu',
      environment: 'Production',
      status: 'Warning',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    },
    {
      server_id: 3,
      hostname: 'prod-cache-01',
      ip_address: '10.10.1.31',
      username: 'ubuntu',
      environment: 'Production',
      status: 'Critical',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    },
    {
      server_id: 4,
      hostname: 'staging-app-01',
      ip_address: '10.20.2.11',
      username: 'ubuntu',
      environment: 'Staging',
      status: 'Healthy',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    },
    {
      server_id: 5,
      hostname: 'dev-app-01',
      ip_address: '10.30.3.14',
      username: 'ubuntu',
      environment: 'Dev',
      status: 'Healthy',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    },
    {
      server_id: 6,
      hostname: 'dev-utils-01',
      ip_address: '10.30.3.22',
      username: 'ubuntu',
      environment: 'Dev',
      status: 'Warning',
      ssh_port: 22,
      created_at: '2025-02-12T14:22:33Z'
    }
  ];

  // Load sample data directly
  useEffect(() => {
    setHosts(sampleHosts);
  }, []);

  const filteredHosts = hosts.filter((h) => {
    const matchesSearch =
      !search || h.hostname.toLowerCase().includes(search.toLowerCase()) || h.ip_address.toLowerCase().includes(search.toLowerCase());

    const matchesEnv = envFilter === 'All' || h.environment === envFilter;
    return matchesSearch && matchesEnv;
  });

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
          <Box sx={{ mt: 2, mb: 2 }}>
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

          <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Host Name</TableCell>
                  <TableCell>IP Address</TableCell>
                  <TableCell>Environment</TableCell>
                  <TableCell>SSH User</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>SSH Port</TableCell>
                  <TableCell>Created At</TableCell>
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
                      <Chip label={h.status || 'Unknown'} size="small" color={statusColor[h.status || 'Unknown']} />
                    </TableCell>
                    <TableCell>{h.ssh_port}</TableCell>
                    <TableCell>{h.created_at ? new Date(h.created_at).toLocaleString() : '-'}</TableCell>
                  </TableRow>
                ))}
                {filteredHosts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <Typography align="center" color="text.secondary">
                        No hosts registered yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Paper>
        </MainCard>
      </Box>

      <RegisterHostModal
        open={openRegister}
        onClose={() => setOpenRegister(false)}
        onRegistered={(newHost) => setHosts((prev) => [newHost, ...prev])}
      />
    </>
  );
}
