
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Challenge } from '@/types/supabase';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { acceptChallengeInvitation, declineChallengeInvitation } from '@/services/challengeService';
import { useQueryClient } from '@tanstack/react-query';

interface ChallengeInvitationProps {
  challenge: Challenge;
}

const ChallengeInvitation: React.FC<ChallengeInvitationProps> = ({ challenge }) => {
  const queryClient = useQueryClient();
  const startDate = new Date(challenge.start_date);
  const endDate = new Date(challenge.end_date);
  
  const handleAccept = async () => {
    try {
      await acceptChallengeInvitation(challenge.id);
      toast.success("Challenge accepted!");
      queryClient.invalidateQueries({ queryKey: ['challengeInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['activeChallenges'] });
    } catch (error) {
      toast.error("Failed to accept challenge");
    }
  };
  
  const handleDecline = async () => {
    try {
      await declineChallengeInvitation(challenge.id);
      toast.success("Challenge declined");
      queryClient.invalidateQueries({ queryKey: ['challengeInvitations'] });
    } catch (error) {
      toast.error("Failed to decline challenge");
    }
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium">{challenge.title}</h3>
          <div className="text-xs text-muted-foreground">
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </div>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <Avatar className="h-6 w-6">
            <AvatarImage 
              src={challenge.creator?.avatar_url || undefined} 
              alt={challenge.creator?.username || 'Creator'} 
            />
            <AvatarFallback>{challenge.creator?.username?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">
            Invitation from {challenge.creator?.username || 'User'}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        {challenge.description && (
          <p className="text-sm text-muted-foreground mb-2">{challenge.description}</p>
        )}
        <div className="flex justify-between text-sm">
          <span>Goal: {challenge.goal_value} {challenge.goal_unit}</span>
          <span>{challenge.challenge_type === 'one_on_one' ? 'One-on-One' : 'Group'} Challenge</span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDecline}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <X size={16} className="mr-1" /> Decline
        </Button>
        <Button 
          variant="default" 
          size="sm" 
          onClick={handleAccept}
        >
          <Check size={16} className="mr-1" /> Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ChallengeInvitation;
