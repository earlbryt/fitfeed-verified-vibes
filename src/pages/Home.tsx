
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutCard from '@/components/workout/WorkoutCard';
import QuickActions from '@/components/home/QuickActions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { format, subDays } from 'date-fns';
import { Calendar, Trophy, TrendingUp } from 'lucide-react';
import { Workout } from '@/types/supabase';

// Mock data for UI presentation
const recentWorkouts: Workout[] = [
  {
    id: '1',
    user_id: '123',
    type: 'running',
    duration: 45,
    intensity: 'medium',
    image: null,
    caption: 'Morning run in the park. Great weather today!',
    verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hidden: false,
    profile: {
      id: '123',
      username: 'jogger123',
      full_name: 'John Smith',
      avatar_url: null,
      bio: 'Running enthusiast',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 12,
    comments_count: 3,
    flags_count: 0,
    user_has_liked: true,
  },
  {
    id: '2',
    user_id: '456',
    type: 'yoga',
    duration: 30,
    intensity: 'low',
    image: 'https://placehold.co/400x300',
    caption: 'Relaxing yoga session after work.',
    verified: true,
    created_at: subDays(new Date(), 1).toISOString(),
    updated_at: subDays(new Date(), 1).toISOString(),
    hidden: false,
    profile: {
      id: '456',
      username: 'yoga_girl',
      full_name: 'Emily Jones',
      avatar_url: null,
      bio: 'Yoga instructor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 18,
    comments_count: 5,
    flags_count: 0,
    user_has_liked: false,
  },
];

const activeChallenge = {
  id: '1',
  title: '30-Day Run Challenge',
  goalValue: 50,
  goalUnit: 'miles',
  startDate: format(subDays(new Date(), 5), 'MMM d'),
  endDate: format(subDays(new Date(), 5 - 30), 'MMM d'),
  daysLeft: 25,
  progress: 12,
  participants: 8,
};

const Home = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <div className="p-4">
        {/* Welcome Card */}
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-1">Hi, Fitness Lover!</h1>
                <p className="text-muted-foreground">
                  {format(new Date(), 'EEEE, MMMM d')}
                </p>
              </div>
              <Avatar className="h-12 w-12">
                <AvatarFallback>FL</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs flex items-center">
                  <Calendar className="h-3 w-3 mr-1" /> This Week
                </span>
                <span className="text-2xl font-bold">4</span>
                <span className="text-sm">Workouts</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col">
                <span className="text-muted-foreground text-xs flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" /> Current
                </span>
                <span className="text-2xl font-bold">8</span>
                <span className="text-sm">Day Streak</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Active Challenge */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Active Challenge</h2>
            <Link to="/challenges" className="text-sm text-primary">
              View all
            </Link>
          </div>
          
          <Card className="border-primary/20">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-amber-500" />
                    {activeChallenge.title}
                  </CardTitle>
                  <CardDescription>
                    {activeChallenge.startDate} - {activeChallenge.endDate}
                  </CardDescription>
                </div>
                <Badge>
                  {activeChallenge.daysLeft} days left
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex justify-between mb-1">
                <span className="text-sm">
                  Goal: {activeChallenge.goalValue} {activeChallenge.goalUnit}
                </span>
                <span className="text-sm font-medium">
                  {activeChallenge.progress}/{activeChallenge.goalValue}
                </span>
              </div>
              <Progress value={(activeChallenge.progress / activeChallenge.goalValue) * 100} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>{activeChallenge.participants} participants</span>
                <span className="text-primary">
                  Rank #3
                </span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to={`/challenges/${activeChallenge.id}`}>
                  View Challenge
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Quick Actions */}
        <QuickActions />

        {/* Recent Activity */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Recent Activity</h2>
          </div>
          
          {recentWorkouts.map((workout) => (
            <div key={workout.id} className="mb-4">
              <WorkoutCard workout={workout} showActions />
            </div>
          ))}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Home;
