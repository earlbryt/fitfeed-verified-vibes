
import React from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, Grid, Bookmark } from 'lucide-react';

const Profile = () => {
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
            <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces" alt="Profile" />
          </Avatar>
          <div className="ml-6">
            <h2 className="text-lg font-bold">Sarah Thompson</h2>
            <p className="text-sm text-muted-foreground">@sarahfit</p>
            <Badge className="mt-1 bg-fit-light text-fit-primary">
              Fitness Enthusiast
            </Badge>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <p className="font-bold">52</p>
            <p className="text-xs text-muted-foreground">Workouts</p>
          </div>
          <div>
            <p className="font-bold">214</p>
            <p className="text-xs text-muted-foreground">Following</p>
          </div>
          <div>
            <p className="font-bold">486</p>
            <p className="text-xs text-muted-foreground">Followers</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm">
            Fitness lover | Marathon runner | Yoga instructor
            <br />
            Sharing my fitness journey and helping others along the way!
          </p>
        </div>
        
        <Button className="w-full mb-6 bg-fit-primary hover:bg-fit-secondary">
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
            <div className="grid grid-cols-3 gap-1">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="aspect-square relative">
                  <img 
                    src={`https://images.unsplash.com/photo-${1570000000000 + item * 100000}?w=300&h=300&fit=crop`} 
                    alt="Workout" 
                    className="object-cover w-full h-full"
                  />
                  {item % 3 === 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="verified-badge"></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="grid grid-cols-3 gap-1">
              {[7, 8, 9].map((item) => (
                <div key={item} className="aspect-square">
                  <img 
                    src={`https://images.unsplash.com/photo-${1580000000000 + item * 100000}?w=300&h=300&fit=crop`} 
                    alt="Saved workout" 
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Profile;
