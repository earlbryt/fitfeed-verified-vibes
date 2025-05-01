
import React from 'react';
import { Home, PlusCircle, User, Trophy } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bottom-nav-container fixed bottom-0 left-0 right-0 z-10 bg-white border-t">
      <nav className="bottom-nav grid grid-cols-4 py-2">
        <Link to="/" className={`bottom-nav-item flex flex-col items-center ${path === '/' ? 'text-fit-primary' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/challenges" className={`bottom-nav-item flex flex-col items-center ${path.includes('/challenges') ? 'text-fit-primary' : 'text-gray-500'}`}>
          <Trophy size={24} />
          <span className="text-xs mt-1">Challenges</span>
        </Link>
        
        <Link to="/add-workout" className={`bottom-nav-item flex flex-col items-center ${path === '/add-workout' ? 'text-fit-primary' : 'text-gray-500'}`}>
          <PlusCircle size={24} />
          <span className="text-xs mt-1">Add</span>
        </Link>
        
        <Link to="/profile" className={`bottom-nav-item flex flex-col items-center ${path === '/profile' ? 'text-fit-primary' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default BottomNavigation;
