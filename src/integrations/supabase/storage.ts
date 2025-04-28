
import { supabase } from './client';

// Create necessary storage buckets if they don't exist
export const initializeStorage = async () => {
  // Check if workout-images bucket exists, create if not
  const { data: buckets, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.error('Error checking storage buckets:', error);
    return;
  }
  
  const workoutBucketExists = buckets.some(bucket => bucket.name === 'workout-images');
  
  if (!workoutBucketExists) {
    const { error: createError } = await supabase.storage.createBucket('workout-images', {
      public: true, // Make files publicly accessible
      fileSizeLimit: 5242880, // 5MB limit
    });
    
    if (createError) {
      console.error('Error creating workout-images bucket:', createError);
    }
  }
};

// Initialize storage when this module loads
initializeStorage().catch(console.error);
