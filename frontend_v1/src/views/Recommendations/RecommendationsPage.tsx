import { useState } from 'react';
import { Lightbulb, Search, TrendingUp, Zap, DollarSign, Shield } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

export function RecommendationsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const recommendations = [
    {
      id: 1,
      category: 'Performance',
      icon: Zap,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/10',
      title: 'Optimize Database Query for User Service',
      description: 'Detected inefficient query pattern in getUsersByFilter(). Consider adding composite index on (status, created_at) columns.',
      impact: 'high',
      savings: '~45% reduction in query time',
      priority: 'critical',
    },
    {
      id: 2,
      category: 'Cost',
      icon: DollarSign,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/10',
      title: 'Reduce Over-Provisioned Resources',
      description: 'Instance prod-web-03 is consistently using <30% CPU and memory. Consider downsizing to save costs.',
      impact: 'medium',
      savings: '~$180/month',
      priority: 'medium',
    },
    {
      id: 3,
      category: 'Security',
      icon: Shield,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10',
      title: 'Update Authentication Service Dependencies',
      description: 'Critical security patch available for auth-service dependencies. Update recommended within 7 days.',
      impact: 'high',
      savings: 'Prevent security vulnerabilities',
      priority: 'high',
    },
    {
      id: 4,
      category: 'Performance',
      icon: TrendingUp,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/10',
      title: 'Enable Response Caching for API Gateway',
      description: '78% of API requests are cacheable. Implementing Redis cache layer could significantly improve response times.',
      impact: 'high',
      savings: '~65% faster response time',
      priority: 'medium',
    },
  ];

  const filteredRecommendations = recommendations.filter(rec =>
    rec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rec.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'low':
        return 'text-slate-400';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">AI Recommendations</h1>
        <p className="text-slate-400 text-sm mt-1">Intelligent insights to optimize your infrastructure</p>
      </div>

      {/* Search */}
      <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input
              placeholder="Search recommendations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-nebula-navy-dark border-nebula-navy-lighter text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Recommendations List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <Card className="bg-nebula-navy-light border-nebula-navy-lighter">
            <CardContent className="p-12 text-center">
              <Lightbulb className="size-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">No recommendations found.</p>
            </CardContent>
          </Card>
        ) : (
          filteredRecommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <Card 
                key={rec.id} 
                className="bg-nebula-navy-light border-nebula-navy-lighter hover:border-nebula-purple/30 transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${rec.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`size-6 ${rec.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                          {rec.priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-purple-500/10 text-purple-400">
                          {rec.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
                      <p className="text-slate-400 mb-4">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-xs text-slate-500">Expected Impact</p>
                          <p className={`text-sm font-medium ${getImpactColor(rec.impact)}`}>
                            {rec.savings}
                          </p>
                        </div>
                        <Button className="bg-gradient-to-r from-nebula-purple to-nebula-blue hover:from-nebula-purple-dark hover:to-nebula-blue text-white">
                          Apply Recommendation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
