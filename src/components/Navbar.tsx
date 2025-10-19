import { useState } from 'react';
import { Search, Bell, User, LogOut, Film } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onSearch: (query: string) => void;
}

export default function Navbar({ onOpenAuth, onSearch }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black to-transparent">
      <div className="flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Film size={32} className="text-red-600" />
            <span className="text-2xl font-bold text-red-600">STREAMFLIX</span>
          </div>

          {user && (
            <div className="hidden md:flex items-center gap-6 text-sm">
              <a href="#" className="text-white hover:text-gray-300 transition-colors">
                Home
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                TV Shows
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                Movies
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-300 transition-colors">
                My List
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              {showSearch ? (
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search titles..."
                    className="w-64 px-4 py-2 bg-black bg-opacity-70 text-white border border-gray-700 rounded focus:outline-none focus:border-white"
                    autoFocus
                    onBlur={() => {
                      if (!searchQuery) setShowSearch(false);
                    }}
                  />
                </form>
              ) : (
                <button
                  onClick={() => setShowSearch(true)}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Search size={20} />
                </button>
              )}

              <button className="text-white hover:text-gray-300 transition-colors">
                <Bell size={20} />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                    <User size={20} />
                  </div>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-black bg-opacity-95 border border-gray-800 rounded shadow-lg">
                    <div className="px-4 py-3 border-b border-gray-800">
                      <p className="text-white text-sm font-semibold truncate">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-white hover:bg-gray-800 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
