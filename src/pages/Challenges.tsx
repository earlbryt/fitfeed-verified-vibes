
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BottomNavigation from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ChallengesInvited from '@/components/challenge/ChallengesInvited';
import ChallengesActive from '@/components/challenge/ChallengesActive';
import ChallengesPast from '@/components/challenge/ChallengesPast';

const Challenges = () => {
  const navigate = useNavigate();

  return (
    <div className="pb-16">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <Button 
          onClick={() => navigate('/create-challenge')} 
          className="bg-fit-primary hover:bg-fit-secondary"
        >
          <Plus size={16} className="mr-1" />
          Create
        </Button>
      </div>

      <Tabs defaultValue="invited" className="w-full">
        <div className="px-4 py-2">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="invited">Invitations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="invited" className="p-4">
          <ChallengesInvited />
        </TabsContent>
        
        <TabsContent value="active" className="p-4">
          <ChallengesActive />
        </TabsContent>
        
        <TabsContent value="past" className="p-4">
          <ChallengesPast />
        </TabsContent>
      </Tabs>

      <BottomNavigation />
    </div>
  );
};

export default Challenges;
