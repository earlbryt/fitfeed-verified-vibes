
import React from 'react';
import { Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex justify-between items-center py-4 px-6 border-b border-gray-200">
      <h1 className="text-xl font-bold bg-gradient-to-r from-fit-primary to-fit-secondary bg-clip-text text-transparent">
        FitCommunity
      </h1>
      <button className="text-gray-600 hover:text-fit-primary transition-colors">
        <Bell size={24} />
      </button>
    </header>
  );
};

export default Header;
