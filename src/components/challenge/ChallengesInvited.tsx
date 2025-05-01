
import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Challenge } from '@/types/supabase';
import { Check, X } from 'lucide-react';
import ChallengeCard from './ChallengeCard';

const ChallengesInvited = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: invitations, isLoading, error } = useQuery({
    queryKey: ['challenges', 'invited'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data: participants, error: participantsError } = await supabase
        .from('challenge_participants')
        .select(`
          id,
          challenge_id,
          user_id,
          status,
          progress,
          challenges:challenge_id (
            id,
            creator_id,
            title,
            goal_value,
            goal_unit,
            duration_days,
            start_date,
            end_date,
            challenge_type,
            status,
            winner_id,
            created_at,
            updated_at,
            profiles:creator_id (
              id,
              username,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'invited');
        
      if (participantsError) throw participantsError;
      
      return participants.map(p => ({
        participant: {
          id: p.id,
          user_id: p.user_id,
          status: p.status,
          progress: p.progress,
        },
        challenge: {
          ...p.challenges,
          creator: p.challenges.profiles ? {
            id: p.challenges.profiles.id,
            username: p.challenges.profiles.username || '',
            full_name: p.challenges.profiles.full_name || '',
            avatar_url: p.challenges.profiles.avatar_url,
            bio: null,
            created_at: '',
            updated_at: ''
          } : undefined
        } as Challenge
      })) || [];
    },
    enabled: !!user
  });
  
  const responseMutation = useMutation({
    mutationFn: async ({ 
      participantId, 
      status 
    }: { 
      participantId: string; 
      status: 'accepted' | 'declined';
    }) => {
      const { error } = await supabase
        .from('challenge_participants')
        .update({ status })
        .eq('id', participantId);
        
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      const status = variables.status;
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
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-40 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        Error loading invitations
      </div>
    );
  }
  
  if (!invitations || invitations.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No pending invitations
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {invitations.map(({ challenge, participant }) => (
        <div key={participant.id} className="border rounded-lg overflow-hidden">
          <ChallengeCard challenge={challenge} userStatus="invited" />
          <div className="flex border-t">
            <Button
              variant="ghost"
              className="flex-1 rounded-none text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={() => responseMutation.mutate({ 
                participantId: participant.id, 
                status: 'accepted' 
              })}
            >
              <Check size={18} className="mr-1" />
              Accept
            </Button>
            <div className="border-r"></div>
            <Button
              variant="ghost"
              className="flex-1 rounded-none text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={() => responseMutation.mutate({ 
                participantId: participant.id, 
                status: 'declined' 
              })}
            >
              <X size={18} className="mr-1" />
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChallengesInvited;
