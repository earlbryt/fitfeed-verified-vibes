
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/types/supabase';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';
import { format } from 'date-fns';

interface ChallengeCardProps {
  challenge: Challenge;
  variant?: 'active' | 'completed';
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, variant = 'active' }) => {
  // Calculate progress percentage using the updated type
  const progressPercentage = challenge.participant?.progress 
    ? Math.min(100, (challenge.participant.progress / challenge.goal_value) * 100)
    : 0;
    
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  // Determine if the current user is the winner
  const isWinner = variant === 'completed' && challenge.winner_id === challenge.participant?.user_id;

  return (
    <Link to={`/challenges/${challenge.id}`} className="block mb-4">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{challenge.title}</h3>
              <div className="text-xs text-muted-foreground">
                {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
              </div>
            </div>
            <Badge variant={variant === 'active' ? 'default' : 'outline'}>
              {variant === 'active' ? 'Active' : 'Completed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Goal: {challenge.goal_value} {challenge.goal_unit}</span>
              <span className="text-muted-foreground">
                {challenge.challenge_type === 'one_on_one' ? 'One-on-One' : 'Group'}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>Your progress</span>
                <span>{challenge.participant?.progress || 0}/{challenge.goal_value}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            {/* Creator info */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage 
                    src={challenge.creator?.avatar_url || undefined} 
                    alt={challenge.creator?.username || 'Creator'} 
                  />
                  <AvatarFallback>{challenge.creator?.username?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <p className="text-sm">Created by {challenge.creator?.username || 'User'}</p>
              </div>
              
              {variant === 'completed' && isWinner && (
                <Badge variant="default" className="bg-yellow-500">Winner!</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChallengeCard;
