
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  goal_value: z.string().min(1, { message: 'Please enter a goal value' }),
  goal_unit: z.string().min(1, { message: 'Please select a goal unit' }),
  duration_days: z.string().min(1, { message: 'Please enter a duration' }),
  challenge_type: z.string().min(1, { message: 'Please select a challenge type' }),
});

const CreateChallenge = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      goal_value: '50',
      goal_unit: 'miles',
      duration_days: '30',
      challenge_type: 'group',
    },
  });
  
  // Fetch friends list (for now we'll just show all users)
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      if (!user) return [];
      
      // In a real app, you'd fetch only friends, but for demo purposes we'll fetch all profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .neq('id', user.id);
        
      if (error) throw error;
      return data || [];
    }
  });

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId)
        : [...prev, friendId]
    );
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to create a challenge');
      return;
    }

    if (selectedFriends.length === 0) {
      toast.error('Please select at least one friend to invite');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create the challenge
      const { data: challenge, error: challengeError } = await supabase
        .from('challenges')
        .insert({
          creator_id: user.id,
          title: values.title,
          goal_value: parseFloat(values.goal_value),
          goal_unit: values.goal_unit,
          duration_days: parseInt(values.duration_days),
          challenge_type: values.challenge_type,
          status: 'pending',
        })
        .select()
        .single();
        
      if (challengeError) throw challengeError;
      
      // Add participants (invited friends)
      const participantsToInsert = selectedFriends.map(friendId => ({
        challenge_id: challenge.id,
        user_id: friendId,
        status: 'invited',
        progress: 0,
      }));
      
      // Also add the creator as an accepted participant
      participantsToInsert.push({
        challenge_id: challenge.id,
        user_id: user.id,
        status: 'accepted',
        progress: 0,
      });
      
      const { error: participantsError } = await supabase
        .from('challenge_participants')
        .insert(participantsToInsert);
        
      if (participantsError) throw participantsError;
      
      // Create notifications for all invited friends
      const notificationsToInsert = selectedFriends.map(friendId => ({
        user_id: friendId,
        type: 'challenge_invitation',
        content: {
          challenge_id: challenge.id,
          challenge_title: values.title,
          inviter_id: user.id
        },
        read: false,
      }));
      
      const { error: notificationsError } = await supabase
        .from('notifications')
        .insert(notificationsToInsert);
        
      if (notificationsError) throw notificationsError;
      
      toast.success('Challenge created successfully!');
      navigate('/challenges');
    } catch (error: any) {
      toast.error('Failed to create challenge', {
        description: error.message,
      });
      console.error('Error creating challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-xl font-bold mx-auto pr-10">Create Challenge</h1>
      </div>

      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 30-Day Run Challenge" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="goal_value"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Goal Value</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} min="1" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goal_unit"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Unit</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="miles">Miles</SelectItem>
                        <SelectItem value="kilometers">Kilometers</SelectItem>
                        <SelectItem value="minutes">Minutes</SelectItem>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="workouts">Workouts</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="duration_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} min="1" max="365" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="challenge_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="one-on-one">One-on-One</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    One-on-one challenges are between you and one friend. Group challenges can include multiple participants.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Invite Friends</h3>
              
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-pulse bg-gray-200 h-10 w-full rounded-md"></div>
                </div>
              ) : friends && friends.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                  {friends.map((friend) => (
                    <div 
                      key={friend.id}
                      onClick={() => toggleFriendSelection(friend.id)}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                        selectedFriends.includes(friend.id) ? 'bg-fit-light' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={friend.avatar_url || ''} />
                          <AvatarFallback>{friend.username?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{friend.full_name || friend.username || 'User'}</p>
                          {friend.username && <p className="text-xs text-gray-500">@{friend.username}</p>}
                        </div>
                      </div>
                      <Checkbox 
                        checked={selectedFriends.includes(friend.id)} 
                        onCheckedChange={() => toggleFriendSelection(friend.id)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  No friends available to invite
                </div>
              )}
              
              {selectedFriends.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-fit-light">
                    {selectedFriends.length} {selectedFriends.length === 1 ? 'Friend' : 'Friends'} Selected
                  </Badge>
                </div>
              )}
            </div>
            
            <Button 
              type="submit"
              className="w-full bg-gradient-to-r from-fit-primary to-fit-secondary hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateChallenge;
