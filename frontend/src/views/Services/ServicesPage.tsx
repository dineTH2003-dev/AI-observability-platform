import { useState } from 'react';
import { Wrench, Search, Activity, CheckCircle, AlertCircle, XCircle, ToggleLeft, ToggleRight, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

export function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'user-api',
      technology: 'Java',
      instances: 8,
      health: 'warning',
      version: 'v3.2.1',
      anomalyDetectionActive: true,
    },
    {
      id: 2,
      name: 'payment-processor',
      technology: 'Node.js',
      instances: 5,
      health: 'critical',
      version: 'v2.5.0',
      anomalyDetectionActive: false,
    },
  ]);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.version.includes(searchQuery)
  );

  const toggleAnomalyDetection = (serviceId: number) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, anomalyDetectionActive: !service.anomalyDetectionActive }
        : service
    ));
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'healthy':
        return <CheckCircle className="size-4 text-green-400" />;
      case 'warning':
        return <AlertCircle className="size-4 text-yellow-400" />;
      case 'critical':
        return <XCircle className="size-4 text-red-400" />;
      default:
        return <Activity className="size-4 text-slate-400" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy':
        return 'bg-green-500/10 text-green-400';
      case 'warning':
        return 'bg-yellow-500/10 text-yellow-400';
      case 'critical':
        return 'bg-red-500/10 text-red-400';
      default:
        return 'bg-slate-500/10 text-slate-400';
    }
  };

  const getTechnologyColor = (tech: string) => {
    const colors: Record<string, string> = {
      'Java': 'bg-orange-500/10 text-orange-400',
      'Node.js': 'bg-green-500/10 text-green-400',
      'Go': 'bg-cyan-500/10 text-cyan-400',
      'Python': 'bg-blue-500/10 text-blue-400',
    };
    return colors[tech] || 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Services</h1>
        <p className="text-slate-400 text-sm mt-1">Monitor microservices health and performance metrics</p>
      </div>

      {/* Search */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search by service name, technology, version..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-nebula-navy-dark border-nebula-navy-lighter text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-nebula-navy-lighter">
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Technology
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Version
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Health
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Instances
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Anomaly Detection
                  </th>
                  <th className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <Wrench className="size-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No services found.</p>
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((service, index) => (
                    <tr
                      key={service.id}
                      className={`border-b border-nebula-navy-lighter hover:bg-nebula-navy-dark transition-colors ${
                        index === filteredServices.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-nebula-cyan/10 flex items-center justify-center flex-shrink-0">
                            <Wrench className="size-5 text-nebula-cyan" />
                          </div>
                          <span className="text-white font-medium">{service.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getTechnologyColor(service.technology)}`}>
                          {service.technology}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-slate-300 text-sm">{service.version}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getHealthIcon(service.health)}
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getHealthColor(service.health)}`}>
                            {service.health}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-medium">{service.instances}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleAnomalyDetection(service.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              service.anomalyDetectionActive ? 'bg-green-500' : 'bg-slate-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                service.anomalyDetectionActive ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                          <span className={`text-sm ${service.anomalyDetectionActive ? 'text-green-400' : 'text-slate-500'}`}>
                            {service.anomalyDetectionActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-nebula-blue hover:text-nebula-purple hover:bg-nebula-navy-lighter"
                        >
                          <ExternalLink className="size-4 mr-1" />
                          Details
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}