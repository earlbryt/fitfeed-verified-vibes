
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { format, addDays } from 'date-fns';
import { Calendar, Award, Share2, Flag, MessageCircle, Zap } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Dummy data for UI demonstration
const mockChallenge = {
  id: '1',
  title: '30-Day Run Challenge',
  description: 'Let\'s see who can run the most in the next 30 days!',
  challenge_type: 'group',
  goal_value: 50,
  goal_unit: 'miles',
  start_date: new Date().toISOString(),
  end_date: addDays(new Date(), 30).toISOString(),
  duration_days: 30,
  creator_id: '123',
  status: 'active',
  winner_id: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  creator: {
    id: '123',
    username: 'runner_mike',
    full_name: 'Mike Johnson',
    avatar_url: null,
    bio: 'Running enthusiast',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  participant: {
    progress: 12,
    status: 'active',
    user_id: '456',
  },
  participants: [
    {
      id: '1',
      challenge_id: '1',
      user_id: '456',
      status: 'active',
      progress: 12,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: '456',
        username: 'current_user',
        full_name: 'Your Name',
        avatar_url: null,
        bio: 'Fitness lover',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
    {
      id: '2',
      challenge_id: '1',
      user_id: '789',
      status: 'active',
      progress: 18,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: '789',
        username: 'fitness_sarah',
        full_name: 'Sarah Smith',
        avatar_url: null,
        bio: 'Love outdoor activities',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    },
    {
      id: '3',
      challenge_id: '1',
      user_id: '321',
      status: 'active',
      progress: 7,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      profile: {
        id: '321',
        username: 'gym_alex',
        full_name: 'Alex Brown',
        avatar_url: null,
        bio: 'Gym enthusiast',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
  ]
};

const mockWorkouts = [
  {
    id: '1',
    user_id: '456',
    type: 'running',
    duration: 30,
    intensity: 'medium',
    image: null,
    caption: 'Morning run in the park',
    verified: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    hidden: false,
    profile: {
      id: '456',
      username: 'current_user',
      full_name: 'Your Name',
      avatar_url: null,
      bio: 'Fitness lover',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 3,
    comments_count: 1,
    flags_count: 0,
    user_has_liked: false,
  },
  {
    id: '2',
    user_id: '789',
    type: 'running',
    duration: 45,
    intensity: 'high',
    image: 'https://placehold.co/400x300',
    caption: 'Trail run with amazing views!',
    verified: true,
    created_at: addDays(new Date(), -1).toISOString(),
    updated_at: addDays(new Date(), -1).toISOString(),
    hidden: false,
    profile: {
      id: '789',
      username: 'fitness_sarah',
      full_name: 'Sarah Smith',
      avatar_url: null,
      bio: 'Love outdoor activities',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    likes_count: 5,
    comments_count: 2,
    flags_count: 0,
    user_has_liked: true,
  }
];

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('overview');
  const challenge = mockChallenge; // In real app, fetch based on ID

  // Sort participants by progress for leaderboard
  const leaderboard = [...challenge.participants || []].sort((a, b) => b.progress - a.progress);
  
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  // Calculate progress percentage
  const progressPercentage = challenge.participant?.progress 
    ? Math.min(100, (challenge.participant.progress / challenge.goal_value) * 100)
    : 0;

  const handleShare = () => {
    // In a real app, implement social sharing
    alert('Challenge share feature would open here');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">{challenge.title}</h1>
        <Button variant="ghost" size="icon" onClick={handleShare}>
          <Share2 className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex-1 p-4 pb-20">
        <div className="space-y-6">
          {/* Challenge Info Card */}
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between">
                <div>
                  <Badge variant={challenge.challenge_type === 'group' ? 'default' : 'outline'}>
                    {challenge.challenge_type === 'group' ? 'Group Challenge' : 'One-on-One'}
                  </Badge>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>
                      {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                    </span>
                  </div>
                </div>
                <div className="flex items-start">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={challenge.creator?.avatar_url || undefined} />
                    <AvatarFallback>{challenge.creator?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <div className="text-xs font-medium">{challenge.creator?.username}</div>
                    <div className="text-xs text-muted-foreground">Creator</div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pb-3">
              <div className="flex justify-between mb-2">
                <div className="text-sm">Goal: {challenge.goal_value} {challenge.goal_unit}</div>
                <div className="text-sm font-medium">
                  {challenge.participant?.progress || 0}/{challenge.goal_value} {challenge.goal_unit}
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              
              {challenge.description && (
                <div className="mt-4 text-sm text-muted-foreground">
                  {challenge.description}
                </div>
              )}
            </CardContent>
            
            <CardFooter>
              <div className="w-full flex gap-2">
                <Button variant="outline" className="flex-1">
                  <MessageCircle className="h-4 w-4 mr-2" /> Chat
                </Button>
                <Button className="flex-1">
                  <Zap className="h-4 w-4 mr-2" /> Log Workout
                </Button>
              </div>
            </CardFooter>
          </Card>
          
          {/* Tabs for different sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="workouts">Workouts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Challenge Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Participants ({leaderboard.length})</h3>
                      <div className="flex flex-wrap gap-2">
                        {leaderboard.map((participant) => (
                          <div key={participant.id} className="flex flex-col items-center">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={participant.profile?.avatar_url || undefined} />
                              <AvatarFallback>{participant.profile?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium mt-1">{participant.profile?.username}</span>
                            <span className="text-xs text-muted-foreground">{participant.progress} {challenge.goal_unit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Your Progress</h3>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium">{challenge.participant?.progress || 0} {challenge.goal_unit}</span>
                          <span className="text-sm text-muted-foreground">Goal: {challenge.goal_value} {challenge.goal_unit}</span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                        
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-xs">
                            <div>{Math.round(progressPercentage)}% complete</div>
                            <div className="text-muted-foreground">{challenge.duration_days - Math.floor((Date.now() - new Date(challenge.start_date).getTime()) / (1000 * 60 * 60 * 24))} days left</div>
                          </div>
                          <Button size="sm">Log Workout</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="leaderboard" className="pt-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Leaderboard</CardTitle>
                  <Award className="h-5 w-5 text-primary" />
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Rank</TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead className="text-right">Progress</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leaderboard.map((participant, index) => (
                        <TableRow key={participant.id} className={participant.user_id === '456' ? "bg-muted/50" : ""}>
                          <TableCell className="font-medium">
                            {index === 0 ? (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-yellow-500 text-white text-xs">1</div>
                            ) : index === 1 ? (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-400 text-white text-xs">2</div>
                            ) : index === 2 ? (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-amber-700 text-white text-xs">3</div>
                            ) : (
                              <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-muted-foreground text-xs">{index + 1}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={participant.profile?.avatar_url || undefined} />
                                <AvatarFallback>{participant.profile?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{participant.profile?.username}</span>
                              {participant.user_id === '456' && <span className="text-xs text-muted-foreground">(You)</span>}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center">
                              <span className="font-medium">{participant.progress}</span>
                              <span className="text-xs text-muted-foreground ml-1">{challenge.goal_unit}</span>
                            </div>
                            <div className="w-20 mt-1">
                              <Progress 
                                value={Math.min(100, (participant.progress / challenge.goal_value) * 100)} 
                                className="h-1" 
                              />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="workouts" className="pt-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Challenge Workouts</h3>
                <Button size="sm">
                  Log Workout
                </Button>
              </div>
              
              {mockWorkouts.map(workout => (
                <div key={workout.id} className="mb-4">
                  <WorkoutCard workout={workout} showActions={true} />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default ChallengeDetails;
