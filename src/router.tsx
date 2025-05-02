
import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LoadingFallback } from '@/components/ui/loading';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { ProtectedRoute, AdminRoute } from '@/components/auth';

const Dashboard = lazy(() => import('@/features/dashboard/Dashboard'));
const Transactions = lazy(() => import('@/features/transactions/TransactionsPage')); 
const Reports = lazy(() => import('@/features/reports/ReportsPage'));
const UserManagement = lazy(() => import('@/features/users/UserManagementPage'));
const Login = lazy(() => import('@/features/auth/LoginPage'));
const NotFound = lazy(() => import('@/components/NotFound'));

export const AppRouter = () => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="user-management" element={
            <AdminRoute><UserManagement /></AdminRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  </ErrorBoundary>
);
