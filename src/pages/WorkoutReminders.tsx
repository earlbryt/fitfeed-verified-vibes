
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parse, isValid } from 'date-fns';
import { Clock, Plus, Calendar, X } from 'lucide-react';

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { WorkoutReminder } from '@/types/supabase';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const formSchema = z.object({
  time: z.string().refine((val) => {
    // Validate time format (HH:MM)
    return isValid(parse(val, "HH:mm", new Date()));
  }, { message: "Please enter a valid time in 24-hour format (HH:MM)" }),
  days: z.array(z.string()).min(1, { message: "Please select at least one day" }),
});

type FormValues = z.infer<typeof formSchema>;

// Mock data
const mockReminders: WorkoutReminder[] = [
  {
    id: '1',
    user_id: '123',
    time: '06:30',
    days: ['Monday', 'Wednesday', 'Friday'],
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    user_id: '123',
    time: '18:00',
    days: ['Tuesday', 'Thursday'],
    active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const WorkoutReminders = () => {
  const [reminders, setReminders] = useState<WorkoutReminder[]>(mockReminders);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      time: '',
      days: [],
    },
  });

  const onSubmit = (values: FormValues) => {
    const newReminder: WorkoutReminder = {
      id: Date.now().toString(),
      user_id: '123',
      time: values.time,
      days: values.days,
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setReminders([...reminders, newReminder]);
    form.reset();
    setIsDrawerOpen(false);
    toast.success('Reminder set successfully!');
  };

  const toggleReminderActive = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    toast.success('Reminder deleted');
  };

  // Helper to format time from 24h to 12h format with AM/PM
  const formatDisplayTime = (time24h: string) => {
    try {
      const date = parse(time24h, "HH:mm", new Date());
      return format(date, "h:mm a");
    } catch (e) {
      return time24h;
    }
  };

  // Helper to show days in a readable format
  const formatDays = (days: string[]) => {
    if (days.length === 7) return "Every day";
    if (days.length >= 5) return `Every day except ${daysOfWeek.filter(d => !days.includes(d)).join(", ")}`;
    return days.join(", ");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Workout Reminders</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        {/* Intro Card */}
        <Card className="mb-6 bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/20 p-3">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-medium mb-1">Never Miss a Workout</h2>
                <p className="text-sm text-muted-foreground">
                  Set reminders to keep your fitness routine on track. We'll notify you when it's time to exercise.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Reminders */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Your Reminders</h2>
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" /> Add New
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Set a Workout Reminder</DrawerTitle>
                  <DrawerDescription>
                    Choose time and days when you want to be reminded
                  </DrawerDescription>
                </DrawerHeader>
                
                <div className="px-4">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reminder Time</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                <Input 
                                  type="time" 
                                  placeholder="Select time" 
                                  {...field} 
                                />
                              </div>
                            </FormControl>
                            <FormDescription>
                              Set the time when you want to receive a reminder
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="days"
                        render={() => (
                          <FormItem>
                            <FormLabel>Repeat on Days</FormLabel>
                            <div className="grid grid-cols-7 gap-1">
                              {daysOfWeek.map((day) => (
                                <FormField
                                  key={day}
                                  control={form.control}
                                  name="days"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={day}
                                        className="flex flex-col items-center space-y-1"
                                      >
                                        <FormControl>
                                          <div
                                            className={`flex flex-col items-center justify-center rounded-md border-2 p-2 cursor-pointer hover:bg-muted/50 ${
                                              field.value?.includes(day)
                                                ? "border-primary bg-primary/10"
                                                : "border-input"
                                            }`}
                                            onClick={() => {
                                              const current = field.value || [];
                                              const updated = current.includes(day)
                                                ? current.filter((d) => d !== day)
                                                : [...current, day];
                                              field.onChange(updated);
                                            }}
                                          >
                                            <span className="text-xs font-medium">
                                              {day.slice(0, 1)}
                                            </span>
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                </div>
                
                <DrawerFooter>
                  <Button onClick={form.handleSubmit(onSubmit)}>Save Reminder</Button>
                  <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>
                    Cancel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>

          {reminders.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg mb-1">No reminders set</h3>
                <p className="text-sm text-muted-foreground mb-4">Create your first workout reminder</p>
                <Button onClick={() => setIsDrawerOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" /> Add Reminder
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {reminders.map((reminder) => (
                <Card key={reminder.id} className={reminder.active ? "" : "opacity-60"}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="mr-3 bg-primary/10 rounded-full p-2">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="text-lg font-medium">
                            {formatDisplayTime(reminder.time)}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {formatDays(reminder.days)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch 
                          checked={reminder.active} 
                          onCheckedChange={() => toggleReminderActive(reminder.id)} 
                        />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-full text-muted-foreground hover:text-destructive"
                          onClick={() => deleteReminder(reminder.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Permission Card */}
        <Card className="mt-6 border-dashed">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium mb-1">Browser Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  Allow notifications to receive workout reminders
                </p>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default WorkoutReminders;
