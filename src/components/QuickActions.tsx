
import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from './ui/card';
import { 
  Utensils, 
  Hospital, 
  Heart, 
  Calendar,
  Users,
  MessagesSquare 
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Diet Planner',
      description: 'Create meal plans',
      icon: <Utensils className="h-5 w-5 text-green-600" />,
      bgColor: 'bg-green-100',
      link: '/diet-planner'
    },
    {
      title: 'Find Hospitals',
      description: 'Locate healthcare nearby',
      icon: <Hospital className="h-5 w-5 text-blue-600" />,
      bgColor: 'bg-blue-100',
      link: '/recommend-hospital'
    },
    {
      title: 'Health Tips',
      description: 'Preventive care advice',
      icon: <Heart className="h-5 w-5 text-purple-600" />,
      bgColor: 'bg-purple-100',
      link: '/preventive-healthcare'
    },
    {
      title: 'Medication Tracker',
      description: 'Track your medications',
      icon: <Calendar className="h-5 w-5 text-orange-600" />,
      bgColor: 'bg-orange-100',
      link: '/expiry-tracker'
    },
    {
      title: 'Community',
      description: 'Connect with doctors',
      icon: <Users className="h-5 w-5 text-indigo-600" />,
      bgColor: 'bg-indigo-100',
      link: '/community'
    },
    {
      title: 'Health AI',
      description: 'AI health assistant',
      icon: <MessagesSquare className="h-5 w-5 text-teal-600" />,
      bgColor: 'bg-teal-100',
      link: '/healthdesk-ai'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <Link to={action.link} key={index}>
          <Card className="p-4 hover:bg-gray-50 transition-colors cursor-pointer h-full">
            <div className="flex items-center space-x-3">
              <div className={`${action.bgColor} p-2 rounded-lg`}>
                {action.icon}
              </div>
              <div>
                <h3 className="font-medium">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default QuickActions;
