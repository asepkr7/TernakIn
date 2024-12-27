import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "@/utils/getUserRole";

const RoleBasedRoute = ({ allowedRoles }) => {
  const userRole = getUserRole(); // Ambil role dari cookies

  if (!userRole) {
    console.warn("No role found. Redirecting to Unauthorized.");
    return <Navigate to="/unauthorized" replace />;
  }

  if (!allowedRoles.includes(userRole)) {
    console.warn(
      `Role ${userRole} not authorized. Redirecting to Unauthorized.`
    );
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />; // Render children routes jika role valid
};

export default RoleBasedRoute;
