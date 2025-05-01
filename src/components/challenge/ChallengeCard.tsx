
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Challenge, ChallengeParticipant } from '@/types/supabase';
import { Award, Calendar, Target, Users } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ChallengeCardProps {
  challenge: Challenge;
  userProgress?: number;
  userStatus?: string;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ 
  challenge, 
  userProgress = 0,
  userStatus = 'accepted'
}) => {
  const navigate = useNavigate();
  
  const getStatusBadge = () => {
    if (challenge.status === 'pending') {
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Pending</Badge>;
    } else if (challenge.status === 'active') {
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Active</Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">Completed</Badge>;
    }
  };

  const getTypeIcon = () => {
    return challenge.challenge_type === 'one-on-one' 
      ? <Users size={14} className="mr-1" />
      : <Users size={14} className="mr-1" />;
  };

  const getParticipantsCount = () => {
    if (challenge.participants) {
      const acceptedParticipants = challenge.participants.filter(p => p.status === 'accepted');
      return acceptedParticipants.length;
    }
    return 0;
  };
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not started';
    return format(parseISO(dateString), 'MMM d, yyyy');
  };

  return (
    <div 
      className="border rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/challenges/${challenge.id}`)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg line-clamp-1">{challenge.title}</h3>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 space-x-4 mb-3">
          <div className="flex items-center">
            <Target size={14} className="mr-1" />
            <span>
              {challenge.goal_value} {challenge.goal_unit}
            </span>
          </div>
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{challenge.duration_days} days</span>
          </div>
          <div className="flex items-center">
            {getTypeIcon()}
            <span>{getParticipantsCount()} participants</span>
          </div>
        </div>
        
        {userStatus === 'accepted' && (
          <>
            <div className="mb-1 flex justify-between text-xs">
              <span>Your progress</span>
              <span className="font-medium">
                {userProgress} / {challenge.goal_value} {challenge.goal_unit}
              </span>
            </div>
            <Progress 
              value={challenge.goal_value > 0 ? (userProgress / challenge.goal_value) * 100 : 0} 
              className="h-2 mb-3"
            />
          </>
        )}
        
        {challenge.status === 'completed' && challenge.winner_id && (
          <div className="flex items-center text-sm mb-2 text-amber-600">
            <Award size={14} className="mr-1" />
            <span>Challenge completed</span>
          </div>
        )}
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-500">
            {challenge.start_date ? (
              <span>Started {formatDate(challenge.start_date)}</span>
            ) : (
              <span>Not started yet</span>
            )}
          </div>
          
          <div className="flex -space-x-2">
            {challenge.participants?.slice(0, 3).map((participant) => (
              <Avatar key={participant.id} className="border-2 border-white w-6 h-6">
                <AvatarImage src={participant.profile?.avatar_url || ''} />
                <AvatarFallback className="text-xs">
                  {participant.profile?.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            ))}
            {(challenge.participants && challenge.participants.length > 3) && (
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs border-2 border-white">
                +{challenge.participants.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
