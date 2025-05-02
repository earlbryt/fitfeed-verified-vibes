
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Link } from 'react-router-dom';
import ChallengeCard from '@/components/challenge/ChallengeCard';
import ChallengeInvitation from '@/components/challenge/ChallengeInvitation';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchInvitedChallenges, 
  fetchActiveChallenges, 
  fetchCompletedChallenges 
} from '@/services/challengeService';
import { Skeleton } from "@/components/ui/skeleton";

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("invited");
  
  // Fetch challenge invitations
  const { 
    data: invitedChallenges, 
    isLoading: isLoadingInvitations 
  } = useQuery({
    queryKey: ['challengeInvitations'],
    queryFn: fetchInvitedChallenges
  });
  
  // Fetch active challenges
  const { 
    data: activeChallenges, 
    isLoading: isLoadingActive 
  } = useQuery({
    queryKey: ['activeChallenges'],
    queryFn: fetchActiveChallenges
  });
  
  // Fetch completed challenges
  const { 
    data: completedChallenges, 
    isLoading: isLoadingCompleted 
  } = useQuery({
    queryKey: ['completedChallenges'],
    queryFn: fetchCompletedChallenges
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Link to="/challenges/create">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <PlusCircle size={16} /> New
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <Tabs defaultValue="invited" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="invited">
              Invitations
              {invitedChallenges && invitedChallenges.length > 0 && (
                <span className="ml-1 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {invitedChallenges.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invited" className="space-y-4">
            {isLoadingInvitations && (
              Array(3).fill(0).map((_, i) => (
                <div key={`invitation-skeleton-${i}`} className="space-y-2 mb-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            )}
            
            {!isLoadingInvitations && invitedChallenges && invitedChallenges.length > 0 ? (
              invitedChallenges.map(challenge => (
                <ChallengeInvitation key={challenge.id} challenge={challenge} />
              ))
            ) : (
              !isLoadingInvitations && (
                <div className="text-center p-8 text-gray-500">
                  <p>You don't have any pending invitations</p>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            {isLoadingActive && (
              Array(3).fill(0).map((_, i) => (
                <div key={`active-skeleton-${i}`} className="space-y-2 mb-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            )}
            
            {!isLoadingActive && activeChallenges && activeChallenges.length > 0 ? (
              activeChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} variant="active" />
              ))
            ) : (
              !isLoadingActive && (
                <div className="text-center p-8 text-gray-500">
                  <p>You don't have any active challenges</p>
                  <Button variant="link" asChild>
                    <Link to="/challenges/create" className="mt-2 inline-flex items-center gap-1">
                      <PlusCircle size={16} /> Create a challenge
                    </Link>
                  </Button>
                </div>
              )
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {isLoadingCompleted && (
              Array(3).fill(0).map((_, i) => (
                <div key={`completed-skeleton-${i}`} className="space-y-2 mb-4">
                  <Skeleton className="h-20 w-full" />
                </div>
              ))
            )}
            
            {!isLoadingCompleted && completedChallenges && completedChallenges.length > 0 ? (
              completedChallenges.map(challenge => (
                <ChallengeCard key={challenge.id} challenge={challenge} variant="completed" />
              ))
            ) : (
              !isLoadingCompleted && (
                <div className="text-center p-8 text-gray-500">
                  <p>You don't have any completed challenges yet</p>
                </div>
              )
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Challenges;
