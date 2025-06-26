import { Link } from 'react-router-dom';
import { Gamepad2, Users, Wand2, LogOut, User, Crown, Shield, Zap } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 'creator':
        return <Shield className="h-4 w-4 text-purple-400" />;
      default:
        return <User className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'text-yellow-400';
      case 'creator':
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <header className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-white hover:text-blue-400 transition-colors">
            <Gamepad2 className="h-8 w-8 text-blue-500" />
            <span>MagicSchool</span>
          </Link>

          {/* Navigation */}
          {isAuthenticated && (
            <nav className="hidden md:flex space-x-8">
              <Link 
                to="/lobby" 
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Users className="h-4 w-4" />
                <span>Lobby</span>
              </Link>
              <Link 
                to="/card-builder" 
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <Wand2 className="h-4 w-4" />
                <span>Card Builder</span>
              </Link>
              <Link 
                to="/collection" 
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Collection</span>
              </Link>
              <Link 
                to="/deck-builder" 
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <span>Deck Builder</span>
              </Link>
              {user && (user.role === 'creator' || user.role === 'admin') && (
                <Link 
                  to="/ability-builder" 
                  className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  <span>Abilities</span>
                </Link>
              )}
              {user && user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="flex items-center space-x-1 text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  <Crown className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
            </nav>
          )}

          {/* User info and actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && user ? (
              <>
                <div className="flex items-center space-x-2 text-gray-300">
                  {getRoleIcon(user.role)}
                  <span className={`font-medium ${getRoleColor(user.role)}`}>
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    ({user.role})
                  </span>
                </div>
                <button 
                  onClick={logout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-300 hover:text-white">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
