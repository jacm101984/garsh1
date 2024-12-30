import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MessageSquare, Bell, Menu, User } from 'lucide-react';

const Navbar = ({ user, setUser, unreadMessages = 0 }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <NavLink to="/" className="text-2xl font-bold text-orange-500">
            GARSH
          </NavLink>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {/* Links for logged-in users */}
            {user ? (
              <>
                {user?.role?.includes('host') && (
                  <>
                    <NavLink
                      to="/add-space"
                      className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                    >
                      List Your Garage
                    </NavLink>
                    <NavLink
                      to="/host-dashboard"
                      className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                    >
                      Host Dashboard
                    </NavLink>
                  </>
                )}
                <NavLink
                  to="/favorites"
                  className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  Favorites
                </NavLink>
                <NavLink
                  to="/user-dashboard"
                  className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  My Dashboard
                </NavLink>
                <NavLink
                  to="/ai-planner"
                  className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  AI Planner
                </NavLink>

                {/* Messages and Notifications */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate('/messages')}
                    className="p-2 hover:bg-gray-100 rounded-full relative"
                  >
                    <MessageSquare className="h-6 w-6 text-gray-600" />
                    {unreadMessages > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {unreadMessages > 9 ? '9+' : unreadMessages}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative ml-2 flex items-center">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-orange-500" />
                      </div>
                    )}
                    <span className="ml-2 text-gray-700">{user.name}</span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Links for guests */}
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-full text-gray-600 hover:bg-gray-100"
                >
                  Sign Up
                </NavLink>
                <NavLink
                  to="/login"
                  className="px-4 py-2 rounded-full bg-orange-500 text-white hover:bg-orange-600"
                >
                  Sign In
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;