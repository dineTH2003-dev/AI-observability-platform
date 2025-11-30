import dashboard from './dashboard';
import auth from './auth';
import applications from './applications';
import hosts from './hosts';
import applicationServices from './application-services';
import logs from './logs';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, applications, hosts, applicationServices, logs, auth]
};

export default menuItems;
