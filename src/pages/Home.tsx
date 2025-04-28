
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { supabase } from '@/integrations/supabase/client';
import { Workout } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Home = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWorkouts();
    }
  }, [user]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      
      // First, fetch the basic workout data with counts
      const { data: workoutsData, error: workoutsError } = await supabase
        .from('workouts')
        .select(`
          *,
          profile:profiles(*),
          likes_count:likes(count),
          comments_count:comments(count),
          flags_count:flags(count)
        `)
        .eq('hidden', false)
        .order('created_at', { ascending: false });

      if (workoutsError) throw workoutsError;
      
      if (!workoutsData) {
        setWorkouts([]);
        return;
      }

      // If user is logged in, fetch user-specific data (likes, flags)
      if (user) {
        // Process each workout to check if user has liked or flagged it
        const enhancedWorkouts = await Promise.all(workoutsData.map(async (workout) => {
          // Check if user has liked this workout
          const { data: likeData, error: likeError } = await supabase
            .from('likes')
            .select('*')
            .eq('user_id', user.id)
            .eq('workout_id', workout.id)
            .maybeSingle();

          if (likeError) console.error('Error checking like status:', likeError);
          
          // Check if user has flagged this workout
          const { data: flagData, error: flagError } = await supabase
            .from('flags')
            .select('*')
            .eq('user_id', user.id)
            .eq('workout_id', workout.id)
            .maybeSingle();

          if (flagError) console.error('Error checking flag status:', flagError);

          // Convert count arrays to numbers and add user-specific data
          return {
            ...workout,
            likes_count: workout.likes_count && workout.likes_count[0] ? Number(workout.likes_count[0].count) : 0,
            comments_count: workout.comments_count && workout.comments_count[0] ? Number(workout.comments_count[0].count) : 0,
            flags_count: workout.flags_count && workout.flags_count[0] ? Number(workout.flags_count[0].count) : 0,
            user_has_liked: !!likeData,
            user_has_flagged: !!flagData
          } as Workout;
        }));

        setWorkouts(enhancedWorkouts);
      } else {
        // If no user, just convert the count arrays to numbers
        const formattedWorkouts = workoutsData.map(workout => ({
          ...workout,
          likes_count: workout.likes_count && workout.likes_count[0] ? Number(workout.likes_count[0].count) : 0,
          comments_count: workout.comments_count && workout.comments_count[0] ? Number(workout.comments_count[0].count) : 0,
          flags_count: workout.flags_count && workout.flags_count[0] ? Number(workout.flags_count[0].count) : 0,
        })) as Workout[];
        
        setWorkouts(formattedWorkouts);
      }
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load workouts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto pt-2 px-4">
        {loading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-2 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-64 w-full rounded-md" />
                <div className="mt-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
        ) : workouts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-gray-600">No workouts yet!</p>
            <p className="text-sm text-gray-500 mt-2">
              Start by adding your first workout.
            </p>
          </div>
        ) : (
          workouts.map((workout) => (
            <WorkoutCard 
              key={workout.id} 
              workout={workout} 
              onWorkoutUpdate={fetchWorkouts} 
            />
          ))
        )}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Home;
