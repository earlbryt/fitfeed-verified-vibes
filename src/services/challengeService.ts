
import { supabase } from "@/integrations/supabase/client";
import { Challenge, ChallengeParticipant } from "@/types/supabase";

// Fetch challenges where the user is invited
export const fetchInvitedChallenges = async (): Promise<Challenge[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      challenge_id,
      status,
      challenges:challenge_id(
        id, 
        title, 
        description, 
        challenge_type,
        goal_value,
        goal_unit,
        start_date,
        end_date,
        status,
        creator:creator_id(
          id,
          username,
          avatar_url
        )
      )
    `)
    .eq('user_id', user.user.id)
    .eq('status', 'invited');

  if (error) {
    console.error("Error fetching invited challenges:", error);
    throw error;
  }

  if (!data) return [];
  
  // Map the nested data to the Challenge interface
  return data.map((item: any) => ({
    ...item.challenges,
  }));
};

// Fetch challenges where the user is a participant (active)
export const fetchActiveChallenges = async (): Promise<Challenge[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      challenge_id,
      status,
      progress,
      challenges:challenge_id(
        id, 
        title, 
        description, 
        challenge_type,
        goal_value,
        goal_unit,
        start_date,
        end_date,
        status,
        creator:creator_id(
          id,
          username,
          avatar_url
        )
      )
    `)
    .eq('user_id', user.user.id)
    .eq('status', 'accepted')
    .eq('challenges.status', 'active');

  if (error) {
    console.error("Error fetching active challenges:", error);
    throw error;
  }

  if (!data) return [];
  
  // Map the nested data to the Challenge interface
  return data.map((item: any) => ({
    ...item.challenges,
    participant: {
      progress: item.progress,
      status: item.status
    }
  }));
};

// Fetch completed challenges where the user participated
export const fetchCompletedChallenges = async (): Promise<Challenge[]> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");

  const { data, error } = await supabase
    .from('challenge_participants')
    .select(`
      challenge_id,
      status,
      progress,
      challenges:challenge_id(
        id, 
        title, 
        description, 
        challenge_type,
        goal_value,
        goal_unit,
        start_date,
        end_date,
        status,
        winner_id,
        creator:creator_id(
          id,
          username,
          avatar_url
        )
      )
    `)
    .eq('user_id', user.user.id)
    .eq('challenges.status', 'completed');

  if (error) {
    console.error("Error fetching completed challenges:", error);
    throw error;
  }

  if (!data) return [];
  
  // Map the nested data to the Challenge interface
  return data.map((item: any) => ({
    ...item.challenges,
    participant: {
      progress: item.progress,
      status: item.status
    }
  }));
};

// Accept a challenge invitation
export const acceptChallengeInvitation = async (challengeId: string): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");
  
  const { error } = await supabase
    .from('challenge_participants')
    .update({ status: 'accepted' })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id);

  if (error) {
    console.error("Error accepting challenge:", error);
    throw error;
  }
};

// Decline a challenge invitation
export const declineChallengeInvitation = async (challengeId: string): Promise<void> => {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("User not authenticated");
  
  const { error } = await supabase
    .from('challenge_participants')
    .update({ status: 'declined' })
    .eq('challenge_id', challengeId)
    .eq('user_id', user.user.id);

  if (error) {
    console.error("Error declining challenge:", error);
    throw error;
  }
};
