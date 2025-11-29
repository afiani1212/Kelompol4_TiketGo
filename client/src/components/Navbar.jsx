// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Jika belum login, jangan tampilkan navbar
  if (!user) return null;

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/flights" className="text-xl font-bold hover:text-blue-200">
          TiketGo✈️
        </Link>

        {/* Info User & Logout */}
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            Hi, <span className="font-semibold">{user.username}</span> ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-pink-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;