import { useState } from 'react';
import { FileText, Search, Filter, Download, AlertCircle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  service: string;
  host: string;
  message: string;
}

export function LogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [advancedMode, setAdvancedMode] = useState(true);

  const logs: LogEntry[] = [
    {
      id: 1,
      timestamp: '2025-01-16 21:12:43',
      level: 'error',
      service: 'snmp-agent',
      host: 'server-01',
      message: 'SNMP trap (SNMPv2-MIB::coldStart) reported from 10.89.0.19',
    },
    {
      id: 2,
      timestamp: '2025-01-16 21:12:41',
      level: 'warning',
      service: 'snmp-agent',
      host: 'server-02',
      message: 'SNMP trap (CISCO-SMI::ciscoMgmt) reported from 10.69.0.3',
    },
    {
      id: 3,
      timestamp: '2025-01-16 21:12:39',
      level: 'info',
      service: 'kube-controller',
      host: 'master-01',
      message: 'ClusterRoleBinding system:controller:token-cleaner updated',
    },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.host.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'info':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Logs and events</h1>
        <p className="text-slate-400 text-sm mt-1">Explore your log data and Kubernetes events. Switch to advanced mode for deeper analysis.</p>
      </div>

      {/* Advanced Mode Toggle */}
      <div className="flex items-center gap-2">
        <input 
          type="checkbox" 
          id="advanced-mode"
          checked={advancedMode}
          onChange={(e) => setAdvancedMode(e.target.checked)}
          className="w-4 h-4 rounded bg-nebula-purple border-nebula-purple"
        />
        <label htmlFor="advanced-mode" className="text-sm text-white font-medium">
          Advanced mode
        </label>
      </div>

      {/* Search */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by message, service, host, level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-nebula-navy-dark border-nebula-navy-lighter text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Execution Info */}
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span>Execution time: 1s</span>
        <span>Scanned data: 6.44 GB</span>
      </div>

      {/* Action Tabs */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="text-white hover:bg-nebula-navy-lighter text-sm">
          Open with...
        </Button>
        <Button variant="ghost" className="text-white hover:bg-nebula-navy-lighter text-sm">
          Create processing rule
        </Button>
        <Button variant="ghost" className="text-white hover:bg-nebula-navy-lighter text-sm">
          Create metric
        </Button>
        <Button variant="ghost" className="text-white hover:bg-nebula-navy-lighter text-sm">
          Format table
        </Button>
        <Button variant="ghost" className="text-white hover:bg-nebula-navy-lighter text-sm">
          Actions
        </Button>
      </div>

      {/* Logs Table */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-nebula-navy-dark border-b border-nebula-navy-lighter">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Host
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-nebula-navy-lighter">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <FileText className="size-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No logs found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr 
                      key={log.id} 
                      className="hover:bg-nebula-navy-dark transition-colors cursor-pointer"
                      onClick={() => setSelectedLog(log)}
                    >
                      <td className="px-6 py-4 text-slate-300 text-sm">{log.timestamp}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded text-xs font-medium uppercase ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white text-sm">{log.service}</td>
                      <td className="px-6 py-4 text-slate-300 text-sm">{log.host}</td>
                      <td className="px-6 py-4 text-white text-sm">
                        {log.message}
                        <button className="ml-2 text-blue-400 hover:text-blue-300 text-xs">
                          Click to view details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-slate-500 text-sm">
        ©2026 Nebula. All Rights Reserved.
      </div>

      {/* Log Details Side Panel */}
      {selectedLog && (
        <div className="fixed top-0 right-0 h-full w-96 bg-nebula-navy-light border-l border-nebula-navy-lighter shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Log Details</h2>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Timestamp</p>
                <p className="text-sm text-white">{selectedLog.timestamp}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Level</p>
                <span className={`inline-block px-3 py-1 rounded text-xs font-medium uppercase ${getLevelColor(selectedLog.level)}`}>
                  {selectedLog.level}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Service</p>
                <p className="text-sm text-white">{selectedLog.service}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Host</p>
                <p className="text-sm text-white">{selectedLog.host}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Message</p>
                <p className="text-sm text-white">{selectedLog.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}