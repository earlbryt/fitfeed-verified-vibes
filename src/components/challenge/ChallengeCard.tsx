
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Challenge } from '@/types/supabase';
import { Link } from 'react-router-dom';

interface ChallengeCardProps {
  challenge: Challenge;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge }) => {
  return (
    <Link to={`/challenges/${challenge.id}`} className="block">
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{challenge.title}</h3>
              <p className="text-sm text-muted-foreground">
                {challenge.challenge_type === 'one_on_one' ? 'One-on-One' : 'Group'} Challenge
              </p>
            </div>
            <Badge variant={challenge.status === 'active' ? 'default' : 'outline'}>
              {challenge.status === 'active' ? 'Active' : 'Completed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Avatar className="h-6 w-6">
                <img 
                  src={challenge.creator?.avatar_url || 'https://api.dicebear.com/6.x/avataaars/svg?seed=placeholder'} 
                  alt={challenge.creator?.username || 'Creator'} 
                />
              </Avatar>
              <p className="text-sm">Created by {challenge.creator?.username || 'User'}</p>
            </div>
            <p className="text-sm">
              Goal: {challenge.goal_value} {challenge.goal_unit}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ChallengeCard;
