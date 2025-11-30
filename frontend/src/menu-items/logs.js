// assets
import { IconBook, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconBook, IconHelp };

// ==============================|| LOGS MENU ITEMS ||============================== //

const logs = {
  id: 'logs',
  type: 'group',
  children: [
    {
      id: 'logs',
      title: 'Logs',
      type: 'item',
      url: '/logs',
      icon: icons.IconBook,
      breadcrumbs: false
    }
  ]
};

export default logs;
