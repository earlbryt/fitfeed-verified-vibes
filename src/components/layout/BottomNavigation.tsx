
import React from 'react';
import { Home, Search, PlusSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const BottomNavigation = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`bottom-nav-item ${path === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </Link>
      
      <Link to="/search" className={`bottom-nav-item ${path === '/search' ? 'active' : ''}`}>
        <Search size={24} />
        <span className="text-xs mt-1">Search</span>
      </Link>
      
      <Link to="/add-workout" className={`bottom-nav-item ${path === '/add-workout' ? 'active' : ''}`}>
        <PlusSquare size={24} />
        <span className="text-xs mt-1">Add</span>
      </Link>
      
      <Link to="/profile" className={`bottom-nav-item ${path === '/profile' ? 'active' : ''}`}>
        <User size={24} />
        <span className="text-xs mt-1">Profile</span>
      </Link>
    </nav>
  );
};

export default BottomNavigation;
