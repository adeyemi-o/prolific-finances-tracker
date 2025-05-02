import { Navigate, useRoutes } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Reports from "@/pages/Reports";
import Transactions from "@/pages/Transactions";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";
import Loading from "@/components/ui/loading";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // After loading, if no user on login page, show login
  if (!user && window.location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export default function Router() {
  const { user, loading } = useAuth();

  const routes = useRoutes([
    {
      path: "/login",
      element: loading ? <Loading /> : user ? <Navigate to="/dashboard" /> : <Login />
    },
    {
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/transactions", element: <Transactions /> },
        { path: "/reports", element: <Reports /> },
        { 
          path: "/users", 
          element: user?.role === "Admin" ? <UserManagement /> : <Navigate to="/dashboard" /> 
        },
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "*", element: <NotFound /> }
      ]
    }
  ]);

  return routes;
}