
import React from 'react';
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader
} from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Heart, MessageCircle, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Workout } from '@/types/workout';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface WorkoutCardProps {
  workout: Workout;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout }) => {
  const handleLike = () => {
    toast.success('Workout liked!');
  };

  const handleComment = () => {
    toast.success('Comment added!');
  };

  const handleFlag = () => {
    toast('Workout flagged for review', {
      description: 'An admin will review this workout soon',
      action: {
        label: 'Undo',
        onClick: () => toast.success('Flag removed')
      }
    });
  };

  return (
    <Card className="mb-6 overflow-hidden animate-fade-in">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8 border border-fit-primary">
            <img src={workout.user.avatar} alt={workout.user.name} />
          </Avatar>
          <div>
            <p className="font-medium text-sm">{workout.user.name}</p>
            <p className="text-xs text-muted-foreground">{workout.timestamp}</p>
          </div>
          {workout.verified && (
            <div className="ml-auto">
              <span className="verified-badge animate-pulse-badge">
                <Badge variant="outline" className="bg-fit-light text-fit-primary border-fit-primary">
                  Verified
                </Badge>
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      
      {workout.image && (
        <div className="relative aspect-square">
          <img 
            src={workout.image} 
            alt={`${workout.type} workout`} 
            className="object-cover w-full h-full"
          />
        </div>
      )}
      
      <CardContent className="pt-4 pb-2 px-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <Button variant="ghost" size="icon" onClick={handleLike}>
              <Heart size={20} className="text-gray-600 hover:text-red-500" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleComment}>
              <MessageCircle size={20} className="text-gray-600" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleFlag}>
            <Flag size={20} className="text-gray-600" />
          </Button>
        </div>
        <div>
          <p className="text-sm font-semibold">{workout.likes} likes</p>
          <div className="mt-1">
            <p className="text-sm">
              <span className="font-semibold">{workout.user.name}</span>{' '}
              <span>{workout.caption}</span>
            </p>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.type}
            </Badge>
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.duration} min
            </Badge>
            <Badge variant="secondary" className="bg-fit-light text-fit-secondary">
              {workout.intensity}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-2">
        <p className="text-xs text-muted-foreground">
          View all {workout.comments} comments
        </p>
      </CardFooter>
    </Card>
  );
};

export default WorkoutCard;
