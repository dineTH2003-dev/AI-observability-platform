// assets
import { IconHelp, IconSandbox } from '@tabler/icons-react';

// constant
const icons = { IconSandbox, IconHelp };

// ==============================|| SERVICES MENU ITEMS ||============================== //

const applicationServices = {
  id: 'applicationServices',
  type: 'group',
  children: [
    {
      id: 'applicationServices',
      title: 'Services',
      type: 'item',
      url: '/application-services',
      icon: icons.IconSandbox,
      breadcrumbs: false
    }
  ]
};

export default applicationServices;
