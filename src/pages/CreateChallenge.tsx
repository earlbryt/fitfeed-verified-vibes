
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Clock, User, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
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
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { format, addDays } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Form schema definition
const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }).max(50, { message: 'Title must be less than 50 characters' }),
  description: z.string().max(500, { message: 'Description must be less than 500 characters' }).optional(),
  challenge_type: z.enum(['one_on_one', 'group'], { 
    required_error: "Please select a challenge type",
  }),
  goal_value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Goal value must be a positive number",
  }),
  goal_unit: z.string().min(1, { message: "Please select a unit" }),
  duration_days: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 1 && Number(val) <= 365, {
    message: "Duration must be between 1 and 365 days",
  }),
  start_date: z.date({
    required_error: "Start date is required",
  }),
});

// Challenge units available for selection
const challengeUnits = [
  { value: 'miles', label: 'Miles' },
  { value: 'kilometers', label: 'Kilometers' },
  { value: 'minutes', label: 'Minutes' },
  { value: 'hours', label: 'Hours' },
  { value: 'workouts', label: 'Workouts' },
  { value: 'steps', label: 'Steps' },
  { value: 'calories', label: 'Calories' },
];

type FormData = z.infer<typeof formSchema>;

const CreateChallenge = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form with default values
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      challenge_type: 'one_on_one',
      goal_value: '',
      goal_unit: '',
      duration_days: '7',
      start_date: new Date(),
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You need to be logged in to create a challenge",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Calculate end date based on start date and duration
      const endDate = addDays(data.start_date, Number(data.duration_days));
      
      // Create challenge in database
      const { data: challengeData, error } = await supabase
        .from('challenges')
        .insert({
          title: data.title,
          description: data.description || null,
          challenge_type: data.challenge_type,
          goal_value: Number(data.goal_value),
          goal_unit: data.goal_unit,
          duration_days: Number(data.duration_days),
          start_date: data.start_date.toISOString(),
          end_date: endDate.toISOString(),
          creator_id: user.id,
          status: 'active',
        })
        .select('id')
        .single();
      
      if (error) {
        throw error;
      }
      
      // Auto-add the creator as an accepted participant
      const { error: participantError } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeData.id,
          user_id: user.id,
          status: 'accepted',
        });
      
      if (participantError) {
        throw participantError;
      }
      
      toast({
        title: "Challenge Created",
        description: "Your challenge has been created successfully!",
      });
      
      // Navigate to the challenges page
      navigate('/challenges');
    } catch (error) {
      console.error('Error creating challenge:', error);
      toast({
        title: "Error",
        description: "There was a problem creating your challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Create Challenge</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Challenge Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g. 30-Day Running Challenge" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Challenge Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your challenge" 
                          {...field} 
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Challenge Type */}
                <FormField
                  control={form.control}
                  name="challenge_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Challenge Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select challenge type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="one_on_one">
                            <div className="flex items-center">
                              <User className="mr-2 h-4 w-4" />
                              <span>One-on-One</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="group">
                            <div className="flex items-center">
                              <Users className="mr-2 h-4 w-4" />
                              <span>Group</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Goal Value and Unit */}
                <div className="flex gap-4">
                  <FormField
                    control={form.control}
                    name="goal_value"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Goal Value</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 50" 
                            {...field} 
                          />
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
                            {challengeUnits.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Start Date */}
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <Calendar className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Duration */}
                <FormField
                  control={form.control}
                  name="duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Days)</FormLabel>
                      <div className="flex items-center">
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="e.g. 30" 
                            {...field} 
                          />
                        </FormControl>
                        <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Challenge"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateChallenge;
