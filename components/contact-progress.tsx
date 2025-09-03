import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarContent, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, AlertCircle, Calendar, Mail } from 'lucide-react';

interface Job {
  id: number;
  title: string;
  contacted: number;
  scheduled: number;
}

interface ContactProgressProps {
  job: Job;
}

const contactActivities = [
  {
    id: 1,
    candidate: 'Alice Johnson',
    avatar: 'AJ',
    action: 'Initial contact sent',
    status: 'Responded',
    timestamp: '2 hours ago',
    statusColor: 'bg-green-100 text-green-700',
    icon: Mail,
  },
  {
    id: 2,
    candidate: 'Bob Chen',
    avatar: 'BC',
    action: 'Follow-up message',
    status: 'Pending',
    timestamp: '4 hours ago',
    statusColor: 'bg-orange-100 text-orange-700',
    icon: Clock,
  },
  {
    id: 3,
    candidate: 'Carol Smith',
    avatar: 'CS',
    action: 'Interview scheduled',
    status: 'Confirmed',
    timestamp: '1 day ago',
    statusColor: 'bg-blue-100 text-blue-700',
    icon: Calendar,
  },
  {
    id: 4,
    candidate: 'David Wilson',
    avatar: 'DW',
    action: 'Initial contact sent',
    status: 'No response',
    timestamp: '3 days ago',
    statusColor: 'bg-slate-100 text-slate-700',
    icon: AlertCircle,
  },
];

export function ContactProgress({ job }: ContactProgressProps) {
  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Contacted</p>
                <p className="text-xl font-bold text-slate-900">{job.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Responded</p>
                <p className="text-xl font-bold text-slate-900">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Scheduled</p>
                <p className="text-xl font-bold text-slate-900">{job.scheduled}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contact Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contactActivities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900">{activity.candidate}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <activity.icon className="w-3 h-3 text-slate-500" />
                      <span className="text-sm text-slate-600">{activity.action}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <Badge className={activity.statusColor}>
                      {activity.status}
                    </Badge>
                    <p className="text-xs text-slate-500 mt-1">{activity.timestamp}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}