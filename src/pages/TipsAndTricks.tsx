
import React, { useState } from 'react';
import { format } from 'date-fns';
import { MessageSquare, Heart, Award, Flag, Send } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FitnessTip } from '@/types/supabase';
import BottomNavigation from '@/components/layout/BottomNavigation';

// Mock data
const mockTips: FitnessTip[] = [
  {
    id: '1',
    user_id: '123',
    content: "Always warm up for at least 5-10 minutes before intense exercise. This helps prevent injuries and prepares your body for the workout ahead.",
    likes_count: 24,
    comments_count: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      id: '123',
      username: 'fitness_coach',
      full_name: 'Jane Smith',
      avatar_url: null,
      bio: 'Certified fitness trainer with 10+ years experience',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: false,
  },
  {
    id: '2',
    user_id: '456',
    content: "Staying hydrated is key for performance. Try to drink at least 16oz of water 2 hours before exercise, and continue hydrating throughout your workout.",
    likes_count: 18,
    comments_count: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      id: '456',
      username: 'runner_joe',
      full_name: 'Joe Johnson',
      avatar_url: null,
      bio: 'Marathon runner and outdoor enthusiast',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: true,
  },
  {
    id: '3',
    user_id: '789',
    content: "For better sleep after evening workouts, try to finish exercising at least 90 minutes before bedtime. This gives your body time to cool down and your heart rate to return to normal.",
    likes_count: 32,
    comments_count: 7,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    profile: {
      id: '789',
      username: 'sleep_expert',
      full_name: 'Sarah Williams',
      avatar_url: null,
      bio: 'Sleep researcher and fitness enthusiast',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    user_has_liked: false,
  },
];

const TipsAndTricks = () => {
  const [activeTab, setActiveTab] = useState('recent');
  const [newTip, setNewTip] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localTips, setLocalTips] = useState<FitnessTip[]>(mockTips);

  const handleSubmitTip = () => {
    if (!newTip.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTipObj: FitnessTip = {
        id: Date.now().toString(),
        user_id: '999',
        content: newTip,
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profile: {
          id: '999',
          username: 'current_user',
          full_name: 'Your Name',
          avatar_url: null,
          bio: 'Fitness enthusiast',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        user_has_liked: false,
      };
      
      setLocalTips([newTipObj, ...localTips]);
      setNewTip('');
      setIsSubmitting(false);
      toast.success('Tip shared successfully!');
    }, 1000);
  };

  const handleLike = (tipId: string) => {
    setLocalTips(localTips.map(tip => {
      if (tip.id === tipId) {
        const newLikeStatus = !tip.user_has_liked;
        return {
          ...tip,
          likes_count: newLikeStatus ? tip.likes_count + 1 : tip.likes_count - 1,
          user_has_liked: newLikeStatus
        };
      }
      return tip;
    }));
  };

  // Sort tips based on active tab
  const sortedTips = [...localTips].sort((a, b) => {
    if (activeTab === 'recent') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else {
      return b.likes_count - a.likes_count;
    }
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Tips & Tricks</h1>
      </div>

      <div className="flex-1 p-4 pb-20">
        {/* New Tip Input */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>YN</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Textarea 
                  placeholder="Share a fitness tip or advice..." 
                  className="resize-none mb-2"
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitTip} 
                    disabled={!newTip.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Posting...' : 'Share Tip'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Tip */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-lg flex items-center">
              <Award className="h-5 w-5 mr-2 text-yellow-500" /> 
              Featured Tip
            </h2>
          </div>
          <Card className="border-yellow-200 bg-yellow-50/30 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>FC</AvatarFallback>
                  </Avatar>
                  <div className="ml-2">
                    <div className="text-sm font-semibold">fitness_coach</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(), 'MMM d')}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-yellow-100">Featured</Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-sm">
                "Consistency beats intensity. It's better to exercise moderately 4-5 times a week than to go all-out once a week and burn out. Small, regular efforts lead to the best long-term results."
              </p>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex gap-4 text-muted-foreground text-xs">
                <button className="flex items-center hover:text-primary">
                  <Heart className="h-4 w-4 mr-1" fill="#d1d5db" stroke="#d1d5db" />
                  <span>42</span>
                </button>
                <button className="flex items-center hover:text-primary">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  <span>12 comments</span>
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
        
        {/* Tab Navigation */}
        <Tabs defaultValue="recent" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="recent">Most Recent</TabsTrigger>
            <TabsTrigger value="popular">Most Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="space-y-4">
            {sortedTips.map((tip) => (
              <TipCard 
                key={tip.id} 
                tip={tip} 
                onLike={() => handleLike(tip.id)} 
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

interface TipCardProps {
  tip: FitnessTip;
  onLike: () => void;
}

const TipCard: React.FC<TipCardProps> = ({ tip, onLike }) => {
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarImage src={tip.profile?.avatar_url || undefined} />
              <AvatarFallback>{tip.profile?.username?.[0].toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <div className="text-sm font-semibold">{tip.profile?.username}</div>
              <div className="text-xs text-muted-foreground">
                {format(new Date(tip.created_at), 'MMM d')}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm">{tip.content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex gap-4 text-muted-foreground text-xs">
          <button 
            className={`flex items-center ${tip.user_has_liked ? 'text-primary' : 'hover:text-primary'}`}
            onClick={onLike}
          >
            <Heart 
              className="h-4 w-4 mr-1" 
              fill={tip.user_has_liked ? "currentColor" : "none"} 
            />
            <span>{tip.likes_count}</span>
          </button>
          
          <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
            <DialogTrigger asChild>
              <button className="flex items-center hover:text-primary">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{tip.comments_count} comments</span>
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Comments</DialogTitle>
                <DialogDescription>
                  Join the conversation
                </DialogDescription>
              </DialogHeader>
              
              <div className="max-h-[60vh] overflow-y-auto py-4">
                <div className="space-y-4">
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className="text-xs font-semibold">user123</div>
                        <div className="text-xs text-muted-foreground">2 days ago</div>
                      </div>
                    </div>
                    <p className="text-sm">Great tip! This really helped me improve my routine.</p>
                  </div>
                  
                  <div className="bg-muted p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>F</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <div className="text-xs font-semibold">fitness_fan</div>
                        <div className="text-xs text-muted-foreground">1 day ago</div>
                      </div>
                    </div>
                    <p className="text-sm">I've been trying this approach and it works really well!</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t">
                <Textarea 
                  placeholder="Add a comment..."
                  className="resize-none min-h-[40px]"
                />
                <Button size="icon" variant="ghost">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <button className="flex items-center hover:text-destructive ml-auto">
            <Flag className="h-4 w-4 mr-1" />
            <span>Report</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default TipsAndTricks;
