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
