import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Comment } from '@/types/supabase';
import { toast } from 'sonner';

interface CommentDialogProps {
  workoutId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCommentAdded: () => void;
}

const CommentDialog: React.FC<CommentDialogProps> = ({
  workoutId,
  open,
  onOpenChange,
  onCommentAdded,
}) => {
  const { user, profile } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      fetchComments();
    }
  }, [open, workoutId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*, profile:profiles(*)')
        .eq('workout_id', workoutId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setComments(data as Comment[]);
    } catch (error: any) {
      console.error('Error fetching comments:', error.message);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      setSubmitting(true);
      
      // Get the comment content before clearing the input
      const commentContent = newComment.trim();
      
      // Create a temporary comment object for optimistic UI update
      const tempComment: Comment = {
        id: `temp-${Date.now()}`, // Temporary ID that will be replaced after server response
        workout_id: workoutId,
        user_id: user.id,
        content: commentContent,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: profile, // Use the current user's profile
      };
      
      // Optimistically update UI first
      setComments(prevComments => [tempComment, ...prevComments]);
      setNewComment(''); // Clear input field immediately
      
      // Increment comment count in parent component without triggering refresh
      // Use a function that updates the state locally
      // This is a synchronous call that doesn't cause a page refresh
      onCommentAdded();
      
      // Then perform the actual database operation
      const { data, error } = await supabase
        .from('comments')
        .insert({
          workout_id: workoutId,
          user_id: user.id,
          content: commentContent,
        })
        .select('*, profile:profiles(*)');

      if (error) {
        // If error, remove the temporary comment
        setComments(prevComments => prevComments.filter(comment => comment.id !== tempComment.id));
        throw error;
      }
      
      // Replace the temporary comment with the real one from the server
      if (data && data.length > 0) {
        setComments(prevComments => 
          prevComments.map(comment => 
            comment.id === tempComment.id ? (data[0] as Comment) : comment
          )
        );
      }
      
      toast.success('Comment added', { duration: 1500 });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-[300px]">
          <div className="flex-1 overflow-y-auto py-2 space-y-4">
            {loading ? (
              Array(3)
                .fill(0)
                .map((_, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <Skeleton className="rounded-full h-8 w-8" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                ))
            ) : comments.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                No comments yet. Be the first to comment!
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-2">
                  <Avatar className="h-8 w-8 border border-fit-primary">
                    <img src={comment.profile?.avatar_url || 'https://api.dicebear.com/6.x/avataaars/svg'} alt={comment.profile?.username || 'User'} />
                  </Avatar>
                  <div>
                    <div className="bg-gray-100 rounded-lg p-2">
                      <p className="text-xs font-semibold">{comment.profile?.username || 'User'}</p>
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          
          <Separator className="my-2" />
          
          <form onSubmit={handleAddComment} className="flex items-center space-x-2 pt-2">
            {user && profile ? (
              <Avatar className="h-8 w-8 border border-fit-primary">
                <img src={profile.avatar_url || 'https://api.dicebear.com/6.x/avataaars/svg'} alt={profile.username || 'User'} />
              </Avatar>
            ) : (
              <Avatar className="h-8 w-8 border border-fit-primary" />
            )}
            <Input
              placeholder={user ? "Add a comment..." : "Login to comment"}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={!user || submitting}
              className="flex-1"
            />
            <Button type="submit" size="sm" disabled={!user || !newComment.trim() || submitting}>
              Post
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
