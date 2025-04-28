
import React from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutForm from '@/components/workout/WorkoutForm';

const AddWorkout = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <WorkoutForm />
      <BottomNavigation />
    </div>
  );
};

export default AddWorkout;
