
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Loader2, Camera, Upload, AlertCircle } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutIntensityPicker from '@/components/workout/WorkoutIntensityPicker';

const formSchema = z.object({
  type: z.string().min(1, { message: "Please select a workout type" }),
  duration: z.number().min(1, { message: "Duration must be at least 1 minute" }),
  intensity: z.string().min(1, { message: "Please select an intensity level" }),
  caption: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const workoutTypes = [
  { value: "running", label: "Running" },
  { value: "cycling", label: "Cycling" },
  { value: "swimming", label: "Swimming" },
  { value: "yoga", label: "Yoga" },
  { value: "strength", label: "Strength Training" },
  { value: "hiit", label: "HIIT" },
  { value: "pilates", label: "Pilates" },
  { value: "walking", label: "Walking" },
  { value: "other", label: "Other" },
];

const LogWorkout: React.FC = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      duration: 30,
      intensity: "medium",
      caption: "",
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Just for UI demo purposes, create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };
  
  const onSubmit = (values: FormValues) => {
    // For UI demo, just show success toast
    toast.success("Workout logged successfully!", {
      description: `${values.duration} minutes of ${values.type} (${values.intensity} intensity)`,
    });
    form.reset();
    setPreviewUrl(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Log Workout</h1>
        <div className="text-sm text-muted-foreground">
          {format(new Date(), 'EEEE, MMMM d')}
        </div>
      </div>

      <div className="flex-1 p-4 pb-20">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>New Workout</CardTitle>
            <CardDescription>
              Track your workout progress and get verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Workout Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select workout type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {workoutTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
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
                      <div className="space-y-2">
                        <Slider
                          min={1}
                          max={180}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(values) => field.onChange(values[0])}
                        />
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">1 min</span>
                          <span className="text-sm font-medium">{field.value} mins</span>
                          <span className="text-xs text-muted-foreground">180 min</span>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity Level</FormLabel>
                      <WorkoutIntensityPicker 
                        value={field.value as 'low' | 'medium' | 'high'} 
                        onValueChange={field.onChange} 
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="caption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Caption (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Add notes about your workout..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <div className="text-sm font-medium">Verify Your Workout</div>
                  
                  <Alert variant="default" className="bg-muted border border-primary/20">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    <AlertTitle>Get verified badge</AlertTitle>
                    <AlertDescription>
                      Upload a photo or screenshot to verify your workout and earn a verified badge!
                    </AlertDescription>
                  </Alert>

                  {previewUrl ? (
                    <div className="mt-4 relative">
                      <img 
                        src={previewUrl} 
                        alt="Workout verification" 
                        className="w-full h-40 object-cover rounded-md border"
                      />
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="absolute top-2 right-2 h-8 w-8 rounded-full p-0"
                        onClick={() => setPreviewUrl(null)}
                      >
                        ✕
                      </Button>
                    </div>
                  ) : (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="workout-image" className="text-sm">Upload Image</Label>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="outline"
                          className="w-full flex items-center gap-2"
                          onClick={() => document.getElementById("workout-image")?.click()}
                          disabled={isUploading}
                        >
                          {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          <span>Upload Photo</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="w-1/3 flex items-center gap-2"
                          type="button"
                          disabled={isUploading}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <Input
                        id="workout-image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </div>
                  )}
                </div>

                <Button 
                  type="submit"
                  className="w-full font-semibold"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : "Log Workout"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <p className="text-xs text-muted-foreground">
              * Verified workouts appear with a badge in challenges and leaderboards
            </p>
          </CardFooter>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default LogWorkout;

const Label: React.FC<{
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}> = ({ htmlFor, className, children }) => {
  return (
    <label 
      htmlFor={htmlFor}
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
    >
      {children}
    </label>
  );
};
