import { ReactNode, useState } from 'react';
import { 
  Menu, Bell, User, Search, Home, Server, Box, Wrench, FileText, 
  AlertTriangle, Lightbulb, Settings, TicketIcon, LogOut, Moon, Sun,
  LayoutGrid, BarChart3, BellRing, AlertCircle, Activity
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { NebulaLogo } from './NebulaLogo';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function Layout({ children, currentPage, onNavigate, onLogout }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, section: 'main' },
    { id: 'hosts', label: 'Hosts', icon: Server, section: 'infrastructure' },
    { id: 'applications', label: 'Applications', icon: Box, section: 'infrastructure' },
    { id: 'services', label: 'Services', icon: Wrench, section: 'infrastructure' },
    { id: 'logs', label: 'Logs', icon: FileText, section: 'monitoring' },
    { id: 'metrics', label: 'Metrics', icon: Activity, section: 'monitoring' },
    { id: 'incidents', label: 'Incidents', icon: AlertCircle, section: 'incident-management' },
    { id: 'anomalies', label: 'Anomalies', icon: AlertTriangle, section: 'investigation' },
    { id: 'tickets', label: 'Tickets', icon: TicketIcon, section: 'management' },
    { id: 'reports', label: 'Reports', icon: BarChart3, section: 'management' },
    { id: 'alert-settings', label: 'Alert Settings', icon: BellRing, section: 'settings' },
  ];

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'main': return null;
      case 'infrastructure': return 'INFRASTRUCTURE';
      case 'monitoring': return 'MONITORING';
      case 'incident-management': return 'INCIDENT MANAGEMENT';
      case 'investigation': return 'INVESTIGATION';
      case 'management': return 'MANAGEMENT';
      case 'settings': return 'SETTINGS';
      default: return null;
    }
  };

  const groupedNavItems = navItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navItems>);

  return (
    <div className="min-h-screen bg-nebula-navy-bg flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-nebula-navy-dark border-r border-nebula-navy-lighter transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-nebula-navy-lighter px-4">
          {sidebarCollapsed ? (
            <NebulaLogo size={40} />
          ) : (
            <div className="flex items-center gap-3">
              <NebulaLogo size={40} />
              <span className="text-xl font-bold bg-gradient-to-r from-nebula-cyan via-nebula-purple to-nebula-pink bg-clip-text text-transparent">
                Nebula
              </span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6">
          {Object.entries(groupedNavItems).map(([section, items]) => (
            <div key={section}>
              {getSectionTitle(section) && !sidebarCollapsed && (
                <div className="px-3 mb-2">
                  <span className="text-xs font-semibold text-slate-500 tracking-wider">
                    {getSectionTitle(section)}
                  </span>
                </div>
              )}
              <div className="space-y-1">
                {items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                        isActive
                          ? 'bg-nebula-purple text-white shadow-lg shadow-nebula-purple/20'
                          : 'text-slate-400 hover:text-white hover:bg-nebula-navy-lighter'
                      } ${sidebarCollapsed ? 'justify-center' : ''}`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className="size-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="text-sm font-medium">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Settings at bottom */}
        <div className="border-t border-nebula-navy-lighter p-3">
          <button
            onClick={() => onNavigate('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
              currentPage === 'settings'
                ? 'bg-nebula-purple text-white'
                : 'text-slate-400 hover:text-white hover:bg-nebula-navy-lighter'
            } ${sidebarCollapsed ? 'justify-center' : ''}`}
            title={sidebarCollapsed ? 'Settings' : undefined}
          >
            <Settings className="size-5 flex-shrink-0" />
            {!sidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-20 bg-nebula-navy-dark border-b border-nebula-navy-lighter px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-slate-400 hover:text-white hover:bg-nebula-navy-lighter"
            >
              <Menu className="size-5" />
            </Button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <LayoutGrid className="size-4 text-slate-500" />
              <span className="text-slate-500">Pages</span>
              <span className="text-slate-500">/</span>
              <span className="text-white capitalize">{currentPage === 'alert-settings' ? 'Alert Settings' : currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-10 bg-nebula-navy-light border-nebula-navy-lighter text-white placeholder:text-slate-500 h-10"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-nebula-navy-lighter relative"
            >
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-nebula-pink rounded-full"></span>
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-slate-400 hover:text-white hover:bg-nebula-navy-lighter"
            >
              <Moon className="size-5" />
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-400 hover:text-white hover:bg-nebula-navy-lighter"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-nebula-cyan to-nebula-purple flex items-center justify-center">
                    <User className="size-4 text-white" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="bg-nebula-navy-light border-nebula-navy-lighter text-white w-56"
              >
                <DropdownMenuLabel className="text-slate-400">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-nebula-navy-lighter" />
                <DropdownMenuItem 
                  onClick={() => onNavigate('profile')} 
                  className="cursor-pointer hover:bg-nebula-navy-lighter focus:bg-nebula-navy-lighter"
                >
                  <User className="size-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNavigate('settings')} 
                  className="cursor-pointer hover:bg-nebula-navy-lighter focus:bg-nebula-navy-lighter"
                >
                  <Settings className="size-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNavigate('alert-settings')} 
                  className="cursor-pointer hover:bg-nebula-navy-lighter focus:bg-nebula-navy-lighter"
                >
                  <BellRing className="size-4 mr-2" />
                  Alert Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-nebula-navy-lighter" />
                <DropdownMenuItem 
                  onClick={onLogout} 
                  className="cursor-pointer hover:bg-nebula-navy-lighter focus:bg-nebula-navy-lighter text-red-400"
                >
                  <LogOut className="size-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="h-12 bg-nebula-navy-dark border-t border-nebula-navy-lighter px-6 flex items-center justify-center">
          <p className="text-xs text-slate-500">©2026 Nebula. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
}