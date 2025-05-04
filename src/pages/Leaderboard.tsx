
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award, Calendar, Medal, Star, TrendingUp } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { cn } from '@/lib/utils';

// Mock data for UI demo
const mockUsers = [
  {
    id: '1',
    username: 'fitness_sarah',
    fullName: 'Sarah Johnson',
    avatar: null,
    workoutsCount: 28,
    challengesWon: 3,
    streak: 12,
  },
  {
    id: '2',
    username: 'runner_mike',
    fullName: 'Mike Peterson',
    avatar: null,
    workoutsCount: 34,
    challengesWon: 2,
    streak: 16,
  },
  {
    id: '3',
    username: 'yoga_jen',
    fullName: 'Jennifer Lee',
    avatar: null,
    workoutsCount: 26,
    challengesWon: 4,
    streak: 21,
  },
  {
    id: '4', // Current user for demo
    username: 'current_user',
    fullName: 'Your Name',
    avatar: null,
    workoutsCount: 19,
    challengesWon: 1,
    streak: 8,
  },
  {
    id: '5',
    username: 'gym_alex',
    fullName: 'Alex Rodriguez',
    avatar: null,
    workoutsCount: 22,
    challengesWon: 2,
    streak: 5,
  },
  {
    id: '6',
    username: 'cycling_emma',
    fullName: 'Emma Wilson',
    avatar: null,
    workoutsCount: 18,
    challengesWon: 1,
    streak: 4,
  },
  {
    id: '7',
    username: 'strength_coach',
    fullName: 'Chris Taylor',
    avatar: null,
    workoutsCount: 24,
    challengesWon: 3,
    streak: 14,
  },
];

