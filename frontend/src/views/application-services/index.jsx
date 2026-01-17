import { useEffect, useState } from 'react'; // 🔥 FIXED
import { Box, Table, TableHead, TableRow, TableCell, TableBody, Chip, Button, Paper } from '@mui/material';

import MainCard from 'ui-component/cards/MainCard';
import AssignApplicationModal from './AssignApplicationModal';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

export default function ApplicationServices() {
  const [services, setServices] = useState([]);
  const [assignModal, setAssignModal] = useState({ open: false, service: null });

  const load = async () => {
    try {
      const res = await fetch('/api/services');
      setServices(await res.json());
    } catch (e) {
      console.error('Failed loading services:', e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Box sx={{ mt: 2 }}>
        <MainCard title="All Discovered Services">
          <Paper sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Service Name</b>
                  </TableCell>
                  <TableCell>
                    <b>Tech</b>
                  </TableCell>
                  <TableCell>
                    <b>Server</b>
                  </TableCell>
                  <TableCell>
                    <b>Status</b>
                  </TableCell>
                  <TableCell>
                    <b>CPU %</b>
                  </TableCell>
                  <TableCell>
                    <b>Memory MB</b>
                  </TableCell>
                  <TableCell>
                    <b>Assigned App</b>
                  </TableCell>
                  <TableCell>
                    <b>Actions</b>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {services.map((svc) => (
                  <TableRow key={svc.service_id} hover>
                    <TableCell>{svc.name}</TableCell>
                    <TableCell>{svc.technology}</TableCell>
                    <TableCell>{svc.hostname}</TableCell>

                    <TableCell>
                      <Chip label={svc.status} size="small" color={svc.status === 'running' ? 'success' : 'error'} />
                    </TableCell>

                    <TableCell>{svc.cpu_usage}</TableCell>
                    <TableCell>{svc.memory_usage}</TableCell>

                    <TableCell>
                      {svc.app_id ? (
                        <Chip label="Mapped" size="small" color="success" />
                      ) : (
                        <Chip label="Unassigned" size="small" color="warning" />
                      )}
                    </TableCell>

                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<LocalOfferIcon />}
                        onClick={() => setAssignModal({ open: true, service: svc })}
                      >
                        Assign App
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </MainCard>
      </Box>

      {/* Assign Modal */}
      {assignModal.open && (
        <AssignApplicationModal
          open={assignModal.open}
          service={assignModal.service}
          onClose={(refresh) => {
            setAssignModal({ open: false, service: null });
            if (refresh) load();
          }}
        />
      )}
    </>
  );
}
