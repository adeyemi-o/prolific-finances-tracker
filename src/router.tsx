import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import Loading from "@/components/ui/loading";

// Code-split page components
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const Reports = lazy(() => import("@/pages/Reports"));
const Transactions = lazy(() => import("@/pages/Transactions"));
const UserManagement = lazy(() => import("@/pages/UserManagement"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const AuditLogsPage = lazy(() => import("@/pages/AuditLogsPage"));

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
      element: user ? <Navigate to="/dashboard" /> : (
        <Suspense fallback={<Loading />}><Login /></Suspense>
      )
    },
    {
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        { path: "/", element: <Navigate to="/dashboard" /> },
        { path: "/dashboard", element: <Suspense fallback={<Loading />}><Dashboard /></Suspense> },
        { path: "/reports", element: <Suspense fallback={<Loading />}><Reports /></Suspense> },
        { path: "/transactions", element: <Suspense fallback={<Loading />}><Transactions /></Suspense> },
        { 
          path: "/user-management", 
          element: user?.role === "Admin" 
            ? <Suspense fallback={<Loading />}><UserManagement /></Suspense> 
            : <Navigate to="/dashboard" /> 
        },
        {
          path: "/audit-logs",
          element: user?.role === "Admin" 
            ? <Suspense fallback={<Loading />}><AuditLogsPage /></Suspense> 
            : <Navigate to="/dashboard" />
        },
        { path: "*", element: <Suspense fallback={<Loading />}><NotFound /></Suspense> },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
