
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Target, Trophy, Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

const ChallengeDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: challenge, isLoading, error } = useQuery({
    queryKey: ['challenge', id],
    queryFn: async () => {
      if (!id || !user) return null;
      
      // Get challenge details
      const { data: challengeData, error: challengeError } = await supabase
        .from('challenges')
        .select(`
          *,
          creator:creator_id (
            id,
            username,
            full_name,
            avatar_url
          ),
          winner:winner_id (
            id,
            username,
            full_name,
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
      
      // Get the user's own participation status
      const userParticipation = challengeData.participants.find(
        (p: any) => p.user_id === user.id
      );
      
      return {
        ...challengeData,
        userParticipation
      };
    },
    enabled: !!id && !!user
  });
  
  const { data: challengeWorkouts } = useQuery({
    queryKey: ['challenge-workouts', id],
    queryFn: async () => {
      if (!id) return [];
      
      const { data, error: workoutsError } = await supabase
        .from('challenge_workouts')
        .select(`
          *,
          workout:workout_id (
            id,
            type,
            duration,
            intensity,
            created_at,
            profile:user_id (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('challenge_id', id)
        .order('created_at', { ascending: false });
        
      if (workoutsError) throw workoutsError;
      return data;
    },
    enabled: !!id
  });
  
  const responseInviteMutation = useMutation({
    mutationFn: async ({ 
      status 
    }: { 
      status: 'accepted' | 'declined';
    }) => {
      if (!challenge?.userParticipation) return;
      
      const { error } = await supabase
        .from('challenge_participants')
        .update({ status })
        .eq('id', challenge.userParticipation.id);
        
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      const status = variables.status;
      queryClient.invalidateQueries({ queryKey: ['challenge', id] });
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      toast.success(`Challenge ${status === 'accepted' ? 'accepted' : 'declined'}`);
    },
    onError: (error) => {
      toast.error('Failed to respond to invitation', { 
        description: error.message
      });
    }
  });
  
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse bg-gray-200 h-8 w-3/4 mb-4 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-24 rounded"></div>
        <div className="animate-pulse bg-gray-200 h-40 rounded"></div>
      </div>
    );
  }
  
  if (error || !challenge) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500 mb-4">Failed to load challenge details</p>
        <Button onClick={() => navigate('/challenges')}>Go Back</Button>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return format(parseISO(dateString), 'MMM d, yyyy');
  };
  
  const getStatusBadge = () => {
    if (challenge.status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    } else if (challenge.status === 'active') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
    }
  };
  
  const sortedParticipants = [...challenge.participants]
    .filter((p: any) => p.status === 'accepted')
    .sort((a: any, b: any) => b.progress - a.progress);
  
  return (
    <div className="pb-16">
      <div className="flex items-center p-4 border-b">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate('/challenges')}
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-xl font-bold mx-auto pr-10">Challenge Details</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold">{challenge.title}</h2>
          {getStatusBadge()}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-md p-3 flex flex-col items-center">
            <Target size={20} className="text-gray-600 mb-1" />
            <div className="text-sm text-gray-600">Goal</div>
            <div className="font-medium">
              {challenge.goal_value} {challenge.goal_unit}
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center">
            <Calendar size={20} className="text-gray-600 mb-1" />
            <div className="text-sm text-gray-600">Duration</div>
            <div className="font-medium">
              {challenge.duration_days} days
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center">
            <Users size={20} className="text-gray-600 mb-1" />
            <div className="text-sm text-gray-600">Type</div>
            <div className="font-medium capitalize">
              {challenge.challenge_type.replace('-', ' ')}
            </div>
          </div>
          
          <div className="border rounded-md p-3 flex flex-col items-center">
            <Trophy size={20} className="text-gray-600 mb-1" />
            <div className="text-sm text-gray-600">Created by</div>
            <div className="font-medium truncate w-full text-center">
              {challenge.creator?.username || 'User'}
            </div>
          </div>
        </div>
        
        {challenge.userParticipation?.status === 'invited' && (
          <div className="border rounded-md p-4 bg-yellow-50">
            <p className="text-center mb-3">You've been invited to join this challenge!</p>
            <div className="flex justify-center space-x-2">
              <Button 
                onClick={() => responseInviteMutation.mutate({ status: 'accepted' })}
                className="bg-green-500 hover:bg-green-600"
              >
                Accept
              </Button>
              <Button 
                variant="outline"
                onClick={() => responseInviteMutation.mutate({ status: 'declined' })}
              >
                Decline
              </Button>
            </div>
          </div>
        )}
        
        {/* Dates */}
        <div className="flex justify-between text-sm text-gray-600">
          <div>
            <span className="font-medium">Started:</span> {formatDate(challenge.start_date)}
          </div>
          <div>
            <span className="font-medium">Ends:</span> {formatDate(challenge.end_date)}
          </div>
        </div>
        
        {/* Participants progress */}
        <div className="space-y-1">
          <h3 className="font-medium mb-2">Participants Progress</h3>
          
          {sortedParticipants.length > 0 ? (
            <div className="space-y-4">
              {sortedParticipants.map((participant: any, index: number) => (
                <div key={participant.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {index === 0 && challenge.status === 'completed' && (
                        <Trophy size={16} className="text-amber-500" />
                      )}
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={participant.profile?.avatar_url || ''} />
                        <AvatarFallback className="text-xs">
                          {participant.profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-sm font-medium">
                        {participant.profile?.username || 'User'} 
                        {participant.user_id === user?.id && ' (You)'}
                      </div>
                    </div>
                    <div className="text-sm font-medium">
                      {participant.progress} / {challenge.goal_value}
                    </div>
                  </div>
                  <Progress 
                    value={challenge.goal_value > 0 ? (participant.progress / challenge.goal_value) * 100 : 0} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2 text-gray-500 text-sm">
              No participants yet
            </div>
          )}
        </div>
        
        {/* Recent contributions */}
        <div>
          <h3 className="font-medium mb-3">Recent Contributions</h3>
          
          {challengeWorkouts && challengeWorkouts.length > 0 ? (
            <div className="space-y-3">
              {challengeWorkouts.slice(0, 5).map((contri: any) => (
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
                    +{contri.contribution_value} {challenge.goal_unit}
                  </div>
                </div>
              ))}
              
              {challengeWorkouts.length > 5 && (
                <div className="text-center text-sm text-gray-500">
                  + {challengeWorkouts.length - 5} more contributions
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">
              No workout contributions yet
            </div>
          )}
        </div>
        
        {/* Winner */}
        {challenge.status === 'completed' && challenge.winner_id && (
          <div className="border-t border-b py-4 my-4">
            <div className="text-center">
              <Trophy size={32} className="text-amber-500 mx-auto mb-2" />
              <h3 className="font-bold">Winner</h3>
              <div className="flex justify-center items-center mt-2">
                <Avatar className="mr-2">
                  <AvatarImage src={challenge.winner?.avatar_url || ''} />
                  <AvatarFallback>
                    {challenge.winner?.username?.substring(0, 2).toUpperCase() || 'W'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-medium">{challenge.winner?.username || 'User'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChallengeDetails;
