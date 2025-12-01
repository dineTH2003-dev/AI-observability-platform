import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import { withAlpha } from 'utils/colorUtils';

// assets
import { IconBrandTelegram, IconMailbox } from '@tabler/icons-react';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: withAlpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList() {
  const containerSX = { gap: 2, pl: 7 };

  return (
    <List sx={{ width: '100%', maxWidth: { xs: 300, md: 330 }, py: 0 }}>
      <ListItemWrapper>
        <ListItem
          alignItems="center"
          disablePadding
          secondaryAction={
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
              <Typography variant="caption">2 min ago</Typography>
            </Stack>
          }
        >
          <ListItemAvatar>
            <Avatar
              sx={{
                color: 'primary.dark',
                bgcolor: 'primary.light'
              }}
            >
              <IconMailbox stroke={1.5} size="20px" />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={<Typography variant="subtitle1">Check Your Mail.</Typography>} />
        </ListItem>
        <Stack sx={containerSX}>
          <Typography variant="subtitle2">All done! Now check your inbox as you&apos;re in for a sweet treat!</Typography>
          <Button variant="contained" endIcon={<IconBrandTelegram stroke={1.5} size={20} />} sx={{ width: 'min-content' }}>
            Mail
          </Button>
        </Stack>
      </ListItemWrapper>
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
