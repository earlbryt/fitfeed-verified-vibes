
import React from 'react';
import { Home, PlusCircle, User, Trophy, BarChart, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="bottom-nav-container">
      <nav className="bottom-nav">
        <Link to="/" className={`bottom-nav-item ${path === '/' ? 'active' : ''}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link to="/challenges" className={`bottom-nav-item ${path.includes('/challenges') ? 'active' : ''}`}>
          <Trophy size={24} />
          <span className="text-xs mt-1">Challenges</span>
        </Link>
        
        <div className="bottom-nav-add-wrapper">
          <Link to="/log-workout" className={`bottom-nav-add ${path === '/log-workout' ? 'active' : ''}`}>
            <PlusCircle size={32} />
          </Link>
        </div>
        
        <Link to="/leaderboard" className={`bottom-nav-item ${path === '/leaderboard' ? 'active' : ''}`}>
          <BarChart size={24} />
          <span className="text-xs mt-1">Leaderboard</span>
        </Link>
        
        <Link to="/profile" className={`bottom-nav-item ${path === '/profile' ? 'active' : ''}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </nav>
    </div>
  );
};

export default BottomNavigation;
