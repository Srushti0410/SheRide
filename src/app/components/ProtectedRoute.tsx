import { Navigate } from "react-router";
import { useAuth, UserRole } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  requireProfileComplete?: boolean;
}

export function ProtectedRoute({
  children,
  requiredRoles = [],
  requireProfileComplete = true,
}: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  if (requireProfileComplete && !user.isProfileComplete) {
    return <Navigate to="/profile-completion" replace />;
  }

  return <>{children}</>;
}