// Weekly progress for Rising Stars
const weeklyProgress = [
  { userId: '6', improvementPercentage: 85 },
  { userId: '4', improvementPercentage: 65 },
  { userId: '5', improvementPercentage: 50 },
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('workouts');
  
  // Sort users based on the active tab criteria
  const sortedUsers = [...mockUsers].sort((a, b) => {
    if (activeTab === 'workouts') {
      return b.workoutsCount - a.workoutsCount;
    } else if (activeTab === 'challenges') {
      return b.challengesWon - a.challengesWon;
    } else {
      return b.streak - a.streak;
    }
  });

  // Find current user's rank in sortedUsers
  const currentUserRank = sortedUsers.findIndex(user => user.id === '4') + 1;
  
  // Find rising stars (users with most progress)
  const risingStar = mockUsers.find(user => 
    user.id === weeklyProgress.sort((a, b) => b.improvementPercentage - a.improvementPercentage)[0].userId
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Leaderboard</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        {/* Top Three Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Award className="h-5 w-5 text-primary" />
              <span>Top Performers</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-around items-end pt-4 pb-2">
              {/* Second Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-gray-400">
                  <AvatarImage src={sortedUsers[1]?.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {sortedUsers[1]?.username?.[0].toUpperCase() || '2'}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-1 flex flex-col items-center">
                  <Badge variant="outline" className="bg-gray-400 text-white border-0">2<sup>nd</sup></Badge>
                  <span className="text-sm font-medium mt-1">{sortedUsers[1]?.username}</span>
                  <div className="text-xs text-muted-foreground">
                    {activeTab === 'workouts' 
                      ? `${sortedUsers[1]?.workoutsCount} workouts` 
                      : activeTab === 'challenges' 
                      ? `${sortedUsers[1]?.challengesWon} wins`
                      : `${sortedUsers[1]?.streak} day streak`}
                  </div>
                </div>
              </div>
              
              {/* First Place */}
              <div className="flex flex-col items-center -mt-6">
                <div className="relative">
                  <Avatar className="h-20 w-20 border-2 border-yellow-500 ring-4 ring-yellow-200">
                    <AvatarImage src={sortedUsers[0]?.avatar || undefined} />
                    <AvatarFallback className="text-xl">
                      {sortedUsers[0]?.username?.[0].toUpperCase() || '1'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -top-1 -right-1 p-1 bg-yellow-500 rounded-full">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div className="mt-1 flex flex-col items-center">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600 border-0">1<sup>st</sup></Badge>
                  <span className="text-sm font-semibold mt-1">{sortedUsers[0]?.username}</span>
                  <div className="text-xs">
                    {activeTab === 'workouts' 
                      ? `${sortedUsers[0]?.workoutsCount} workouts` 
                      : activeTab === 'challenges' 
                      ? `${sortedUsers[0]?.challengesWon} wins`
                      : `${sortedUsers[0]?.streak} day streak`}
                  </div>
                </div>
              </div>
              
              {/* Third Place */}
              <div className="flex flex-col items-center">
                <Avatar className="h-16 w-16 border-2 border-amber-700">
                  <AvatarImage src={sortedUsers[2]?.avatar || undefined} />
                  <AvatarFallback className="text-lg">
                    {sortedUsers[2]?.username?.[0].toUpperCase() || '3'}
                  </AvatarFallback>
                </Avatar>
                <div className="mt-1 flex flex-col items-center">
                  <Badge variant="outline" className="bg-amber-700 text-white border-0">3<sup>rd</sup></Badge>
                  <span className="text-sm font-medium mt-1">{sortedUsers[2]?.username}</span>
                  <div className="text-xs text-muted-foreground">
                    {activeTab === 'workouts' 
                      ? `${sortedUsers[2]?.workoutsCount} workouts` 
                      : activeTab === 'challenges' 
                      ? `${sortedUsers[2]?.challengesWon} wins`
                      : `${sortedUsers[2]?.streak} day streak`}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rising Star */}
        <Card className="mb-6 border-green-200 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-green-700">
              <TrendingUp className="h-5 w-5" />
              <span>Rising Star</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 ring-2 ring-green-200">
                <AvatarImage src={risingStar?.avatar || undefined} />
                <AvatarFallback>{risingStar?.username?.[0].toUpperCase() || 'R'}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{risingStar?.username}</div>
                <div className="text-xs text-muted-foreground">Most improved this week</div>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-3 w-3 fill-green-500 text-green-500" />
                  <span className="text-xs text-green-700">
                    {weeklyProgress[0].improvementPercentage}% improvement
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Your Rank */}
        <Card className="mb-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {currentUserRank}
                </div>
                <div>
                  <div className="font-medium">Your Ranking</div>
                  <div className="text-xs text-muted-foreground">
                    {activeTab === 'workouts' 
                      ? `${sortedUsers.find(u => u.id === '4')?.workoutsCount} workouts` 
                      : activeTab === 'challenges' 
                      ? `${sortedUsers.find(u => u.id === '4')?.challengesWon} challenge wins`
                      : `${sortedUsers.find(u => u.id === '4')?.streak} day streak`}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="border-primary/30">
                {activeTab === 'workouts' 
                  ? 'Top 30%' 
                  : activeTab === 'challenges' 
                  ? 'Top 40%'
                  : 'Top 25%'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Leaderboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workouts" className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Workouts</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-1">
              <Award className="h-4 w-4" />
              <span>Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex items-center gap-1">
              <Medal className="h-4 w-4" />
              <span>Streaks</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  {sortedUsers.map((user, index) => (
                    <div 
                      key={user.id}
                      className={cn(
                        "flex items-center justify-between py-2 px-3 rounded-lg",
                        user.id === '4' ? "bg-primary/10 border border-primary/20" : (index % 2 === 0 ? "bg-muted/30" : "")
                      )}
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-muted text-xs font-medium mr-3">
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback>{user.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {user.username}
                            {user.id === '4' && <span className="text-xs text-muted-foreground ml-2">(You)</span>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        {index < 3 && (
                          <div className={cn(
                            "mr-2 p-0.5 rounded-full",
                            index === 0 ? "bg-yellow-500" : 
                            index === 1 ? "bg-gray-400" : "bg-amber-700"
                          )}>
                            <Award className="h-4 w-4 text-white" />
                          </div>
                        )}
                        
                        <div className="text-right">
                          <div className="text-sm font-semibold">
                            {activeTab === 'workouts' 
                              ? user.workoutsCount 
                              : activeTab === 'challenges' 
                              ? user.challengesWon
                              : user.streak}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {activeTab === 'workouts' 
                              ? 'workouts' 
                              : activeTab === 'challenges' 
                              ? 'wins'
                              : 'day streak'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Leaderboard;
