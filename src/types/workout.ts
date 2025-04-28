
export interface Workout {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  type: string;
  duration: number;
  intensity: string;
  image?: string;
  caption: string;
  timestamp: string;
  likes: number;
  comments: number;
  verified: boolean;
}
