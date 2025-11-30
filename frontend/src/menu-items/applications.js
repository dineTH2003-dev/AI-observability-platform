// assets
import { IconApps, IconHelp } from '@tabler/icons-react';

// constant
const icons = { IconApps, IconHelp };

// ==============================|| APPLICATIONS MENU ITEMS ||============================== //

const applications = {
  id: 'applications',
  type: 'group',
  children: [
    {
      id: 'applications',
      title: 'Applications',
      type: 'item',
      url: '/applications',
      icon: icons.IconApps,
      breadcrumbs: false
    }
  ]
};

export default applications;
