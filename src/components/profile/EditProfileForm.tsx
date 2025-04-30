import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }).optional(),
  full_name: z.string().min(2, { message: 'Full name is required' }).optional(),
  bio: z.string().max(150, { message: 'Bio must be less than 150 characters' }).optional(),
  avatar: z.any().optional(),
});

interface EditProfileFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProfileUpdated: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ 
  open, 
  onOpenChange,
  onProfileUpdated
}) => {
  const { user, profile, refreshProfile } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      full_name: '',
      bio: '',
    },
  });
  
  // Set initial form values when profile data is available
  useEffect(() => {
    if (profile) {
      form.reset({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
      });
      
      if (profile.avatar_url) {
        setAvatarPreview(profile.avatar_url);
      }
    }
  }, [profile, form]);
  
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue('avatar', file);
    }
  };
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user) {
      toast.error('You must be logged in to update your profile');
      return;
    }

    try {
      setUploading(true);
      
      // Handle avatar upload if provided
      let avatarUrl = profile?.avatar_url || null;
      if (values.avatar instanceof File) {
        const fileExt = values.avatar.name.split('.').pop();
        const filePath = `avatars/${user.id}/avatar.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('planetpitness')
          .upload(filePath, values.avatar, {
            cacheControl: '3600',
            upsert: true
          });
          
        if (uploadError) throw uploadError;
        
        // Get the public URL
        const { data: urlData } = await supabase.storage
          .from('planetpitness')
          .getPublicUrl(filePath);
          
        avatarUrl = urlData.publicUrl;
      }
      
      // Update profile information
      const updates = {
        username: values.username || null,
        full_name: values.full_name || null,
        bio: values.bio || null,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
      
      // Refresh profile data in context
      await refreshProfile();
      
      // Notify parent component
      onProfileUpdated();
      
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message,
      });
      console.error('Error updating profile:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] max-w-md mx-auto rounded-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col items-center mb-4">
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col items-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-2 border-fit-primary cursor-pointer">
                        <img 
                          src={avatarPreview || (profile?.avatar_url || `https://api.dicebear.com/6.x/avataaars/svg?seed=${user?.id}`)} 
                          alt="Profile" 
                          className="h-full w-full object-cover"
                        />
                      </Avatar>
                      <label 
                        htmlFor="avatar-upload" 
                        className="absolute bottom-0 right-0 bg-fit-primary text-white p-1 rounded-full cursor-pointer"
                      >
                        <Camera size={16} />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., fitness_enthusiast" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public username.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="full_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about yourself..." 
                      className="resize-none"
                      maxLength={150}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value ? field.value.length : 0}/150 characters
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-fit-primary to-fit-secondary hover:opacity-90"
                disabled={uploading}
              >
                {uploading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm; 