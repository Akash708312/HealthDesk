
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { format, parseISO, isToday, isYesterday } from 'date-fns';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  date: string;
  status?: string;
}

interface RecentActivityProps {
  activities: ActivityItem[];
  loading?: boolean;
}

const RecentActivity = ({ activities = [], loading = false }: RecentActivityProps) => {
  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      if (isToday(date)) return `Today, ${format(date, 'h:mm a')}`;
      if (isYesterday(date)) return `Yesterday, ${format(date, 'h:mm a')}`;
      return format(date, 'MMM d, yyyy');
    } catch (e) {
      return dateString;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'health_record':
        return <div className="w-2 h-2 rounded-full bg-green-500"></div>;
      case 'appointment':
        return <div className="w-2 h-2 rounded-full bg-blue-500"></div>;
      case 'medication':
        return <div className="w-2 h-2 rounded-full bg-purple-500"></div>;
      default:
        return <div className="w-2 h-2 rounded-full bg-gray-500"></div>;
    }
  };

  const getStatusBadge = (status: string | undefined) => {
    if (!status) return null;
    
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'missed':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-3 items-center">
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>No recent activities to display</p>
            <p className="text-sm text-gray-400 mt-1">
              Your health activities will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{activity.description}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
