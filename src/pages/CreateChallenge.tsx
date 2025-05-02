
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const CreateChallenge = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center p-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </Button>
        <h1 className="text-xl font-semibold ml-2">Create Challenge</h1>
      </div>
      
      <div className="flex-1 p-4">
        <p className="text-center text-muted-foreground">
          Challenge creation form coming in step 2
        </p>
      </div>
    </div>
  );
};

export default CreateChallenge;
