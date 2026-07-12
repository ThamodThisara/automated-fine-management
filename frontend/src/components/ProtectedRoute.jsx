import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

// Guards a route so only logged-in users with an allowed role can view it.
// - Not logged in  -> redirect to the given login page.
// - Wrong role     -> redirect home.
// Server-side middleware still enforces access; this is the client-side guard.
export const ProtectedRoute = ({ allowedRoles, redirectTo = "/login", children }) => {
  const { authUser } = useAuthContext();

  if (!authUser) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};
