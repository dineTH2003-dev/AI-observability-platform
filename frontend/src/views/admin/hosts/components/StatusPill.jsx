import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, HelpCircle } from 'lucide-react';

const STATUS_CONFIG = {
  healthy: {
    label: 'Healthy',
    icon: CheckCircle,
    className: 'border-green-400 bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 dark:border-green-600'
  },
  warning: {
    label: 'Warning',
    icon: AlertTriangle,
    className: 'border-amber-400 bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-600'
  },
  critical: {
    label: 'Critical',
    icon: XCircle,
    className: 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
  },

  running: {
    label: 'Running',
    icon: CheckCircle,
    className: 'border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-600'
  },
  stopped: {
    label: 'Stopped',
    icon: XCircle,
    className: 'border-red-400 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 dark:border-red-600'
  },

  unknown: {
    label: 'Unknown',
    icon: HelpCircle,
    className: 'border-gray-300 bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600'
  }
};

export default function StatusPill({ status }) {
  const key = (status || 'unknown').toLowerCase();
  const cfg = STATUS_CONFIG[key] || STATUS_CONFIG.unknown;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${cfg.className}`}>
      <Icon className="h-3.5 w-3.5" />
      <span>{cfg.label}</span>
    </span>
  );
}
