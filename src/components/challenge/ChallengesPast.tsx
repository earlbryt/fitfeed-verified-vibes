
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Challenge } from '@/types/supabase';
import ChallengeCard from './ChallengeCard';

const ChallengesPast = () => {
  const { user } = useAuth();
  
  const { data: pastUserChallenges, isLoading, error } = useQuery({
    queryKey: ['challenges', 'past'],
    queryFn: async () => {
      if (!user) return [];
      
      // Get all challenges where the user is an accepted participant and challenge is completed
      const { data: userChallenges, error: challengesError } = await supabase
        .from('challenge_participants')
        .select(`
          id,
          challenge_id,
          status,
          progress,
          user_id,
          challenges:challenge_id (
            id,
            title,
            goal_value,
            goal_unit,
            duration_days,
            start_date,
            end_date,
            challenge_type,
            status,
            winner_id,
            creator_id
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'accepted')
        .eq('challenges.status', 'completed');
        
      if (challengesError) throw challengesError;
      
      // Format the data
      return userChallenges.map(uc => ({
        participant: {
          id: uc.id,
          user_id: uc.user_id,
          status: uc.status,
          progress: uc.progress,
        },
        challenge: uc.challenges
      }));
    },
    enabled: !!user
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
        Error loading past challenges
      </div>
    );
  }
  
  if (!pastUserChallenges || pastUserChallenges.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No completed challenges
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {pastUserChallenges.map(({ challenge, participant }) => (
        <div key={participant.id}>
          <ChallengeCard 
            challenge={challenge as Challenge}
            userProgress={participant.progress}
          />
        </div>
      ))}
    </div>
  );
};

export default ChallengesPast;
