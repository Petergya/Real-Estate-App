import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { Home, Search, User, Menu, X, Building2, LogOut, Settings, Map, Camera, Info, Mail } from 'lucide-react';
import NotificationCenter from './NotificationCenter';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('you have log out your account');
    navigate('/login');
    setIsProfileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#DCE7F0] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Building2 className="h-8 w-8 text-[#123B7A] group-hover:text-[#00B8D9] transition-colors" />
            <span className="text-xl font-bold text-[#123B7A]">Habixa Properties</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
              Home
            </Link>
            <Link to="/properties" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
              Properties
            </Link>
            <Link to="/properties/map" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
              Map
            </Link>
            <Link to="/about" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
              About
            </Link>
            <Link to="/contact" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
              Contact
            </Link>
            {user && user.role !== 'admin' && (
              <Link to="/dashboard" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium">
                Dashboard
              </Link>
            )}
            <Link to="/media-demo" className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-[#123B7A]" />
              Media
            </Link>
          </div>

          {/* User Menu - Show Login/Sign Up for guests and admins (landing page is for users) */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationCenter />
            {user && user.role !== 'admin' ? (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-gold" />
                    </div>
                    <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                  </button>
                  {isProfileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-2 z-50 border border-gray-200 overflow-hidden">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-white/90 hover:bg-white/10 hover:text-gold transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 text-gray-500" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-[#123B7A]/80 hover:text-[#123B7A] hover:bg-[#E8F6FC] transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg bg-[#123B7A] text-white hover:bg-[#0D2D5E] transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC] transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-[#DCE7F0] bg-white">
            <div className="flex flex-col gap-1">
              <Link to="/" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
              <Link to="/properties" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                <Search className="h-4 w-4" />
                <span>Properties</span>
              </Link>
              <Link to="/properties/map" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                <Map className="h-4 w-4" />
                <span>Map View</span>
              </Link>
              <Link to="/about" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                <Info className="h-4 w-4" />
                <span>About Us</span>
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                <Mail className="h-4 w-4" />
                <span>Contact</span>
              </Link>
              {user && user.role !== 'admin' && (
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              )}
              <Link to="/media-demo" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                <Camera className="h-4 w-4" />
                <span>Media</span>
              </Link>
              {user && user.role !== 'admin' ? (
                <>
                  <Link to="/profile" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                    <Settings className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex items-center gap-2 px-4 py-3 rounded-lg text-left text-[#123B7A] hover:bg-[#E8F6FC]">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-2 px-4 py-3 rounded-lg text-[#123B7A] hover:bg-[#E8F6FC]" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className="mx-4 mt-2 py-3 rounded-lg bg-[#123B7A] text-white text-center hover:bg-[#0D2D5E] transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;