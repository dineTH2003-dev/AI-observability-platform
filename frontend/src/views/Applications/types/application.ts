export type ApplicationStatus =
  | 'running'
  | 'warning'
  | 'stopped'
  | 'healthy'
  | 'critical';

export interface Application {
  id: number;
  name: string;
  description?: string;
  version?: string;
  server_id: string;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}
