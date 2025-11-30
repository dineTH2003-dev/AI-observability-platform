// assets
import { IconHelp, IconServer } from '@tabler/icons-react';

// constant
const icons = { IconServer, IconHelp };

// ==============================|| HOSTS MENU ITEMS ||============================== //

const hosts = {
  id: 'hosts',
  type: 'group',
  children: [
    {
      id: 'hosts',
      title: 'Hosts',
      type: 'item',
      url: '/hosts',
      icon: icons.IconServer,
      breadcrumbs: false
    }
  ]
};

export default hosts;
