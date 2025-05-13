import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Loading from "@/components/ui/loading";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Reports from "@/pages/Reports";
import Transactions from "@/pages/Transactions";
import UserManagement from "@/pages/UserManagement";
import NotFound from "@/pages/NotFound";
import AuditLogsPage from "@/pages/AuditLogsPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

export function Router() {
  // Always call all hooks unconditionally at the top level
  const location = useLocation();
  const { user, loading } = useAuth();

  // Define routes configuration
  const routes = [
    {
      path: "/login",
      element: user ? <Navigate to="/dashboard" /> : <Login />
    },
    {
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/reports", element: <Reports /> },
        { path: "/transactions", element: <Transactions /> },
        { 
          path: "/user-management", 
          element: user?.role === "Admin" ? <UserManagement /> : <Navigate to="/dashboard" /> 
        },
        {
          path: "/audit-logs",
          element: user?.role === "Admin" ? <AuditLogsPage /> : <Navigate to="/dashboard" />
        },
        { path: "*", element: <NotFound /> },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
