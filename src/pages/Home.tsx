
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
      
      let query = supabase
        .from('workouts')
        .select(`
          *,
          profile: profiles(*),
          likes_count: likes(count),
          comments_count: comments(count),
          flags_count: flags(count)
        `)
        .eq('hidden', false)
        .order('created_at', { ascending: false });

      if (user) {
        query = query.select(`
          *,
          profile: profiles(*),
          likes_count: likes(count),
          comments_count: comments(count),
          flags_count: flags(count),
          user_has_liked: likes!inner(user_id.eq.${user.id}),
          user_has_flagged: flags!inner(user_id.eq.${user.id})
        `);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      setWorkouts(data as Workout[]);
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
