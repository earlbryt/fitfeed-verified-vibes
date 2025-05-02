
export type Profile = {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type Workout = {
  id: string;
  user_id: string;
  type: string;
  duration: number;
  intensity: string;
  image: string | null;
  caption: string | null;
  verified: boolean;
  created_at: string;
  updated_at: string;
  hidden: boolean;
  profile?: Profile;
  likes_count: number;
  comments_count: number;
  flags_count: number;
  user_has_liked?: boolean;
  user_has_flagged?: boolean;
};

export type Like = {
  id: string;
  user_id: string;
  workout_id: string;
  created_at: string;
};

export type Comment = {
  id: string;
  user_id: string;
  workout_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profile?: Profile;
};

export type Flag = {
  id: string;
  user_id: string;
  workout_id: string;
  reason: string | null;
  created_at: string;
};

export type Challenge = {
  id: string;
  creator_id: string;
  title: string;
  goal_value: number;
  goal_unit: string;
  duration_days: number;
  start_date: string | null;
  end_date: string | null;
  challenge_type: 'one-on-one' | 'group';
  status: 'pending' | 'active' | 'completed';
  winner_id: string | null;
  created_at: string;
  updated_at: string;
  creator?: Profile;
  participants?: ChallengeParticipant[];
};

export type ChallengeParticipant = {
  id: string;
  challenge_id: string;
  user_id: string;
  status: 'invited' | 'accepted' | 'declined';
  progress: number;
  created_at: string;
  updated_at: string;
  profile?: Profile;
};

export type ChallengeWorkout = {
  id: string;
  challenge_id: string;
  workout_id: string;
  user_id: string;
  contribution_value: number;
  created_at: string;
  workout?: Workout;
};

export type Notification = {
  id: string;
  user_id: string;
  type: string;
  content: any;
  read: boolean;
  created_at: string;
};
