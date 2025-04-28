
import React from 'react';
import Header from '@/components/layout/Header';
import BottomNavigation from '@/components/layout/BottomNavigation';
import WorkoutCard from '@/components/workout/WorkoutCard';
import { Workout } from '@/types/workout';

// Sample data - in a real app this would come from an API
const workouts: Workout[] = [
  {
    id: '1',
    user: {
      id: '101',
      name: 'Alex Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces',
    },
    type: 'Running',
    duration: 45,
    intensity: 'High',
    image: 'https://images.unsplash.com/photo-1502224562085-639556652f33?w=500&h=500&fit=crop',
    caption: 'Morning run through the park! 🏃‍♂️ Feeling energized for the day ahead!',
    timestamp: '1 hour ago',
    likes: 24,
    comments: 5,
    verified: true,
  },
  {
    id: '2',
    user: {
      id: '102',
      name: 'Sam Miller',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces',
    },
    type: 'Yoga',
    duration: 60,
    intensity: 'Medium',
    image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=500&h=500&fit=crop',
    caption: 'Found my inner peace today with an hour of yoga. Namaste 🧘‍♀️',
    timestamp: '3 hours ago',
    likes: 42,
    comments: 8,
    verified: true,
  },
  {
    id: '3',
    user: {
      id: '103',
      name: 'Taylor Reed',
      avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?w=200&h=200&fit=crop&crop=faces',
    },
    type: 'Weightlifting',
    duration: 75,
    intensity: 'High',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&h=500&fit=crop',
    caption: 'New personal best on deadlifts today! 💪 Consistency is key.',
    timestamp: '5 hours ago',
    likes: 37,
    comments: 12,
    verified: false,
  },
];

const Home = () => {
  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-md mx-auto pt-2 px-4">
        {workouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Home;
