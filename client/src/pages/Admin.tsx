import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Crown, Shield, User, Ban, CheckCircle, XCircle, Trash2 } from 'lucide-react';

// Temporary types - these should come from shared/types.ts
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

// Demo users for admin management
const ALL_USERS: User[] = [
  {
    id: '1',
    username: 'DemoPlayer',
    email: 'player@demo.com',
    role: UserRole.PLAYER,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
    isBanned: false
  },
  {
    id: '2',
    username: 'DemoCreator',
    email: 'creator@demo.com',
    role: UserRole.CREATOR,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
    isBanned: false
  },
  {
    id: '3',
    username: 'DemoAdmin',
    email: 'admin@demo.com',
    role: UserRole.ADMIN,
    createdAt: new Date('2024-01-01'),
    lastLogin: new Date(),
    isActive: true,
    isBanned: false
  },
  {
    id: '4',
    username: 'TestPlayer1',
    email: 'test1@demo.com',
    role: UserRole.PLAYER,
    createdAt: new Date('2024-01-15'),
    lastLogin: new Date('2024-01-20'),
    isActive: true,
    isBanned: false
  },
  {
    id: '5',
    username: 'BannedUser',
    email: 'banned@demo.com',
    role: UserRole.PLAYER,
    createdAt: new Date('2024-01-10'),
    lastLogin: new Date('2024-01-10'),
    isActive: false,
    isBanned: true
  }
];

export function Admin() {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>(ALL_USERS);
  const [activeTab, setActiveTab] = useState<'users' | 'cards'>('users');

  // Only admins can access this page
  if (!user || user.role !== UserRole.ADMIN) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <Crown className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-gray-400">Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case UserRole.CREATOR:
        return <Shield className="h-4 w-4 text-purple-400" />;
      default:
        return <User className="h-4 w-4 text-blue-400" />;
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return 'text-yellow-400';
      case UserRole.CREATOR:
        return 'text-purple-400';
      default:
        return 'text-blue-400';
    }
  };

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, role: newRole } : u
    ));
    // In a real app, this would make an API call
    console.log(`Changed user ${userId} role to ${newRole}`);
  };

  const handleBanToggle = (userId: string) => {
    setUsers(prev => prev.map(u => 
      u.id === userId ? { ...u, isBanned: !u.isBanned, isActive: u.isBanned } : u
    ));
    // In a real app, this would make an API call
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      // In a real app, this would make an API call
    }
  };

  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <Crown className="h-8 w-8 text-yellow-400 mr-3" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              User Management
            </button>
            <button
              onClick={() => setActiveTab('cards')}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'cards'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              Card Moderation
            </button>
          </nav>
        </div>

        {/* User Management Tab */}
        {activeTab === 'users' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">User Management</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-700/50">
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{u.username}</div>
                          <div className="text-sm text-gray-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getRoleIcon(u.role)}
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                            className={`bg-slate-700 border border-slate-600 rounded px-2 py-1 text-sm ${getRoleColor(u.role)}`}
                            disabled={u.id === user.id} // Can't change own role
                          >
                            <option value={UserRole.PLAYER}>Player</option>
                            <option value={UserRole.CREATOR}>Creator</option>
                            <option value={UserRole.ADMIN}>Admin</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {u.isBanned ? (
                            <XCircle className="h-4 w-4 text-red-400" />
                          ) : u.isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className={
                            u.isBanned ? 'text-red-400' : 
                            u.isActive ? 'text-green-400' : 'text-gray-400'
                          }>
                            {u.isBanned ? 'Banned' : u.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleBanToggle(u.id)}
                            className={`p-2 rounded ${
                              u.isBanned 
                                ? 'bg-green-600 hover:bg-green-700 text-white' 
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                            disabled={u.id === user.id} // Can't ban yourself
                            title={u.isBanned ? 'Unban User' : 'Ban User'}
                          >
                            <Ban className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded"
                            disabled={u.id === user.id} // Can't delete yourself
                            title="Delete User"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Card Moderation Tab */}
        {activeTab === 'cards' && (
          <div className="bg-slate-800/50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">Card Moderation</h2>
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🚧</div>
              <h3 className="text-lg font-medium mb-2">Coming Soon</h3>
              <p className="text-gray-400">
                Card moderation features will be implemented when the backend is ready.
                This will include approving suggested cards, managing card balance, and moderating content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
