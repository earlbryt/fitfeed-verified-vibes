
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Link } from 'react-router-dom';

const Challenges = () => {
  const [activeTab, setActiveTab] = useState("invited");

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
            <TabsTrigger value="invited">Invitations</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="invited" className="space-y-4">
            <div className="text-center p-8 text-gray-500">
              <p>You don't have any pending invitations</p>
            </div>
          </TabsContent>
          
          <TabsContent value="active" className="space-y-4">
            <div className="text-center p-8 text-gray-500">
              <p>You don't have any active challenges</p>
              <Button variant="link" asChild>
                <Link to="/challenges/create" className="mt-2 inline-flex items-center gap-1">
                  <PlusCircle size={16} /> Create a challenge
                </Link>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            <div className="text-center p-8 text-gray-500">
              <p>You don't have any completed challenges yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Challenges;
