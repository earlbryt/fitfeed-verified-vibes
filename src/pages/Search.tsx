
import React, { useState } from 'react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const categories = [
  'Running', 'HIIT', 'Yoga', 'Cycling', 'Weightlifting', 'Swimming', 'Pilates', 'Crossfit'
];

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Discover</h1>
        
        <div className="relative mb-6">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search workouts, users, or challenges"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <h2 className="text-sm font-medium mb-2">Popular Categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge 
                key={category}
                className="bg-fit-light text-fit-secondary hover:bg-fit-secondary hover:text-white cursor-pointer"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3, 4, 5, 6, 9].map((item) => (
            <div key={item} className="aspect-square relative">
              <img 
                src={`https://images.unsplash.com/photo-${1560000000000 + item * 100000}?w=300&h=300&fit=crop`} 
                alt="Workout thumbnail" 
                className="object-cover w-full h-full"
              />
              {item % 2 === 0 && (
                <div className="absolute top-2 right-2">
                  <span className="verified-badge"></span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Search;
