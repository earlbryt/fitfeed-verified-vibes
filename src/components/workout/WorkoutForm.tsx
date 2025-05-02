import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  type: z.string().min(1, { message: 'Please select a workout type' }),
  duration: z.string().min(1, { message: 'Please enter a duration' }),
  intensity: z.string().min(1, { message: 'Please select an intensity' }),
  caption: z.string().optional(),
  image: z.any().optional(),
});

const WorkoutForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: '',
      duration: '30',
      intensity: 'medium',
      caption: '',
    },
  });
  
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('image', file);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to post a workout');
      return;
    }

    try {
      setUploading(true);
      
      // First, upload the image if provided
      let imageUrl = null;
      if (values.image instanceof File) {
        // Make sure the file has a unique name
        const fileExt = values.image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `workouts/${user.id}/${fileName}`;
        
        console.log('Uploading to path:', filePath);
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('planetpitness')
          .upload(filePath, values.image, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }
        
        console.log('Upload successful:', uploadData);
        
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('planetpitness')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
        console.log('Image URL:', imageUrl);
      }
      
      console.log('Creating workout with data:', {
        user_id: user.id,
        type: values.type,
        duration: parseInt(values.duration),
        intensity: values.intensity,
        caption: values.caption || null,
        image: imageUrl,
        verified: !!imageUrl
      });
      
      // Insert the workout
      const { data, error } = await supabase
        .from('workouts')
        .insert({
          user_id: user.id,
          type: values.type,
          duration: parseInt(values.duration),
          intensity: values.intensity,
          caption: values.caption || null,
          image: imageUrl,
          verified: !!imageUrl, // Mark as verified if image provided
        })
        .select();
      
      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      
      toast.success('Workout logged successfully!', {
        description: values.image ? 'Your workout has been verified!' : 'Add a photo next time to verify your workout.',
      });
      
      // Reset form
      form.reset();
      setImagePreview(null);
      
      // Navigate to home
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to log workout', {
        description: error.message,
      });
      console.error('Error logging workout:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Log Your Workout</h1>
        <p className="text-muted-foreground">
          Share your fitness journey with the community!
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select workout type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="weightlifting">Weightlifting</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="hiit">HIIT</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="e.g., 30" 
                    {...field} 
                    min="1"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="intensity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Intensity</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intensity" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="caption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Caption</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="How did your workout go?" 
                    className="resize-none" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Camera className="mr-2 h-4 w-4" />
                  Verification Photo
                  <Badge variant="outline" className="ml-2 bg-fit-light text-fit-primary">
                    Optional
                  </Badge>
                </FormLabel>
                <FormDescription>
                  Upload a photo to verify your workout and get a verification badge.
                </FormDescription>
                <FormControl>
                  <div className="grid w-full max-w-sm items-center gap-1.5">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-fit-primary transition-colors">
                      {imagePreview ? (
                        <div className="relative w-full">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full h-40 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => {
                              setImagePreview(null);
                              form.setValue('image', undefined);
                            }}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center cursor-pointer">
                          <Upload className="h-10 w-10 text-gray-400 mb-2" />
                          <span className="text-xs text-gray-500">Click to upload</span>
                          <Input 
                            type="file" 
                            className="hidden" 
                            accept="image/*" 
                            onChange={handleImageChange}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-fit-primary to-fit-secondary hover:opacity-90"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Log Workout'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default WorkoutForm;
