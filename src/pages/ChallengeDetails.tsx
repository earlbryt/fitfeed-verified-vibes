
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, parseISO, differenceInDays } from 'date-fns';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Trophy, 
  Users, 
  ArrowLeft,
  Award,
  Clock,
  Target,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Challenge, ChallengeParticipant, ChallengeWorkout } from '@/types/supabase';

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  
  // Get challenge details with participants
  const { data: challengeData, isLoading, error } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      if (!id) throw new Error('No challenge ID provided');
      
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .select(`
          *,
          creator:creator_id (
            id,
            username,
            avatar_url
          ),
          participants:challenge_participants(
            id,
            user_id,
            status,
            progress,
            profile:user_id (
              id, 
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (challengeError) throw challengeError;
      
      // Get all workouts associated with this challenge
      const { data: workouts, error: workoutsError } = await supabase
        .from('challenge_workouts')
        .select(`
          id,
          contribution_value,
          created_at,
          workout:workout_id (
            id,
            type,
            duration,
            intensity,
            created_at,
            image,
            profile:user_id (
              id,
              username,
              avatar_url
            )
          )
        `)
        .eq('challenge_id', id)
        .order('created_at', { ascending: false });
        
      if (workoutsError) throw workoutsError;
      
      // Create a properly typed object with all challenge data including workouts
      const typedChallenge: Challenge = {
        ...challenge as Challenge,
        workouts: workouts as unknown as ChallengeWorkout[],
        creator: challenge.creator ? {
          id: challenge.creator.id,
          username: challenge.creator.username || '',
          avatar_url: challenge.creator.avatar_url,
          full_name: null,
          bio: null,
          created_at: '',
          updated_at: ''
        } : undefined,
        participants: challenge.participants 
          ? challenge.participants.map(p => ({
              ...p,
              profile: p.profile ? {
                id: p.profile.id,
                username: p.profile.username || '',
                full_name: p.profile.full_name || '',
                avatar_url: p.profile.avatar_url,
                bio: null,
                created_at: '',
                updated_at: ''
              } : undefined
            }))
          : []
      };
      
      return typedChallenge;
    },
    enabled: !!id
  });
  
  // Determine user's role in the challenge
  const userIsParticipant = !!challengeData?.participants?.find(
    p => p.user_id === user?.id && p.status === 'accepted'
  );
  
  const userIsCreator = challengeData?.creator_id === user?.id;
  
  // Sort participants by progress
  const sortedParticipants = challengeData?.participants
    ?.filter(p => p.status === 'accepted')
    .sort((a, b) => b.progress - a.progress) || [];
  
  // Format functions
  const formatDate = (date: string | null) => {
    if (!date) return 'Not set';
    return format(parseISO(date), 'MMMM d, yyyy');
  };
  
  // Calculate days remaining
  const getDaysRemaining = () => {
    if (!challengeData?.end_date) return 'No end date set';
    const now = new Date();
    const endDate = parseISO(challengeData.end_date);
    const days = differenceInDays(endDate, now);
    return days > 0 ? `${days} days remaining` : 'Challenge ended';
  };
  
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse">
          <div className="h-8 w-3/4 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full bg-gray-200 rounded mb-4"></div>
          <div className="h-20 w-full bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }
  
  if (error || !challengeData) {
    return (
      <div className="flex flex-col items-center justify-center p-6">
        <AlertTriangle className="text-red-500 h-12 w-12 mb-4" />
        <h1 className="text-xl font-bold text-center">
          Error loading challenge
        </h1>
        <p className="text-gray-500 text-center mt-2">
          Could not load the challenge details
        </p>
        <Button
          onClick={() => navigate('/challenges')}
          variant="outline"
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Challenges
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-16">
      <div className="flex items-center bg-white p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/challenges')}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold ml-2">Challenge Details</h1>
      </div>
      
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{challengeData.title}</h2>
          
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="bg-gray-100 text-gray-800">
              {challengeData.challenge_type === 'one-on-one' ? 'One-on-One' : 'Group Challenge'}
            </Badge>
            <Badge variant={challengeData.status === 'active' ? 'default' : 'secondary'}>
              {challengeData.status?.charAt(0).toUpperCase() + challengeData.status?.slice(1)}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center text-gray-600">
              <Target className="h-4 w-4 mr-1" />
              <span>
                Goal: {challengeData.goal_value} {challengeData.goal_unit}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {challengeData.duration_days} days
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                Start: {formatDate(challengeData.start_date)}
              </span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>
                {getDaysRemaining()}
              </span>
            </div>
          </div>
          
          {challengeData.status === 'completed' && challengeData.winner_id && (
            <div className="border rounded-lg p-4 mb-4 bg-amber-50">
              <div className="flex items-center">
                <Trophy className="h-6 w-6 text-amber-500 mr-2" />
                <h3 className="font-bold text-lg">Winner!</h3>
              </div>
              
              <div className="flex items-center mt-3">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={(sortedParticipants.find(p => p.user_id === challengeData.winner_id)?.profile?.avatar_url) || ''} />
                  <AvatarFallback>
                    {(sortedParticipants.find(p => p.user_id === challengeData.winner_id)?.profile?.username?.charAt(0) || 'W').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {sortedParticipants.find(p => p.user_id === challengeData.winner_id)?.profile?.username || 'User'}
                  </div>
                  <div className="text-sm text-gray-500">
                    Completed with {sortedParticipants.find(p => p.user_id === challengeData.winner_id)?.progress || 0} {challengeData.goal_unit}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card className="mb-4">
            <div className="p-4 border-b">
              <h3 className="font-medium flex items-center">
                <Users className="h-4 w-4 mr-1" />
                Participants Progress
              </h3>
            </div>
            
            <div className="p-4 space-y-4">
              {sortedParticipants.length > 0 ? (
                sortedParticipants.map((participant) => (
                  <div key={participant.id} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={participant.profile?.avatar_url || ''} />
                          <AvatarFallback>
                            {(participant.profile?.username?.charAt(0) || 'U').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {participant.profile?.username || 'User'}
                        </span>
                      </div>
                      <span className="text-sm">
                        {participant.progress} / {challengeData.goal_value}
                      </span>
                    </div>
                    <Progress 
                      value={(participant.progress / challengeData.goal_value) * 100} 
                      className="h-2"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-3 text-gray-500">
                  No participants yet
                </div>
              )}
            </div>
          </Card>

          {/* Challenge creator info */}
          <div className="flex items-center mb-6">
            <div className="text-sm text-gray-500">Created by</div>
            <Avatar className="h-6 w-6 ml-2">
              <AvatarImage src={challengeData.creator?.avatar_url || ''} />
              <AvatarFallback>
                {(challengeData.creator?.username?.charAt(0) || 'C').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm ml-1">
              {challengeData.creator?.username || 'Unknown'}
            </div>
          </div>
          
          {userIsParticipant && challengeData.status === 'active' && (
            <div className="mt-4">
              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => setShowLeaveConfirm(true)}
              >
                Leave Challenge
              </Button>
              
              {showLeaveConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                    <h3 className="font-bold text-lg mb-2">Leave Challenge?</h3>
                    <p className="text-gray-600 mb-4">
                      Are you sure you want to leave this challenge? Your progress will be lost.
                    </p>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => setShowLeaveConfirm(false)}
                      >
                        Cancel
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="flex-1"
                        onClick={() => {
                          // Handle leave challenge logic
                          toast.error('Feature not implemented yet');
                          setShowLeaveConfirm(false);
                        }}
                      >
                        Leave
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Recent activities section */}
        <div>
          <h3 className="font-bold text-lg mb-3">Recent Activities</h3>
          
          {challengeData.workouts && challengeData.workouts.length > 0 ? (
            <div className="space-y-3">
              {challengeData.workouts.slice(0, 5).map((contri) => (
                <div key={contri.id} className="border rounded-md p-3 flex justify-between">
                  <div className="flex items-center">
                    <Avatar className="w-6 h-6 mr-2">
                      <AvatarImage src={contri.workout?.profile?.avatar_url || ''} />
                      <AvatarFallback className="text-xs">
                        {contri.workout?.profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {contri.workout?.profile?.username || 'User'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contri.workout?.type} workout, {formatDate(contri.created_at)}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    +{contri.contribution_value} {challengeData.goal_unit}
                  </div>
                </div>
              ))}
              
              {challengeData.workouts.length > 5 && (
                <div className="text-center text-sm text-gray-500">
                  + {challengeData.workouts.length - 5} more contributions
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border rounded-lg">
              No activities yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
