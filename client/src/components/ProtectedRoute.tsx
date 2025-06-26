import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'player' | 'creator' | 'admin';
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  requireRole,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} replace />;
  }

  if (user.isBanned) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-red-900/20 border border-red-600 rounded-xl p-8 max-w-md">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-red-300 mb-4">Account Banned</h2>
          <p className="text-gray-300 mb-4">
            Your account has been banned and you cannot access MagicSchool.
          </p>
          <p className="text-sm text-gray-400">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    );
  }

  if (!user.isActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center bg-yellow-900/20 border border-yellow-600 rounded-xl p-8 max-w-md">
          <div className="text-6xl mb-4">⏸️</div>
          <h2 className="text-2xl font-bold text-yellow-300 mb-4">Account Inactive</h2>
          <p className="text-gray-300 mb-4">
            Your account is currently inactive. Please contact an administrator.
          </p>
        </div>
      </div>
    );
  }

  // Check role requirements
  if (requireRole) {
    const roleHierarchy = ['player', 'creator', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(requireRole);

    if (userRoleIndex < requiredRoleIndex) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="text-center bg-purple-900/20 border border-purple-600 rounded-xl p-8 max-w-md">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-2xl font-bold text-purple-300 mb-4">Access Restricted</h2>
            <p className="text-gray-300 mb-4">
              You need {requireRole} role or higher to access this page.
            </p>
            <p className="text-sm text-gray-400">
              Your current role: <span className="capitalize">{user.role}</span>
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
