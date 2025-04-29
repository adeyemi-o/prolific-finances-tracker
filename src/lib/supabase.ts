
// Re-export all Supabase functionality from specialized modules
export { supabase } from './supabase-client';

// Auth functions
export {
  signIn,
  signUp,
  signOut,
  getCurrentUser,
  getSession
} from './supabase-auth';

// Transaction functions
export {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  seedTransactions
} from './supabase-transactions';

// User management functions
export {
  getUsers,
  createUser,
  deleteUser
} from './supabase-users';
