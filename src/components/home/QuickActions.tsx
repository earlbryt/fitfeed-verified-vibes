
import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Calendar, PlusCircle, MessageSquare, Bell, Award, Trophy } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      title: "Log Workout",
      description: "Track your exercise",
      icon: <PlusCircle className="h-6 w-6 text-primary" />,
      link: "/log-workout",
      color: "bg-primary/10",
    },
    {
      title: "Challenges",
      description: "Join competitions",
      icon: <Trophy className="h-6 w-6 text-amber-500" />,
      link: "/challenges",
      color: "bg-amber-100",
    },
    {
      title: "Leaderboard",
      description: "View rankings",
      icon: <BarChart className="h-6 w-6 text-blue-500" />,
      link: "/leaderboard",
      color: "bg-blue-100",
    },
    {
      title: "Set Reminders",
      description: "Stay consistent",
      icon: <Bell className="h-6 w-6 text-red-500" />,
      link: "/reminders",
      color: "bg-red-100",
    },
    {
      title: "Tips & Tricks",
      description: "Get fitness advice",
      icon: <MessageSquare className="h-6 w-6 text-green-500" />,
      link: "/tips",
      color: "bg-green-100",
    },
    {
      title: "My History",
      description: "Past workouts",
      icon: <Calendar className="h-6 w-6 text-violet-500" />,
      link: "/profile",
      color: "bg-violet-100",
    },
  ];

  return (
    <div className="my-6">
      <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <Link key={index} to={action.link}>
            <div className="flex items-start p-4 rounded-lg border hover:border-primary/40 hover:shadow-sm transition-all">
              <div className={`${action.color} p-2 rounded-lg mr-3`}>
                {action.icon}
              </div>
              <div>
                <div className="font-medium">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
