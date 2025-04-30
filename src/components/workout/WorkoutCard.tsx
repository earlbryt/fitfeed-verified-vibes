import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Workout } from '@/types/supabase';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CommentDialog from './CommentDialog';

interface WorkoutCardProps {
  workout: Workout;
  onWorkoutUpdate?: () => void;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onWorkoutUpdate }) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(workout.user_has_liked || false);
  const [likeCount, setLikeCount] = useState(workout.likes_count || 0);
  const [commentCount, setCommentCount] = useState(workout.comments_count || 0);
  const [isFlagged, setIsFlagged] = useState(workout.user_has_flagged || false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);

  const handleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like workouts');
      return;
    }

    try {
      // Optimistically update UI first for immediate feedback
      const wasLiked = isLiked;
      const newLikeCount = wasLiked ? Math.max(0, likeCount - 1) : likeCount + 1;
      
      // Update local state immediately for responsive UI
      setIsLiked(!wasLiked);
      setLikeCount(newLikeCount);
      
      // Then perform the actual database operation
      if (wasLiked) {
        // Unlike the workout
        const { error } = await supabase
          .from('likes')
          .delete()
          .match({ user_id: user.id, workout_id: workout.id });

        if (error) {
          // Revert UI changes if the operation failed
          setIsLiked(wasLiked);
          setLikeCount(likeCount);
          throw error;
        }
        
        // Only toast on success, after the API call completes
        toast.success('Workout unliked', { duration: 1500 });
      } else {
        // Like the workout
        const { error } = await supabase
          .from('likes')
          .insert({ user_id: user.id, workout_id: workout.id });

        if (error) {
          // Revert UI changes if the operation failed
          setIsLiked(wasLiked);
          setLikeCount(likeCount);
          throw error;
        }
        
        // Only toast on success, after the API call completes
        toast.success('Workout liked!', { duration: 1500 });
      }

      // Only call onWorkoutUpdate when we need to sync data with the parent
      // For example, when changing views or on component unmount
      // Remove this for immediate actions to avoid refreshing
      // if (onWorkoutUpdate) onWorkoutUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Error updating like');
    }
  };

  const handleFlag = async () => {
    if (!user) {
      toast.error('Please sign in to flag workouts');
      return;
    }

    try {
      // Optimistically update UI first
      const wasFlagged = isFlagged;
      
      // Update local state immediately
      setIsFlagged(!wasFlagged);
      
      // Then perform the actual database operation
      if (wasFlagged) {
        // Remove flag
        const { error } = await supabase
          .from('flags')
          .delete()
          .match({ user_id: user.id, workout_id: workout.id });

        if (error) {
          // Revert UI changes if operation failed
          setIsFlagged(wasFlagged);
          throw error;
        }
        
        toast.success('Flag removed', { duration: 1500 });
      } else {
        // Flag the workout
        const { error } = await supabase
          .from('flags')
          .insert({ user_id: user.id, workout_id: workout.id });

        if (error) {
          // Revert UI changes if operation failed
          setIsFlagged(wasFlagged);
          throw error;
        }
        
        toast('Workout flagged for review', {
          description: 'An admin will review this workout soon',
          duration: 3000,
          action: {
            label: 'Undo',
            onClick: () => handleFlag()
          }
        });
      }

      // Don't refresh the entire page
      // if (onWorkoutUpdate) onWorkoutUpdate();
    } catch (error: any) {
      toast.error(error.message || 'Error updating flag');
    }
  };

  const handleCommentAdded = () => {
    setCommentCount(prev => prev + 1);
    if (onWorkoutUpdate) onWorkoutUpdate();
  };

  return (
    <Card className="mb-6 overflow-hidden animate-fade-in">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border border-fit-primary">
            <img 
              src={workout.profile?.avatar_url || 'https://api.dicebear.com/6.x/avataaars/svg'} 
              alt={workout.profile?.username || 'User'} 
            />
          </Avatar>
          <div>
            <p className="font-medium text-sm">{workout.profile?.full_name || workout.profile?.username || 'User'}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(workout.created_at).toLocaleString()}
            </p>
          </div>
          {workout.verified && (
            <div className="ml-auto">
              <span className="verified-badge animate-pulse-badge">
                <Badge variant="outline" className="bg-fit-light text-fit-primary border-fit-primary">
                  Verified
                </Badge>
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      {workout.image && (
        <div className="relative aspect-square">
          <img 
            src={workout.image} 
            alt={`${workout.type} workout`} 
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      <CardContent className="pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart size={20} className={`${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'} hover:text-red-500`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setCommentDialogOpen(true)}>
              <MessageCircle size={20} className="text-gray-600" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleFlag}>
            <Flag size={20} className={`${isFlagged ? 'text-amber-500' : 'text-gray-600'}`} />
          </Button>
        </div>
        <div>
          <p className="text-sm font-semibold">{likeCount} likes</p>
          <div className="mt-1">
            <p className="text-sm">
              <span className="font-semibold">{workout.profile?.username || 'User'}</span>{' '}
              <span>{workout.caption}</span>
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.type}
            </Badge>
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.duration} min
            </Badge>
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.intensity}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2">
        <button 
          className="text-xs text-muted-foreground"
          onClick={() => setCommentDialogOpen(true)}
        >
          {commentCount > 0 
            ? `View all ${commentCount} comments` 
            : 'Be the first to comment'}
        </button>
      </CardFooter>

      <CommentDialog 
        workoutId={workout.id}
        open={commentDialogOpen}
        onOpenChange={setCommentDialogOpen}
        onCommentAdded={handleCommentAdded}
      />
    </Card>
  );
};

export default WorkoutCard;
