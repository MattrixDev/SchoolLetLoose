import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types locally to avoid import issues for now
enum UserRole {
  PLAYER = 'player',
  CREATOR = 'creator',
  ADMIN = 'admin'
}

interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  isBanned: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for development
const DEMO_USERS: User[] = [
  {
    id: '1',
    username: 'DemoPlayer',
    email: 'player@demo.com',
    role: UserRole.PLAYER,
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  },
  {
    id: '2',
    username: 'DemoCreator',
    email: 'creator@demo.com',
    role: UserRole.CREATOR,
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  },
  {
    id: '3',
    username: 'DemoAdmin',
    email: 'admin@demo.com',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    isActive: true,
    isBanned: false
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('schoolletloose-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          user,
          isAuthenticated: true
        });
      } catch (error) {
        console.error('Error loading saved user:', error);
        localStorage.removeItem('schoolletloose-user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, check against demo users
      const user = DEMO_USERS.find(u => u.email === email);
      
      if (!user || password !== 'password') {
        throw new Error('Invalid email or password');
      }

      if (user.isBanned) {
        throw new Error('Your account has been banned. Please contact support.');
      }

      if (!user.isActive) {
        throw new Error('Your account is inactive. Please contact support.');
      }

      const updatedUser = { ...user, lastLogin: new Date() };
      
      setAuthState({
        user: updatedUser,
        isAuthenticated: true
      });

      // Save to localStorage
      localStorage.setItem('schoolletloose-user', JSON.stringify(updatedUser));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = DEMO_USERS.find(u => u.email === email || u.username === username);
      if (existingUser) {
        throw new Error('User with this email or username already exists');
      }

      // Validate password (for demo purposes, just check length)
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }

      // Create new user
      const newUser: User = {
        id: (DEMO_USERS.length + 1).toString(),
        username,
        email,
        role: UserRole.PLAYER, // Default role
        createdAt: new Date(),
        isActive: true,
        isBanned: false
      };

      // Add to demo users (in real app, this would be sent to backend)
      DEMO_USERS.push(newUser);

      setAuthState({
        user: newUser,
        isAuthenticated: true
      });

      // Save to localStorage
      localStorage.setItem('schoolletloose-user', JSON.stringify(newUser));
      
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    localStorage.removeItem('schoolletloose-user');
  };

  const updateUser = (user: User) => {
    setAuthState((prev: AuthState) => ({
      ...prev,
      user
    }));
    localStorage.setItem('schoolletloose-user', JSON.stringify(user));
  };

  return (
    <AuthContext.Provider value={{
      user: authState.user,
      isAuthenticated: authState.isAuthenticated,
      isLoading,
      login,
      register,
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
