import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSignedIn = typeof window !== 'undefined' && localStorage.getItem('token');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setDropdownOpen(false);
    navigate('/');
  };


  return (
    <nav className="w-full bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 shadow text-white px-4 sm:px-10 py-3 flex items-center justify-between">
      <Link to="/" className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
        ClassAway
      </Link>
      <div className="flex items-center gap-1 sm:gap-2 md:gap-4 text-base font-semibold">
        {[
          { to: '/', label: 'Home' },
          { to: '/demo', label: 'Demo' },
          ...(isSignedIn ? [
            { to: '/dashboard', label: 'Dashboard' },
            { to: '/od-list', label: 'OD List' },
            { to: '/add-od', label: 'Add OD' },
            { to: '/placement-tracker', label: 'Placement Tracker' },
          ] : [])
        ].map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`px-4 py-2 rounded-xl transition font-medium focus:outline-none focus:ring-2 focus:ring-yellow-200
              ${location.pathname === link.to
                ? 'bg-white/20 text-yellow-200 shadow-sm'
                : 'text-white hover:bg-white/10 hover:text-yellow-100'}`}
          >
            {link.label}
          </Link>
        ))}
        <div className="relative" ref={dropdownRef}>
          <button
            className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 border border-white/30 focus:outline-none focus:ring-2 focus:ring-yellow-200 transition shadow-lg"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-label="User menu"
          >
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="8" r="4" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white text-gray-800 rounded-2xl shadow-2xl py-4 z-50 border border-gray-200 animate-fade-in-up drop-shadow-xl">
              {isSignedIn ? (
                <>
                  {/* User avatar and name */}
                  <div className="flex items-center gap-3 px-6 pb-4 border-b border-gray-100 mb-2">
                    <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold border-2 border-indigo-200">
                      <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <circle cx="12" cy="8" r="4" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-bold text-indigo-700 leading-tight">Profile</div>
                      <div className="text-xs text-gray-400">Signed in</div>
                    </div>
                  </div>
                  <Link to="/profile" className="block px-6 py-2.5 rounded-xl transition font-medium text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 active:bg-indigo-100" onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <div className="my-2 border-t border-gray-200 mx-3" />
                  <button onClick={handleLogout} className="block w-full text-left px-6 py-2.5 rounded-xl transition font-medium text-pink-600 hover:bg-pink-50 focus:bg-pink-100 active:bg-pink-100">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-6 py-2.5 rounded-t-xl transition font-medium text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 active:bg-indigo-100" onClick={() => setDropdownOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-6 py-2.5 rounded-b-xl transition font-medium text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 active:bg-indigo-100" onClick={() => setDropdownOpen(false)}>Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
