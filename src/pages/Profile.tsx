import React, { useState, useEffect } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Grid, Bookmark, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Workout } from '@/types/supabase';
import { toast } from 'sonner';
import EditProfileForm from '@/components/profile/EditProfileForm';

const Profile = () => {
  const { user, profile } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    workoutsCount: 0,
    followingCount: 0,  // Placeholder for future implementation
    followersCount: 0   // Placeholder for future implementation
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  useEffect(() => {
    if (user) {
      fetchUserWorkouts();
      fetchUserStats();
    }
  }, [user]);

  const fetchUserWorkouts = async () => {
    try {
      setLoading(true);
      
      // Fetch user's workouts
      const { data: userWorkouts, error: workoutsError } = await supabase
        .from('workouts')
        .select('*, profile:profiles(*)')
        .eq('user_id', user!.id)
        .eq('hidden', false)
        .order('created_at', { ascending: false });
      
      if (workoutsError) throw workoutsError;
      
      // Fetch user's liked workouts (as a simple demonstration of "saved" workouts)
      const { data: likedWorkouts, error: likesError } = await supabase
        .from('likes')
        .select('workout_id')
        .eq('user_id', user!.id);
      
      if (likesError) throw likesError;
      
      if (likedWorkouts && likedWorkouts.length > 0) {
        const workoutIds = likedWorkouts.map(like => like.workout_id);
        
        const { data: savedWorkoutsData, error: savedError } = await supabase
          .from('workouts')
          .select('*, profile:profiles(*)')
          .in('id', workoutIds)
          .eq('hidden', false);
          
        if (savedError) throw savedError;
        setSavedWorkouts(savedWorkoutsData as Workout[] || []);
      }
      
      setWorkouts(userWorkouts as Workout[] || []);
    } catch (error: any) {
      console.error('Error fetching workouts:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Get count of user's workouts
      const { count: workoutsCount, error: workoutsError } = await supabase
        .from('workouts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('hidden', false);
      
      if (workoutsError) throw workoutsError;
      
      // For following/followers, we could implement this in the future
      // For now, using placeholder values
      
      setStats({
        workoutsCount: workoutsCount || 0,
        followingCount: 0,  // Placeholder until you implement a following system
        followersCount: 0   // Placeholder until you implement a followers system
      });
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleProfileUpdated = () => {
    // Refresh data when profile is updated
    fetchUserWorkouts();
    fetchUserStats();
  };

  // Handle loading state
  if (!user || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-fit-primary" />
        <span className="ml-2">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Profile</h1>
          <Button variant="ghost" size="icon">
            <Settings size={20} />
          </Button>
        </div>
        
        <div className="flex items-center mb-6">
          <Avatar className="h-20 w-20 border-2 border-fit-primary">
            <img 
              src={profile.avatar_url || `https://api.dicebear.com/6.x/avataaars/svg?seed=${profile.id}`} 
              alt={profile.username || 'Profile'} 
            />
          </Avatar>
          <div className="ml-6">
            <h2 className="text-lg font-bold">{profile.full_name || 'User'}</h2>
            <p className="text-sm text-muted-foreground">@{profile.username || user.email?.split('@')[0]}</p>
            <Badge className="mt-1 bg-fit-light text-fit-primary">
              Fitness Enthusiast
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p className="font-bold">{stats.workoutsCount}</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div>
            <p className="font-bold">{stats.followingCount}</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="font-bold">{stats.followersCount}</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm">
            {profile.bio || 'No bio yet. Tell us about yourself!'}
          </p>
        </div>
        
        <Button 
          className="w-full mb-6 bg-gradient-to-r from-fit-primary to-fit-secondary hover:opacity-90"
          onClick={() => setIsEditProfileOpen(true)}
        >
          Edit Profile
        </Button>
        
        <Tabs defaultValue="workouts">
          <TabsList className="w-full mb-4">
            <TabsTrigger value="workouts" className="w-1/2">
              <Grid size={16} className="mr-2" /> Workouts
            </TabsTrigger>
            <TabsTrigger value="saved" className="w-1/2">
              <Bookmark size={16} className="mr-2" /> Saved
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workouts">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-fit-primary" />
              </div>
            ) : workouts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No workouts yet. Start sharing your fitness journey!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {workouts.map((workout) => (
                  <div key={workout.id} className="aspect-square relative">
                    {workout.image ? (
                      <img 
                        src={workout.image} 
                        alt={workout.type} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{workout.type}</span>
                      </div>
                    )}
                    {workout.verified && (
                      <div className="absolute top-2 right-2">
                        <span className="verified-badge"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-6 w-6 animate-spin text-fit-primary" />
              </div>
            ) : savedWorkouts.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No saved workouts yet. Like workouts to save them here!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-1">
                {savedWorkouts.map((workout) => (
                  <div key={workout.id} className="aspect-square relative">
                    {workout.image ? (
                      <img 
                        src={workout.image} 
                        alt={workout.type} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-xs text-gray-500">{workout.type}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileForm 
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        onProfileUpdated={handleProfileUpdated}
      />
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;
